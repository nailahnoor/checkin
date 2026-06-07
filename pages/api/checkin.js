import { google } from "googleapis";

const spreadsheetId = process.env.GOOGLE_SHEET_ID;

// ---- format helpers ----
function formatDateOnly(dateInput) {
  const d = new Date(dateInput);
  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();
  return `${month}/${day}/${year}`;
}

function formatTimestamp(dateInput) {
  const d = new Date(dateInput);

  const month = d.getMonth() + 1;
  const day = d.getDate();
  const year = d.getFullYear();

  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  return `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ status: "error", message: "Method not allowed" });
  }

  const { name } = req.body;

  if (!name?.trim()) {
    return res.status(400).json({ status: "error", message: "invalid name" });
  }

  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      },
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    const cleanName = name.trim().toLowerCase();
    const today = formatDateOnly(new Date());

    // ---- VALID NAMES ----
    const namesRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "alphabetized registration names!A2:A1000",
    });

    const validNames = (namesRes.data.values || [])
      .flat()
      .filter(Boolean)
      .map(n => n.trim().toLowerCase());

    if (!validNames.includes(cleanName)) {
      return res.json({ status: "error", message: "oops! that name does not exist." });
    }

    // ✅ IMPORTANT FIX: read FULL COLUMN, not 1000 rows
    const checkinRes = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "check-ins!A2:C", // <-- THIS IS THE FIX
    });

    const rows = checkinRes.data.values || [];

    const alreadyCheckedIn = rows.some((row) => {
      const ts = row?.[0];
      const rowName = row?.[1];

      if (!ts || !rowName) return false;

      const rowDate = formatDateOnly(ts);
      const nameMatch = rowName.trim().toLowerCase() === cleanName;

      return nameMatch && rowDate === today;
    });

    if (alreadyCheckedIn) {
      return res.json({
        status: "error",
        message: "you have already checked in today.",
      });
    }

    // ✅ CONSISTENT FORMAT ALWAYS
    const timestamp = formatTimestamp(new Date());

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "check-ins!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name.trim(), "i am here"]],
      },
    });

    return res.json({ status: "success" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ status: "error", message: "server error" });
  }
}