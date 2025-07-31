# TrailGuide Neighborhood Visualization

## Overview

TrailGuide is a narrative-driven data visualization system that transforms demographic data into interactive stories about neighborhood change. Focused on **1225 11th Street North, St. Petersburg, FL 33705**, it reveals the complex dynamics between legacy community, newcomer settlement, and the tensions that arise during neighborhood transition.

## Core Principles

- **Not typical dashboards**: Every visual is anchored in people, place, and paradox
- **Narrative-first**: Data serves story, not the other way around  
- **Community-centered**: Elevates lived experience alongside statistics
- **Tensions visible**: Shows friction between old/new, local/arrival, stability/change
- **Faith as anchor**: Recognizes religious institutions as community resilience hubs

## Components Built

### 1. Split-Narrative Demographics Map
**File**: `src/components/visualizations/NeighborhoodSplitMap.tsx`

Interactive map showing neighborhood zones color-coded by dominant community theme:
- **Legacy areas** (blue): Long-term Black community, family-rooted, faith-anchored
- **Newcomer areas** (red): Young professionals, recent arrivals, higher incomes
- **Transition zones** (amber): Mixed demographics, highest change pressure

**Features**:
- Three view modes: Demographics, Tensions, Stories
- Clickable zones with detailed population statistics
- Community anchor markers (churches, businesses, institutions)
- Tension lines showing displacement pressure between zones
- Story points with community voice quotes
- Animated interactions and smooth transitions

**Props**:
```typescript
interface NeighborhoodSplitMapProps {
  data: DemographicZone[];           // Zone boundaries and demographics
  highlights: {
    churches: CommunityAnchor[];     // Faith institutions and community centers
    homeSales: HomeSale[];           // Recent property transactions
    tensions: TensionLine[];         // Inter-zone displacement pressure
  };
  centerLabel: string;               // Address label for focus point
  annotations: StoryQuote[];         // Community voice quotes
  narrativeMode: 'legacy' | 'newcomer' | 'tension' | 'integrated';
  showStories: boolean;
}
```

### 2. Displacement & Renewal Timeline
**File**: `src/components/visualizations/NeighborhoodTimeline.tsx`

Interactive timeline from 2008-2024 showing relationship between:
- Home value changes (line chart)
- Population shifts (area chart) 
- Community events (milestone markers)
- Displacement data (in/out migration)

**Features**:
- Animated playback of timeline progression
- Event type color coding (development, community, resistance, celebration)
- Clickable data points for detailed year statistics
- Impact lines connecting events to home value changes
- Story integration with event descriptions

**Props**:
```typescript
interface NeighborhoodTimelineProps {
  events: TimelineEvent[];          // Community milestones and turning points
  annualStats: AnnualStats[];       // Yearly home values, rents, population
  narratives: StoryQuote[];         // Timeline-specific stories
  timeRange: [number, number];      // Start and end years
}
```

### 3. Pulse of Faith Community Map
**File**: `src/components/visualizations/FaithPulseMap.tsx`

Radial impact visualization showing faith institutions as community anchors:
- Church locations with congregation size indicators
- Program type rings around each institution
- Animated "pulse" effects showing community reach
- Network connections between collaborating institutions

**Features**:
- Three view modes: Impact Zones, Program Networks, Needs & Support
- Pulsing animation to show ripple effects
- Program type color coding (food, housing, education, healthcare, social, advocacy)
- Church founding era indicators (legacy vs. newer institutions)
- Community needs/support overlay points

**Props**:
```typescript
interface FaithPulseMapProps {
  churches: FaithInstitution[];     // Faith institutions with programs
  radiiData: ProgramRadius[];       // Program reach and intensity data
  overlays: {
    needsData: NeedPoint[];         // Community need locations
    supportData: SupportPoint[];   // Available support locations
  };
}
```

## Data Structure

### Mock Data Files
**File**: `src/data/trailguide-mock.ts`

Comprehensive sample data representing real neighborhood patterns:

- **DemographicZones**: 3 zones (Historic Core, Eastern Transition, Northern Development)
- **CommunityAnchors**: Churches, businesses, community centers with impact metrics
- **TimelineEvents**: 15+ major events from foreclosure crisis to community celebrations
- **AnnualStats**: 5 years of housing, population, and displacement data
- **FaithInstitutions**: Detailed church data with congregation demographics and programs
- **StoryQuotes**: Community voices representing different perspectives and experiences

