Quickstart
Realtime agents enable voice conversations with your AI agents using OpenAI's Realtime API. This guide walks you through creating your first realtime voice agent.

Beta feature

Realtime agents are in beta. Expect some breaking changes as we improve the implementation.

Prerequisites
Python 3.9 or higher
OpenAI API key
Basic familiarity with the OpenAI Agents SDK
Installation
If you haven't already, install the OpenAI Agents SDK:

pip install openai-agents
Creating your first realtime agent

Import required components
import asyncio
from agents.realtime import RealtimeAgent, RealtimeRunner
2. Create a realtime agent

agent = RealtimeAgent(
name="Assistant",
instructions="You are a helpful voice assistant. Keep your responses conversational and friendly.",
)
3. Set up the runner

runner = RealtimeRunner(
starting_agent=agent,
config={
"model_settings": {
"model_name": "gpt-4o-realtime-preview",
"voice": "alloy",
"modalities": ["text", "audio"],
}
}
)
4. Start a session

async def main():
# Start the realtime session
session = await runner.run()

async with session:
    # Send a text message to start the conversation
    await session.send_message("Hello! How are you today?")

    # The agent will stream back audio in real-time (not shown in this example)
    # Listen for events from the session
    async for event in session:
        if event.type == "response.audio_transcript.done":
            print(f"Assistant: {event.transcript}")
        elif event.type == "conversation.item.input_audio_transcription.completed":
            print(f"User: {event.transcript}")
Run the session
asyncio.run(main())
Complete example
Here's a complete working example:

import asyncio
from agents.realtime import RealtimeAgent, RealtimeRunner

async def main():
# Create the agent
agent = RealtimeAgent(
name="Assistant",
instructions="You are a helpful voice assistant. Keep responses brief and conversational.",
)

# Set up the runner with configuration
runner = RealtimeRunner(
    starting_agent=agent,
    config={
        "model_settings": {
            "model_name": "gpt-4o-realtime-preview",
            "voice": "alloy",
            "modalities": ["text", "audio"],
            "input_audio_transcription": {
                "model": "whisper-1"
            },
            "turn_detection": {
                "type": "server_vad",
                "threshold": 0.5,
                "prefix_padding_ms": 300,
                "silence_duration_ms": 200
            }
        }
    }
)

# Start the session
session = await runner.run()

async with session:
    print("Session started! The agent will stream audio responses in real-time.")

    # Process events
    async for event in session:
        if event.type == "response.audio_transcript.done":
            print(f"Assistant: {event.transcript}")
        elif event.type == "conversation.item.input_audio_transcription.completed":
            print(f"User: {event.transcript}")
        elif event.type == "error":
            print(f"Error: {event.error}")
            break
if name == "main":
asyncio.run(main())
Configuration options
Model settings
model_name: Choose from available realtime models (e.g., gpt-4o-realtime-preview)
voice: Select voice (alloy, echo, fable, onyx, nova, shimmer)
modalities: Enable text and/or audio (["text", "audio"])
Audio settings
input_audio_format: Format for input audio (pcm16, g711_ulaw, g711_alaw)
output_audio_format: Format for output audio
input_audio_transcription: Transcription configuration
Turn detection
type: Detection method (server_vad, semantic_vad)
threshold: Voice activity threshold (0.0-1.0)
silence_duration_ms: Silence duration to detect turn end
prefix_padding_ms: Audio padding before speech
Next steps
Learn more about realtime agents
Check out working examples in the examples/realtime folder
Add tools to your agent
Implement handoffs between agents
Set up guardrails for safety
Authentication
Make sure your OpenAI API key is set in your environment:

export OPENAI_API_KEY="your-api-key-here"
Or pass it directly when creating the session:

session = await runner.run(model_config={"api_key": "your-api-key"})
"""

"""
Guide
This guide provides an in-depth look at building voice-enabled AI agents using the OpenAI Agents SDK's realtime capabilities.

Beta feature

Realtime agents are in beta. Expect some breaking changes as we improve the implementation.

Overview
Realtime agents allow for conversational flows, processing audio and text inputs in real time and responding with realtime audio. They maintain persistent connections with OpenAI's Realtime API, enabling natural voice conversations with low latency and the ability to handle interruptions gracefully.

Architecture
Core Components
The realtime system consists of several key components:

