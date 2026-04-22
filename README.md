# MRR Drones — Mission Wizard

A mission planning UI for MRR Drones. Designed for the **DJI RC controller display** and landscape mobile phones — built to be fast and easy to use in the field.

## What it does

A field-facing control panel for drone survey operations. From the home screen you can start a flight, create a new mission, manage saved missions, or review the flight log.

**Start Flight** lets you pick a drone and a saved mission, preview the flight area and estimated metrics, then launch. **Create Mission** walks you through a 4-step wizard: home point, survey area, flight settings (altitude, quality, RTK, app), and confirm. Completed flights are stored in the **Flight Log** with date, duration, and photo count.

All UI text is in Dutch.

## Stack

- React 18 (JavaScript)
- React Router v6 (HashRouter)
- Vite
- Tailwind CSS v3
- SCSS modules for component styles

No backend. Missions are held in memory via React Context.

## Run locally

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

Set your browser devtools display size to **640×360px** to match the DJI RC controller view.

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

Designed for the **DJI RC controller** (640×360px) and landscape mobile phones.
