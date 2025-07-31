"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ResilienceIndicator } from "@/components/ui/resilience-indicator";
import { useCensusData } from "@/hooks/useCensusData";

export default function DemographicsPage() {
  const [stateCode, setStateCode] = useState("12"); // Florida
  const [countyCode, setCountyCode] = useState("103"); // Pinellas County
  const { data, loading, error, fetchData } = useCensusData();

  useEffect(() => {
    // Auto-load Saint Petersburg data on mount
    fetchData("12", "103");
  }, [fetchData]);

  const handleSearch = () => {
    fetchData(stateCode, countyCode);
  };

  const getVulnerabilityLevel = (percent: number): 'low' | 'medium' | 'high' => {
    if (percent < 20) return 'low';
    if (percent < 40) return 'medium';
    return 'high';
  };

  return (
    <div className="min-h-screen text-black p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold font-['Inter'] text-black">
            Census Demographics Dashboard
          </h1>
          <p className="text-lg text-[#a1a1aa] font-['Georgia'] max-w-2xl mx-auto">
            Explore social vulnerability and community resilience data from the U.S. Census Bureau.
            Currently focused on Saint Petersburg, FL and surrounding Pinellas County.
          </p>
        </div>

        {/* Search Controls */}
        <Card className="bg-white border-[#27272a]">
          <CardHeader>
            <CardTitle className="font-['Inter'] text-black">Location Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2 font-['Inter']">
                  State FIPS Code
                </label>
                <Input
                  value={stateCode}
                  onChange={(e) => setStateCode(e.target.value)}
                  placeholder="12 (Florida)"
                  className="bg-white border-[#27272a] text-black"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-[#a1a1aa] mb-2 font-['Inter']">
                  County FIPS Code
                </label>
                <Input
                  value={countyCode}
                  onChange={(e) => setCountyCode(e.target.value)}
                  placeholder="103 (Pinellas)"
                  className="bg-white border-[#27272a] text-black"
                />
              </div>
              <Button 
                onClick={handleSearch}
                disabled={loading}
                className="bg-[#8b5cf6] hover:bg-[#7c3aed] font-['Inter']"
              >
                {loading ? "Loading..." : "Search"}
              </Button>
            </div>
            
            {/* Debug Information */}
            <div className="mt-4 p-3 bg-white rounded border border-[#27272a]">
              <p className="text-sm text-[#71717a] font-['Inter']">
                <strong>Debug:</strong> State: {stateCode}, County: {countyCode}, 
                Loading: {loading.toString()}, 
                Data: {data ? "Loaded" : "None"}, 
                Error: {error || "None"}
              </p>
            </div>
            
            <p className="text-sm text-[#71717a] mt-2 font-['Inter']">
              Tip: Florida is state code 12, Pinellas County is 103 (Saint Petersburg area)
            </p>
          </CardContent>
        </Card>

        {/* Error Display */}
        {error && (
          <Alert className="bg-red-900/20 border-red-800">
            <AlertDescription className="text-red-400 font-['Inter']">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {/* Data Display */}
        {data && (
          <div className="space-y-8">
            {/* Location Overview */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black">Location Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-black font-['Inter'] mb-1">
                      {data.name}
                    </h3>
                    <p className="text-[#a1a1aa] font-['Inter']">Location</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-black font-['Inter'] mb-1">
                      {data.state}
                    </h3>
                    <p className="text-[#a1a1aa] font-['Inter']">State</p>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-black font-['Inter'] mb-1">
                      {data.population.toLocaleString()}
                    </h3>
                    <p className="text-[#a1a1aa] font-['Inter']">Total Population</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Vulnerability Indicators */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-black font-['Inter']">
                Social Vulnerability Assessment
              </h2>
              <p className="text-[#a1a1aa] font-['Georgia']">
                Community Resilience Estimates showing population vulnerability levels during disasters or emergencies.
                These are aggregated vulnerability scores based on multiple demographic and socioeconomic factors.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ResilienceIndicator
                  label="Low Vulnerability"
                  count={data.resilience.lowVulnerability.count}
                  percent={data.resilience.lowVulnerability.percent}
                  total={data.population}
                  variant="low"
                />

                <ResilienceIndicator
                  label="Medium Vulnerability"
                  count={data.resilience.mediumVulnerability.count}
                  percent={data.resilience.mediumVulnerability.percent}
                  total={data.population}
                  variant="medium"
                />

                <ResilienceIndicator
                  label="High Vulnerability"
                  count={data.resilience.highVulnerability.count}
                  percent={data.resilience.highVulnerability.percent}
                  total={data.population}
                  variant="high"
                />
              </div>
            </div>

            {/* Additional Context */}
            <Card className="bg-white border-[#27272a]">
              <CardHeader>
                <CardTitle className="font-['Inter'] text-black">About This Data</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-[#a1a1aa] font-['Georgia'] leading-relaxed">
                  The Community Resilience Estimates (CRE) provide social vulnerability indicators
                  at the county level. These metrics help identify populations that may need
                  additional support during emergencies or disasters.
                </p>
                <p className="text-[#a1a1aa] font-['Georgia'] leading-relaxed">
                  <strong className="text-black">Data Source:</strong> U.S. Census Bureau Community Resilience Estimates, 2023
                </p>
                <p className="text-[#a1a1aa] font-['Georgia'] leading-relaxed">
                  <strong className="text-black">Saint Petersburg Context:</strong> Located in Pinellas County, FL (FIPS 12103),
                  this data represents county-wide demographics that include Saint Petersburg and surrounding communities.
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading State */}
        {loading && !data && (
          <Card className="bg-white border-[#27272a]">
            <CardContent className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8b5cf6] mx-auto mb-4"></div>
              <p className="text-[#a1a1aa] font-['Inter']">
                Loading demographic data from Census Bureau...
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
