"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { 
  Bot, 
  Upload,
  Search,
  Database,
  Code,
  Image,
  Globe,
  Monitor,
  Send,
  Paperclip,
  Download,
  CheckCircle,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  Settings,
  FileText,
  Zap,
  Brain,
  Shield,
  Info
} from 'lucide-react';

import { 
  availableTools, 
  AgentMessage, 
  AgentAttachment,
  processUploadedFile,
  detectSDSDocument,
  extractSDSData,
  generateProductLabel,
  saveExtractedData,
  getSavedData,
  ExtractedProductData
} from '@/lib/agent-utils';

// Tool icon mapping
const toolIcons = {
  Search,
  Database,
  Code,
  Image,
  Globe,
  Monitor
};

export default function AIAgentPage() {
  // Core state
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant with access to multiple tools. I can help you with file analysis, data extraction, code execution, image generation, web search, and more. How can I assist you today?',
      timestamp: new Date(),
      tools_used: []
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // File handling state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [processingFiles, setProcessingFiles] = useState<string[]>([]);
  const [processedFileContents, setProcessedFileContents] = useState<Record<string, string>>({});
  
  // Tool state
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [autoSelectTools, setAutoSelectTools] = useState(true);
  
  // Data extraction state
  const [extractedData, setExtractedData] = useState<Partial<ExtractedProductData> | null>(null);
  const [generatedLabel, setGeneratedLabel] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<ExtractedProductData[]>([]);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  
  // UI state
  const [activeTab, setActiveTab] = useState<'chat' | 'files' | 'tools' | 'data'>('chat');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Load saved data on component mount
  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const data = await getSavedData();
      setSavedData(data);
    } catch (error) {
      console.error('Failed to load saved data:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList) => {
    const newFiles = Array.from(files);
    setUploadedFiles(prev => [...prev, ...newFiles]);
    
    // Process each file
    for (const file of newFiles) {
      setProcessingFiles(prev => [...prev, file.name]);
      
      try {
        const content = await processUploadedFile(file);
        setProcessedFileContents(prev => ({
          ...prev,
          [file.name]: content
        }));
        
        // Check if it's an SDS document
        if (detectSDSDocument(content)) {
          addMessage({
            role: 'assistant',
            content: `I've detected that "${file.name}" appears to be a Safety Data Sheet. I can extract structured data from it and generate a product label. Would you like me to proceed?`,
            tools_used: ['data_extraction']
          });
        }
        
      } catch (error) {
        console.error(`Failed to process file ${file.name}:`, error);
        addMessage({
          role: 'assistant',
          content: `Sorry, I couldn't process the file "${file.name}". Please make sure it's a supported format (PDF, TXT, etc.).`,
          tools_used: []
        });
      } finally {
        setProcessingFiles(prev => prev.filter(name => name !== file.name));
      }
    }
  };

  // Add message to conversation
  const addMessage = (message: Omit<AgentMessage, 'id' | 'timestamp'>) => {
    const newMessage: AgentMessage = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  // Handle message send
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;
    
    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);
    
    // Add user message
    addMessage({
      role: 'user',
      content: userMessage,
      attachments: uploadedFiles.map(file => ({
        type: 'file',
        name: file.name,
        metadata: { size: file.size, type: file.type }
      }))
    });
    
    try {
      // Simulate AI processing with tools
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Determine which tools to use based on the message
      const toolsUsed = determineToolsToUse(userMessage);
      
      // Generate response based on tools and context
      const response = await generateResponse(userMessage, toolsUsed);
      
      addMessage({
        role: 'assistant',
        content: response,
        tools_used: toolsUsed
      });
      
    } catch (error) {
      console.error('Failed to process message:', error);
      addMessage({
        role: 'assistant',
        content: 'I encountered an error processing your request. Please try again.',
        tools_used: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Determine which tools to use based on user input
  const determineToolsToUse = (message: string): string[] => {
    const tools: string[] = [];
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('search') || lowerMessage.includes('find')) {
      if (uploadedFiles.length > 0) {
        tools.push('file_search');
      } else {
        tools.push('web_search');
      }
    }
    
    if (lowerMessage.includes('extract') || lowerMessage.includes('data') || lowerMessage.includes('sds')) {
      tools.push('data_extraction');
    }
    
    if (lowerMessage.includes('code') || lowerMessage.includes('python') || lowerMessage.includes('analyze')) {
      tools.push('code_interpreter');
    }
    
    if (lowerMessage.includes('image') || lowerMessage.includes('generate') || lowerMessage.includes('picture')) {
      tools.push('image_generation');
    }
    
    return tools;
  };

  // Generate AI response (simplified simulation)
  const generateResponse = async (message: string, toolsUsed: string[]): Promise<string> => {
    if (toolsUsed.includes('data_extraction') && uploadedFiles.length > 0) {
      const file = uploadedFiles[uploadedFiles.length - 1];
      const content = processedFileContents[file.name];
      
      if (content && detectSDSDocument(content)) {
        try {
          const extracted = await extractSDSData(content);
          setExtractedData({
            ...extracted,
            file_name: file.name,
            file_type: file.type
          });
          
          return `I've successfully extracted structured data from the Safety Data Sheet "${file.name}". The document contains information about ${extracted.product_name || 'a chemical product'} with ${extracted.hazards?.length || 0} identified hazards and ${extracted.ingredients?.length || 0} listed ingredients. You can view the extracted data in the Data tab, and I can generate a product label if needed.`;
        } catch (error) {
          return `I attempted to extract data from "${file.name}" but encountered some difficulties. The document may not be in a standard SDS format or may be incomplete.`;
        }
      }
    }
    
    if (toolsUsed.includes('file_search') && uploadedFiles.length > 0) {
      return `I've searched through your uploaded files. I found ${uploadedFiles.length} file(s) with a total of ${Object.values(processedFileContents).join(' ').split(' ').length} words. You can ask me specific questions about the content.`;
    }
    
    if (toolsUsed.includes('web_search')) {
      return `I would perform a web search for "${message}" and provide you with relevant, up-to-date information from reliable sources.`;
    }
    
    if (toolsUsed.includes('code_interpreter')) {
      return `I can help you with code execution and data analysis. Please provide the specific code you'd like me to run or the analysis you need.`;
    }
    
    if (toolsUsed.includes('image_generation')) {
      return `I can generate images based on your description. Please provide a detailed prompt for the image you'd like me to create.`;
    }
    
    return `I understand you're asking about: "${message}". I can help you with file analysis, data extraction, web search, code execution, and image generation. Please let me know what specific assistance you need.`;
  };

  // Handle data extraction for SDS
  const handleExtractSDS = async (fileName: string) => {
    const content = processedFileContents[fileName];
    if (!content) return;
    
    setIsLoading(true);
    try {
      const extracted = await extractSDSData(content);
      const file = uploadedFiles.find(f => f.name === fileName);
      
      setExtractedData({
        ...extracted,
        file_name: fileName,
        file_type: file?.type || 'unknown'
      });
      
      addMessage({
        role: 'assistant',
        content: `Successfully extracted data from ${fileName}. Found product: ${extracted.product_name || 'Unknown'} with ${extracted.hazards?.length || 0} hazards identified.`,
        tools_used: ['data_extraction']
      });
      
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: `Failed to extract data from ${fileName}. Please ensure it's a valid Safety Data Sheet.`,
        tools_used: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Generate product label
  const handleGenerateLabel = async () => {
    if (!extractedData) return;
    
    setIsLoading(true);
    try {
      const label = await generateProductLabel(extractedData);
      setGeneratedLabel(label);
      
      addMessage({
        role: 'assistant',
        content: 'I\'ve generated a professional product label based on the extracted data. You can view it in the Data tab.',
        tools_used: ['data_extraction']
      });
      
    } catch (error) {
      addMessage({
        role: 'assistant',
        content: 'Failed to generate product label. Please try again.',
        tools_used: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Save data to Supabase
  const handleSaveData = async () => {
    if (!extractedData || !extractedData.product_name) return;
    
    setSaveStatus('saving');
    try {
      const dataToSave: ExtractedProductData = {
        product_name: extractedData.product_name,
        manufacturer: extractedData.manufacturer,
        hazards: extractedData.hazards || [],
        ingredients: extractedData.ingredients || [],
        safety_precautions: extractedData.safety_precautions || [],
        first_aid_measures: extractedData.first_aid_measures || [],
        physical_properties: extractedData.physical_properties,
        generated_label: generatedLabel || undefined,
        file_name: extractedData.file_name || 'unknown',
        file_type: extractedData.file_type || 'unknown',
        extraction_confidence: extractedData.extraction_confidence
      };
      
      await saveExtractedData(dataToSave);
      setSaveStatus('success');
      await loadSavedData(); // Reload the saved data list
      
      addMessage({
        role: 'assistant',
        content: 'Successfully saved the extracted data and generated label to the database.',
        tools_used: ['data_extraction']
      });
      
    } catch (error) {
      setSaveStatus('error');
      addMessage({
        role: 'assistant',
        content: 'Failed to save data to database. Please try again.',
        tools_used: []
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 font-['Inter']">
                  AI Agent Hub
                </h1>
                <p className="text-sm text-gray-600">
                  Multi-tool AI assistant for document analysis, data extraction, and content generation
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                {availableTools.filter(t => t.enabled).length} Tools Active
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-180px)]">
          {/* Main Chat Interface */}
          <div className="lg:col-span-3 flex flex-col">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="chat" className="flex items-center gap-2">
                  <Bot className="w-4 h-4" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="files" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Files ({uploadedFiles.length})
                </TabsTrigger>
                <TabsTrigger value="tools" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Tools
                </TabsTrigger>
                <TabsTrigger value="data" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Data
                </TabsTrigger>
              </TabsList>

              {/* Chat Tab */}
              <TabsContent value="chat" className="flex-1 flex flex-col">
                <Card className="flex-1 flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg font-['Inter']">Conversation</CardTitle>
                      <div className="flex items-center gap-2">
                        {isLoading && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Processing...
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-0">
                    <ScrollArea className="flex-1 px-6">
                      <div className="space-y-4 pb-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex gap-3 ${
                              message.role === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            {message.role === 'assistant' && (
                              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                                <Bot className="w-4 h-4 text-white" />
                              </div>
                            )}
                            <div
                              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                                message.role === 'user'
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              {message.tools_used && message.tools_used.length > 0 && (
                                <div className="flex items-center gap-1 mt-2 pt-2 border-t border-gray-200">
                                  <span className="text-xs text-gray-500">Tools used:</span>
                                  {message.tools_used.map((tool) => {
                                    const toolData = availableTools.find(t => t.name === tool);
                                    const IconComponent = toolIcons[toolData?.icon as keyof typeof toolIcons];
                                    return (
                                      <Badge key={tool} variant="secondary" className="text-xs">
                                        {IconComponent && <IconComponent className="w-3 h-3 mr-1" />}
                                        {tool.replace('_', ' ')}
                                      </Badge>
                                    );
                                  })}
                                </div>
                              )}
                              {message.attachments && message.attachments.length > 0 && (
                                <div className="mt-2 pt-2 border-t border-gray-200">
                                  {message.attachments.map((attachment, index) => (
                                    <div key={index} className="flex items-center gap-2 text-xs text-gray-500">
                                      <Paperclip className="w-3 h-3" />
                                      {attachment.name}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                            {message.role === 'user' && (
                              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="text-sm font-medium text-gray-700">U</span>
                              </div>
                            )}
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                    
                    {/* Input Area */}
                    <div className="border-t border-gray-200 p-6">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-shrink-0"
                        >
                          <Paperclip className="w-4 h-4" />
                        </Button>
                        <div className="flex-1">
                          <Textarea
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask me anything... I can analyze files, extract data, generate images, search the web, and more!"
                            className="min-h-[60px] resize-none"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                        </div>
                        <Button
                          onClick={handleSendMessage}
                          disabled={isLoading || (!inputMessage.trim() && uploadedFiles.length === 0)}
                          className="flex-shrink-0"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {uploadedFiles.map((file, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              <FileText className="w-3 h-3" />
                              {file.name}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 ml-1"
                                onClick={() => {
                                  setUploadedFiles(prev => prev.filter((_, i) => i !== index));
                                  setProcessedFileContents(prev => {
                                    const { [file.name]: removed, ...rest } = prev;
                                    return rest;
                                  });
                                }}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Files Tab */}
              <TabsContent value="files" className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="font-['Inter']">File Management</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Upload className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                        <p className="text-gray-600 mb-4">
                          Upload files for analysis, data extraction, or search
                        </p>
                        <Button
                          onClick={() => fileInputRef.current?.click()}
                          variant="outline"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Choose Files
                        </Button>
                      </div>
                      
                      {uploadedFiles.length > 0 && (
                        <div className="space-y-3">
                          <h3 className="font-medium">Uploaded Files</h3>
                          {uploadedFiles.map((file, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5 text-gray-500" />
                                <div>
                                  <p className="font-medium">{file.name}</p>
                                  <p className="text-sm text-gray-500">
                                    {(file.size / 1024).toFixed(1)} KB • {file.type}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {processingFiles.includes(file.name) ? (
                                  <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
                                ) : processedFileContents[file.name] ? (
                                  <>
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    {detectSDSDocument(processedFileContents[file.name]) && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleExtractSDS(file.name)}
                                        disabled={isLoading}
                                      >
                                        Extract SDS Data
                                      </Button>
                                    )}
                                  </>
                                ) : (
                                  <AlertCircle className="w-4 h-4 text-red-500" />
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Tools Tab */}
              <TabsContent value="tools" className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="font-['Inter']">Available Tools</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-medium">Auto-select tools</label>
                        <Button
                          variant={autoSelectTools ? "default" : "outline"}
                          size="sm"
                          onClick={() => setAutoSelectTools(!autoSelectTools)}
                        >
                          {autoSelectTools ? "ON" : "OFF"}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {availableTools.map((tool) => {
                          const IconComponent = toolIcons[tool.icon as keyof typeof toolIcons];
                          return (
                            <div
                              key={tool.name}
                              className={`p-4 border rounded-lg ${
                                tool.enabled ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'
                              }`}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                  {IconComponent && (
                                    <div className={`p-2 rounded ${
                                      tool.enabled ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                  )}
                                  <div>
                                    <h3 className="font-medium capitalize">
                                      {tool.name.replace('_', ' ')}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {tool.description}
                                    </p>
                                    <Badge 
                                      variant="secondary" 
                                      className="mt-2 text-xs capitalize"
                                    >
                                      {tool.category}
                                    </Badge>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {tool.name === 'computer_use' && (
                                    <Shield className="w-4 h-4 text-orange-500" />
                                  )}
                                  <div className={`w-3 h-3 rounded-full ${
                                    tool.enabled ? 'bg-green-500' : 'bg-gray-300'
                                  }`} />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {availableTools.some(tool => tool.name === 'computer_use' && !tool.enabled) && (
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            Computer use capabilities are disabled by default for security. 
                            These features require explicit user consent and should only be enabled in trusted environments.
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Data Tab */}
              <TabsContent value="data" className="flex-1">
                <Card className="h-full">
                  <CardHeader>
                    <CardTitle className="font-['Inter']">Extracted Data & Labels</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Current Extraction */}
                      {extractedData && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="font-medium">Current Extraction</h3>
                            <div className="flex gap-2">
                              {!generatedLabel && (
                                <Button
                                  size="sm"
                                  onClick={handleGenerateLabel}
                                  disabled={isLoading}
                                >
                                  <Image className="w-4 h-4 mr-2" />
                                  Generate Label
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={handleSaveData}
                                disabled={isLoading || saveStatus === 'saving'}
                              >
                                {saveStatus === 'saving' ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : saveStatus === 'success' ? (
                                  <CheckCircle className="w-4 h-4 mr-2" />
                                ) : (
                                  <Database className="w-4 h-4 mr-2" />
                                )}
                                Save to Database
                              </Button>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 rounded-lg p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <h4 className="font-medium mb-2">Product Information</h4>
                                <p><strong>Name:</strong> {extractedData.product_name || 'N/A'}</p>
                                <p><strong>Manufacturer:</strong> {extractedData.manufacturer || 'N/A'}</p>
                                <p><strong>File:</strong> {extractedData.file_name || 'N/A'}</p>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Safety Information</h4>
                                <p><strong>Hazards:</strong> {extractedData.hazards?.length || 0} identified</p>
                                <p><strong>Ingredients:</strong> {extractedData.ingredients?.length || 0} listed</p>
                                <p><strong>Confidence:</strong> {extractedData.extraction_confidence ? `${(extractedData.extraction_confidence * 100).toFixed(1)}%` : 'N/A'}</p>
                              </div>
                            </div>
                          </div>
                          
                          {generatedLabel && (
                            <div className="space-y-2">
                              <h4 className="font-medium">Generated Product Label</h4>
                              <div 
                                className="border rounded-lg p-4 bg-white"
                                dangerouslySetInnerHTML={{ __html: generatedLabel }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Saved Data */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">Saved Data ({savedData.length})</h3>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={loadSavedData}
                          >
                            <Database className="w-4 h-4 mr-2" />
                            Refresh
                          </Button>
                        </div>
                        
                        {savedData.length > 0 ? (
                          <div className="space-y-3">
                            {savedData.slice(0, 5).map((item) => (
                              <div key={item.id} className="p-3 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <h4 className="font-medium">{item.product_name}</h4>
                                    <p className="text-sm text-gray-600">
                                      {item.manufacturer} • {item.file_name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(item.created_at || '').toLocaleDateString()}
                                    </p>
                                  </div>
                                  <Button size="sm" variant="outline">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
                            <p>No saved data yet</p>
                            <p className="text-sm">Extract data from SDS documents to populate this section</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Sidebar - Capabilities & Usage */}
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="font-['Inter'] flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Capabilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[calc(100vh-300px)]">
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium mb-3">Document Analysis</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Upload and process PDF/text files</li>
                        <li>• Search within document content</li>
                        <li>• Extract structured data from SDS</li>
                        <li>• Generate compliance labels</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">AI Capabilities</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Natural language conversation</li>
                        <li>• Code execution & analysis</li>
                        <li>• Image generation (DALL-E)</li>
                        <li>• Real-time web search</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Data Management</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Supabase database storage</li>
                        <li>• Structured data extraction</li>
                        <li>• Product label generation</li>
                        <li>• Export capabilities</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-medium mb-3">Security Features</h3>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Safe file processing</li>
                        <li>• Controlled computer access</li>
                        <li>• Data privacy protection</li>
                        <li>• User consent for actions</li>
                      </ul>
                    </div>
                    
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h3 className="font-medium text-blue-900 mb-2">Getting Started</h3>
                      <ol className="text-sm text-blue-800 space-y-1">
                        <li>1. Upload documents or ask questions</li>
                        <li>2. The AI will auto-select tools needed</li>
                        <li>3. Review extracted data in Data tab</li>
                        <li>4. Generate labels and save to database</li>
                      </ol>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          if (e.target.files) {
            handleFileUpload(e.target.files);
          }
        }}
      />
    </div>
  );
}
