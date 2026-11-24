# ForgeFit Independent v1.1

Free standalone mobile Progressive Web App. No Muse, Lovable, paid subscription, account or backend required.

## Features
- Five-day beginner workout split plus two rest days, with setup, instructions and safety cues.
- Record exercise weights/reps and save completed workouts.
- Meal logging and calorie, protein, carb and fat totals.
- Editable starting targets: 2,150 kcal, 140g protein, 230g carbs, 70g fat.
- Weight/waist history and local progress photos.
- JSON backup export/import and reset.
- Installable PWA with app-shell caching for offline use after first online visit.

## Limitations
Data stays in this browser on this device; there is no cloud sync. Export backups before switching phones or clearing browser data. YouTube tutorial searches and online fonts require internet. Videos are not bundled. General fitness guidance only, not medical advice.

## Free GitHub Pages publishing (iPhone)
1. Create a public GitHub repository named `forgefit`.
2. Extract this ZIP and upload the *contents* into the repository root. `index.html` must be directly in the root.
3. Open repository Settings → Pages.
4. Choose Deploy from a branch, branch `main`, folder `/(root)`, then Save.
5. Open the GitHub Pages URL when published.
6. In iPhone Safari, tap Share → Add to Home Screen.
7. Open ForgeFit once online so the service worker caches the app shell before trying offline mode.
