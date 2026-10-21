const DOWNLOAD_URL =
  'https://github.com/MARVLO-code/faan-cbt-practice/releases/download/v1.0.0-windows/FAAN-CBT-Practice-Windows.zip';

export default function DownloadWindowsApp() {
  return (
    <details className="download-card">
      <summary className="download-summary">Download Windows app (offline)</summary>
      <div className="download-body">
        <h2>Prefer a Windows app you can open without the internet?</h2>
        <p className="hint">
          Download the offline Windows version — no install, no internet connection needed once
          it's on your PC.
        </p>
        <a className="secondary-btn download-btn" href={DOWNLOAD_URL}>
          Download for Windows (.zip)
        </a>
        <ol className="download-steps">
          <li>Unzip the downloaded file anywhere (e.g. your Desktop).</li>
          <li>
            Open the folder and double-click <strong>Create Shortcuts.bat</strong> once — this
            adds a shortcut to your Desktop and Start Menu. No admin rights needed.
          </li>
          <li>
            From then on, open <strong>FAAN CBT Practice</strong> like any other program.
          </li>
        </ol>
      </div>
    </details>
  );
}
