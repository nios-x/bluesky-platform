// lib/location-data.ts

export interface LocationData {
  slug: string;
  city: string;
  county: string;
  state: string;
  nearbyCounties: string[];
}

const RAW_LOCATIONS = [
  { county: "Washtenaw County", city: "Ann Arbor", state: "Michigan" },
  { county: "Lapeer County", city: "Lapeer", state: "Michigan" },
  { county: "Genesee County", city: "Flint", state: "Michigan" },
  { county: "Livingston County", city: "Howell", state: "Michigan" },
  { county: "Monroe County", city: "Monroe", state: "Michigan" },
  { county: "St Clair County", city: "Port Huron", state: "Michigan" },
  { county: "Clinton County", city: "St Johns", state: "Michigan" },
  { county: "Ingham County", city: "Lansing", state: "Michigan" },
  { county: "Shiawassee County", city: "Corunna", state: "Michigan" },
  { county: "Bay County", city: "Bay City", state: "Michigan" },
  { county: "Saginaw County", city: "Saginaw", state: "Michigan" },
  { county: "Tuscola County", city: "Caro", state: "Michigan" },
  { county: "Mecosta County", city: "Big Rapids", state: "Michigan" },
  { county: "Gratiot County", city: "Ithaca", state: "Michigan" },
  { county: "Midland County", city: "Midland", state: "Michigan" },
  { county: "Gladwin County", city: "Gladwin", state: "Michigan" },
  { county: "Isabella County", city: "Mount Pleasant", state: "Michigan" },
  { county: "Huron County", city: "Bad Axe", state: "Michigan" },
  { county: "Antrim County", city: "Bellaire", state: "Michigan" },
  { county: "Emmet County", city: "Petoskey", state: "Michigan" },
  { county: "Cheboygan County", city: "Cheboygan", state: "Michigan" },
  { county: "Clare County", city: "Harrison", state: "Michigan" },
  { county: "Iosco County", city: "Tawas City", state: "Michigan" },
  { county: "Kent County", city: "Grand Rapids", state: "Michigan" },
  { county: "Montmorency County", city: "Atlanta", state: "Michigan" },
  { county: "Manchester County", city: "Manchester", state: "Michigan" },
  { county: "Macomb County", city: "Macomb", state: "Michigan" },
  { county: "Kalamazoo County", city: "Kalamazoo", state: "Michigan" },
  { county: "Oakland County", city: "Pontiac", state: "Michigan" },
  { county: "Jackson County", city: "Jackson", state: "Michigan" },
  { county: "Wayne County", city: "Detroit", state: "Michigan" },

  { county: "Miami-Dade County", city: "Miami", state: "Florida" },

  { county: "Los Angeles County", city: "Los Angeles", state: "California" },

  { county: "Cook County", city: "Chicago", state: "Illinois" },

  { county: "Iron County", city: "Iron River", state: "Michigan" }
];

function createSlug(name: string) {
  return name
    .replace(" County", "")
    .toLowerCase()
    .replace(/\s+/g, "-");
}

const locations: Record<string, LocationData> = {};

RAW_LOCATIONS.forEach((item, index) => {

  const slug = createSlug(item.county);

  const nearbyCounties = RAW_LOCATIONS
    .filter((_, i) => i !== index)
    .slice(0, 6)
    .map(x => x.county);

  locations[slug] = {
    slug,
    city: item.city,
    county: item.county,
    state: item.state,
    nearbyCounties
  };

});


export async function getLocationBySlug(
  slug: string
): Promise<LocationData | null> {

  return locations[slug.toLowerCase()] || null;

}


export async function getAllLocations(): Promise<LocationData[]> {

  return Object.values(locations);

}


export function getLocationSlugs(): string[] {

  return Object.keys(locations);

}