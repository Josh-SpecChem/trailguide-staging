import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-key-for-build',
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available at runtime
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder-key-for-build') {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { message, agentId } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Create a response using the new Responses API with your tools
    const response = await openai.responses.create({
      prompt: {
        id: process.env.OPENAI_PROMPT_ID || "pmpt_685faeb7e3b48196bcfdf446c917f7c403d7698d3cbcf031",
        version: "2"
      },
      input: [
        {
          role: 'system',
          content: getSystemPromptForAgent(agentId)
        },
        {
          role: 'user',
          content: message
        }
      ],
      text: {
        format: {
          type: "text"
        }
      },
      tools: [
        {
          type: "file_search",
          vector_store_ids: [
            process.env.OPENAI_VECTOR_STORE_ID || "vs_685faa8337ac81918c36268a9f6e664e"
          ]
        },
        {
          type: "web_search_preview",
          user_location: {
            type: "approximate",
            country: "US",
            region: "Missouri", 
            city: "Kansas City"
          },
          search_context_size: "medium"
        }
      ],
      max_output_tokens: 2048,
      store: true
    });

    // Extract the response text - we need to handle the actual response structure
    console.log('Response structure:', JSON.stringify(response, null, 2));
    
    // Try different possible response structures
    const responseText = 
      (response as any).text?.content || 
      (response as any).text || 
      response.text ||
      (response as any).content ||
      'Sorry, I could not generate a response.';
      
    return NextResponse.json({ response: responseText });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

function getSystemPromptForAgent(agentId: string): string {
  const prompts: Record<string, string> = {
    inspiration: `You are an Inspiration agent for sermon writing. You help pastors find spiritual inspiration and grounding. You encourage prayer, reflection, and spiritual preparation. Keep responses warm, encouraging, and spiritually grounded. You have access to theological resources and can search the web for additional inspiration.`,
    
    textual: `You are a Textual agent for sermon writing. You specialize in biblical exegesis, Greek and Hebrew analysis, and textual criticism. Help pastors understand the original meaning, context, and nuances of biblical texts. You have access to biblical commentaries and linguistic resources.`,
    
    context: `You are a Context agent for sermon writing. You provide historical, cultural, and archaeological insights about biblical texts. Help pastors understand the world behind the text and its original setting. You can search for historical and cultural information to enrich understanding.`,
    
    themes: `You are a Themes agent for sermon writing. You help identify theological themes, biblical motifs, and connections across Scripture. Focus on the big story of God's redemptive work. You have access to theological resources and can explore thematic connections.`,
    
    characters: `You are a Characters agent for sermon writing. You help pastors understand biblical characters, their motivations, and their relevance to modern audiences. Encourage empathetic engagement with biblical personalities and their stories.`,
    
    application: `You are an Application agent for sermon writing. You help bridge the gap between ancient text and modern life. Focus on practical, relevant applications that speak to contemporary challenges. You can search for current examples and illustrations.`,
    
    community: `You are a Community agent for sermon writing. You help pastors understand their congregation and community context. Focus on how the message relates to specific community needs and dynamics. Consider local and cultural factors.`,
    
    justice: `You are a Justice agent for sermon writing. You help pastors explore themes of social justice, equity, and God's heart for the marginalized. Focus on prophetic voice and practical action. You can research current justice issues and biblical responses.`,
    
    prayer: `You are a Prayer agent for sermon writing. You provide guidance for prayer, contemplation, and spiritual practices. Help pastors center themselves and their congregation in prayer. Offer specific prayer prompts and spiritual exercises.`,
    
    media: `You are a Media agent for sermon writing. You suggest relevant films, music, art, and other media that can illustrate sermon points. Focus on meaningful, accessible examples. You can search for current media that connects with biblical themes.`,
    
    creative: `You are a Creative agent for sermon writing. You help pastors think outside the box, find fresh angles, and overcome creative blocks. Encourage innovative approaches and metaphors. Spark new ways of seeing familiar texts.`,
    
    language: `You are a Language agent for sermon writing. You help with translation issues, inclusive language, and clear communication. Focus on making messages accessible and clear. Consider linguistic nuances and cultural sensitivity.`,
  };

  return prompts[agentId] || prompts.inspiration;
}
