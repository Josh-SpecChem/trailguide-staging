import { useState, useCallback } from 'react';

interface CensusData {
  name: string;
  state: string;
  population: number;
  resilience: {
    lowVulnerability: { count: number; percent: number };
    mediumVulnerability: { count: number; percent: number };
    highVulnerability: { count: number; percent: number };
  };
}

interface UseCensusDataReturn {
  data: CensusData | null;
  loading: boolean;
  error: string | null;
  fetchData: (stateCode: string, countyCode?: string) => Promise<void>;
}

export function useCensusData(): UseCensusDataReturn {
  const [data, setData] = useState<CensusData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (stateCode: string, countyCode?: string) => {
    setLoading(true);
    setError(null);

    try {
      // For now, let's use mock data for Saint Petersburg/Pinellas County
      // We'll replace this with real Census API once we debug the endpoint
      if (stateCode === "12" && countyCode === "103") {
        // Mock data for Pinellas County, FL (Saint Petersburg area)
        const mockData: CensusData = {
          name: "Pinellas County, Florida",
          state: "12",
          population: 959107, // Actual 2022 population estimate
          resilience: {
            lowVulnerability: {
              count: 671375, // ~70% low vulnerability
              percent: 70.0,
            },
            mediumVulnerability: {
              count: 191821, // ~20% medium vulnerability  
              percent: 20.0,
            },
            highVulnerability: {
              count: 95911, // ~10% high vulnerability
              percent: 10.0,
            },
          },
        };

        console.log('🏠 Using mock data for Saint Petersburg/Pinellas County:', mockData);
        setData(mockData);
        return;
      }

      // For other locations, try the Census API
      const baseUrl = 'https://api.census.gov/data/2022/acs/acs5';
      const variables = 'NAME,B01003_001E';
      
      let url: string;
      if (countyCode) {
        url = `${baseUrl}?get=${variables}&for=county:${countyCode}&in=state:${stateCode}`;
      } else {
        url = `${baseUrl}?get=${variables}&for=state:${stateCode}`;
      }

      console.log('🌍 Fetching Census data from:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Census API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('📊 Raw Census response:', result);

      // Parse the response - first row is headers, second row is data
      if (!result || result.length < 2) {
        throw new Error('No data returned from Census API');
      }

      const headers = result[0];
      const dataRow = result[1];

      // Map the data to our structure for other locations
      const population = parseInt(dataRow[headers.indexOf('B01003_001E')] || '0');
      const parsedData: CensusData = {
        name: dataRow[headers.indexOf('NAME')],
        state: dataRow[headers.indexOf('state')],
        population: population,
        resilience: {
          lowVulnerability: {
            count: Math.floor(population * 0.65),
            percent: 65.0, // Estimated low vulnerability
          },
          mediumVulnerability: {
            count: Math.floor(population * 0.25),
            percent: 25.0, // Estimated medium vulnerability
          },
          highVulnerability: {
            count: Math.floor(population * 0.10),
            percent: 10.0, // Estimated high vulnerability
          },
        },
      };

      console.log('✅ Parsed Census data:', parsedData);
      setData(parsedData);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      console.error('❌ Census API error:', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, fetchData };
}
