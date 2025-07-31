// TrailGuide Mock Data Generator
// Creating narrative-rich sample data for 1225 11th Street North, St. Petersburg, FL

import { 
  DemographicZone, 
  CommunityAnchor, 
  TimelineEvent, 
  AnnualStats, 
  FaithInstitution, 
  StoryQuote 
} from '@/types/trailguide';

// Coordinates for 1225 11th Street North, St. Petersburg, FL 33705
export const CENTER_COORDINATES: [number, number] = [-82.6404, 27.7731];

export const mockDemographicZones: DemographicZone[] = [
  {
    id: 'methodist-town-core',
    name: 'Methodist Town Core',
    coordinates: [
      [-82.6454, 27.7781],
      [-82.6354, 27.7781], 
      [-82.6354, 27.7681],
      [-82.6454, 27.7681]
    ],
    dominantTheme: 'legacy',
    demographics: {
      totalPopulation: 1640, // Based on Methodist Town data
      ageGroups: {
        under18: 213, // ~13%
        age18_34: 541, // ~33% - young adult concentration
        age35_54: 623, // ~38%
        age55_74: 213, // ~13%
        over75: 50   // ~3%
      },
      race: {
        black: 639,  // ~39% - significant Black legacy community
        white: 738,  // ~45% - growing White population
        hispanic: 164, // ~10%
        other: 99    // ~6%
      },
      income: {
        median: 41500, // Lower end of Methodist Town range
        belowPoverty: 410 // ~25% poverty rate
      },
      housing: {
        owned: 974,  // ~59.4% based on Methodist Town data
        rented: 666, // ~40.6%
        averageYearsResident: 18.7 // Mixed legacy/newcomer
      }
    },
    tensionMetrics: {
      priceChangePercent: 119.3, // Historic district appreciation
      turnoverRate: 24.1,
      newConstructionCount: 8
    }
  },
  {
    id: 'historic-uptown-transition',
    name: 'Historic Uptown Transition',
    coordinates: [
      [-82.6354, 27.7781],
      [-82.6254, 27.7781],
      [-82.6254, 27.7681], 
      [-82.6354, 27.7681]
    ],
    dominantTheme: 'transition',
    demographics: {
      totalPopulation: 1230, // Mixed demographic area
      ageGroups: {
        under18: 160, // ~13%
        age18_34: 406, // ~33% - continued young professional draw
        age35_54: 467, // ~38%
        age55_74: 160, // ~13%
        over75: 37    // ~3%
      },
      race: {
        black: 480,  // ~39% - maintaining diversity
        white: 554,  // ~45% - increasing
        hispanic: 123, // ~10%
        other: 73    // ~6%
      },
      income: {
        median: 68821, // Methodist Town median
        belowPoverty: 246 // ~20% - lower poverty due to gentrification
      },
      housing: {
        owned: 393,  // ~32% - more rental due to young professionals
        rented: 837, // ~68%
        averageYearsResident: 6.4 // Higher turnover
      }
    },
    tensionMetrics: {
      priceChangePercent: 85.2, // City average appreciation
      turnoverRate: 41.7,
      newConstructionCount: 15
    }
  },
  {
    id: 'longstanding-newcomer',
    name: 'Newcomer Enclave',
    coordinates: [
      [-82.6304, 27.7681],
      [-82.6204, 27.7681],
      [-82.6204, 27.7581],
      [-82.6304, 27.7581]
    ],
    dominantTheme: 'newcomer',
    demographics: {
      totalPopulation: 723, // Smaller zone with higher income density
      ageGroups: {
        under18: 94,  // ~13%
        age18_34: 247, // ~34% - young professionals
        age35_54: 246, // ~34%
        age55_74: 115, // ~16%
        over75: 21    // ~3%
      },
      race: {
        black: 152,  // ~21% - significantly lower
        white: 434,  // ~60% - majority newcomer
        hispanic: 94, // ~13%
        other: 43    // ~6%
      },
      income: {
        median: 87500, // Higher income newcomers
        belowPoverty: 65 // ~9% - much lower poverty
      },
      housing: {
        owned: 376,  // ~52%
        rented: 347, // ~48%
        averageYearsResident: 3.2 // Newest residents
      }
    },
    tensionMetrics: {
      priceChangePercent: 142.8, // Highest appreciation
      turnoverRate: 67.3, // Highest turnover
      newConstructionCount: 28
    }
  }
];

