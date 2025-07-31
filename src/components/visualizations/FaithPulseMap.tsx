"use client";

import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FaithPulseMapProps, FaithInstitution } from '@/types/trailguide';

export function FaithPulseMap({
  churches,
  radiiData,
  overlays,
  narrativeMode = 'integrated',
  showStories = true,
  exportMode = 'web'
}: FaithPulseMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedChurch, setSelectedChurch] = useState<FaithInstitution | null>(null);
  const [viewMode, setViewMode] = useState<'impact' | 'programs' | 'needs'>('impact');
  const [animationState, setAnimationState] = useState<'idle' | 'pulsing'>('idle');

  const width = 800;
  const height = 600;
  const margin = { top: 40, right: 40, bottom: 40, left: 40 };

  // Color schemes for different program types
  const programColors = {
    food: '#22c55e',
    housing: '#3b82f6', 
    education: '#f59e0b',
    healthcare: '#ef4444',
    social: '#8b5cf6',
    advocacy: '#06b6d4'
  };

  const centerPoint: [number, number] = [-82.6404, 27.7731]; // 1225 11th Street North

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Create scales based on coordinate bounds
    const allCoords = churches.map(church => church.coordinates);
    allCoords.push(centerPoint);
    
    const xExtent = d3.extent(allCoords, d => d[0]) as [number, number];
    const yExtent = d3.extent(allCoords, d => d[1]) as [number, number];

    // Add padding to the extent
    const xPadding = (xExtent[1] - xExtent[0]) * 0.1;
    const yPadding = (yExtent[1] - yExtent[0]) * 0.1;

    const xScale = d3.scaleLinear()
      .domain([xExtent[0] - xPadding, xExtent[1] + xPadding])
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([yExtent[0] - yPadding, yExtent[1] + yPadding])
      .range([height - margin.bottom, margin.top]);

    // Create main group
    const g = svg.append('g');

    // Add subtle background grid
    const xTicks = xScale.ticks(5);
    const yTicks = yScale.ticks(5);

    g.selectAll('.grid-line-x')
      .data(xTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line-x')
      .attr('x1', d => xScale(d))
      .attr('x2', d => xScale(d))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', '#27272a')
      .attr('stroke-opacity', 0.3);

    g.selectAll('.grid-line-y')
      .data(yTicks)
      .enter()
      .append('line')
      .attr('class', 'grid-line-y')
      .attr('x1', margin.left)
      .attr('x2', width - margin.right)
      .attr('y1', d => yScale(d))
      .attr('y2', d => yScale(d))
      .attr('stroke', '#27272a')
      .attr('stroke-opacity', 0.3);

    // Draw impact radii/ripples for each church
    churches.forEach((church, churchIndex) => {
      const churchRadii = radiiData.find(r => r.churchId === church.id);
      if (!churchRadii) return;

      // Calculate radius scale (convert miles to pixels approximately)
      const maxRadius = Math.min(width, height) / 6;

      churchRadii.programs.forEach((program, programIndex) => {
        const radius = (program.radius / 3) * maxRadius; // 3 miles = max visual radius
        const opacity = program.intensity * 0.6;

        // Create ripple effect
        const ripple = g.append('circle')
          .attr('cx', xScale(church.coordinates[0]))
          .attr('cy', yScale(church.coordinates[1]))
          .attr('r', 0)
          .attr('fill', 'none')
          .attr('stroke', programColors[program.type as keyof typeof programColors] || '#8b5cf6')
          .attr('stroke-width', 2)
          .attr('opacity', opacity);

        if (animationState === 'pulsing') {
          // Animate ripple expansion
          ripple
            .transition()
            .duration(2000)
            .delay(programIndex * 300)
            .attr('r', radius)
            .attr('opacity', 0)
            .on('end', function() {
              d3.select(this).remove();
            });
        } else {
          // Static circles
          ripple.attr('r', radius);
        }

        // Add filled area for impact zone
        if (viewMode === 'impact') {
          g.append('circle')
            .attr('cx', xScale(church.coordinates[0]))
            .attr('cy', yScale(church.coordinates[1]))
            .attr('r', radius)
            .attr('fill', programColors[program.type as keyof typeof programColors] || '#8b5cf6')
            .attr('opacity', opacity * 0.2)
            .attr('class', 'impact-zone');
        }
      });
    });

    // Draw connection lines between churches if they have shared programs
    if (viewMode === 'programs') {
      churches.forEach((church1, i) => {
        churches.slice(i + 1).forEach(church2 => {
          const church1Programs = church1.programs.map(p => p.type);
          const church2Programs = church2.programs.map(p => p.type);
          const sharedPrograms = church1Programs.filter(p => church2Programs.includes(p));
          
          if (sharedPrograms.length > 0) {
            g.append('line')
              .attr('x1', xScale(church1.coordinates[0]))
              .attr('y1', yScale(church1.coordinates[1]))
              .attr('x2', xScale(church2.coordinates[0]))
              .attr('y2', yScale(church2.coordinates[1]))
              .attr('stroke', '#8b5cf6')
              .attr('stroke-width', sharedPrograms.length)
              .attr('opacity', 0.4)
              .attr('stroke-dasharray', '5,5');
          }
        });
      });
    }

    // Draw need/support overlay points
    if (viewMode === 'needs' && overlays.needsData) {
      g.selectAll('.need-point')
        .data(overlays.needsData)
        .enter()
        .append('circle')
        .attr('class', 'need-point')
        .attr('cx', d => xScale(d.coordinates[0]))
        .attr('cy', d => yScale(d.coordinates[1]))
        .attr('r', d => 3 + d.intensity * 5)
        .attr('fill', '#ef4444')
        .attr('opacity', 0.7)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
    }

    if (viewMode === 'needs' && overlays.supportData) {
      g.selectAll('.support-point')
        .data(overlays.supportData)
        .enter()
        .append('circle')
        .attr('class', 'support-point')
        .attr('cx', d => xScale(d.coordinates[0]))
        .attr('cy', d => yScale(d.coordinates[1]))
        .attr('r', d => 3 + d.strength * 5)
        .attr('fill', '#22c55e')
        .attr('opacity', 0.7)
        .attr('stroke', 'white')
        .attr('stroke-width', 1);
    }

    // Draw church anchors
    const churchGroups = g.selectAll('.church')
      .data(churches)
      .enter()
      .append('g')
      .attr('class', 'church')
      .style('cursor', 'pointer');

    // Church main circles
    churchGroups.append('circle')
      .attr('cx', d => xScale(d.coordinates[0]))
      .attr('cy', d => yScale(d.coordinates[1]))
      .attr('r', d => 8 + (d.congregation.size / 100))
      .attr('fill', '#1f2937')
      .attr('stroke', '#8b5cf6')
      .attr('stroke-width', 3)
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 8 + (d.congregation.size / 100) + 3)
          .attr('stroke-width', 4);
      })
      .on('mouseout', function(event, d) {
        if (selectedChurch?.id !== d.id) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr('r', 8 + (d.congregation.size / 100))
            .attr('stroke-width', 3);
        }
      })
      .on('click', (event, d) => {
        setSelectedChurch(d);
      });

    // Church inner indicators for founding era
    churchGroups.append('circle')
      .attr('cx', d => xScale(d.coordinates[0]))
      .attr('cy', d => yScale(d.coordinates[1]))
      .attr('r', 4)
      .attr('fill', d => d.foundedYear < 1980 ? '#fbbf24' : '#06b6d4') // Gold for legacy, blue for newer
      .style('pointer-events', 'none');

    // Church labels
    churchGroups.append('text')
      .attr('x', d => xScale(d.coordinates[0]))
      .attr('y', d => yScale(d.coordinates[1]) - 20)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '10px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .style('pointer-events', 'none')
      .text(d => d.name.split(' ')[0]); // First word

    // Program type indicators around each church
    churchGroups.each(function(church) {
      const group = d3.select(this);
      const cx = xScale(church.coordinates[0]);
      const cy = yScale(church.coordinates[1]);
      
      church.programs.forEach((program, i) => {
        const angle = (i / church.programs.length) * 2 * Math.PI;
        const radius = 20;
        const px = cx + Math.cos(angle) * radius;
        const py = cy + Math.sin(angle) * radius;
        
        group.append('circle')
          .attr('cx', px)
          .attr('cy', py)
          .attr('r', 3 + program.impact / 2)
          .attr('fill', programColors[program.type as keyof typeof programColors] || '#8b5cf6')
          .attr('opacity', 0.8)
          .attr('stroke', 'white')
          .attr('stroke-width', 1);
      });
    });

    // Center point marker for 1225 11th St N
    g.append('circle')
      .attr('cx', xScale(centerPoint[0]))
      .attr('cy', yScale(centerPoint[1]))
      .attr('r', 10)
      .attr('fill', '#fbbf24')
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))');

    g.append('text')
      .attr('x', xScale(centerPoint[0]))
      .attr('y', yScale(centerPoint[1]) - 18)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Inter, sans-serif')
      .style('font-size', '11px')
      .style('font-weight', '700')
      .style('fill', 'white')
      .style('text-shadow', '1px 1px 2px rgba(0,0,0,0.8)')
      .text('1225 11th St N');

  }, [churches, radiiData, overlays, viewMode, animationState]);

  const triggerPulse = () => {
    setAnimationState('pulsing');
    setTimeout(() => setAnimationState('idle'), 3000);
  };

  return (
    <div className="w-full space-y-6">
      {/* View Mode Controls */}
      <div className="flex gap-2 justify-center">
        <Button
          variant={viewMode === 'impact' ? 'default' : 'outline'}
          onClick={() => setViewMode('impact')}
          className="font-['Inter']"
        >
          Impact Zones
        </Button>
        <Button
          variant={viewMode === 'programs' ? 'default' : 'outline'}
          onClick={() => setViewMode('programs')}
          className="font-['Inter']"
        >
          Program Networks
        </Button>
        <Button
          variant={viewMode === 'needs' ? 'default' : 'outline'}
          onClick={() => setViewMode('needs')}
          className="font-['Inter']"
        >
          Needs & Support
        </Button>
        <Button
          onClick={triggerPulse}
          disabled={animationState === 'pulsing'}
          className="bg-[#8b5cf6] hover:bg-[#7c3aed] font-['Inter']"
        >
          {animationState === 'pulsing' ? 'Pulsing...' : 'Pulse Faith Impact'}
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
        <div className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm rounded-lg p-4 space-y-2 max-w-xs">
          <h4 className="font-['Inter'] font-semibold text-black text-sm">
            Faith Community Impact
          </h4>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#fbbf24] rounded-full"></div>
              <span className="text-xs text-[#a1a1aa] font-['Inter']">Legacy Church (pre-1980)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-[#06b6d4] rounded-full"></div>
              <span className="text-xs text-[#a1a1aa] font-['Inter']">Newer Church (post-1980)</span>
            </div>
          </div>

          {viewMode === 'impact' && (
            <div className="space-y-1 border-t border-[#27272a] pt-2">
              <p className="text-xs text-[#a1a1aa] font-['Inter'] mb-1">Program Types:</p>
              {Object.entries(programColors).map(([type, color]) => (
                <div key={type} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded"
                    style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-xs text-[#a1a1aa] font-['Inter'] capitalize">
                    {type}
                  </span>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'needs' && (
            <div className="space-y-1 border-t border-[#27272a] pt-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">Community Needs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-xs text-[#a1a1aa] font-['Inter']">Support Available</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Church Details */}
      <AnimatePresence>
        {selectedChurch && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            <Card className="bg-white border-[#27272a]">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-black font-['Inter'] mb-1">
                      {selectedChurch.name}
                    </h3>
                    <p className="text-sm text-[#a1a1aa] font-['Inter']">
                      {selectedChurch.denomination} • Founded {selectedChurch.foundedYear}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedChurch(null)}
                    className="text-[#a1a1aa] hover:text-black"
                  >
                    ✕
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <h4 className="font-semibold text-black mb-2 font-['Inter']">Congregation</h4>
                    <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                      <p>Size: {selectedChurch.congregation.size} members</p>
                      <p>Avg Age: {selectedChurch.congregation.demographics.avgAge} years</p>
                      <p>Local: {selectedChurch.congregation.demographics.percentLocal}%</p>
                      <p>Multi-gen: {selectedChurch.congregation.demographics.percentMultiGenerational}%</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-black mb-2 font-['Inter']">Community Impact</h4>
                    <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                      <p>Direct: {selectedChurch.rippleEffect.directImpact.toLocaleString()} people</p>
                      <p>Network: {selectedChurch.rippleEffect.networkImpact.toLocaleString()} people</p>
                      <p>Economic: ${selectedChurch.rippleEffect.economicImpact.toLocaleString()}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-black mb-2 font-['Inter']">Programs ({selectedChurch.programs.length})</h4>
                    <div className="space-y-1 text-sm text-[#a1a1aa] font-['Inter']">
                      {selectedChurch.programs.slice(0, 3).map((program, i) => (
                        <p key={i}>
                          <span className="capitalize">{program.type}</span>: {program.reach} people
                        </p>
                      ))}
                      {selectedChurch.programs.length > 3 && (
                        <p className="text-xs text-[#71717a]">
                          +{selectedChurch.programs.length - 3} more programs
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Program Details */}
                <div>
                  <h4 className="font-semibold text-black mb-3 font-['Inter']">All Programs</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedChurch.programs.map((program, i) => (
                      <div 
                        key={i}
                        className="bg-white rounded-lg p-3 border border-[#27272a]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div 
                            className="w-3 h-3 rounded"
                            style={{ 
                              backgroundColor: programColors[program.type as keyof typeof programColors] || '#8b5cf6' 
                            }}
                          ></div>
                          <span className="font-semibold text-black text-sm font-['Inter'] capitalize">
                            {program.name}
                          </span>
                        </div>
                        <div className="text-xs text-[#a1a1aa] font-['Inter'] space-y-1">
                          <p>Reach: {program.reach} people</p>
                          <p>Impact Score: {program.impact}/10</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
