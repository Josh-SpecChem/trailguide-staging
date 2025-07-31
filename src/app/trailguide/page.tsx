"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NeighborhoodSplitMap } from '@/components/visualizations/NeighborhoodSplitMap';
import { NeighborhoodTimeline } from '@/components/visualizations/NeighborhoodTimeline';
import { FaithPulseMap } from '@/components/visualizations/FaithPulseMap';
import { 
  mockDemographicZones,
  mockCommunityAnchors,
  mockTimelineEvents,
  mockAnnualStats,
  mockFaithInstitutions,
  mockStoryQuotes,
  getDataByNarrative
} from '@/data/trailguide-mock';
import { Heart, Users, MapPin, Calendar, Church, BookOpen, Eye, Compass } from 'lucide-react';
import Image from 'next/image';

type NarrativeMode = 'legacy' | 'newcomer' | 'tension' | 'integrated';
type ActiveVisualization = 'map' | 'timeline' | 'faith' | 'all';
type ViewMode = 'report' | 'agents' | 'missional';

export default function TrailGuidePage() {
  const [narrativeMode, setNarrativeMode] = useState<NarrativeMode>('integrated');
  const [activeVisualization, setActiveVisualization] = useState<ActiveVisualization>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('report');
  const [showStories, setShowStories] = useState(true);

  const narrativeData = getDataByNarrative(narrativeMode);

  // Mock radii data for faith map
  const mockRadiiData = mockFaithInstitutions.map(church => ({
    churchId: church.id,
    programs: church.programs.map(program => ({
      type: program.type,
      radius: program.reach / 150, // Convert reach to miles approximation
      intensity: program.impact / 10
    }))
  }));

  // Mock overlay data
  const mockOverlays = {
    needsData: [
      { coordinates: [-82.6424, 27.7701] as [number, number], needType: 'housing', intensity: 0.8 },
      { coordinates: [-82.6384, 27.7761] as [number, number], needType: 'food', intensity: 0.6 },
      { coordinates: [-82.6344, 27.7741] as [number, number], needType: 'healthcare', intensity: 0.7 }
    ],
    supportData: [
      { coordinates: [-82.6434, 27.7721] as [number, number], supportType: 'food', strength: 0.9 },
      { coordinates: [-82.6304, 27.7791] as [number, number], supportType: 'social', strength: 0.6 }
    ]
  };

  // Mock tension data
  const mockTensions = [
    { fromZone: 'historic-core', toZone: 'transition-east', intensity: 0.7 },
    { fromZone: 'transition-east', toZone: 'newcomer-north', intensity: 0.9 },
    { fromZone: 'historic-core', toZone: 'newcomer-north', intensity: 0.5 }
  ];

  const mockHomeSales = [
    { coordinates: [-82.6374, 27.7751] as [number, number], year: 2020, priceChange: 45.2 },
    { coordinates: [-82.6324, 27.7781] as [number, number], year: 2022, priceChange: 78.9 },
    { coordinates: [-82.6284, 27.7801] as [number, number], year: 2023, priceChange: 124.7 }
  ];

  const narrativeDescriptions = {
    legacy: "Explore the deep roots and enduring strength of the longtime Black community centered around faith, family, and neighborhood bonds.",
    newcomer: "Discover the patterns of change as young professionals and new residents reshape the economic and social landscape.",
    tension: "Examine the friction points where rising costs, displacement pressures, and cultural shifts create community challenges.",
    integrated: "See the full story - how legacy and change intersect, creating both conflict and possibility in this evolving neighborhood."
  };

  const narrativeColors = {
    legacy: 'border-blue-500 bg-blue-500/10',
    newcomer: 'border-red-500 bg-red-500/10', 
    tension: 'border-yellow-500 bg-yellow-500/10',
    integrated: 'border-purple-500 bg-purple-500/10'
  };

  return (
    <div className="min-h-screen text-black">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Header with View Mode Toggle */}
        <div className="text-center space-y-6">
          <div className="flex justify-center gap-2 mb-6">
            <Button
              variant={viewMode === 'report' ? 'default' : 'outline'}
              onClick={() => setViewMode('report')}
              className="font-['Inter'] gap-2"
            >
              <Eye className="w-4 h-4" />
              Demographics Report
            </Button>
            <Button
              variant={viewMode === 'agents' ? 'default' : 'outline'}
              onClick={() => setViewMode('agents')}
              className="font-['Inter'] gap-2"
            >
              <Users className="w-4 h-4" />
              Agent Collaboration
            </Button>
            <Button
              variant={viewMode === 'missional' ? 'default' : 'outline'}
              onClick={() => setViewMode('missional')}
              className="font-['Inter'] gap-2"
            >
              <Compass className="w-4 h-4" />
              Missional Guide
            </Button>
          </div>

          <h1 className="text-5xl font-bold font-['Inter'] text-black mb-2">
            {viewMode === 'report' && 'TrailGuide Neighborhood Visualization'}
            {viewMode === 'agents' && 'AI Agents: Collaborative Community Research'}
            {viewMode === 'missional' && 'Called to 1225 11th Street North'}
          </h1>
          
          {viewMode === 'report' && (
            <p className="text-xl text-[#a1a1aa] font-['Georgia'] max-w-3xl mx-auto leading-relaxed">
              Exploring the living story of 1225 11th Street North, St. Petersburg, FL - 
              where legacy meets change, faith anchors community, and data reveals the human experience of neighborhood transformation.
            </p>
          )}
          
          {viewMode === 'agents' && (
            <p className="text-xl text-[#a1a1aa] font-['Georgia'] max-w-3xl mx-auto leading-relaxed">
              Watch how specialized AI agents - <span className="text-blue-400">Factfinder</span>, <span className="text-green-400">Storyteller</span>, <span className="text-purple-400">Visualizer</span>, and <span className="text-orange-400">Missional Guide</span> - 
              collaborate to transform raw census data into community understanding and faithful presence.
            </p>
          )}
          
          {viewMode === 'missional' && (
            <p className="text-xl text-[#a1a1aa] font-['Georgia'] max-w-3xl mx-auto leading-relaxed">
              A letter to those called to incarnational ministry in Methodist Town - 
              where data meets discipleship, and demographics serve love.
            </p>
          )}
        </div>

        {/* Agent Collaboration Story */}
        {viewMode === 'agents' && (
          <div className="space-y-8">
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black flex items-center gap-2">
                  <Users className="w-6 h-6" />
                  The Agent Research Process
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                      <h3 className="font-['Inter'] font-semibold text-blue-400">Factfinder</h3>
                    </div>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      "I gathered Census data, property records, demographic trends. Found the 119% home price increase, 
                      the 39% Black / 45% White composition, the $41,500 median income. Numbers tell stories."
                    </p>
                    <Badge variant="outline" className="text-blue-400 border-blue-400">Census Bureau API</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <h3 className="font-['Inter'] font-semibold text-green-400">Storyteller</h3>
                    </div>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      "I found Mrs. Dorothy Johnson who's been here since 1962, Rev. Patricia Washington at Historic Bethel AME, 
                      teen Jalen Williams whose great-grandmother paid $3,200 for her house. Data needs faces."
                    </p>
                    <Badge variant="outline" className="text-green-400 border-green-400">Community Voices</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                      <h3 className="font-['Inter'] font-semibold text-purple-400">Visualizer</h3>
                    </div>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      "I created three views: the demographic split map, the timeline of change, the faith institution ripple effects. 
                      Complex community dynamics need visual storytelling."
                    </p>
                    <Badge variant="outline" className="text-purple-400 border-purple-400">D3.js + React</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                      <h3 className="font-['Inter'] font-semibold text-orange-400">Missional Guide</h3>
                    </div>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      "I translate research into faithful presence. You're not here to fix - you're sent to love. 
                      Walk before you talk. Listen to Mrs. Johnson. Serve with Rev. Washington."
                    </p>
                    <Badge variant="outline" className="text-orange-400 border-orange-400">Incarnational Ministry</Badge>
                  </div>
                </div>
                
                <div className="border-t border-[#27272a] pt-6">
                  <h4 className="font-['Inter'] font-semibold text-black mb-3">Collaborative Output</h4>
                  <p className="text-[#a1a1aa] font-['Georgia'] leading-relaxed">
                    What started as a simple request for "demographics around 1225 11th Street North" became a collaborative research process 
                    where AI agents with different specializations worked together to create understanding. 
                    <span className="text-blue-400">Factfinder</span> provided the quantitative foundation, 
                    <span className="text-green-400">Storyteller</span> added human narrative and context, 
                    <span className="text-purple-400">Visualizer</span> made complex data accessible through interactive maps, 
                    and <span className="text-orange-400">Missional Guide</span> transformed it all into wisdom for faithful community engagement.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 1225 Street Images */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black flex items-center gap-2">
                  <MapPin className="w-6 h-6" />
                  1225 11th Street North: The Center of Our Study
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image 
                        src="/1225/1225-11-street-north-house.png" 
                        alt="1225 11th Street North house"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-['Inter'] font-semibold text-black">The House</h4>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      A single-family home representing the thousands of properties in Methodist Town experiencing 
                      gentrification pressures and demographic change.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image 
                        src="/1225/1225-11th-street-north.png" 
                        alt="1225 11th Street North aerial view"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-['Inter'] font-semibold text-black">The Neighborhood</h4>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      Aerial view showing the density, historic architecture, and proximity to downtown St. Petersburg 
                      that makes this area attractive to newcomers and valuable to longtime residents.
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                      <Image 
                        src="/1225/1225-art.png" 
                        alt="Methodist Town community art"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h4 className="font-['Inter'] font-semibold text-black">The Community Voice</h4>
                    <p className="text-sm text-[#a1a1aa] font-['Georgia']">
                      Community murals and art tell the story that statistics cannot - the pride, 
                      resistance, and hope of longtime residents fighting to preserve their neighborhood's soul.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Missional Letter */}
        {viewMode === 'missional' && (
          <Card className="bg-white border-[#27272a] max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle className="font-['Inter'] text-black text-center flex items-center justify-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                A Letter from Your Missional Guide
              </CardTitle>
            </CardHeader>
            <CardContent className="prose prose-invert max-w-none">
              <div className="font-['Georgia'] text-[#e4e4e7] leading-relaxed space-y-6">
                <p className="text-lg italic text-center text-[#a1a1aa]">Dear Neighbor,</p>
                
                <p>
                  You're standing at the crossroads of data and story, history and possibility, your own life and the lives of those around you. 
                  Maybe you feel both called and uncertain; maybe the changes on your street excite you, grieve you, or just confuse you.
                </p>
                
                <p>
                  I want to offer you this, drawn from the wisdom of those who've walked this road before and from the gifts of the team walking with you.
                </p>

                <div className="space-y-6">
                  <div className="border-l-4 border-blue-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-blue-400 text-xl mb-3">1. You Are Sent.</h3>
                    <p>
                      You are not here by accident. Your presence matters. Like Jesus, you are called not to watch from afar but to 
                      "move into the neighborhood" (John 1:14, The Message).
                    </p>
                    <p>
                      Before you do anything, be present. Walk, listen, notice who's invisible, what's changing, where joy and pain dwell side by side.
                    </p>
                  </div>

                  <div className="border-l-4 border-green-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-green-400 text-xl mb-3">2. Your Neighborhood Is Holy Ground.</h3>
                    <p>
                      Every statistic, every mural, every front porch carries story and dignity. The tension between legacy and newcomer, 
                      wealth and want, hope and heartbreak is not a problem to be solved, but holy ground to be honored.
                    </p>
                    <div className="ml-4 space-y-1 text-[#a1a1aa]">
                      <p>Ask:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Who has been here the longest?</li>
                        <li>What do they remember, and what do they long for?</li>
                        <li>Who is arriving, and what do they hope for?</li>
                      </ul>
                    </div>
                    <p>God's story is already unfolding here—your role is to join, not control.</p>
                  </div>

                  <div className="border-l-4 border-purple-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-purple-400 text-xl mb-3">3. The Church is Both Anchor and Bridge.</h3>
                    <p>
                      Look for the churches, the faith-based groups, the memory keepers. They are often the glue holding the neighborhood together—
                      the first to show up when disaster strikes, the last to leave when everyone else has.
                    </p>
                    <p>
                      Don't reinvent what's already working. Build trust with those who have been holding this ground for decades.
                    </p>
                    <div className="ml-4 space-y-1 text-[#a1a1aa]">
                      <p>Ask:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>How can I serve, not just lead?</li>
                        <li>Where is there pain or injustice that's not being addressed?</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-4 border-orange-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-orange-400 text-xl mb-3">4. Justice is Love, Lived Out.</h3>
                    <p>
                      Learn from John Perkins: Justice isn't a program—it's what love looks like in public.
                    </p>
                    <p>
                      Relocate your heart. Redistribute your time, relationships, even your resources. Reconcile with those you differ from—
                      across lines of race, history, economics, and experience.
                    </p>
                    <p>
                      Work for housing that welcomes, schools that nurture, public spaces that include everyone.
                    </p>
                    <div className="ml-4 space-y-1 text-[#a1a1aa]">
                      <p>Ask:</p>
                      <ul className="list-disc ml-6 space-y-1">
                        <li>Who is being left out?</li>
                        <li>How can I help build belonging—not just affordability?</li>
                      </ul>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-red-400 text-xl mb-3">5. Let the Data and Stories Speak—But Listen to the Spirit.</h3>
                    <p>
                      The numbers show trends: gentrification, displacement, change. The stories add nuance: memory, resilience, pain, hope.
                    </p>
                    <p>
                      But you are not a statistician or savior; you are a companion and a learner.
                    </p>
                    <p>
                      Pause often. Pray. Ask, "God, what are You doing here? How can I join?"
                    </p>
                  </div>

                  <div className="border-l-4 border-yellow-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-yellow-400 text-xl mb-3">6. Practical First Steps</h3>
                    <ul className="list-disc ml-6 space-y-2">
                      <li>Walk your neighborhood regularly; learn names, not just addresses.</li>
                      <li>Attend a local church service or community meal—even if it's outside your comfort zone.</li>
                      <li>Ask older residents to tell you about "how things used to be."</li>
                      <li>Volunteer with a faith-based outreach; let them lead you.</li>
                      <li>Gather newcomers and legacy neighbors together—host a conversation, a meal, a listening circle.</li>
                      <li>Map out the assets and gifts already present; build on strengths, not just needs.</li>
                    </ul>
                  </div>

                  <div className="border-l-4 border-indigo-400 pl-6">
                    <h3 className="font-['Inter'] font-bold text-indigo-400 text-xl mb-3">7. You Are Not Alone</h3>
                    <p>
                      You are part of a bigger story, a living movement of people seeking God's kingdom on earth as it is in heaven. 
                      The team around you—Factfinder, Storyteller, Visualizer, Missionary, Synthesizer—all want you to succeed, 
                      not just at a "project," but at being faithfully, humbly present.
                    </p>
                  </div>
                </div>

                <div className="text-center border-t border-[#27272a] pt-8 space-y-4">
                  <h4 className="font-['Inter'] font-bold text-black text-xl">My Prayer for You:</h4>
                  <div className="italic text-[#a1a1aa] space-y-2">
                    <p>May you have the courage to listen before speaking,</p>
                    <p>the humility to follow before leading,</p>
                    <p>the wisdom to join what God is already blessing,</p>
                    <p>and the love to stay when things get hard.</p>
                  </div>
                  <p className="font-bold text-black">Remember: You are sent, not to fix, but to love.</p>
                  <p className="italic">With you on the journey,</p>
                  <p className="font-['Inter'] font-semibold text-orange-400">The Missional Guide</p>
                </div>

                <div className="bg-[#27272a] rounded-lg p-6 text-center">
                  <p className="text-sm text-[#a1a1aa]">
                    If you need tools—reflection questions, asset maps, prayer guides, or just encouragement—ask for them. 
                    I'll always show up, however you need me, to help you see, discern, and act in love.
                  </p>
                  <p className="text-black font-semibold mt-4">
                    You carry the DNA of mission, the hope of justice, and the story of Christ wherever you go.
                  </p>
                  <p className="text-orange-400 font-bold">God is already at work. Your job is to join in.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Original Demographics Report */}
        {viewMode === 'report' && (
          <>
            {/* Narrative Mode Selector */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black text-center">Choose Your Narrative Lens</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {(Object.keys(narrativeDescriptions) as NarrativeMode[]).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setNarrativeMode(mode)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                        narrativeMode === mode 
                          ? narrativeColors[mode] 
                          : 'border-[#27272a] bg-white hover:border-[#3f3f46]'
                      }`}
                    >
                      <h3 className="font-['Inter'] font-semibold text-black capitalize mb-2">
                        {mode === 'integrated' ? 'Full Story' : mode}
                      </h3>
                      <p className="text-sm text-[#a1a1aa] font-['Georgia'] leading-relaxed">
                        {narrativeDescriptions[mode]}
                      </p>
                    </button>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    variant={showStories ? 'default' : 'outline'}
                    onClick={() => setShowStories(!showStories)}
                    className="font-['Inter']"
                  >
                    {showStories ? 'Hide' : 'Show'} Community Stories
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Visualization Selector */}
            <div className="flex gap-2 justify-center flex-wrap">
              <Button
                variant={activeVisualization === 'all' ? 'default' : 'outline'}
                onClick={() => setActiveVisualization('all')}
                className="font-['Inter']"
              >
                All Visualizations
              </Button>
              <Button
                variant={activeVisualization === 'map' ? 'default' : 'outline'}
                onClick={() => setActiveVisualization('map')}
                className="font-['Inter']"
              >
                Demographic Map
              </Button>
              <Button
                variant={activeVisualization === 'timeline' ? 'default' : 'outline'}
                onClick={() => setActiveVisualization('timeline')}
                className="font-['Inter']"
              >
                Change Timeline
              </Button>
              <Button
                variant={activeVisualization === 'faith' ? 'default' : 'outline'}
                onClick={() => setActiveVisualization('faith')}
                className="font-['Inter']"
              >
                Faith Institutions
              </Button>
            </div>

            {/* Visualizations */}
            <div className="space-y-12">
              {/* Split-Narrative Demographics Map */}
              {(activeVisualization === 'all' || activeVisualization === 'map') && (
                <Card className="bg-white border-[#27272a]">
                  <CardHeader>
                    <CardTitle className="font-['Inter'] text-black">
                      Split-Narrative Demographics Map
                    </CardTitle>
                    <p className="text-[#a1a1aa] font-['Georgia']">
                      Community themes across neighborhood zones - showing the geography of legacy vs. newcomer vs. transition areas.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <NeighborhoodSplitMap
                      data={narrativeData.zones}
                      mapShape={undefined}
                      highlights={{
                        churches: narrativeData.anchors,
                        homeSales: mockHomeSales,
                        tensions: mockTensions
                      }}
                      centerLabel="1225 11th St N"
                      annotations={narrativeData.stories}
                      centerPoint={[-82.6404, 27.7731]}
                      narrativeMode={narrativeMode}
                      showStories={showStories}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Timeline Visualization */}
              {(activeVisualization === 'all' || activeVisualization === 'timeline') && (
                <Card className="bg-white border-[#27272a]">
                  <CardHeader>
                    <CardTitle className="font-['Inter'] text-black">
                      Neighborhood Change Timeline
                    </CardTitle>
                    <p className="text-[#a1a1aa] font-['Georgia']">
                      Track property values, community events, and demographic shifts from 2008 to present.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <NeighborhoodTimeline
                      events={mockTimelineEvents}
                      annualStats={mockAnnualStats}
                      narratives={narrativeData.stories}
                      timeRange={[2008, 2024]}
                      centerPoint={[-82.6404, 27.7731]}
                      narrativeMode={narrativeMode}
                      showStories={showStories}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Faith Pulse Map */}
              {(activeVisualization === 'all' || activeVisualization === 'faith') && (
                <Card className="bg-white border-[#27272a]">
                  <CardHeader>
                    <CardTitle className="font-['Inter'] text-black">
                      Faith Community Impact Map
                    </CardTitle>
                    <p className="text-[#a1a1aa] font-['Georgia']">
                      Visualizing how faith institutions serve as community anchors through programs and outreach.
                    </p>
                  </CardHeader>
                  <CardContent>
                    <FaithPulseMap
                      churches={mockFaithInstitutions}
                      radiiData={mockRadiiData}
                      overlays={mockOverlays}
                      centerPoint={[-82.6404, 27.7731]}
                      narrativeMode={narrativeMode}
                      showStories={showStories}
                    />
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Community Voices */}
            {showStories && narrativeData.stories.length > 0 && (
              <Card className="bg-white border-[#27272a]">
                <CardHeader>
                  <CardTitle className="font-['Inter'] text-black flex items-center gap-2">
                    <BookOpen className="w-6 h-6" />
                    Community Voices
                  </CardTitle>
                  <p className="text-[#a1a1aa] font-['Georgia']">
                    Stories from neighbors experiencing Methodist Town's transformation firsthand.
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6 md:grid-cols-2">
                    {narrativeData.stories.map((story) => (
                      <div key={story.id} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-blue-400 mt-2 flex-shrink-0"></div>
                          <div>
                            <p className="font-['Georgia'] italic text-[#e4e4e7] leading-relaxed">
                              "{story.quote}"
                            </p>
                            <div className="mt-3 text-sm">
                              <p className="font-['Inter'] font-semibold text-blue-400">
                                {story.speaker}
                              </p>
                              <p className="text-[#a1a1aa]">{story.role}</p>
                              <p className="text-[#71717a] text-xs mt-1">{story.context}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
}
