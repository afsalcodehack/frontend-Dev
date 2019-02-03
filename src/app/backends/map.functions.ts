// Helper functions for map calculations

class Point {
  lat: number;
  lng: number;
}

/**
 * Checks if a location is within the bounds defined by the Northeast and
 * Southwest corners. Takes into account that the longitude wraps
 * around from 180 to -180. Incoming lng values have to be in [-180, 180]
 * @param location the point to be checked
 * @param ne northeast point of the boundary
 * @param sw southwest point of the boundary
 */
export const isInsideBounds = (location: Point, ne: Point, sw: Point) => {
  let isLngInBounds: boolean;
  if (ne.lng < sw.lng) { // Special case: wrapping around from 180 to -180
    isLngInBounds = location.lng >= sw.lng || location.lng <= ne.lng;
  } else {
    isLngInBounds = location.lng >= sw.lng && location.lng <= ne.lng;
  }
  const isLatInBounds = location.lat >= sw.lat && location.lat <= ne.lat;
  return isLatInBounds && isLngInBounds;
};
