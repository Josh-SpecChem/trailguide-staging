"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Bot, 
  BookOpen, 
  Users, 
  Map,
  Image,
  MessageSquare,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Settings,
  Database,
  Brain,
  Sparkles,
  ArrowRight,
  Activity
} from 'lucide-react';

// Mock agent definitions based on OpenAI Agents SDK patterns
const mockAgents = [
  {
    id: 'textual-exegesis',
    name: 'Textual Exegesis Specialist',
    description: 'Deep biblical text analysis, Greek/Hebrew linguistics, and theological interpretation',
    category: 'theology',
    capabilities: ['Greek text analysis', 'Hebrew linguistics', 'Theological interpretation', 'Cross-references'],
    model: 'gpt-4',
    status: 'ready',
    icon: BookOpen,
    color: 'blue'
  },
  {
    id: 'historical-context',
    name: 'Historical Context Agent',
    description: 'Ancient Near Eastern history, cultural background, and archaeological insights',
    category: 'theology',
    capabilities: ['Historical research', 'Cultural analysis', 'Archaeological data', 'Timeline construction'],
    model: 'gpt-4',
    status: 'ready',
    icon: Map,
    color: 'amber'
  },
  {
    id: 'modern-application',
    name: 'Modern Application Synthesizer',
    description: 'Contemporary relevance, practical applications, and pastoral insights',
    category: 'theology',
    capabilities: ['Contemporary analysis', 'Practical applications', 'Pastoral guidance', 'Sermon preparation'],
    model: 'gpt-4',
    status: 'ready',
    icon: Users,
    color: 'green'
  },
  {
    id: 'demographics-analyst',
    name: 'Demographics Research Agent',
    description: 'Census data analysis, community insights, and demographic trend identification',
    category: 'research',
    capabilities: ['Census API integration', 'Demographic analysis', 'Community profiling', 'Trend analysis'],
    model: 'gpt-4',
    status: 'ready',
    icon: Database,
    color: 'purple'
  },
  {
    id: 'visual-storyteller',
    name: 'Visual Content Generator',
    description: 'Image generation, infographic creation, and visual narrative development',
    category: 'creative',
    capabilities: ['DALL-E integration', 'Infographic design', 'Visual narratives', 'Brand consistency'],
    model: 'dall-e-3',
    status: 'coming-soon',
    icon: Image,
    color: 'pink'
  },
  {
    id: 'conversation-orchestrator',
    name: 'Multi-Agent Orchestrator',
    description: 'Coordinates agent handoffs, manages context, and optimizes workflows',
    category: 'system',
    capabilities: ['Agent coordination', 'Context management', 'Workflow optimization', 'Result synthesis'],
    model: 'gpt-4',
    status: 'in-development',
    icon: Brain,
    color: 'indigo'
  }
];

const agentCategories = [
  { id: 'all', name: 'All Agents', icon: Bot },
  { id: 'theology', name: 'Theological Analysis', icon: BookOpen },
  { id: 'research', name: 'Research & Data', icon: Database },
  { id: 'creative', name: 'Creative Generation', icon: Sparkles },
  { id: 'system', name: 'System & Orchestration', icon: Brain }
];

const workflowTemplates = [
  {
    id: 'sermon-prep',
    name: 'Sermon Preparation Pipeline',
    description: 'Complete exegetical workflow from text to modern application',
    agents: ['textual-exegesis', 'historical-context', 'modern-application'],
    estimatedTime: '15-20 minutes'
  },
  {
    id: 'community-analysis',
    name: 'Community Demographics Deep Dive',
    description: 'Comprehensive demographic analysis with visual insights',
    agents: ['demographics-analyst', 'visual-storyteller'],
    estimatedTime: '8-12 minutes'
  },
  {
    id: 'custom-research',
    name: 'Custom Research Project',
    description: 'Mix and match agents for specialized research needs',
    agents: [],
    estimatedTime: 'Variable'
  }
];

