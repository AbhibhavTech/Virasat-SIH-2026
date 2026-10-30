export interface StateDirectoryStay {
  name: string;
  category: string;
}

export interface StateDirectoryFoodSpot {
  restaurant: string;
  location: string;
  specialties: string;
}

export interface StateDirectoryDining {
  veg: StateDirectoryFoodSpot[];
  nonVeg: StateDirectoryFoodSpot[];
  culinaryNote?: string;
  coastalNote?: string;
  spicyNote?: string;
  wineNote?: string;
  peacefulNote?: string;
  [key: string]: any;
}

export interface StateDirectoryAttraction {
  id: string;
  name: string;
  category: string;
  timings: string;
  fee: {
    domestic: string;
    foreign: string;
  };
  isHiddenGem: boolean;
  image: string;
  photoCredit: string;
  summary: string;
}

export interface StateDirectoryCity {
  id: string;
  code: string;
  name: string;
  nickname: string;
  tagline: string;
  flashcardBlurb: string;
  coverImage?: string;
  photoCredit?: string;
  topStays: StateDirectoryStay[];
  dining: StateDirectoryDining;
  attractions: StateDirectoryAttraction[];
  accentColor?: string;
  bgGradient?: string;
}

export interface StateDirectoryConfig {
  stateId: string;
  stateName: string;
  stateCode: string; // e.g. "IN-MH-MASTER"
  title: string;     // e.g. "Maharashtra Master Directory (IN-MH-MASTER)"
  regionalSubtitle: string; // e.g. "WESTERN GHATS, KONKAN COAST & DECCAN PLATEAU"
  cuisineLabel: string;     // e.g. "Malvani, Parsi & Kolhapuri Flavors"
  unescoCount: string;      // e.g. "5 UNESCO Heritage Sites"
  cities: StateDirectoryCity[];
}
