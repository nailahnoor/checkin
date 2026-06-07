import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>STUDENT CHECK IN FORM</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        {/* 🔥 REQUIRED: inject API key for script.js */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.NEXT_PUBLIC_GOOGLE_SHEET_API_KEY =
                "${process.env.NEXT_PUBLIC_GOOGLE_SHEET_API_KEY}";
            `,
          }}
        />
      </Head>

      <div className="page-wrapper">
        {/* LOGO OUTSIDE CARD */}
        <div className="logo-wrapper">
          <a
            href="https://www.nailahnoorbellydance.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/images/nnbd-logo.png" alt="logo" className="logo" />
          </a>
        </div>

        <div className="card">
          <div className="header">
            <h2>STUDENT CHECK IN FORM</h2>
            <p className="subtext">
              please select your name from the dropdown list.
            </p>
          </div>

          <div className="section">
            <div className="input-wrap">
              <input
                type="text"
                id="nameInput"
                placeholder="start typing here..."
                autoComplete="off"
              />
              <div id="suggestions" className="suggestions"></div>
            </div>

            <div id="nameError" className="error"></div>
          </div>

          <div className="footer">
            <button id="checkBtn">I AM HERE</button>
          </div>

          <div id="statusMsg" className="status"></div>
        </div>
      </div>

      {/* JS */}
      <script defer src="/script.js"></script>
    </>
  );
}