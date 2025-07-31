// TrailGuide Neighborhood Visualization Types
// Focused on 1225 11th Street North, St. Petersburg, FL 33705

export interface DemographicZone {
  id: string;
  name: string;
  coordinates: [number, number][];
  dominantTheme: 'legacy' | 'newcomer' | 'transition';
  demographics: {
    totalPopulation: number;
    ageGroups: {
      under18: number;
      age18_34: number;
      age35_54: number;
      age55_74: number;
      over75: number;
    };
    race: {
      black: number;
      white: number;
      hispanic: number;
      other: number;
    };
    income: {
      median: number;
      belowPoverty: number;
    };
    housing: {
      owned: number;
      rented: number;
      averageYearsResident: number;
    };
  };
  tensionMetrics: {
    priceChangePercent: number;
    turnoverRate: number;
    newConstructionCount: number;
  };
}

export interface CommunityAnchor {
  id: string;
  name: string;
  type: 'church' | 'school' | 'business' | 'community_center';
  coordinates: [number, number];
  foundedYear: number;
  impact: {
    reach: number; // people served
    services: string[];
    communityRating: number; // 1-10
  };
  story: string;
}

export interface TimelineEvent {
  year: number;
  month?: number;
  eventType: 'development' | 'community' | 'economic' | 'resistance' | 'celebration';
  label: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  affectedPopulation: number;
  coordinates?: [number, number];
  story?: string;
}

export interface AnnualStats {
  year: number;
  homeValues: {
    median: number;
    average: number;
    percentChange: number;
  };
  rentPrices: {
    median: number;
    average: number;
    percentChange: number;
  };
  population: {
    total: number;
    byAge: Record<string, number>;
    byRace: Record<string, number>;
  };
  displacement: {
    familiesLeaving: number;
    newcomersArriving: number;
    netChange: number;
  };
}

export interface FaithInstitution {
  id: string;
  name: string;
  denomination: string;
  coordinates: [number, number];
  foundedYear: number;
  congregation: {
    size: number;
    demographics: {
      avgAge: number;
      percentLocal: number; // % living within 2 miles
      percentMultiGenerational: number;
    };
  };
  programs: Array<{
    name: string;
    type: 'food' | 'housing' | 'education' | 'healthcare' | 'social' | 'advocacy';
    reach: number; // people served annually
    impact: number; // 1-10 community impact score
  }>;
  rippleEffect: {
    directImpact: number; // people directly served
    networkImpact: number; // extended community reach
    economicImpact: number; // dollars in community support
  };
}

export interface StoryQuote {
  id: string;
  speaker: string;
  role: string; // "longtime resident", "newcomer", "pastor", etc.
  quote: string;
  context: string;
  coordinates?: [number, number]; // where the story takes place
  theme: 'legacy' | 'change' | 'tension' | 'hope' | 'loss' | 'resistance';
}

export interface VisualizationProps {
  // Common props for all TrailGuide visualizations
  centerPoint: [number, number]; // 1225 11th St N coordinates
  narrativeMode: 'legacy' | 'newcomer' | 'tension' | 'integrated';
  showStories: boolean;
  exportMode?: 'web' | 'print' | 'svg';
  accessibilityMode?: boolean;
}

// Map-specific types
export interface NeighborhoodSplitMapProps extends VisualizationProps {
  data: DemographicZone[];
  mapShape?: any; // GeoJSON shape
  highlights: {
    churches: CommunityAnchor[];
    homeSales: Array<{coordinates: [number, number], year: number, priceChange: number}>;
    tensions: Array<{fromZone: string, toZone: string, intensity: number}>;
  };
  centerLabel: string;
  annotations: StoryQuote[];
}

// Timeline-specific types
export interface NeighborhoodTimelineProps extends VisualizationProps {
  events: TimelineEvent[];
  annualStats: AnnualStats[];
  narratives: StoryQuote[];
  timeRange: [number, number]; // [startYear, endYear]
}

// Faith Map-specific types
export interface FaithPulseMapProps extends VisualizationProps {
  churches: FaithInstitution[];
  radiiData: Array<{
    churchId: string;
    programs: Array<{
      type: string;
      radius: number; // in miles
      intensity: number; // 0-1
    }>;
  }>;
  overlays: {
    needsData: Array<{coordinates: [number, number], needType: string, intensity: number}>;
    supportData: Array<{coordinates: [number, number], supportType: string, strength: number}>;
  };
}