### Type Definitions
**File**: `src/types/trailguide.ts`

Complete TypeScript interfaces for:
- Demographic and geographic data
- Timeline and historical data
- Faith community and program data
- Story and narrative structures
- Visualization component props

## Technical Stack

- **React 18+**: Component architecture with hooks
- **D3.js**: Custom SVG visualizations and data binding
- **Framer Motion**: Smooth animations and transitions
- **TypeScript**: Full type safety and developer experience
- **Tailwind CSS**: Responsive styling with dark theme
- **ShadCN Components**: UI primitives and layout components

## Design System

### Colors
- **Legacy Community**: Deep blue (#2563eb) - roots, stability
- **Newcomer Areas**: Red (#dc2626) - change, energy
- **Transition Zones**: Amber (#f59e0b) - uncertainty, flux
- **Faith/Community**: Purple (#8b5cf6) - spiritual anchor
- **Center Point**: Gold (#fbbf24) - focal address
- **Backgrounds**: Dark theme (#111112, #1a1a1b) for data focus

### Typography
- **Headings**: Inter - clean, modern, accessible
- **Body/Reading**: Georgia - readable, narrative-friendly
- **Data Labels**: Inter - precise, scannable

### Accessibility
- High contrast color choices
- Keyboard navigation support
- Screen reader compatible
- Responsive design for mobile/tablet
- Clear visual hierarchy

## Usage Examples

### Basic Implementation
```tsx
import { NeighborhoodSplitMap } from '@/components/visualizations/NeighborhoodSplitMap';
import { mockDemographicZones, mockCommunityAnchors } from '@/data/trailguide-mock';

function MyPage() {
  return (
    <NeighborhoodSplitMap
      data={mockDemographicZones}
      highlights={{
        churches: mockCommunityAnchors,
        homeSales: [],
        tensions: []
      }}
      centerLabel="1225 11th St N"
      annotations={[]}
      narrativeMode="integrated"
      showStories={true}
    />
  );
}
```

### Narrative Mode Filtering
```tsx
import { getDataByNarrative } from '@/data/trailguide-mock';

const legacyData = getDataByNarrative('legacy');     // Legacy community focus
const newcomerData = getDataByNarrative('newcomer'); // Newcomer focus  
const tensionData = getDataByNarrative('tension');   // Transition zones
const fullData = getDataByNarrative('integrated');   // Complete picture
```

## Export Capabilities

All visualizations support multiple output formats:
- **Web**: Interactive React components
- **SVG**: Vector export for print/reports  
- **PNG**: Raster export for presentations
- **Print**: CSS print styles for clean printing

Set `exportMode` prop to control rendering optimizations.

## Development Setup

1. **Install Dependencies**
```bash
npm install d3 @types/d3 framer-motion
```

2. **Import Components**
```tsx
import { NeighborhoodSplitMap } from '@/components/visualizations/NeighborhoodSplitMap';
import { NeighborhoodTimeline } from '@/components/visualizations/NeighborhoodTimeline';  
import { FaithPulseMap } from '@/components/visualizations/FaithPulseMap';
```

3. **View Complete Example**
Navigate to `/trailguide` to see all three visualizations integrated with narrative mode switching.

## Data Integration

To replace mock data with real sources:

1. **Census Data**: Update `useCensusData` hook with American Community Survey endpoints
2. **Property Data**: Integrate with real estate APIs (Zillow, local assessor data)
3. **Community Data**: Partner with local organizations for program and impact data
4. **Story Collection**: Implement community story submission and moderation system

## Future Enhancements

- **Storybook Integration**: Component documentation and testing
- **Animation Controls**: User-configurable speed and complexity
- **Data Export**: CSV/JSON download of filtered datasets
- **Annotation System**: User-generated story overlay capability
- **Comparison Mode**: Side-by-side neighborhood analysis
- **Temporal Layers**: Historical map overlays showing change over time

## Community Impact

This tool is designed to:
- **Elevate Community Voice**: Center resident stories in planning discussions
- **Reveal Hidden Patterns**: Make demographic change visible and understandable
- **Bridge Perspectives**: Help legacy and newcomer residents understand each other's experiences
- **Inform Policy**: Provide nuanced data for equitable development decisions
- **Preserve History**: Document and honor neighborhood memory and culture

---

*TrailGuide represents a new approach to neighborhood data - one that recognizes that behind every statistic is a person, a family, a story that matters.*
