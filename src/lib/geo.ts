/** City coordinates for the threat heat map (city-level only — k-anonymity). */
export const CITY_COORDS: Record<string, [number, number]> = {
  "Surrey, BC": [49.1913, -122.849],
  "Vancouver, BC": [49.2827, -123.1207],
  "Burnaby, BC": [49.2488, -122.9805],
  "Calgary, AB": [51.0447, -114.0719],
  "Edmonton, AB": [53.5461, -113.4938],
  "Winnipeg, MB": [49.8951, -97.1384],
  "Toronto, ON": [43.6532, -79.3832],
  "Brampton, ON": [43.7315, -79.7624],
  "Mississauga, ON": [43.589, -79.6441],
  "Ottawa, ON": [45.4215, -75.6972],
  "Montréal, QC": [45.5019, -73.5674],
  "Québec City, QC": [46.8139, -71.208],
  "Halifax, NS": [44.6488, -63.5752],
  "Moncton, NB": [46.0878, -64.7782],
  "Saskatoon, SK": [52.1332, -106.67],
  "St. John's, NL": [47.5615, -52.7126],
};

export interface HeatPoint {
  city: string;
  lat: number;
  lng: number;
  reports: number;
  artifacts: number;
  topCategory: string;
  categories: Record<string, number>;
}
