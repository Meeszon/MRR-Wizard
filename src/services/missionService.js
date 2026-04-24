/**
 * Build a new mission object from wizard state.
 * The id is assigned by MissionsContext.addMission.
 */
export function buildMission(wizard) {
  return {
    name: wizard.name.trim(),
    createdAt: new Date().toISOString().slice(0, 10),
    areaHectares: wizard.areaHectares ?? 0,
    homePoint: wizard.homePoint,
    areaPolygon: wizard.areaPolygon,
    quality: wizard.quality,
    app: wizard.app,
    rtkEnabled: wizard.rtkEnabled,
    highestPointMeters: wizard.highestPointMeters,
  }
}

/**
 * Build an update payload for an existing mission from wizard state.
 */
export function buildMissionUpdate(wizard) {
  return {
    name: wizard.name.trim(),
    quality: wizard.quality,
    app: wizard.app,
    rtkEnabled: wizard.rtkEnabled,
    highestPointMeters: wizard.highestPointMeters,
  }
}
