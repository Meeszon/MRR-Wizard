# MRR Drones — Mission Wizard

A mission planning UI for DJI drone controllers. Designed for a **640×360px screen** — built to be fast and easy to use in the field.

## What it does

Step-by-step wizard to set up a drone survey mission:

1. **Home point** — set the takeoff/landing location on the map
2. **Survey area** — draw the area to be flown
3. **Settings** — configure altitude, overlap, speed, and app (OpenDroneMap)
4. **Confirm** — name and save the mission

Saved missions can be viewed and re-edited from the mission list. All text is in Dutch.

## Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS v3
- DM Sans font

No backend. Missions are held in memory.

## Run locally

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run preview   # preview production build
```

## Screen size

Fixed at **640×360px** — matches the DJI RC controller display. Not intended to be responsive.