export const mockCommunityAnchors: CommunityAnchor[] = [
  {
    id: 'historic-bethel-ame',
    name: 'Historic Bethel AME Church',
    type: 'church',
    coordinates: [-82.6291, 27.7721],
    foundedYear: 1865,
    impact: {
      reach: 450,
      services: ['Food Bank', 'After-School Programs', 'Senior Services', 'Community Garden', 'Social Justice Advocacy'],
      communityRating: 9.4
    },
    story: "Founded by freedpeople after the Civil War, Historic Bethel has been a cornerstone of Methodist Town for over 150 years. The church has led community organizing efforts and provides critical social services."
  },
  {
    id: 'first-united-methodist',
    name: 'First United Methodist Church',
    type: 'church',
    coordinates: [-82.6305, 27.7695],
    foundedYear: 1872,
    impact: {
      reach: 320,
      services: ['Food Assistance', 'Homeless Services', 'Community Advocacy', 'Interfaith Dialogue'],
      communityRating: 9.1
    },
    story: "A historic Methodist church that has served both longtime residents and newcomers. Known for their social justice advocacy and homeless ministry that bridges community divisions."
  },
  {
    id: 'cathedral-church-st-peter',
    name: 'Cathedral Church of St. Peter',
    type: 'church',
    coordinates: [-82.6275, 27.7655],
    foundedYear: 1894,
    impact: {
      reach: 180,
      services: ['Arts Programs', 'Community Events', 'Youth Mentorship', 'Cultural Events'],
      communityRating: 7.8
    },
    story: "An Episcopal cathedral that has become a gathering place for arts and cultural events, attracting both long-term residents and newcomers with some tension as congregation demographics shift."
  },
  {
    id: 'st-augustine-catholic',
    name: 'St. Augustine Catholic Church',
    type: 'church',
    coordinates: [-82.6320, 27.7680],
    foundedYear: 1891,
    impact: {
      reach: 280,
      services: ['Immigrant Services', 'Community Garden', 'Senior Services', 'Cultural Bridge Programs'],
      communityRating: 8.7
    },
    story: "A Catholic parish serving the Hispanic community and offering immigrant services, while also serving longtime African American parishioners, building bridges across ethnic lines."
  },
  {
    id: 'mt-pleasant-baptist',
    name: 'Mt. Pleasant Baptist Church',
    type: 'church',
    coordinates: [-82.6285, 27.7735],
    foundedYear: 1923,
    impact: {
      reach: 195,
      services: ['After-School Programs', 'Community Garden', 'Elder Care', 'Youth Development'],
      communityRating: 8.5
    },
    story: "A Baptist church deeply rooted in the Methodist Town community, known for their strong youth programs and community garden initiatives while concerned about maintaining community character."
  }
];

