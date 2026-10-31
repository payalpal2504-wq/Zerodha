# CRA to Vite migration guide

This project has been converted from Create React App to Vite. Existing React pages, components, CSS, and public images are preserved.

## Requirements

- Node.js 20.19+ or 22.12+ recommended for Vite 7
- npm (included with Node.js)

Check your versions in PowerShell:

```powershell
node -v
npm -v
```

## Run on Windows

1. Extract this ZIP to a normal folder, for example `C:\Projects\frontend-vite`.
2. Open that folder in VS Code.
3. Choose **Terminal > New Terminal**.
4. Make sure the terminal is in the folder containing `package.json`.
5. Install dependencies:

   ```powershell
   npm install
   ```

6. Start the development server:

   ```powershell
   npm run dev
   ```

7. Open the local URL printed by Vite, usually `http://localhost:5173`.
8. To check the production build:

   ```powershell
   npm run build
   ```

9. To preview the production build locally:

   ```powershell
   npm run preview
   ```

## Main changes made

- Replaced `react-scripts` scripts with Vite scripts.
- Renamed `src/index.js` to `src/main.jsx` so Vite handles JSX explicitly.
- Moved CRA's `public/index.html` to the project root, as required by Vite.
- Replaced `%PUBLIC_URL%/manifest.json` with `/manifest.json`.
- Kept the existing React Router routes, components, CSS, and `/media/images/...` public asset paths.
- Removed the old CRA build output, `.git` history, and old npm lockfile from the ZIP.
- The new `package-lock.json` is generated when you run `npm install`.

## Notes

- The app uses React Router's `BrowserRouter`; when deploying, configure the host to serve `index.html` for app routes such as `/about` and `/pricing`.
- Bootstrap and Font Awesome are loaded from CDNs in `index.html`, so they require internet access in the browser.
- The old CRA testing scripts were not carried over. If you need automated tests, configure Vitest separately.
- This ZIP is a source migration. Dependencies have not been installed in your Windows environment; run `npm install` there and fix any environment-specific issues it reports.
