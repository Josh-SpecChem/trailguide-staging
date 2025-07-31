import { NextRequest } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'sk-placeholder-key-for-build',
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available at runtime
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'sk-placeholder-key-for-build') {
      return new Response(
        JSON.stringify({ error: 'OpenAI API key not configured' }),
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const { message, agentId } = await request.json();

    if (!message) {
      return new Response('Message is required', { status: 400 });
    }

    // Use the Responses API with your prompt, vector store, and tools
    const stream = await openai.responses.create({
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
      store: true,
      stream: true
    });

    // Return a streaming response
    const encoder = new TextEncoder();
    
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            // Handle text streaming events - log the chunk type to debug
            console.log('Chunk type:', chunk.type);
            
            // Cast to any to handle the dynamic event types
            const chunkAny = chunk as any;
            const chunkType = chunk.type;
            
            // Handle text delta events (content being streamed)
            if (chunkType?.includes('text') && chunkType?.includes('delta')) {
              const content = chunkAny.delta?.text || chunkAny.delta?.content || '';
              if (content) {
                const data = JSON.stringify({ 
                  type: 'text_delta', 
                  content: content 
                });
                controller.enqueue(encoder.encode(`data: ${data}

`));
              }
            } 
            // Handle text completion
            else if (chunkType?.includes('text') && chunkType?.includes('done')) {
              const content = chunkAny.text || chunkAny.response?.text || '';
              if (content) {
                const data = JSON.stringify({ 
                  type: 'text_complete', 
                  content: content 
                });
                controller.enqueue(encoder.encode(`data: ${data}

`));
              }
            } 
            // Handle stream completion
            else if (chunkType?.includes('done') && !chunkType?.includes('text')) {
              const data = JSON.stringify({ type: 'done' });
              controller.enqueue(encoder.encode(`data: ${data}

`));
              controller.close();
              return;
            } 
            // Handle errors
            else if (chunkType === 'error') {
              const data = JSON.stringify({ 
                type: 'error', 
                error: chunkAny.error?.message || 'Unknown error' 
              });
              controller.enqueue(encoder.encode(`data: ${data}

`));
            }
          }
          
          // If we exit the loop without hitting 'done', close the stream
          const data = JSON.stringify({ type: 'done' });
          controller.enqueue(encoder.encode(`data: ${data}

`));
          controller.close();
          
        } catch (error) {
          console.error('Streaming error:', error);
          const errorData = JSON.stringify({ 
            type: 'error', 
            error: error instanceof Error ? error.message : 'Stream failed' 
          });
          controller.enqueue(encoder.encode(`data: ${errorData}\n\n`));
          controller.close();
        }
      }
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('OpenAI API error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Failed to process request' }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
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
