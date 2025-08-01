import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder'
})

export async function POST(request: NextRequest) {
  try {
    const { productData } = await request.json()
    
    if (!productData) {
      return NextResponse.json({ error: 'No product data provided' }, { status: 400 })
    }
    
    const prompt = `
Generate a professional product safety label based on the following extracted data:

Product: ${productData.product_name || 'Unknown Product'}
Manufacturer: ${productData.manufacturer || 'Unknown Manufacturer'}
Hazards: ${JSON.stringify(productData.hazards || [])}
Key Ingredients: ${JSON.stringify(productData.ingredients || [])}
Safety Precautions: ${JSON.stringify(productData.safety_precautions || [])}
First Aid: ${JSON.stringify(productData.first_aid_measures || [])}

Create a clear, professional product label that includes:
1. Product name and manufacturer
2. Hazard warnings with appropriate symbols (describe which symbols should be used)
3. Key safety precautions
4. Essential first aid information
5. Storage and handling instructions

Format the label as HTML with appropriate styling classes for a professional appearance.
Use warning colors (red, orange, yellow) where appropriate.
Make it concise but comprehensive.
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a safety label specialist. Create professional, compliant product labels in HTML format.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 1500
    })
    
    const label = response.choices[0]?.message?.content
    
    if (!label) {
      throw new Error('No response from OpenAI')
    }
    
    return NextResponse.json({ label })
    
  } catch (error) {
    console.error('Label generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate product label' },
      { status: 500 }
    )
  }
}
