"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResilienceIndicator } from "@/components/ui/resilience-indicator";
import { useCensusData } from "@/hooks/useCensusData";
import { 
  mockDemographicZones,
  mockTimelineEvents,
  mockAnnualStats,
  mockFaithInstitutions,
} from '@/data/trailguide-mock';
import { 
  Users, 
  Home, 
  DollarSign, 
  TrendingUp, 
  MapPin, 
  Calendar,
  Building,
  GraduationCap,
  Heart,
  Briefcase,
  Car,
  ShoppingCart,
  Database,
  Map
} from 'lucide-react';

export default function IntegratedDemographicsPage() {
  // Census API data state
  const [stateCode, setStateCode] = useState("12"); // Florida
  const [countyCode, setCountyCode] = useState("103"); // Pinellas County
  const { data: censusData, loading: censusLoading, error: censusError, fetchData } = useCensusData();

  // TrailGuide mock data state
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'current' | '5year' | '10year'>('current');
  const [activeTab, setActiveTab] = useState<'census' | 'community'>('census');

  useEffect(() => {
    // Auto-load Saint Petersburg data on mount
    fetchData("12", "103");
  }, [fetchData]);

  const handleCensusSearch = () => {
    fetchData(stateCode, countyCode);
  };

  const getVulnerabilityLevel = (percent: number): 'low' | 'medium' | 'high' => {
    if (percent < 20) return 'low';
    if (percent < 40) return 'medium';
    return 'high';
  };

  // Calculate TrailGuide aggregate demographics
  const totalPopulation = mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.totalPopulation, 0);
  const trailguideData = {
    population: totalPopulation,
    medianAge: 42.3,
    medianIncome: 68821,
    homeOwnership: 47.2,
    collegeEducated: 34.6,
    unemploymentRate: 6.8
  };

  // Racial composition aggregated
  const racialComposition = {
    black: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.race.black, 0) / totalPopulation) * 100),
    white: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.race.white, 0) / totalPopulation) * 100),
    hispanic: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.race.hispanic, 0) / totalPopulation) * 100),
    other: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.race.other, 0) / totalPopulation) * 100)
  };

  // Get selected zone data
  const currentZoneData = selectedZone === 'all' 
    ? trailguideData 
    : mockDemographicZones.find(zone => zone.id === selectedZone)?.demographics;

  console.log('Selected Zone:', selectedZone);
  console.log('Selected Timeframe:', timeframe);
  console.log('Selected Data:', currentZoneData);

  return (
    <div className="min-h-screen text-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-['Inter'] text-black">
            St. Petersburg Demographics Hub
          </h1>
          <p className="text-lg text-[#a1a1aa] font-['Georgia'] max-w-3xl mx-auto">
            Comprehensive demographic analysis combining real-time Census data with local community insights. 
            Explore both regional trends and hyperlocal neighborhood narratives.
          </p>
        </div>

        {/* Data Source Tabs */}
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'census' | 'community')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="census" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Census Data
            </TabsTrigger>
            <TabsTrigger value="community" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Community Analysis
            </TabsTrigger>
          </TabsList>

          {/* Census API Data Tab */}
          <TabsContent value="census" className="space-y-6">
            {/* Search Controls */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  U.S. Census Bureau Data
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-2">
                      State Code (FIPS)
                    </label>
                    <Input
                      type="text"
                      value={stateCode}
                      onChange={(e) => setStateCode(e.target.value)}
                      placeholder="12 (Florida)"
                      className="border-[#52525b] text-black"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-2">
                      County Code (FIPS)
                    </label>
                    <Input
                      type="text"
                      value={countyCode}
                      onChange={(e) => setCountyCode(e.target.value)}
                      placeholder="103 (Pinellas)"
                      className="border-[#52525b] text-black"
                    />
                  </div>
                  <Button 
                    onClick={handleCensusSearch}
                    disabled={censusLoading}
                    className="bg-[#8b5cf6] text-white hover:bg-[#7c3aed]"
                  >
                    {censusLoading ? "Loading..." : "Search"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Census Error Display */}
            {censusError && (
              <Alert className="border-red-300 bg-red-50">
                <AlertDescription className="text-red-800">
                  {censusError}
                </AlertDescription>
              </Alert>
            )}

            {/* Census Data Display */}
            {censusData && (
              <div className="space-y-6">
                <Card className="bg-white border-[#27272a]">
                  <CardHeader>
                    <CardTitle className="font-['Inter'] text-black">
                      {censusData.name}, {censusData.state}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">Population</h3>
                        <p className="text-3xl font-bold text-[#8b5cf6]">
                          {censusData.population.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">Social Vulnerability</h3>
                        <div className="space-y-3">
                          <ResilienceIndicator
                            label="Low Vulnerability"
                            count={censusData.resilience.lowVulnerability.count}
                            percent={censusData.resilience.lowVulnerability.percent}
                            total={censusData.population}
                            variant="low"
                          />
                          <ResilienceIndicator
                            label="Medium Vulnerability"
                            count={censusData.resilience.mediumVulnerability.count}
                            percent={censusData.resilience.mediumVulnerability.percent}
                            total={censusData.population}
                            variant="medium"
                          />
                          <ResilienceIndicator
                            label="High Vulnerability"
                            count={censusData.resilience.highVulnerability.count}
                            percent={censusData.resilience.highVulnerability.percent}
                            total={censusData.population}
                            variant="high"
                          />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-black">Resilience Score</h3>
                        <div className="text-center">
                          <div className="text-4xl font-bold text-black mb-2">
                            {(100 - censusData.resilience.highVulnerability.percent).toFixed(1)}%
                          </div>
                          <Badge variant={
                            getVulnerabilityLevel(censusData.resilience.highVulnerability.percent) === 'low' ? 'default' :
                            getVulnerabilityLevel(censusData.resilience.highVulnerability.percent) === 'medium' ? 'secondary' : 'destructive'
                          }>
                            {getVulnerabilityLevel(censusData.resilience.highVulnerability.percent) === 'low' ? 'High Resilience' :
                             getVulnerabilityLevel(censusData.resilience.highVulnerability.percent) === 'medium' ? 'Medium Resilience' : 'Lower Resilience'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Community Analysis Tab */}
          <TabsContent value="community" className="space-y-6">
            {/* Zone Selection */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black flex items-center gap-2">
                  <Map className="w-5 h-5" />
                  Community Analysis - 1225 11th Street North Area
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-2">
                      Geographic Zone
                    </label>
                    <select 
                      value={selectedZone}
                      onChange={(e) => setSelectedZone(e.target.value)}
                      className="w-full p-2 border border-[#52525b] rounded-md text-black"
                    >
                      <option value="all">All Zones (Aggregated)</option>
                      {mockDemographicZones.map((zone) => (
                        <option key={zone.id} value={zone.id}>
                          {zone.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-black mb-2">
                      Timeframe
                    </label>
                    <select 
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value as 'current' | '5year' | '10year')}
                      className="w-full p-2 border border-[#52525b] rounded-md text-black"
                    >
                      <option value="current">Current (2025)</option>
                      <option value="5year">5-Year Trend</option>
                      <option value="10year">10-Year Trend</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Demographics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-white border-[#27272a]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Total Population</CardTitle>
                  <Users className="h-4 w-4 text-[#8b5cf6]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{trailguideData.population.toLocaleString()}</div>
                  <p className="text-xs text-[#a1a1aa]">Across {mockDemographicZones.length} zones</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#27272a]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Median Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-[#8b5cf6]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">${trailguideData.medianIncome.toLocaleString()}</div>
                  <p className="text-xs text-[#a1a1aa]">Annual household income</p>
                </CardContent>
              </Card>

              <Card className="bg-white border-[#27272a]">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-black">Home Ownership</CardTitle>
                  <Home className="h-4 w-4 text-[#8b5cf6]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-black">{trailguideData.homeOwnership}%</div>
                  <p className="text-xs text-[#a1a1aa]">Owner-occupied housing</p>
                </CardContent>
              </Card>
            </div>

            {/* Racial Composition */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black">Community Composition</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{racialComposition.black}%</div>
                    <div className="text-sm text-[#a1a1aa]">Black/African American</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{racialComposition.white}%</div>
                    <div className="text-sm text-[#a1a1aa]">White</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{racialComposition.hispanic}%</div>
                    <div className="text-sm text-[#a1a1aa]">Hispanic/Latino</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-black">{racialComposition.other}%</div>
                    <div className="text-sm text-[#a1a1aa]">Other/Multiracial</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Black/African American</span>
                    <span>{racialComposition.black}%</span>
                  </div>
                  <Progress value={racialComposition.black} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>White</span>
                    <span>{racialComposition.white}%</span>
                  </div>
                  <Progress value={racialComposition.white} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Hispanic/Latino</span>
                    <span>{racialComposition.hispanic}%</span>
                  </div>
                  <Progress value={racialComposition.hispanic} className="h-2" />
                  
                  <div className="flex justify-between text-sm">
                    <span>Other/Multiracial</span>
                    <span>{racialComposition.other}%</span>
                  </div>
                  <Progress value={racialComposition.other} className="h-2" />
                </div>
              </CardContent>
            </Card>

            {/* Community Zones */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black">Neighborhood Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockDemographicZones.map((zone) => (
                    <div 
                      key={zone.id} 
                      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedZone === zone.id 
                          ? 'border-[#8b5cf6] bg-purple-50' 
                          : 'border-[#52525b] hover:border-[#a1a1aa]'
                      }`}
                      onClick={() => setSelectedZone(zone.id)}
                    >
                      <h3 className="font-semibold text-black">{zone.name}</h3>
                      <p className="text-sm text-[#a1a1aa] mb-2">Theme: {zone.dominantTheme}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Population:</span>
                          <span className="font-medium">{zone.demographics.totalPopulation.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Median Income:</span>
                          <span className="font-medium">${zone.demographics.income.median.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Homeownership:</span>
                          <span className="font-medium">
                            {Math.round((zone.demographics.housing.owned / zone.demographics.totalPopulation) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Faith Institutions */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Community Anchors & Faith Institutions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {mockFaithInstitutions.slice(0, 6).map((institution) => (
                    <div key={institution.id} className="p-4 border border-[#52525b] rounded-lg">
                      <h3 className="font-semibold text-black">{institution.name}</h3>
                      <p className="text-sm text-[#a1a1aa] mb-2">{institution.denomination} • {institution.foundedYear}</p>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Congregation:</span>
                          <span className="font-medium">{institution.congregation.size}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Founded:</span>
                          <span className="font-medium">{institution.foundedYear}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
