import { useState } from 'react';

const DOWNLOAD_URL =
  'https://github.com/MARVLO-code/faan-cbt-practice/releases/download/v1.0.0-windows/FAAN-CBT-Practice-Windows.zip';

const isDesktop = () =>
  typeof window !== 'undefined' && window.matchMedia('(min-width: 900px)').matches;

export default function DownloadWindowsApp() {
  const [open, setOpen] = useState(isDesktop);

  return (
    <div className="download-card">
      <button
        type="button"
        className="download-summary"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        Download Windows app (offline)
        <span className="download-chevron">{open ? 'Tap to collapse' : 'Tap to expand'}</span>
      </button>
      {open && (
        <div className="download-body">
          <h2>Prefer a Windows app you can open without the internet?</h2>
          <p className="hint">
            Download the offline Windows version — no install, no internet connection needed
            once it's on your PC.
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
      )}
    </div>
  );
}
