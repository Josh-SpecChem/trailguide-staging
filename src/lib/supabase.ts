import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types for extracted data
export interface ExtractedProductData {
  id?: string
  created_at?: string
  product_name: string
  manufacturer?: string
  hazards: string[]
  ingredients: string[]
  safety_precautions: string[]
  first_aid_measures: string[]
  physical_properties?: Record<string, any>
  generated_label?: string
  file_name: string
  file_type: string
  extraction_confidence?: number
}

// Table structure for product data
export const createProductDataTable = async () => {
  const { error } = await supabase.rpc('create_product_data_table', {
    sql: `
      CREATE TABLE IF NOT EXISTS product_data (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        product_name TEXT NOT NULL,
        manufacturer TEXT,
        hazards JSONB,
        ingredients JSONB,
        safety_precautions JSONB,
        first_aid_measures JSONB,
        physical_properties JSONB,
        generated_label TEXT,
        file_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        extraction_confidence DECIMAL(3,2)
      );
    `
  })
  
  if (error) {
    console.error('Error creating table:', error)
  }
}