export default function AgentStagingPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<string | null>(null);
  const [workspaceView, setWorkspaceView] = useState<'agents' | 'workflow' | 'results'>('agents');

  const filteredAgents = selectedCategory === 'all' 
    ? mockAgents 
    : mockAgents.filter(agent => agent.category === selectedCategory);

  const selectedAgentData = selectedAgent ? mockAgents.find(a => a.id === selectedAgent) : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ready': return 'bg-green-100 text-green-800 border-green-200';
      case 'in-development': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'coming-soon': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAgentColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: 'text-blue-600 bg-blue-50 border-blue-200',
      amber: 'text-amber-600 bg-amber-50 border-amber-200',
      green: 'text-green-600 bg-green-50 border-green-200',
      purple: 'text-purple-600 bg-purple-50 border-purple-200',
      pink: 'text-pink-600 bg-pink-50 border-pink-200',
      indigo: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    };
    return colors[color] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-black font-['Inter']">
                Agent Orchestration Hub
              </h1>
              <p className="text-gray-600 font-['Georgia'] mt-1">
                Coordinate specialized AI agents for theological research, community analysis, and content creation
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {mockAgents.filter(a => a.status === 'ready').length} Active Agents
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Left Panel: Agent Selection */}
          <div className="lg:col-span-1 space-y-4">
            {/* Category Filter */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-['Inter']">Agent Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {agentCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="w-4 h-4 mr-2" />
                      {category.name}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Agent List */}
            <Card className="flex-1">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-['Inter']">Available Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {filteredAgents.map((agent) => {
                      const Icon = agent.icon;
                      return (
                        <div
                          key={agent.id}
                          className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                            selectedAgent === agent.id 
                              ? `${getAgentColor(agent.color)} border-2` 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedAgent(agent.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded ${selectedAgent === agent.id ? 'bg-white/50' : 'bg-gray-100'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm truncate">{agent.name}</h3>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">{agent.description}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge className={`text-xs ${getStatusColor(agent.status)}`}>
                                  {agent.status.replace('-', ' ')}
                                </Badge>
                                <span className="text-xs text-gray-500">{agent.model}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>

          {/* Right Panel: Workspace */}
          <div className="lg:col-span-2 space-y-4">
            <Tabs value={workspaceView} onValueChange={(value) => setWorkspaceView(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="agents">Agent Details</TabsTrigger>
                <TabsTrigger value="workflow">Workflow Builder</TabsTrigger>
                <TabsTrigger value="results">Execution Results</TabsTrigger>
              </TabsList>

              {/* Agent Details Tab */}
              <TabsContent value="agents" className="space-y-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="font-['Inter']">
                      {selectedAgentData ? selectedAgentData.name : 'Select an Agent'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedAgentData ? (
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${getAgentColor(selectedAgentData.color)}`}>
                            <selectedAgentData.icon className="w-6 h-6" />
                          </div>
                          <div>
                            <Badge className={getStatusColor(selectedAgentData.status)}>
                              {selectedAgentData.status.replace('-', ' ')}
                            </Badge>
                            <p className="text-sm text-gray-600 mt-1">Model: {selectedAgentData.model}</p>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium mb-2">Description</h4>
                          <p className="text-gray-700">{selectedAgentData.description}</p>
                        </div>

                        <div>
                          <h4 className="font-medium mb-3">Capabilities</h4>
                          <div className="grid grid-cols-1 gap-2">
                            {selectedAgentData.capabilities.map((capability, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                {capability}
                              </div>
                            ))}
                          </div>
                        </div>

                        <Separator />

                        <div className="flex gap-3">
                          <Button 
                            className="flex-1"
                            disabled={selectedAgentData.status !== 'ready'}
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Run Agent
                          </Button>
                          <Button variant="outline">
                            <Settings className="w-4 h-4 mr-2" />
                            Configure
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <Bot className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Agent Selected</h3>
                        <p className="text-gray-600 max-w-sm">
                          Select an agent from the left panel to view its details, capabilities, and configuration options.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Workflow Builder Tab */}
              <TabsContent value="workflow" className="space-y-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="font-['Inter']">Workflow Templates</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {workflowTemplates.map((workflow) => (
                        <div
                          key={workflow.id}
                          className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-sm ${
                            activeWorkflow === workflow.id 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setActiveWorkflow(workflow.id)}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="font-medium">{workflow.name}</h3>
                              <p className="text-sm text-gray-600 mt-1">{workflow.description}</p>
                              <div className="flex items-center gap-4 mt-3">
                                <div className="flex items-center gap-1">
                                  <Users className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {workflow.agents.length} agents
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Activity className="w-3 h-3 text-gray-400" />
                                  <span className="text-xs text-gray-500">
                                    {workflow.estimatedTime}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <Button 
                              size="sm"
                              disabled={workflow.agents.length === 0}
                            >
                              <Play className="w-3 h-3 mr-1" />
                              Start
                            </Button>
                          </div>
                          
                          {workflow.agents.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <span>Pipeline:</span>
                                {workflow.agents.map((agentId, index) => {
                                  const agent = mockAgents.find(a => a.id === agentId);
                                  return (
                                    <div key={agentId} className="flex items-center gap-1">
                                      {agent && <agent.icon className="w-3 h-3" />}
                                      <span>{agent?.name.split(' ')[0]}</span>
                                      {index < workflow.agents.length - 1 && (
                                        <ArrowRight className="w-3 h-3 text-gray-300" />
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Results Tab */}
              <TabsContent value="results" className="space-y-4">
                <Card className="h-[500px]">
                  <CardHeader>
                    <CardTitle className="font-['Inter']">Execution Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <MessageSquare className="w-16 h-16 text-gray-300 mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Executions Yet</h3>
                      <p className="text-gray-600 max-w-sm">
                        Agent execution results will appear here. Start a workflow or run an individual agent to see outputs, logs, and handoff details.
                      </p>
                      <Button variant="outline" className="mt-4">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        View History
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
