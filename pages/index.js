import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>STUDENT STATUS FORM</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="page-wrapper">
        <div className="card">
          <div className="header">
            <h2>STUDENT STATUS FORM</h2>
            <p className="subtext">please select your name from the dropdown list.</p>
          </div>

          <div className="section">
            <div className="input-wrap">
              <input
                type="text"
                id="nameInput"
                placeholder="start typing your name..."
                autoComplete="off"
              />
              <div id="suggestions" className="suggestions"></div>
            </div>
            <div id="nameError" className="error"></div>
          </div>

          <div className="footer">
            <button id="checkBtn">check my status</button>
          </div>

          <div id="statusMsg" className="status"></div>
        </div>
      </div>

      {/* Inject API key for script.js */}
      <script
        dangerouslySetInnerHTML={{
          __html: `window.NEXT_PUBLIC_GOOGLE_SHEET_API_KEY = "${process.env.NEXT_PUBLIC_GOOGLE_SHEET_API_KEY}";`,
        }}
      />

      {/* Load the external script */}
      <script src="/script.js"></script>

      {/* Global styling */}
      <style jsx global>{`
        * {
          box-sizing: border-box;
          font-family: 'Montserrat', sans-serif;
          text-transform: lowercase;
        }

        html,
        body {
          margin: 0;
          padding: 0;
          height: 100%;
          font-family: 'Montserrat', sans-serif;
        }

        .page-wrapper {
          min-height: 100vh;
          background: #fce2b3; /* light orange background */
          display: flex;
          justify-content: center;
          align-items: flex-start; /* card top-aligned; change to center for vertical center */
          padding: 16px;
        }

        .card {
          max-width: 520px;
          width: 100%;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 1px 3px rgba(0,0,0,.2);
          overflow: hidden;
        }

        .header {
          border-top: 10px solid #f39c12;
          padding: 24px;
        }

        h2 {
          margin: 0 0 8px 0;
          font-weight: 700;
          text-transform: uppercase;
        }

        .subtext {
          margin: 0;
          font-size: 16px;
        }

        .section {
          padding: 24px;
        }

        .input-wrap {
          width: 100%;
          position: relative;
        }

        input[type="text"] {
          width: 100%;
          padding: 12px;
          font-size: 16px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        input::placeholder {
          font-size: 16px;
          color: #555;
        }

        .suggestions {
          width: 100%;
          background: #fff;
          border: 1px solid #ccc;
          border-top: none;
          max-height: 220px;
          overflow-y: auto;
          display: none;
          margin-top: -1px;
        }

        .suggestions div {
          padding: 10px 12px;
          cursor: pointer;
        }

        .suggestions div:hover {
          background: #f2f2f2;
        }

        .error {
          color: #c62828;
          font-size: 14px;
          margin-top: 6px;
          display: none;
          text-align: center;
        }

        .footer {
          padding: 16px 24px 24px;
          text-align: center;
        }

        button {
          background: #d84315;
          color: #fff;
          border: none;
          padding: 12px 28px;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          font-size: 16px;
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .status {
          padding: 16px 24px;
          font-weight: 600;
          display: none;
          text-align: center;
          margin-top: 12px;
          border-radius: 6px;
        }

        .status.active {
          background: #e8f5e9;
          color: #2e7d32;
        }

        .status.inactive {
          background: #ffebee;
          color: #c62828;
        }
      `}</style>
    </>
  );
}
