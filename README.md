# KrakenNotes

A lightweight local-first notes app built with Tauri 2 + Rust and a Vite/TypeScript frontend. Notes are stored locally in the WebView using `localStorage` in this MVP.

## Development
```sh
npm install
npm run tauri dev
```

## Android
```sh
npm run tauri -- android init
npm run tauri -- android build --apk
```

GitHub Actions builds an APK on pushes to `main` and on manual dispatch. Generated Android files under `src-tauri/gen/android` are created during CI and are not committed.
