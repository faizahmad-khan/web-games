# Quick Local Testing

To manually smoke-test the games locally, run a static HTTP server from the repository root and open an individual game's `index.html` in your browser.

Run a simple Python server (works on macOS):

```bash
# from repository root
python3 -m http.server 8000
```

Then open `http://localhost:8000/Game2/index.html` (replace `Game2` with the game folder you want to test).

Notes:
- `Game7/config.js` contains a placeholder Hugging Face token; leave blank to use fallback images.
- Open pages in a modern browser and check the DevTools console for runtime warnings.
