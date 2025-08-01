import { supabase, ExtractedProductData } from '@/lib/supabase'

// Re-export types for convenience
export type { ExtractedProductData } from '@/lib/supabase'

// File processing utilities
export const processUploadedFile = async (file: File): Promise<string> => {
  const fileType = file.type
  
  if (fileType === 'application/pdf') {
    // For PDF processing, we'll use a server-side API route
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/process-file', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      throw new Error('Failed to process PDF file')
    }
    
    const { text } = await response.json()
    return text
  } else if (fileType.startsWith('text/')) {
    // Handle plain text files
    return await file.text()
  } else {
    throw new Error(`Unsupported file type: ${fileType}`)
  }
}

// AI Agent tool definitions
export interface AgentTool {
  name: string
  description: string
  icon: string
  category: 'analysis' | 'generation' | 'search' | 'computation' | 'automation'
  enabled: boolean
}

export const availableTools: AgentTool[] = [
  {
    name: 'file_search',
    description: 'Search through uploaded documents and files',
    icon: 'Search',
    category: 'search',
    enabled: true
  },
  {
    name: 'data_extraction',
    description: 'Extract structured data from safety data sheets and technical documents',
    icon: 'Database',
    category: 'analysis',
    enabled: true
  },
  {
    name: 'code_interpreter',
    description: 'Execute Python code, perform data analysis, and create visualizations',
    icon: 'Code',
    category: 'computation',
    enabled: true
  },
  {
    name: 'image_generation',
    description: 'Generate images from text descriptions using DALL-E',
    icon: 'Image',
    category: 'generation',
    enabled: true
  },
  {
    name: 'web_search',
    description: 'Search the web for real-time information',
    icon: 'Globe',
    category: 'search',
    enabled: true
  },
  {
    name: 'computer_use',
    description: 'Perform safe computer actions (requires explicit user consent)',
    icon: 'Monitor',
    category: 'automation',
    enabled: false // Disabled by default for security
  }
]

// Agent message types
export interface AgentMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: Date
  tools_used?: string[]
  attachments?: AgentAttachment[]
  metadata?: Record<string, any>
}

export interface AgentAttachment {
  type: 'file' | 'image' | 'code' | 'data'
  name: string
  url?: string
  content?: string
  metadata?: Record<string, any>
}

// Safety Data Sheet pattern recognition
export const detectSDSDocument = (text: string): boolean => {
  const sdsIndicators = [
    'safety data sheet',
    'sds',
    'msds',
    'material safety data sheet',
    'hazard identification',
    'composition/information on ingredients',
    'first-aid measures',
    'fire-fighting measures',
    'accidental release measures',
    'handling and storage',
    'exposure controls/personal protection',
    'physical and chemical properties',
    'stability and reactivity',
    'toxicological information',
    'ecological information',
    'disposal considerations',
    'transport information',
    'regulatory information'
  ]
  
  const normalizedText = text.toLowerCase()
  const matchCount = sdsIndicators.filter(indicator => 
    normalizedText.includes(indicator)
  ).length
  
  // If we find 5 or more SDS indicators, it's likely an SDS
  return matchCount >= 5
}

// Extract structured data from SDS
export const extractSDSData = async (text: string): Promise<Partial<ExtractedProductData>> => {
  const response = await fetch('/api/extract-sds', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  })
  
  if (!response.ok) {
    throw new Error('Failed to extract SDS data')
  }
  
  return await response.json()
}

// Generate product label from extracted data
export const generateProductLabel = async (productData: Partial<ExtractedProductData>): Promise<string> => {
  const response = await fetch('/api/generate-label', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ productData })
  })
  
  if (!response.ok) {
    throw new Error('Failed to generate product label')
  }
  
  const { label } = await response.json()
  return label
}

// Save extracted data to Supabase
export const saveExtractedData = async (data: ExtractedProductData): Promise<void> => {
  const { error } = await supabase
    .from('product_data')
    .insert([data])
  
  if (error) {
    throw new Error(`Failed to save data: ${error.message}`)
  }
}

// Retrieve saved data from Supabase
export const getSavedData = async (): Promise<ExtractedProductData[]> => {
  const { data, error } = await supabase
    .from('product_data')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) {
    throw new Error(`Failed to retrieve data: ${error.message}`)
  }
  
  return data || []
}
