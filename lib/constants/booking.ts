// Booking configuration and constants

export const BRAND_COLORS = {
  gold: "#C89B2B",
  navy: "#142A52",
};

export const PROJECT_TYPES = [
  "Home/Garage/Basement Cleanout",
  "Home Remodel",
  "Kitchen or Bathroom Demo",
  "Roofing Project",
  "Siding Tear-Off",
  "Wood Deck Removal",
  "Yard Cleanup / Landscaping",
  "Concrete or Masonry Removal",
  "Other Project",
  "Not Sure Yet",
];

export const MATERIAL_TYPES = [
  "Mixed Household Trash",
  "Construction Debris",
  "Yard or Organic Material",
  "Roofing Material",
  "Siding Material",
  "Wood Deck Material",
  "Concrete, Brick, Block, or Asphalt",
  "Dirt, Gravel, or Rock",
];

export const HEAVY_MATERIALS = [
  "Concrete, Brick, Block, or Asphalt",
  "Dirt, Gravel, or Rock",
];

export const RENTAL_PERIODS = [
  { days: 7, label: "7 Days", price: 0 },
  { days: 14, label: "14 Days", price: 0 },
  { days: 30, label: "30 Days", price: 0 },
];

export const EXTRA_DAYS_SURCHARGE = 25; // $25 per day for > 14 days
export const SHIPPING_PRICE = 200;

export const DUMPSTER_TYPES = {
  ROLL_OFF: "roll-off",
  RUBBER_WHEEL: "rubber-wheel",
  FRONT_LOAD: "front-load",
};

export const DUMPSTER_SIZES = {
  [DUMPSTER_TYPES.ROLL_OFF]: [
    {
      size: 10,
      dimensions: "10 ft x 4 ft x 5 ft",
      image: "/images/dumpsters/10yd-roll-off.jpg",
    },
    {
      size: 20,
      dimensions: "20 ft x 8 ft x 4.5 ft",
      image: "/images/dumpsters/20yd-roll-off.jpg",
    },
    {
      size: 30,
      dimensions: "30 ft x 8 ft x 4.5 ft",
      image: "/images/dumpsters/30yd-roll-off.jpg",
    },
    {
      size: 40,
      dimensions: "40 ft x 8 ft x 4.5 ft",
      image: "/images/dumpsters/40yd-roll-off.jpg",
    },
  ],
  [DUMPSTER_TYPES.RUBBER_WHEEL]: [
    {
      size: 10,
      dimensions: "10 yd container",
      image: "/images/dumpsters/10yd-rubber-wheel.jpg",
    },
    {
      size: 20,
      dimensions: "20 yd container",
      image: "/images/dumpsters/20yd-rubber-wheel.jpg",
    },
    {
      size: 30,
      dimensions: "30 yd container",
      image: "/images/dumpsters/30yd-rubber-wheel.jpg",
    },
  ],
  [DUMPSTER_TYPES.FRONT_LOAD]: [
    { size: 2, dimensions: "2 yd", image: "/images/dumpsters/2yd-front-load.jpg" },
    { size: 4, dimensions: "4 yd", image: "/images/dumpsters/4yd-front-load.jpg" },
    { size: 6, dimensions: "6 yd", image: "/images/dumpsters/6yd-front-load.jpg" },
    { size: 8, dimensions: "8 yd", image: "/images/dumpsters/8yd-front-load.jpg" },
  ],
};

export const PRICING = {
  [DUMPSTER_TYPES.ROLL_OFF]: {
    10: 435,
    20: 455,
    30: 475,
    40: 555,
  },
  [DUMPSTER_TYPES.RUBBER_WHEEL]: {
    10: 445,
    20: 525,
    30: 655,
  },
  [DUMPSTER_TYPES.FRONT_LOAD]: {
    2: 250,
    4: 350,
    6: 450,
    8: 550,
  },
};

export const HEAVY_MATERIAL_SURCHARGE = 75; // $75 for dirt/concrete/brick in Macomb/Wayne/Oakland

export const SURCHARGES = {
  mattress: 45,
  boxSpring: 45,
  heavyMaterial: HEAVY_MATERIAL_SURCHARGE,
};

export const MATERIAL_RESTRICTIONS = [
  "Hazardous waste",
  "Tires",
  "Batteries",
  "Paint / chemicals",
  "Asbestos",
  "Flammable materials",
  "Propane tanks",
  "Medical waste",
  "Electronics (where restricted)",
];

export const ROOFING_MATERIALS = [
  "Asphalt Shingles",
  "Wood Shingles",
  "Metal",
  "Synthetic",
  "Slate",
];

export const CONTACT_INFO = {
  phone: "586-412-3762",
  email: "BlueSkyDisposal@gmail.com",
  address: "42815 Garfield Rd Suite 202, Clinton Twp MI",
};

export const ACCOUNT_DISCOUNT = 20; // $20 off for creating account