RealtimeAgent: An agent, configured wiht instructions, tools and handoffs.
RealtimeRunner: Manages configuration. You can call runner.run() to get a session.
RealtimeSession: A single interaction session. You typically create one each time a user starts a conversation, and keep it alive until the conversation is done.
RealtimeModel: The underlying model interface (typically OpenAI's WebSocket implementation)
Session flow
A typical realtime session follows this flow:

Create your RealtimeAgent(s) with instructions, tools and handoffs.
Set up a RealtimeRunner with the agent and configuration options
Start the session using await runner.run() which returns a RealtimeSession.
Send audio or text messages to the session using send_audio() or send_message()
Listen for events by iterating over the session - events include audio output, transcripts, tool calls, handoffs, and errors
Handle interruptions when users speak over the agent, which automatically stops current audio generation
The session maintains the conversation history and manages the persistent connection with the realtime model.

Agent configuration
RealtimeAgent works similarly to the regular Agent class with some key differences. For full API details, see the RealtimeAgent API reference.

Key differences from regular agents:

Model choice is configured at the session level, not the agent level.
No structured output support (outputType is not supported).
Voice can be configured per agent but cannot be changed after the first agent speaks.
All other features like tools, handoffs, and instructions work the same way.
Session configuration
Model settings
The session configuration allows you to control the underlying realtime model behavior. You can configure the model name (such as gpt-4o-realtime-preview), voice selection (alloy, echo, fable, onyx, nova, shimmer), and supported modalities (text and/or audio). Audio formats can be set for both input and output, with PCM16 being the default.

Audio configuration
Audio settings control how the session handles voice input and output. You can configure input audio transcription using models like Whisper, set language preferences, and provide transcription prompts to improve accuracy for domain-specific terms. Turn detection settings control when the agent should start and stop responding, with options for voice activity detection thresholds, silence duration, and padding around detected speech.

Tools and Functions
Adding Tools
Just like regular agents, realtime agents support function tools that execute during conversations:

from agents import function_tool

@function_tool
def get_weather(city: str) -> str:
"""Get current weather for a city."""
# Your weather API logic here
return f"The weather in {city} is sunny, 72°F"

@function_tool
def book_appointment(date: str, time: str, service: str) -> str:
"""Book an appointment."""
# Your booking logic here
return f"Appointment booked for {service} on {date} at {time}"

agent = RealtimeAgent(
name="Assistant",
instructions="You can help with weather and appointments.",
tools=[get_weather, book_appointment],
)
Handoffs
Creating Handoffs
Handoffs allow transferring conversations between specialized agents.

from agents.realtime import realtime_handoff

Specialized agents
billing_agent = RealtimeAgent(
name="Billing Support",
instructions="You specialize in billing and payment issues.",
)

technical_agent = RealtimeAgent(
name="Technical Support",
instructions="You handle technical troubleshooting.",
)

Main agent with handoffs
main_agent = RealtimeAgent(
name="Customer Service",
instructions="You are the main customer service agent. Hand off to specialists when needed.",
handoffs=[
realtime_handoff(billing_agent, tool_description="Transfer to billing support"),
realtime_handoff(technical_agent, tool_description="Transfer to technical support"),
]
)
Event handling
The session streams events that you can listen to by iterating over the session object. Events include audio output chunks, transcription results, tool execution start and end, agent handoffs, and errors. Key events to handle include:

audio: Raw audio data from the agent's response
audio_end: Agent finished speaking
audio_interrupted: User interrupted the agent
tool_start/tool_end: Tool execution lifecycle
handoff: Agent handoff occurred
error: Error occurred during processing
For complete event details, see RealtimeSessionEvent.

Guardrails
Only output guardrails are supported for realtime agents. These guardrails are debounced and run periodically (not on every word) to avoid performance issues during real-time generation. The default debounce length is 100 characters, but this is configurable.

When a guardrail is triggered, it generates a guardrail_tripped event and can interrupt the agent's current response. The debounce behavior helps balance safety with real-time performance requirements. Unlike text agents, realtime agents do not raise an Exception when guardrails are tripped.

Audio processing
Send audio to the session using session.send_audio(audio_bytes) or send text using session.send_message().

For audio output, listen for audio events and play the audio data through your preferred audio library. Make sure to listen for audio_interrupted events to stop playback immediately and clear any queued audio when the user interrupts the agent.

Direct model access
You can access the underlying model to add custom listeners or perform advanced operations:

Add a custom listener to the model
session.model.add_listener(my_custom_listener)
This gives you direct access to the RealtimeModel interface for advanced use cases where you need lower-level control over the connection.

Examples
For complete working examples, check out the examples/realtime directory which includes demos with and without UI components.
"""

# Realtime Agents

## Quickstart

Realtime agents enable voice conversations with your AI agents using OpenAI's Realtime API. This guide walks you through creating your first realtime voice agent.

> **Beta feature:**  
> Realtime agents are in beta. Expect some breaking changes as we improve the implementation.

### Prerequisites

- Python 3.9 or higher
- OpenAI API key
- Basic familiarity with the OpenAI Agents SDK

### Installation

If you haven't already, install the OpenAI Agents SDK:

```bash
pip install openai-agents
Creating your first realtime agent
1. Import required components
import asyncio
from agents.realtime import RealtimeAgent, RealtimeRunner
2. Create a realtime agent
agent = RealtimeAgent(
    name="Assistant",
    instructions="You are a helpful voice assistant. Keep your responses conversational and friendly.",
)
3. Set up the runner
runner = RealtimeRunner(
    starting_agent=agent,
    config={
        "model_settings": {
            "model_name": "gpt-4o-realtime-preview",
            "voice": "alloy",
            "modalities": ["text", "audio"],
        }
    }
)
4. Start a session
async def main():
    # Start the realtime session
    session = await runner.run()

    async with session:
        # Send a text message to start the conversation
        await session.send_message("Hello! How are you today?")

        # The agent will stream back audio in real-time (not shown in this example)
        # Listen for events from the session
        async for event in session:
            if event.type == "response.audio_transcript.done":
                print(f"Assistant: {event.transcript}")
            elif event.type == "conversation.item.input_audio_transcription.completed":
                print(f"User: {event.transcript}")

# Run the session
asyncio.run(main())
Complete example
Here's a complete working example:

import asyncio
from agents.realtime import RealtimeAgent, RealtimeRunner

async def main():
    # Create the agent
    agent = RealtimeAgent(
        name="Assistant",
        instructions="You are a helpful voice assistant. Keep responses brief and conversational.",
    )

    # Set up the runner with configuration
    runner = RealtimeRunner(
        starting_agent=agent,
        config={
            "model_settings": {
                "model_name": "gpt-4o-realtime-preview",
                "voice": "alloy",
                "modalities": ["text", "audio"],
                "input_audio_transcription": {
                    "model": "whisper-1"
                },
                "turn_detection": {
                    "type": "server_vad",
                    "threshold": 0.5,
                    "prefix_padding_ms": 300,
                    "silence_duration_ms": 200
                }
            }
        }
    )

    # Start the session
    session = await runner.run()

    async with session:
        print("Session started! The agent will stream audio responses in real-time.")

        # Process events
        async for event in session:
            if event.type == "response.audio_transcript.done":
                print(f"Assistant: {event.transcript}")
            elif event.type == "conversation.item.input_audio_transcription.completed":
                print(f"User: {event.transcript}")
            elif event.type == "error":
                print(f"Error: {event.error}")
                break

if __name__ == "__main__":
    asyncio.run(main())
Configuration options
Model settings
model_name: Choose from available realtime models (e.g., gpt-4o-realtime-preview)
voice: Select voice (alloy, echo, fable, onyx, nova, shimmer)
modalities: Enable text and/or audio (["text", "audio"])
Audio settings
input_audio_format: Format for input audio (pcm16, g711_ulaw, g711_alaw)
output_audio_format: Format for output audio
input_audio_transcription: Transcription configuration
Turn detection
type: Detection method (server_vad, semantic_vad)
threshold: Voice activity threshold (0.0-1.0)
silence_duration_ms: Silence duration to detect turn end
prefix_padding_ms: Audio padding before speech
Next steps
Learn more about realtime agents
Check out working examples in the examples/realtime folder
Add tools to your agent
Implement handoffs between agents
Set up guardrails for safety
Authentication
Make sure your OpenAI API key is set in your environment:

export OPENAI_API_KEY="your-api-key-here"
Or pass it directly when creating the session:

session = await runner.run(model_config={"api_key": "your-api-key"})
Guide
This guide provides an in-depth look at building voice-enabled AI agents using the OpenAI Agents SDK's realtime capabilities.

Beta feature:
Realtime agents are in beta. Expect some breaking changes as we improve the implementation.

Overview
Realtime agents allow for conversational flows, processing audio and text inputs in real time and responding with realtime audio. They maintain persistent connections with OpenAI's Realtime API, enabling natural voice conversations with low latency and the ability to handle interruptions gracefully.

Architecture
Core Components
The realtime system consists of several key components:

RealtimeAgent: An agent, configured with instructions, tools and handoffs.
RealtimeRunner: Manages configuration. You can call runner.run() to get a session.
RealtimeSession: A single interaction session. You typically create one each time a user starts a conversation, and keep it alive until the conversation is done.
RealtimeModel: The underlying model interface (typically OpenAI's WebSocket implementation)
Session flow
A typical realtime session follows this flow:

Create your RealtimeAgent(s) with instructions, tools and handoffs.
Set up a RealtimeRunner with the agent and configuration options
Start the session using await runner.run() which returns a RealtimeSession.
Send audio or text messages to the session using send_audio() or send_message()
Listen for events by iterating over the session - events include audio output, transcripts, tool calls, handoffs, and errors
Handle interruptions when users speak over the agent, which automatically stops current audio generation
The session maintains the conversation history and manages the persistent connection with the realtime model.

Agent configuration
RealtimeAgent works similarly to the regular Agent class with some key differences. For full API details, see the RealtimeAgent API reference.

Key differences from regular agents:

Model choice is configured at the session level, not the agent level.
No structured output support (outputType is not supported).
Voice can be configured per agent but cannot be changed after the first agent speaks.
All other features like tools, handoffs, and instructions work the same way.
Session configuration
Model settings
The session configuration allows you to control the underlying realtime model behavior. You can configure the model name (such as gpt-4o-realtime-preview), voice selection (alloy, echo, fable, onyx, nova, shimmer), and supported modalities (text and/or audio). Audio formats can be set for both input and output, with PCM16 being the default.

Audio configuration
Audio settings control how the session handles voice input and output. You can configure input audio transcription using models like Whisper, set language preferences, and provide transcription prompts to improve accuracy for domain-specific terms. Turn detection settings control when the agent should start and stop responding, with options for voice activity detection thresholds, silence duration, and padding around detected speech.

Tools and Functions
Adding Tools
Just like regular agents, realtime agents support function tools that execute during conversations:

from agents import function_tool

@function_tool
def get_weather(city: str) -> str:
    """Get current weather for a city."""
    # Your weather API logic here
    return f"The weather in {city} is sunny, 72°F"

@function_tool
def book_appointment(date: str, time: str, service: str) -> str:
    """Book an appointment."""
    # Your booking logic here
    return f"Appointment booked for {service} on {date} at {time}"

agent = RealtimeAgent(
    name="Assistant",
    instructions="You can help with weather and appointments.",
    tools=[get_weather, book_appointment],
)
Handoffs
Creating Handoffs
Handoffs allow transferring conversations between specialized agents.

from agents.realtime import realtime_handoff

# Specialized agents
billing_agent = RealtimeAgent(
    name="Billing Support",
    instructions="You specialize in billing and payment issues.",
)

technical_agent = RealtimeAgent(
    name="Technical Support",
    instructions="You handle technical troubleshooting.",
)

# Main agent with handoffs
main_agent = RealtimeAgent(
    name="Customer Service",
    instructions="You are the main customer service agent. Hand off to specialists when needed.",
    handoffs=[
        realtime_handoff(billing_agent, tool_description="Transfer to billing support"),
        realtime_handoff(technical_agent, tool_description="Transfer to technical support"),
    ]
)
Event handling
The session streams events that you can listen to by iterating over the session object. Events include audio output chunks, transcription results, tool execution start and end, agent handoffs, and errors. Key events to handle include:

audio: Raw audio data from the agent's response
audio_end: Agent finished speaking
audio_interrupted: User interrupted the agent
tool_start/tool_end: Tool execution lifecycle
handoff: Agent handoff occurred
error: Error occurred during processing
For complete event details, see RealtimeSessionEvent.

Guardrails
Only output guardrails are supported for realtime agents. These guardrails are debounced and run periodically (not on every word) to avoid performance issues during real-time generation. The default debounce length is 100 characters, but this is configurable.

When a guardrail is triggered, it generates a guardrail_tripped event and can interrupt the agent's current response. The debounce behavior helps balance safety with real-time performance requirements. Unlike text agents, realtime agents do not raise an Exception when guardrails are tripped.

Audio processing
Send audio to the session using session.send_audio(audio_bytes) or send text using session.send_message().

For audio output, listen for audio events and play the audio data through your preferred audio library. Make sure to listen for audio_interrupted events to stop playback immediately and clear any queued audio when the user interrupts the agent.

Direct model access
You can access the underlying model to add custom listeners or perform advanced operations:

# Add a custom listener to the model
session.model.add_listener(my_custom_listener)
This gives you direct access to the RealtimeModel interface for advanced use cases where you need lower-level control over the connection.

Examples
For complete working examples, check out the examples/realtime directory which includes demos with and without UI components.