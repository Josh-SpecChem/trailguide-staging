import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder'
})

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json()
    
    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }
    
    const prompt = `
You are an expert at extracting structured data from Safety Data Sheets (SDS) and technical documents.
Extract the following information from the provided text and return it in JSON format:

{
  "product_name": "string",
  "manufacturer": "string",
  "hazards": ["array of hazard descriptions"],
  "ingredients": ["array of chemical ingredients with percentages if available"],
  "safety_precautions": ["array of safety measures"],
  "first_aid_measures": ["array of first aid instructions"],
  "physical_properties": {
    "physical_state": "string",
    "color": "string",
    "odor": "string",
    "ph": "string",
    "boiling_point": "string",
    "melting_point": "string",
    "flash_point": "string",
    "density": "string"
  },
  "extraction_confidence": "number between 0 and 1"
}

If information is not available, use null or an empty array. Be precise and only extract information that is clearly stated.

Document text:
${text.substring(0, 8000)} // Limit text length for API
`

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a precise data extraction specialist. Always return valid JSON.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.1,
      max_tokens: 2000
    })
    
    const extractedText = response.choices[0]?.message?.content
    
    if (!extractedText) {
      throw new Error('No response from OpenAI')
    }
    
    // Parse the JSON response
    let extractedData
    try {
      extractedData = JSON.parse(extractedText)
    } catch (parseError) {
      // If JSON parsing fails, try to extract JSON from the response
      const jsonMatch = extractedText.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        extractedData = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('Invalid JSON response from AI')
      }
    }
    
    return NextResponse.json(extractedData)
    
  } catch (error) {
    console.error('SDS extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract SDS data' },
      { status: 500 }
    )
  }
}
