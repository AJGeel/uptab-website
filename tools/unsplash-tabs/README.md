# Unsplash tabs

A tiny Firefox/Floorp extension for the admin's "Import from open tabs" button. It can list the open
`unsplash.com/photos/…` tabs and close them, and only talks to pages on `http://localhost`.

Load it in Floorp: run `bun run tabs-extension`, which opens `about:debugging#/runtime/this-firefox` and reveals
`manifest.json` in Finder. Choose "Load Temporary Add-on…" and pick that file. A temporary add-on is removed when the browser restarts. To keep it, sign it as an unlisted
add-on (free, https://addons.mozilla.org/developers/) or load it in a build that allows unsigned add-ons.
