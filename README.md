# MRR Drones — Mission Wizard

A mission planning UI for MRR Drones. Designed for the **DJI RC controller display** and landscape mobile phones — built to be fast and easy to use in the field.

## What it does

Step-by-step wizard to set up a drone survey mission:

1. **Home point** — set the takeoff/landing location on the map
2. **Survey area** — draw the area to be flown
3. **Settings** — configure altitude, quality, RTK, and app (OpenDroneMap)
4. **Confirm** — name and save the mission

Saved missions can be viewed and re-edited from the mission list. All text is in Dutch.

## Stack

- React 18 (JavaScript)
- React Router v6 (HashRouter)
- Vite
- Tailwind CSS v3
- SCSS modules for component styles
- DM Sans font

No backend. Missions are held in memory via React Context.

## Run locally

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

## Code quality

ESLint (Airbnb config) and Prettier run automatically on every commit via Husky + lint-staged. Only staged files are checked.

## Project structure

```
src/
  pages/          # Route-level page components
    wizard/       # Step1–Step4 wizard pages
  components/     # Shared UI primitives (Button, Toggle, WizardBar, …)
  context/        # React Context providers (App, Missions, Wizard)
  hooks/          # Custom hooks (useWizard, useMissions, useAppPrefs)
  services/       # Mission data helpers (build/update mission objects)
  utils/          # Pure utility functions
  data/           # Mock seed data
  styles/         # Global SCSS + design token variables/mixins
```

## Screen size

Designed for the **DJI RC controller** (640×360px) and landscape mobile phones.