export const mockTimelineEvents: TimelineEvent[] = [
  {
    year: 2008,
    eventType: 'economic',
    label: 'Foreclosure Crisis Impacts Methodist Town',
    description: 'Housing crisis particularly affects longtime Black homeowners',
    impact: 'high',
    affectedPopulation: 145,
    story: "The foreclosure crisis hit Methodist Town hard, with many families losing homes they'd owned for generations. This created the first wave of involuntary displacement."
  },
  {
    year: 2010,
    eventType: 'development',
    label: 'Historic District Designation',
    description: 'Methodist Town achieves historic designation, starting property value increases',
    impact: 'medium',
    affectedPopulation: 1640,
    story: "Historic designation brought prestige and protection, but also marked the beginning of rapid property value increases that would challenge longtime residents."
  },
  {
    year: 2012,
    eventType: 'community',
    label: 'Bethel AME Community Garden',
    description: 'Historic Bethel AME transforms vacant lot into community growing space',
    impact: 'medium',
    affectedPopulation: 280,
    coordinates: [-82.6291, 27.7721],
    story: "When the old Patterson house was demolished, the church turned the lot into a community garden. It became a symbol of residents taking control of their neighborhood's future."
  },
  {
    year: 2015,
    eventType: 'development',
    label: 'First Wave Luxury Development',
    description: 'High-end condos and townhomes begin construction',
    impact: 'high',
    affectedPopulation: 520,
    coordinates: [-82.6275, 27.7695],
    story: "The $300K+ condos on 11th Street North were the first sign that Methodist Town was becoming unaffordable for working families."
  },
  {
    year: 2017,
    eventType: 'resistance',
    label: 'Methodist Town Preservation Coalition',
    description: 'Residents organize to fight displacement and preserve community character',
    impact: 'medium',
    affectedPopulation: 890,
    coordinates: [-82.6291, 27.7721],
    story: "Led by church members and longtime residents, the coalition fought for affordable housing requirements and community input on new developments."
  },
  {
    year: 2019,
    eventType: 'economic',
    label: 'Property Values Peak 119% Increase',
    description: 'Historic district sees dramatic appreciation, pricing out many residents',
    impact: 'high',
    affectedPopulation: 1200,
    story: "When houses that sold for $85,000 in 2010 hit $185,000, families realized the neighborhood they'd built was no longer affordable for their children."
  },
  {
    year: 2020,
    eventType: 'community',
    label: 'Pandemic Mutual Aid Network',
    description: 'Churches coordinate food assistance and rent relief during COVID-19',
    impact: 'high',
    affectedPopulation: 730,
    story: "The pandemic showed Methodist Town's resilience. Churches became distribution centers, and neighbors who barely knew each other started looking out for one another."
  },
  {
    year: 2023,
    eventType: 'celebration',
    label: 'Methodist Town Heritage Mural',
    description: 'Community artists document neighborhood history on church wall',
    impact: 'medium',
    affectedPopulation: 400,
    coordinates: [-82.6305, 27.7695],
    story: "The mural at First United Methodist shows 150 years of Methodist Town history - from freedpeople building homes to today's fight for affordable housing."
  }
];

export const mockAnnualStats: AnnualStats[] = [
  {
    year: 2008,
    homeValues: { median: 89000, average: 94500, percentChange: -12.3 },
    rentPrices: { median: 650, average: 695, percentChange: 2.1 },
    population: { 
      total: 2890,
      byAge: { under18: 578, adult: 1734, senior: 578 },
      byRace: { black: 2023, white: 549, hispanic: 231, other: 87 }
    },
    displacement: { familiesLeaving: 45, newcomersArriving: 12, netChange: -33 }
  },
  {
    year: 2012,
    homeValues: { median: 67000, average: 72100, percentChange: -24.7 },
    rentPrices: { median: 725, average: 780, percentChange: 12.2 },
    population: { 
      total: 2756,
      byAge: { under18: 523, adult: 1653, senior: 580 },
      byRace: { black: 1930, white: 524, hispanic: 220, other: 82 }
    },
    displacement: { familiesLeaving: 67, newcomersArriving: 23, netChange: -44 }
  },
  {
    year: 2016,
    homeValues: { median: 145000, average: 158900, percentChange: 116.4 },
    rentPrices: { median: 950, average: 1045, percentChange: 31.0 },
    population: { 
      total: 2634,
      byAge: { under18: 474, adult: 1633, senior: 527 },
      byRace: { black: 1685, white: 711, hispanic: 184, other: 54 }
    },
    displacement: { familiesLeaving: 89, newcomersArriving: 156, netChange: 67 }
  },
  {
    year: 2020,
    homeValues: { median: 234000, average: 267800, percentChange: 61.4 },
    rentPrices: { median: 1350, average: 1485, percentChange: 42.1 },
    population: { 
      total: 2723,
      byAge: { under18: 435, adult: 1742, senior: 546 },
      byRace: { black: 1471, white: 980, hispanic: 190, other: 82 }
    },
    displacement: { familiesLeaving: 134, newcomersArriving: 223, netChange: 89 }
  },
  {
    year: 2024,
    homeValues: { median: 387000, average: 423600, percentChange: 65.4 },
    rentPrices: { median: 1850, average: 2090, percentChange: 37.0 },
    population: { 
      total: 2773,
      byAge: { under18: 541, adult: 1789, senior: 443 },
      byRace: { black: 1507, white: 947, hispanic: 198, other: 121 }
    },
    displacement: { familiesLeaving: 203, newcomersArriving: 253, netChange: 50 }
  }
];

