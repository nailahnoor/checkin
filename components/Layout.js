export default function Layout({ children }) {
  return (
    <div className="red-background">
      <div className="container">

        {/* GLOBAL LOGO (ONE PLACE ONLY) */}
        <a
          href="https://www.nailahnoorbellydance.com/home"
          target="_blank"
          rel="noopener noreferrer"
          className="logo-wrapper"
        >
          <img
            src="/images/nnbd-logo.png"
            alt="Nailah Noor Belly Dance"
            className="logo"
          />
        </a>

        {/* PAGE CONTENT */}
        <div className="content-group">
          {children}
        </div>

      </div>
    </div>
  );
}