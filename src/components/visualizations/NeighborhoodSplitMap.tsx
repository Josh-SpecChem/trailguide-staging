"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NeighborhoodSplitMapProps, DemographicZone, StoryQuote } from '@/types/trailguide';

export function NeighborhoodSplitMap({
  data,
  highlights,
  centerLabel,
  annotations,
  narrativeMode = 'integrated',
  showStories = true,
  exportMode = 'web'
}: NeighborhoodSplitMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedZone, setSelectedZone] = useState<DemographicZone | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryQuote | null>(null);
  const [viewMode, setViewMode] = useState<'demographics' | 'tensions' | 'stories'>(
    narrativeMode === 'tension' ? 'tensions' : 'demographics'
  );

  const width = 800;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };

  // Color schemes for different themes
  const themeColors = {
    legacy: '#2563eb', // Deep blue - roots, stability
    newcomer: '#dc2626', // Red - change, new energy  
    transition: '#f59e0b', // Amber - in-between, uncertainty
    tension: '#dc2626' // Red for tension lines
  };

  const getZoneColor = (zone: DemographicZone, mode: string) => {
    if (mode === 'tensions') {
      const intensity = zone.tensionMetrics.priceChangePercent / 100;
      return d3.interpolateReds(Math.min(intensity, 1));
    }
    return themeColors[zone.dominantTheme];
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create scales based on coordinate bounds
    const allCoords = data.flatMap(zone => zone.coordinates);
    const xExtent = d3.extent(allCoords, d => d[0]) as [number, number];
    const yExtent = d3.extent(allCoords, d => d[1]) as [number, number];

    const xScale = d3.scaleLinear()
      .domain(xExtent)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain(yExtent)
      .range([height - margin.bottom, margin.top]);

    // Create main group
    const g = svg.append('g');

    // Draw zones
    const zones = g.selectAll('.zone')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'zone')
      .style('cursor', 'pointer');

    // Zone polygons
    zones.append('path')
      .attr('d', (d) => {
        const pathCoords = d.coordinates.map(coord => [
          xScale(coord[0]), 
          yScale(coord[1])
        ]);
        return `M${pathCoords.join('L')}Z`;
      })
      .attr('fill', (d) => getZoneColor(d, viewMode))
      .attr('stroke', '#1f2937')
      .attr('stroke-width', 2)
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('opacity', 1)
          .attr('stroke-width', 3);
      })
      .on('mouseout', function(event, d) {
        if (selectedZone?.id !== d.id) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('opacity', 0.8)
            .attr('stroke-width', 2);
        }
      })
      .on('click', (event, d) => {
        setSelectedZone(d);
      });

    // Zone labels
    zones.append('text')
      .attr('x', (d) => {
        const centroidX = d3.mean(d.coordinates, coord => xScale(coord[0])) || 0;
        return centroidX;
      })
      .attr('y', (d) => {
        const centroidY = d3.mean(d.coordinates, coord => yScale(coord[1])) || 0;
        return centroidY;
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .text(d => d.name);

    // Draw tension lines if in tension mode
    if (viewMode === 'tensions' && highlights.tensions) {
      const tensionLines = g.selectAll('.tension-line')
        .data(highlights.tensions)
        .enter()
        .append('line')
        .attr('class', 'tension-line')
        .attr('x1', (d) => {
          const fromZone = data.find(z => z.id === d.fromZone);
          if (!fromZone) return 0;
          return d3.mean(fromZone.coordinates, coord => xScale(coord[0])) || 0;
        })
        .attr('y1', (d) => {
          const fromZone = data.find(z => z.id === d.fromZone);
          if (!fromZone) return 0;
          return d3.mean(fromZone.coordinates, coord => yScale(coord[1])) || 0;
        })
        .attr('x2', (d) => {
          const toZone = data.find(z => z.id === d.toZone);
          if (!toZone) return 0;
          return d3.mean(toZone.coordinates, coord => xScale(coord[0])) || 0;
        })
        .attr('y2', (d) => {
          const toZone = data.find(z => z.id === d.toZone);
          if (!toZone) return 0;
          return d3.mean(toZone.coordinates, coord => yScale(coord[1])) || 0;
        })
        .attr('stroke', themeColors.tension)
        .attr('stroke-width', (d) => 2 + d.intensity * 4)
        .attr('opacity', 0.7)
        .style('stroke-dasharray', '5,5');
    }

    // Draw community anchors
    const anchors = g.selectAll('.anchor')
      .data(highlights.churches)
      .enter()
      .append('g')
      .attr('class', 'anchor')
      .style('cursor', 'pointer');

    anchors.append('circle')
      .attr('cx', (d) => xScale(d.coordinates[0]))
      .attr('cy', (d) => yScale(d.coordinates[1]))
      .attr('r', 8)
      .attr('fill', '#8b5cf6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2);

    anchors.append('text')
      .attr('x', (d) => xScale(d.coordinates[0]))
      .attr('y', (d) => yScale(d.coordinates[1]) - 15)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '10px')
      .style('font-weight', '500')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .text(d => d.name.split(' ')[0]); // First word only

    // Draw story points if in stories mode
    if (viewMode === 'stories' && showStories) {
      const storyPoints = g.selectAll('.story-point')
        .data(annotations)
        .enter()
        .append('g')
        .attr('class', 'story-point')
        .style('cursor', 'pointer');

      storyPoints.append('circle')
        .attr('cx', (d) => d.coordinates ? xScale(d.coordinates[0]) : 0)
        .attr('cy', (d) => d.coordinates ? yScale(d.coordinates[1]) : 0)
        .attr('r', 6)
        .attr('fill', '#22c55e')
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .on('click', (event, d) => {
          setSelectedStory(d);
        });
    }

    // Center point marker for 1225 11th St N
    g.append('circle')
      .attr('cx', xScale(centerPoint[0]))
      .attr('cy', yScale(centerPoint[1]))
      .attr('r', 12)
      .attr('fill', '#fbbf24')
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))');

    g.append('text')
      .attr('x', xScale(centerPoint[0]))
      .attr('y', yScale(centerPoint[1]) - 20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('font-weight', '700')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .text(centerLabel);

  }, [data, highlights, viewMode, showStories, centerLabel]);

  const centerPoint: [number, number] = [-82.6404, 27.7731]; // 1225 11th Street North

  return (
    <div className="w-full space-y-6">
      {/* View Mode Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={viewMode === 'demographics' ? 'default' : 'outline'}
          onClick={() => setViewMode('demographics')}
          className="font-['Inter']"
        >
          Demographics
        </Button>
        <Button
          variant={viewMode === 'tensions' ? 'default' : 'outline'}
          onClick={() => setViewMode('tensions')}
          className="font-['Inter']"
        >
          Tensions
        </Button>
        <Button
          variant={viewMode === 'stories' ? 'default' : 'outline'}
          onClick={() => setViewMode('stories')}
          className="font-['Inter']"
        >
          Stories
        </Button>
      </div>

      {/* Map Container */}
      <div className="relative bg-white rounded-lg border border-[#27272a] overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-auto"
          viewBox={`0 0 ${width} ${height}`}
        />

        {/* Legend */}
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 space-y-2">
          <h4 className="font-['Inter'] font-semibold text-black text-sm">
            {viewMode === 'demographics' && 'Community Themes'}
            {viewMode === 'tensions' && 'Price Change Intensity'}
            {viewMode === 'stories' && 'Story Locations'}
          </h4>
          {viewMode === 'demographics' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{backgroundColor: themeColors.legacy}}></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">Legacy Community</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{backgroundColor: themeColors.transition}}></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">Transition Zone</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded" style={{backgroundColor: themeColors.newcomer}}></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">Newcomer Area</span>
              </div>
            </div>
          )}
          {viewMode === 'tensions' && (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-200"></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">Low Change</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-600"></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">High Change</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Zone Details */}
      <AnimatePresence>
        {selectedZone && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-white border-[#27272a]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-black font-['Inter']">
                    {selectedZone.name}
                  </h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedZone(null)}
                    className="text-[#a1a1aa] hover:text-black"
                  >
                    ✕
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <h4 className="font-semibold text-black mb-2 font-['Inter']">Demographics</h4>
                    <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                      <p>Population: {selectedZone.demographics.totalPopulation.toLocaleString()}</p>
                      <p>Median Income: ${selectedZone.demographics.income.median.toLocaleString()}</p>
                      <p>Avg Years Resident: {selectedZone.demographics.housing.averageYearsResident}</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-black mb-2 font-['Inter']">Change Metrics</h4>
                    <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                      <p>Price Change: +{selectedZone.tensionMetrics.priceChangePercent}%</p>
                      <p>Turnover Rate: {selectedZone.tensionMetrics.turnoverRate}%</p>
                      <p>New Construction: {selectedZone.tensionMetrics.newConstructionCount} units</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-black mb-2 font-['Inter']">Community</h4>
                    <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                      <p>Ownership: {Math.round((selectedZone.demographics.housing.owned / selectedZone.demographics.totalPopulation) * 100)}%</p>
                      <p>Theme: <span className="capitalize">{selectedZone.dominantTheme}</span></p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Story Details */}
      <AnimatePresence>
        {selectedStory && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-white border-[#27272a]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-black font-['Inter'] mb-1">
                      {selectedStory.speaker}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] font-['Inter'] capitalize">
                      {selectedStory.role}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStory(null)}
                    className="text-[#a1a1aa] hover:text-black"
                  >
                    ✕
                  </Button>
                </div>
                
                <blockquote className="text-black font-['Georgia'] text-base leading-relaxed mb-3 border-l-4 border-[#8b5cf6] pl-4">
                  "{selectedStory.quote}"
                </blockquote>
                
                <p className="text-sm text-[#a1a1aa] font-['Inter']">
                  {selectedStory.context}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