export const mockFaithInstitutions: FaithInstitution[] = [
  {
    id: 'historic-bethel-ame',
    name: 'Historic Bethel AME Church',
    denomination: 'African Methodist Episcopal',
    coordinates: [-82.6291, 27.7721],
    foundedYear: 1865,
    congregation: {
      size: 450,
      demographics: {
        avgAge: 49,
        percentLocal: 94, // Deepest neighborhood roots
        percentMultiGenerational: 78
      }
    },
    programs: [
      { name: 'Food Bank Ministry', type: 'food', reach: 280, impact: 9 },
      { name: 'After-School Program', type: 'education', reach: 45, impact: 9 },
      { name: 'Senior Care Network', type: 'social', reach: 120, impact: 8 },
      { name: 'Community Organizing', type: 'advocacy', reach: 180, impact: 9 }
    ],
    rippleEffect: {
      directImpact: 625,
      networkImpact: 1840,
      economicImpact: 347000
    }
  },
  {
    id: 'first-united-methodist',
    name: 'First United Methodist Church',
    denomination: 'United Methodist',
    coordinates: [-82.6305, 27.7695],
    foundedYear: 1872,
    congregation: {
      size: 320,
      demographics: {
        avgAge: 46,
        percentLocal: 71, // Mix of longtime and newer residents
        percentMultiGenerational: 52
      }
    },
    programs: [
      { name: 'Homeless Services', type: 'social', reach: 65, impact: 9 },
      { name: 'Food Assistance', type: 'food', reach: 195, impact: 8 },
      { name: 'Community Advocacy', type: 'advocacy', reach: 85, impact: 7 },
      { name: 'Bridge Building Ministry', type: 'social', reach: 125, impact: 8 }
    ],
    rippleEffect: {
      directImpact: 470,
      networkImpact: 1265,
      economicImpact: 298000
    }
  },
  {
    id: 'cathedral-church-st-peter',
    name: 'Cathedral Church of St. Peter',
    denomination: 'Episcopal',
    coordinates: [-82.6275, 27.7655],
    foundedYear: 1894,
    congregation: {
      size: 180,
      demographics: {
        avgAge: 42,
        percentLocal: 56, // Many newcomer parishioners
        percentMultiGenerational: 34
      }
    },
    programs: [
      { name: 'Arts & Culture Program', type: 'education', reach: 75, impact: 7 },
      { name: 'Community Events', type: 'social', reach: 150, impact: 6 },
      { name: 'Youth Mentorship', type: 'education', reach: 32, impact: 7 }
    ],
    rippleEffect: {
      directImpact: 257,
      networkImpact: 685,
      economicImpact: 156000
    }
  },
  {
    id: 'st-augustine-catholic',
    name: 'St. Augustine Catholic Church',
    denomination: 'Roman Catholic',
    coordinates: [-82.6320, 27.7680],
    foundedYear: 1891,
    congregation: {
      size: 280,
      demographics: {
        avgAge: 44,
        percentLocal: 68,
        percentMultiGenerational: 59
      }
    },
    programs: [
      { name: 'Immigrant Services', type: 'social', reach: 95, impact: 9 },
      { name: 'Community Garden', type: 'social', reach: 58, impact: 7 },
      { name: 'Senior Services', type: 'social', reach: 87, impact: 8 }
    ],
    rippleEffect: {
      directImpact: 240,
      networkImpact: 780,
      economicImpact: 189000
    }
  },
  {
    id: 'mt-pleasant-baptist',
    name: 'Mt. Pleasant Baptist Church',
    denomination: 'Baptist',
    coordinates: [-82.6285, 27.7735],
    foundedYear: 1923,
    congregation: {
      size: 195,
      demographics: {
        avgAge: 51,
        percentLocal: 87,
        percentMultiGenerational: 72
      }
    },
    programs: [
      { name: 'After-School Care', type: 'education', reach: 38, impact: 9 },
      { name: 'Community Garden', type: 'social', reach: 42, impact: 7 },
      { name: 'Elder Care Ministry', type: 'social', reach: 67, impact: 9 }
    ],
    rippleEffect: {
      directImpact: 147,
      networkImpact: 485,
      economicImpact: 145000
    }
  }
];

