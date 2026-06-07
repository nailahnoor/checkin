// ----- CONFIG -----
const API_KEY = window.NEXT_PUBLIC_GOOGLE_SHEET_API_KEY || "";

const NAMES_SHEET_ID = "1pHJlG4kTheQp8oeU75O7WFh8RI7do2rSlxDA6iaAHBk";
const NAMES_RANGE = "alphabetized registration names!A2:A1000";

// ----- ELEMENTS -----
const input = document.getElementById("nameInput");
const suggestions = document.getElementById("suggestions");
const checkBtn = document.getElementById("checkBtn");
const statusDiv = document.getElementById("statusMsg");

// ----- STATE -----
let names = [];
let activeIndex = -1;
let namesLoaded = false;
let isCheckingIn = false;

// ----- FETCH NAMES -----
async function fetchNames() {
  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${NAMES_SHEET_ID}/values/${encodeURIComponent(
        NAMES_RANGE
      )}?key=${API_KEY}`
    );

    const data = await res.json();

    if (data.values?.length) {
      names = data.values.flat().filter(Boolean);
      namesLoaded = true;
    } else {
      names = [];
      namesLoaded = false;
    }
  } catch (err) {
    console.error("Error fetching names:", err);
    namesLoaded = false;
  }
}

window.addEventListener("DOMContentLoaded", fetchNames);

// ----- AUTOCOMPLETE -----
input.addEventListener("input", () => {
  const value = input.value.toLowerCase().trim();
  suggestions.innerHTML = "";
  activeIndex = -1;

  if (!value || !namesLoaded) {
    suggestions.style.display = "none";
    return;
  }

  const matches = names
    .filter((n) => n.toLowerCase().includes(value))
    .slice(0, 10);

  if (!matches.length) {
    suggestions.style.display = "none";
    return;
  }

  matches.forEach((name) => {
    const div = document.createElement("div");
    div.textContent = name;

    div.onclick = () => {
      input.value = name;
      suggestions.style.display = "none";
    };

    suggestions.appendChild(div);
  });

  suggestions.style.display = "block";
});

// ----- KEYBOARD NAVIGATION -----
input.addEventListener("keydown", (e) => {
  const items = suggestions.querySelectorAll("div");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    activeIndex = (activeIndex + 1) % items.length;
    highlight(items);
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    activeIndex = (activeIndex - 1 + items.length) % items.length;
    highlight(items);
  }

  if (e.key === "Enter") {
    if (activeIndex > -1) {
      input.value = items[activeIndex].textContent;
      suggestions.style.display = "none";
      activeIndex = -1;
    }
  }
});

function highlight(items) {
  items.forEach((i) => (i.style.background = ""));
  if (items[activeIndex]) {
    items[activeIndex].style.background = "#eee";
  }
}

// ----- CLOSE DROPDOWN -----
document.addEventListener("click", (e) => {
  if (!e.target.closest(".input-wrap")) {
    suggestions.style.display = "none";
  }
});

// ----- MESSAGE UI -----
function showMessage(text, type) {
  statusDiv.style.display = "block";
  statusDiv.textContent = text;
  statusDiv.className = "status";

  if (type === "success") {
    statusDiv.classList.add("active"); // green
  } else {
    statusDiv.classList.add("error"); // red
  }
}

// ----- CHECK-IN -----
checkBtn.addEventListener("click", async () => {
  if (isCheckingIn) return; // 🔒 prevents spam clicks

  const name = input.value.trim();

  if (!name) {
    showMessage("no name was selected.", "error");
    return;
  }

  isCheckingIn = true;
  checkBtn.disabled = true;

  try {
    const res = await fetch("/api/checkin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    const data = await res.json();

    if (data.status === "success") {
      showMessage("you are checked in!", "success");
      input.value = "";
      suggestions.style.display = "none";
    } else {
      showMessage(data.message || "already checked in today", "error");
    }
  } catch (err) {
    showMessage("server error. try again.", "error");
  }

  isCheckingIn = false;
  checkBtn.disabled = false;
});