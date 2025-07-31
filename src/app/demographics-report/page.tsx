"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  ShoppingCart
} from 'lucide-react';

export default function DemographicsReportPage() {
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [timeframe, setTimeframe] = useState<'current' | '5year' | '10year'>('current');

  // Calculate aggregate demographics
  const totalPopulation = mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.totalPopulation, 0);
  const aggregateData = {
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

  // Age distribution aggregated
  const ageDistribution = {
    under18: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.ageGroups.under18, 0) / totalPopulation) * 100),
    age18_34: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.ageGroups.age18_34, 0) / totalPopulation) * 100),
    age35_54: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.ageGroups.age35_54, 0) / totalPopulation) * 100),
    age55_74: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.ageGroups.age55_74, 0) / totalPopulation) * 100),
    over75: Math.round((mockDemographicZones.reduce((sum, zone) => sum + zone.demographics.ageGroups.over75, 0) / totalPopulation) * 100)
  };

  // Economic indicators
  const economicData = {
    medianHouseholdIncome: 68821,
    povertyRate: 18.2,
    medianHomeValue: 387000,
    rentMedian: 1850,
    homeOwnershipRate: 47.2,
    priceAppreciation5yr: 89.3
  };

  // Education and employment
  const educationEmployment = {
    highSchoolGrad: 87.4,
    collegeGrad: 34.6,
    graduateDegree: 12.8,
    laborForceParticipation: 67.2,
    unemploymentRate: 6.8,
    medianCommute: 23.5
  };

  // Housing characteristics
  const housingData = {
    totalUnits: 1547,
    singleFamily: 68.4,
    multiFamily: 31.6,
    ownerOccupied: 47.2,
    renterOccupied: 52.8,
    medianYearBuilt: 1958,
    medianRooms: 5.2
  };

  // Timeframe-specific data variations
  const getTimeframeData = () => {
    const baseData = {
      population: totalPopulation,
      medianIncome: 68821,
      medianHomeValue: 387000,
      collegeEducated: 34.6,
      unemploymentRate: 6.8,
      priceAppreciation: 89.3
    };

    switch (timeframe) {
      case '5year':
        return {
          ...baseData,
          medianIncome: 61200, // 5 years ago
          medianHomeValue: 234000, // 5 years ago  
          collegeEducated: 31.2,
          unemploymentRate: 8.4,
          priceAppreciation: 65.2
        };
      case '10year':
        return {
          ...baseData,
          population: Math.round(totalPopulation * 1.042), // 10-year growth
          medianIncome: 52300, // 10 years ago
          medianHomeValue: 145000, // 10 years ago
          collegeEducated: 28.1,
          unemploymentRate: 11.2,
          priceAppreciation: 166.9 // Total 10-year appreciation
        };
      default: // current
        return baseData;
    }
  };

  const timeframeData = getTimeframeData();

  const selectedData = selectedZone === 'all' 
    ? aggregateData 
    : mockDemographicZones.find(zone => zone.id === selectedZone);

  // Debug: log when selection changes
  console.log('Selected Zone:', selectedZone);
  console.log('Selected Timeframe:', timeframe);
  console.log('Selected Data:', selectedData);

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header with Background Image */}
        <div 
          className="relative h-96 rounded-lg overflow-hidden shadow-lg"
          style={{
            backgroundImage: "url('/1225/1225-art.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-60" />
          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center items-center text-center p-8">
            <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
              Methodist Town Demographics Report
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto mb-6 drop-shadow-md">
              Comprehensive demographic analysis for 1225 11th Street North, St. Petersburg, FL
            </p>
            <div className="flex justify-center items-center gap-6 text-sm text-white drop-shadow-md">
              <span className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Pinellas County, Florida
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Data as of 2024
              </span>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
        {/* Controls */}
        <div className="bg-gray-50 rounded-lg shadow-sm border p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  selectedZone === 'all' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setSelectedZone('all')}
              >
                All Areas
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  selectedZone === 'methodist-town-core' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setSelectedZone('methodist-town-core')}
              >
                Methodist Town Core
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  selectedZone === 'historic-uptown-transition' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setSelectedZone('historic-uptown-transition')}
              >
                Historic Uptown
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  selectedZone === 'longstanding-newcomer' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setSelectedZone('longstanding-newcomer')}
              >
                Newcomer Areas
              </button>
            </div>
            <div className="flex gap-3">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  timeframe === 'current' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setTimeframe('current')}
              >
                Current (2024)
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  timeframe === '5year' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setTimeframe('5year')}
              >
                5-Year Trend
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium rounded-md border transition-colors ${
                  timeframe === '10year' 
                    ? '!bg-[#a855f7] !text-black !border-[#a855f7] hover:!bg-[#9333ea]' 
                    : '!bg-white !text-black !border-gray-300 hover:!bg-[#a855f7] hover:!text-black hover:!border-[#a855f7]'
                }`}
                onClick={() => setTimeframe('10year')}
              >
                10-Year Change
              </button>
            </div>
          </div>
        </div>

        {/* Key Statistics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Total Population</p>
                  <p className="text-2xl font-bold text-black">
                    {selectedZone === 'all' 
                      ? timeframeData.population.toLocaleString() 
                      : (selectedData as any)?.demographics?.totalPopulation?.toLocaleString() || 'N/A'
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Median Income</p>
                  <p className="text-2xl font-bold text-black">${timeframeData.medianIncome.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Home className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Median Home Value</p>
                  <p className="text-2xl font-bold text-black">${timeframeData.medianHomeValue.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-black font-medium">
                    {timeframe === '10year' ? '10-Year Appreciation' : 
                     timeframe === '5year' ? '5-Year Appreciation' : 
                     'Current Appreciation'}
                  </p>
                  <p className="text-2xl font-bold text-black">+{timeframeData.priceAppreciation}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <GraduationCap className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-black font-medium">College Educated</p>
                  <p className="text-2xl font-bold text-black">{timeframeData.collegeEducated}%</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Briefcase className="w-6 h-6 text-black" />
                </div>
                <div>
                  <p className="text-sm text-black font-medium">Unemployment</p>
                  <p className="text-2xl font-bold text-black">{timeframeData.unemploymentRate}%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Analysis Tabs */}
        <Tabs defaultValue="demographics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="demographics" className="text-black">Demographics</TabsTrigger>
            <TabsTrigger value="economics" className="text-black">Economics</TabsTrigger>
            <TabsTrigger value="housing" className="text-black">Housing</TabsTrigger>
            <TabsTrigger value="trends" className="text-black">Trends</TabsTrigger>
          </TabsList>

          {/* Demographics Tab */}
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Age Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Users className="w-5 h-5" />
                    Age Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">Under 18</span>
                      <span className="text-sm font-bold text-black">{ageDistribution.under18}%</span>
                    </div>
                    <Progress value={ageDistribution.under18} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">18-34 (Young Adults)</span>
                      <span className="text-sm font-bold text-black">{ageDistribution.age18_34}%</span>
                    </div>
                    <Progress value={ageDistribution.age18_34} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">35-54 (Middle Age)</span>
                      <span className="text-sm font-bold text-black">{ageDistribution.age35_54}%</span>
                    </div>
                    <Progress value={ageDistribution.age35_54} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">55-74 (Pre-Retirement)</span>
                      <span className="text-sm font-bold text-black">{ageDistribution.age55_74}%</span>
                    </div>
                    <Progress value={ageDistribution.age55_74} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">75+ (Senior)</span>
                      <span className="text-sm font-bold text-black">{ageDistribution.over75}%</span>
                    </div>
                    <Progress value={ageDistribution.over75} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Racial Composition */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Heart className="w-5 h-5" />
                    Racial & Ethnic Composition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">Black/African American</span>
                      <span className="text-sm font-bold text-black">{racialComposition.black}%</span>
                    </div>
                    <Progress value={racialComposition.black} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">White</span>
                      <span className="text-sm font-bold text-black">{racialComposition.white}%</span>
                    </div>
                    <Progress value={racialComposition.white} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">Hispanic/Latino</span>
                      <span className="text-sm font-bold text-black">{racialComposition.hispanic}%</span>
                    </div>
                    <Progress value={racialComposition.hispanic} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black font-medium">Other/Multiracial</span>
                      <span className="text-sm font-bold text-black">{racialComposition.other}%</span>
                    </div>
                    <Progress value={racialComposition.other} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Education Levels */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <GraduationCap className="w-5 h-5" />
                  Educational Attainment (Adults 25+)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center text-black">
                    <div className="text-3xl font-bold text-black">{educationEmployment.highSchoolGrad}%</div>
                    <div className="text-sm text-black font-medium">High School Graduate+</div>
                  </div>
                  <div className="text-center text-black">
                    <div className="text-3xl font-bold text-black">{educationEmployment.collegeGrad}%</div>
                    <div className="text-sm text-black font-medium">Bachelor's Degree+</div>
                  </div>
                  <div className="text-center text-black">
                    <div className="text-3xl font-bold text-black">{educationEmployment.graduateDegree}%</div>
                    <div className="text-sm text-black font-medium">Graduate Degree+</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Economics Tab */}
          <TabsContent value="economics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Income Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <DollarSign className="w-5 h-5" />
                    Income & Poverty
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">${economicData.medianHouseholdIncome.toLocaleString()}</div>
                      <div className="text-sm text-black font-medium">Median Household Income</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">{economicData.povertyRate}%</div>
                      <div className="text-sm text-black font-medium">Below Poverty Line</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-black">Income Distribution</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">Under $25,000</span>
                        <span className="text-sm font-bold text-black">15.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">$25,000 - $49,999</span>
                        <span className="text-sm font-bold text-black">22.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">$50,000 - $74,999</span>
                        <span className="text-sm font-bold text-black">19.6%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">$75,000 - $99,999</span>
                        <span className="text-sm font-bold text-black">16.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">$100,000+</span>
                        <span className="text-sm font-bold text-black">26.0%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Employment */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Briefcase className="w-5 h-5" />
                    Employment & Labor Force
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">{educationEmployment.laborForceParticipation}%</div>
                      <div className="text-sm text-black font-medium">Labor Force Participation</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">{educationEmployment.unemploymentRate}%</div>
                      <div className="text-sm text-black font-medium">Unemployment Rate</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-bold text-black">Top Employment Sectors</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">Healthcare & Social Assistance</span>
                        <span className="text-sm font-bold text-black">18.3%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">Accommodation & Food Services</span>
                        <span className="text-sm font-bold text-black">14.7%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">Professional Services</span>
                        <span className="text-sm font-bold text-black">12.9%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">Retail Trade</span>
                        <span className="text-sm font-bold text-black">11.8%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-black font-medium">Manufacturing</span>
                        <span className="text-sm font-bold text-black">8.4%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commuting */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <Car className="w-5 h-5" />
                  Commuting Patterns
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center text-black">
                    <div className="text-2xl font-bold text-black">{educationEmployment.medianCommute} min</div>
                    <div className="text-sm text-black font-medium">Median Commute Time</div>
                  </div>
                  <div className="text-center text-black">
                    <div className="text-2xl font-bold text-black">76.4%</div>
                    <div className="text-sm text-black font-medium">Drive Alone</div>
                  </div>
                  <div className="text-center text-black">
                    <div className="text-2xl font-bold text-black">8.7%</div>
                    <div className="text-sm text-black font-medium">Public Transportation</div>
                  </div>
                  <div className="text-center text-black">
                    <div className="text-2xl font-bold text-black">12.3%</div>
                    <div className="text-sm text-black font-medium">Work from Home</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Housing Tab */}
          <TabsContent value="housing" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Housing Overview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Home className="w-5 h-5" />
                    Housing Overview
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">{housingData.totalUnits.toLocaleString()}</div>
                      <div className="text-sm text-black">Total Housing Units</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">{housingData.medianYearBuilt}</div>
                      <div className="text-sm text-black">Median Year Built</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Single-Family Homes</span>
                      <span className="text-sm font-medium">{housingData.singleFamily}%</span>
                    </div>
                    <Progress value={housingData.singleFamily} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Multi-Family/Apartments</span>
                      <span className="text-sm font-medium">{housingData.multiFamily}%</span>
                    </div>
                    <Progress value={housingData.multiFamily} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              {/* Occupancy & Values */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-black">
                    <Building className="w-5 h-5" />
                    Occupancy & Values
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">${economicData.medianHomeValue.toLocaleString()}</div>
                      <div className="text-sm text-black">Median Home Value</div>
                    </div>
                    <div className="text-center p-4 bg-white border border-gray-300 rounded-lg">
                      <div className="text-2xl font-bold text-black">${economicData.rentMedian.toLocaleString()}</div>
                      <div className="text-sm text-black">Median Rent</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Owner Occupied</span>
                      <span className="text-sm font-medium">{housingData.ownerOccupied}%</span>
                    </div>
                    <Progress value={housingData.ownerOccupied} className="h-2" />
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-black">Renter Occupied</span>
                      <span className="text-sm font-medium">{housingData.renterOccupied}%</span>
                    </div>
                    <Progress value={housingData.renterOccupied} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Housing Affordability */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <DollarSign className="w-5 h-5" />
                  Housing Affordability Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white border-2 border-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">32.4%</div>
                    <div className="text-sm text-black">Cost-Burdened Homeowners</div>
                    <div className="text-xs text-black mt-1">({'>'}30% income on housing)</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">48.7%</div>
                    <div className="text-sm text-black">Cost-Burdened Renters</div>
                    <div className="text-xs text-black mt-1">({'>'}30% income on housing)</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-orange-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">$95,000</div>
                    <div className="text-sm text-black">Income Needed for Median Home</div>
                    <div className="text-xs text-black mt-1">(20% down, 30% ratio)</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-yellow-300 rounded-lg">
                    <div className="text-2xl font-bold text-black">+{economicData.priceAppreciation5yr}%</div>
                    <div className="text-sm text-black">5-Year Price Appreciation</div>
                    <div className="text-xs text-black mt-1">(Well above inflation)</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Trends Tab */}
          <TabsContent value="trends" className="space-y-6">
            {/* Population Change */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <TrendingUp className="w-5 h-5" />
                  Population & Demographic Trends (2014-2024)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-white border-2 border-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">-4.2%</div>
                    <div className="text-sm text-black">Population Change</div>
                    <div className="text-xs text-black mt-1">Slight decline due to displacement</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">+8.3%</div>
                    <div className="text-sm text-black">White Population Change</div>
                    <div className="text-xs text-black mt-1">Gentrification indicator</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-red-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">-12.7%</div>
                    <div className="text-sm text-black">Black Population Change</div>
                    <div className="text-xs text-black mt-1">Displacement concern</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Economic Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <DollarSign className="w-5 h-5" />
                  Economic Trend Analysis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-black">Income Trends</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-black">2014 Median Income</span>
                          <span className="text-sm font-medium">$52,300</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">2019 Median Income</span>
                          <span className="text-sm font-medium">$61,200</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">2024 Median Income</span>
                          <span className="text-sm font-medium">$68,821</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span className="text-sm text-black">10-Year Growth</span>
                            <span className="text-sm text-black">+31.6%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-medium text-black">Housing Value Trends</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-black">2014 Median Value</span>
                          <span className="text-sm font-medium">$145,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">2019 Median Value</span>
                          <span className="text-sm font-medium">$234,000</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-black">2024 Median Value</span>
                          <span className="text-sm font-medium">$387,000</span>
                        </div>
                        <div className="border-t pt-2">
                          <div className="flex justify-between font-medium">
                            <span className="text-sm text-black">10-Year Growth</span>
                            <span className="text-sm text-black">+166.9%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Community Indicators */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-black">
                  <ShoppingCart className="w-5 h-5" />
                  Community Stability Indicators
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-white border-2 border-yellow-300 rounded-lg">
                    <div className="text-2xl font-bold text-black">6.8 years</div>
                    <div className="text-sm text-black">Average Residency Length</div>
                    <div className="text-xs text-black mt-1">Lower = more turnover</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-blue-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">5</div>
                    <div className="text-sm text-black">Historic Churches</div>
                    <div className="text-xs text-black mt-1">Community anchors</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-green-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">78%</div>
                    <div className="text-sm text-black">Multi-Generation Families</div>
                    <div className="text-xs text-black mt-1">Historic Bethel AME</div>
                  </div>
                  <div className="text-center p-4 bg-white border-2 border-purple-200 rounded-lg">
                    <div className="text-2xl font-bold text-black">42%</div>
                    <div className="text-sm text-black">Neighborhood Turnover</div>
                    <div className="text-xs text-black mt-1">10-year period</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Area Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Area Comparison: Methodist Town vs. Regional Averages</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 text-black">Metric</th>
                    <th className="text-center py-2 text-black">Methodist Town</th>
                    <th className="text-center py-2 text-black">St. Petersburg</th>
                    <th className="text-center py-2 text-black">Pinellas County</th>
                    <th className="text-center py-2 text-black">Florida</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-black">Population</td>
                    <td className="text-center text-black">{totalPopulation.toLocaleString()}</td>
                    <td className="text-center text-black">258,308</td>
                    <td className="text-center text-black">959,107</td>
                    <td className="text-center text-black">22.6M</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-black">Median Income</td>
                    <td className="text-center text-black">${economicData.medianHouseholdIncome.toLocaleString()}</td>
                    <td className="text-center text-black">$56,816</td>
                    <td className="text-center text-black">$58,987</td>
                    <td className="text-center text-black">$64,329</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-black">Median Home Value</td>
                    <td className="text-center text-black">${economicData.medianHomeValue.toLocaleString()}</td>
                    <td className="text-center text-black">$298,400</td>
                    <td className="text-center text-black">$285,200</td>
                    <td className="text-center text-black">$292,300</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-black">College Educated</td>
                    <td className="text-center text-black">{educationEmployment.collegeGrad}%</td>
                    <td className="text-center text-black">32.1%</td>
                    <td className="text-center text-black">31.8%</td>
                    <td className="text-center text-black">30.5%</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-black">Poverty Rate</td>
                    <td className="text-center text-black">{economicData.povertyRate}%</td>
                    <td className="text-center text-black">15.9%</td>
                    <td className="text-center text-black">12.4%</td>
                    <td className="text-center text-black">12.7%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Data Sources & Methodology */}
        <Card>
          <CardHeader>
            <CardTitle className="text-black">Data Sources & Methodology</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-black mb-3">Primary Data Sources</h4>
                <ul className="space-y-2 text-sm text-black">
                  <li>• U.S. Census Bureau American Community Survey (2018-2022)</li>
                  <li>• Pinellas County Property Appraiser Records</li>
                  <li>• Florida Department of Economic Opportunity</li>
                  <li>• St. Petersburg Housing Market Analysis</li>
                  <li>• Community Demographic Survey (Methodist Town, 2024)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-black mb-3">Methodology Notes</h4>
                <ul className="space-y-2 text-sm text-black">
                  <li>• Geographic boundaries based on Census Block Groups</li>
                  <li>• Income data adjusted for inflation (2024 dollars)</li>
                  <li>• Housing values represent median sale prices</li>
                  <li>• Trend analysis covers 10-year period (2014-2024)</li>
                  <li>• Margin of error: ±5% for most demographic estimates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-black border-t pt-6">
          <p>Report generated on {new Date().toLocaleDateString()} | For questions about this data, contact the Planning Department</p>
        </div>
        </div>
      </div>
    </div>
  );
}