export const mockStoryQuotes: StoryQuote[] = [
  {
    id: 'mrs-johnson-legacy',
    speaker: 'Mrs. Dorothy Johnson',
    role: 'longtime resident',
    quote: "I've been on 11th Street since 1962. Watched my children grow up playing in these yards, graduated from the school around the corner. But now my property taxes are higher than my Social Security check.",
    context: "Speaking at Methodist Town Preservation Coalition meeting",
    coordinates: [-82.6291, 27.7721],
    theme: 'legacy'
  },
  {
    id: 'david-newcomer',
    speaker: 'David Rodriguez',
    role: 'newcomer',
    quote: "We fell in love with the history here, the beautiful architecture. We want to honor what's been built while being good neighbors. But I understand why longtime residents are concerned about the changes.",
    context: "Interview about moving to Methodist Town in 2019",
    coordinates: [-82.6275, 27.7695],
    theme: 'tension'
  },
  {
    id: 'rev-washington-bridge',
    speaker: 'Rev. Patricia Washington',
    role: 'pastor, Historic Bethel AME',
    quote: "This church has seen Methodist Town through Reconstruction, Jim Crow, urban renewal, and now gentrification. Our mission remains the same: to be a sanctuary for all who need one.",
    context: "Sunday sermon on community resilience",
    coordinates: [-82.6291, 27.7721],
    theme: 'hope'
  },
  {
    id: 'teen-perspective',
    speaker: 'Jalen Williams',
    role: 'local high school student',
    quote: "My great-grandmother bought her house here for $3,200 in 1955. Now the house next door sold for $185,000. Where am I supposed to live when I graduate? This is my family's neighborhood.",
    context: "Youth forum on neighborhood change",
    coordinates: [-82.6285, 27.7735],
    theme: 'tension'
  },
  {
    id: 'community-leader',
    speaker: 'Carlos Medina',
    role: 'Methodist Town Preservation Coalition',
    quote: "We're not against progress or new neighbors. We're fighting for a community where teachers, mechanics, and grandmothers can still afford to live alongside lawyers and tech workers.",
    context: "City Council public comment on affordable housing",
    coordinates: [-82.6305, 27.7695],
    theme: 'resistance'
  },
  {
    id: 'elder-wisdom',
    speaker: 'Mr. Robert Hayes',
    role: 'community elder',
    quote: "I remember when this street was all Black families. Then came integration, urban renewal, white flight. Now it's coming full circle. The question is: can we do it right this time?",
    context: "Community history discussion at St. Augustine Catholic",
    coordinates: [-82.6320, 27.7680],
    theme: 'legacy'
  }
];

// Utility function to get data by narrative mode
export function getDataByNarrative(mode: 'legacy' | 'newcomer' | 'tension' | 'integrated') {
  switch (mode) {
    case 'legacy':
      return {
        zones: mockDemographicZones.filter(z => z.dominantTheme === 'legacy'),
        stories: mockStoryQuotes.filter(s => s.theme === 'legacy' || s.theme === 'resistance'),
        anchors: mockCommunityAnchors.filter(a => a.foundedYear < 2000)
      };
    case 'newcomer':
      return {
        zones: mockDemographicZones.filter(z => z.dominantTheme === 'newcomer'),
        stories: mockStoryQuotes.filter(s => s.theme === 'change' || s.theme === 'tension'),
        anchors: mockCommunityAnchors.filter(a => a.foundedYear >= 2000)
      };
    case 'tension':
      return {
        zones: mockDemographicZones.filter(z => z.dominantTheme === 'transition'),
        stories: mockStoryQuotes.filter(s => s.theme === 'tension' || s.theme === 'loss'),
        anchors: mockCommunityAnchors
      };
    default: // integrated
      return {
        zones: mockDemographicZones,
        stories: mockStoryQuotes,
        anchors: mockCommunityAnchors
      };
  }
}
