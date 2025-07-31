"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { NeighborhoodTimelineProps, TimelineEvent, AnnualStats } from '@/types/trailguide';

export function NeighborhoodTimeline({
  events,
  annualStats,
  narratives,
  timeRange = [2008, 2024],
  narrativeMode = 'integrated',
  showStories = true
}: NeighborhoodTimelineProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [playingAnimation, setPlayingAnimation] = useState(false);
  const [currentAnimationYear, setCurrentAnimationYear] = useState(timeRange[0]);

  const width = 900;
  const height = 500;
  const margin = { top: 60, right: 60, bottom: 80, left: 80 };

  // Color scheme for event types
  const eventColors = {
    development: '#dc2626', // Red - often displacing
    community: '#22c55e', // Green - building together
    economic: '#f59e0b', // Amber - external forces
    resistance: '#8b5cf6', // Purple - community power
    celebration: '#06b6d4' // Cyan - joy and culture
  };

  const impactSizes = {
    low: 4,
    medium: 6,
    high: 10
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create scales
    const xScale = d3.scaleLinear()
      .domain(timeRange)
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(annualStats, d => d.homeValues.median) || 400000])
      .range([height - margin.bottom, margin.top]);

    const populationScale = d3.scaleLinear()
      .domain(d3.extent(annualStats, d => d.population.total) as [number, number])
      .range([height - margin.bottom - 100, margin.top + 50]);

    // Create main group
    const g = svg.append('g');

    // Add background grid
    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.format('d'))
      .ticks(8);
    
    const yAxis = d3.axisLeft(yScale)
      .tickFormat((d) => `$${(d as number / 1000)}K`);

    g.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(xAxis)
      .attr('color', '#71717a');

    g.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(yAxis)
      .attr('color', '#71717a');

    // Add axis labels
    g.append('text')
      .attr('x', width / 2)
      .attr('y', height - 10)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('fill', '#a1a1aa')
      .text('Year');

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', 20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '12px')
      .style('fill', '#a1a1aa')
      .text('Median Home Value');

    // Home values line
    const homeLine = d3.line<AnnualStats>()
      .x(d => xScale(d.year))
      .y(d => yScale(d.homeValues.median))
      .curve(d3.curveMonotoneX);

    const homeValuesPath = g.append('path')
      .datum(annualStats)
      .attr('fill', 'none')
      .attr('stroke', '#3b82f6')
      .attr('stroke-width', 3)
      .attr('d', homeLine);

    // Animate line drawing if playing
    if (playingAnimation) {
      const totalLength = homeValuesPath.node()?.getTotalLength() || 0;
      homeValuesPath
        .attr('stroke-dasharray', totalLength + ' ' + totalLength)
        .attr('stroke-dashoffset', totalLength)
        .transition()
        .duration(3000)
        .attr('stroke-dashoffset', 0);
    }

    // Population area chart
    const populationArea = d3.area<AnnualStats>()
      .x(d => xScale(d.year))
      .y0(height - margin.bottom - 50)
      .y1(d => populationScale(d.population.total))
      .curve(d3.curveMonotoneX);

    g.append('path')
      .datum(annualStats)
      .attr('fill', '#22c55e')
      .attr('opacity', 0.3)
      .attr('d', populationArea);

    // Data points for home values
    g.selectAll('.data-point')
      .data(annualStats)
      .enter()
      .append('circle')
      .attr('class', 'data-point')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.homeValues.median))
      .attr('r', 4)
      .attr('fill', '#3b82f6')
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('r', 6);
        
        // Tooltip
        const tooltip = g.append('g')
          .attr('class', 'tooltip');
        
        const rect = tooltip.append('rect')
          .attr('x', xScale(d.year) + 10)
          .attr('y', yScale(d.homeValues.median) - 40)
          .attr('width', 120)
          .attr('height', 30)
          .attr('fill', 'black')
          .attr('opacity', 0.8)
          .attr('rx', 4);
        
        tooltip.append('text')
          .attr('x', xScale(d.year) + 15)
          .attr('y', yScale(d.homeValues.median) - 25)
          .style('font-family', 'Inter, sans-serif')
          .style('font-size', '10px')
          .style('fill', 'white')
          .text(`${d.year}: $${(d.homeValues.median / 1000).toFixed(0)}K`);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', 4);
        g.selectAll('.tooltip').remove();
      })
      .on('click', (event, d) => {
        setSelectedYear(d.year);
      });

    // Timeline events
    const eventGroups = g.selectAll('.event')
      .data(events)
      .enter()
      .append('g')
      .attr('class', 'event')
      .style('cursor', 'pointer');

    // Event markers
    eventGroups.append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', height - margin.bottom + 30)
      .attr('r', d => impactSizes[d.impact])
      .attr('fill', d => eventColors[d.eventType])
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('opacity', 0.9)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', impactSizes[d.impact] + 2);
      })
      .on('mouseout', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', impactSizes[d.impact]);
      })
      .on('click', (event, d) => {
        setSelectedEvent(d);
      });

    // Event labels (abbreviated)
    eventGroups.append('text')
      .attr('x', d => xScale(d.year))
      .attr('y', height - margin.bottom + 55)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '8px')
      .style('font-weight', '500')
      .style('fill', '#a1a1aa')
      .text(d => d.label.split(' ').slice(0, 2).join(' ')); // First two words

    // Impact lines connecting events to home values
    eventGroups.each(function(d) {
      const homeValueAtYear = annualStats.find(stat => stat.year === d.year);
      if (homeValueAtYear && d.impact === 'high') {
        g.append('line')
          .attr('x1', xScale(d.year))
          .attr('y1', height - margin.bottom + 30)
          .attr('x2', xScale(d.year))
          .attr('y2', yScale(homeValueAtYear.homeValues.median))
          .attr('stroke', eventColors[d.eventType])
          .attr('stroke-width', 1)
          .attr('stroke-dasharray', '3,3')
          .attr('opacity', 0.5);
      }
    });

    // Animation progress indicator
    if (playingAnimation) {
      const progressLine = g.append('line')
        .attr('class', 'progress-line')
        .attr('x1', xScale(currentAnimationYear))
        .attr('x2', xScale(currentAnimationYear))
        .attr('y1', margin.top)
        .attr('y2', height - margin.bottom)
        .attr('stroke', '#fbbf24')
        .attr('stroke-width', 3)
        .attr('opacity', 0.8);
    }

  }, [events, annualStats, timeRange, selectedYear, playingAnimation, currentAnimationYear]);

  const playTimeline = () => {
    setPlayingAnimation(true);
    const duration = 4000;
    const steps = timeRange[1] - timeRange[0];
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    const interval = setInterval(() => {
      const year = timeRange[0] + currentStep;
      setCurrentAnimationYear(year);
      currentStep++;
      
      if (currentStep > steps) {
        clearInterval(interval);
        setPlayingAnimation(false);
        setCurrentAnimationYear(timeRange[0]);
      }
    }, stepDuration);
  };

  return (
    <div className="w-full space-y-6">
      {/* Controls */}
      <div className="flex gap-4 justify-between items-center">
        <div className="flex gap-2">
          <Button
            onClick={playTimeline}
            disabled={playingAnimation}
            className="bg-[#8b5cf6] hover:bg-[#7c3aed] font-['Inter']"
          >
            {playingAnimation ? 'Playing...' : 'Play Timeline'}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedEvent(null);
              setSelectedYear(null);
            }}
            className="font-['Inter']"
          >
            Clear Selection
          </Button>
        </div>
        
        {playingAnimation && (
          <div className="text-sm text-[#a1a1aa] font-['Inter']">
            Current Year: {currentAnimationYear}
          </div>
        )}
      </div>

      {/* Timeline Chart */}
      <div className="bg-white rounded-lg border border-[#27272a] p-4">
        <h3 className="text-lg font-bold text-black font-['Inter'] mb-4">
          Neighborhood Change Timeline: Home Values & Community Events
        </h3>
        
        <svg
          ref={svgRef}
          width={width}
          height={height}
          className="w-full h-auto"
          viewBox={`0 0 ${width} ${height}`}
        />

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-6 justify-center">
          <div className="text-center">
            <div className="w-4 h-4 bg-blue-500 rounded mx-auto mb-1"></div>
            <span className="text-xs text-[#a1a1aa] font-['Inter']">Home Values</span>
          </div>
          <div className="text-center">
            <div className="w-4 h-4 bg-green-500 opacity-30 rounded mx-auto mb-1"></div>
            <span className="text-xs text-[#a1a1aa] font-['Inter']">Population</span>
          </div>
          {Object.entries(eventColors).map(([type, color]) => (
            <div key={type} className="text-center">
              <div 
                className="w-4 h-4 rounded-full mx-auto mb-1"
                style={{ backgroundColor: color }}
              ></div>
              <span className="text-xs text-[#a1a1aa] font-['Inter'] capitalize">
                {type}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Selected Event Details */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-white border-[#27272a]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-black font-['Inter'] mb-1">
                      {selectedEvent.label}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] font-['Inter']">
                      {selectedEvent.year} • {selectedEvent.eventType} • {selectedEvent.impact} impact
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedEvent(null)}
                    className="text-[#a1a1aa] hover:text-black"
                  >
                    ✕
                  </Button>
                </div>
                
                <p className="text-black font-['Georgia'] mb-3 leading-relaxed">
                  {selectedEvent.description}
                </p>

                {selectedEvent.story && (
                  <blockquote className="border-l-4 border-[#8b5cf6] pl-4 text-[#a1a1aa] font-['Georgia'] italic">
                    "{selectedEvent.story}"
                  </blockquote>
                )}

                <div className="mt-4 text-sm text-[#a1a1aa] font-['Inter']">
                  Affected Population: {selectedEvent.affectedPopulation.toLocaleString()} people
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Year Details */}
      <AnimatePresence>
        {selectedYear && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="bg-white border-[#27272a]">
              <div className="p-6">
                {(() => {
                  const yearData = annualStats.find(stat => stat.year === selectedYear);
                  if (!yearData) return null;
                  
                  return (
                    <>
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-black font-['Inter']">
                          {selectedYear} Neighborhood Stats
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedYear(null)}
                          className="text-[#a1a1aa] hover:text-black"
                        >
                          ✕
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <h4 className="font-semibold text-black mb-2 font-['Inter']">Housing</h4>
                          <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                            <p>Median Home Value: ${yearData.homeValues.median.toLocaleString()}</p>
                            <p>Change from Previous: {yearData.homeValues.percentChange > 0 ? '+' : ''}{yearData.homeValues.percentChange.toFixed(1)}%</p>
                            <p>Median Rent: ${yearData.rentPrices.median}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-black mb-2 font-['Inter']">Population</h4>
                          <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                            <p>Total: {yearData.population.total.toLocaleString()}</p>
                            <p>Net Change: {yearData.displacement.netChange > 0 ? '+' : ''}{yearData.displacement.netChange}</p>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-black mb-2 font-['Inter']">Movement</h4>
                          <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                            <p>Families Leaving: {yearData.displacement.familiesLeaving}</p>
                            <p>Newcomers: {yearData.displacement.newcomersArriving}</p>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
