demo_loop.py — Interactive REPL for OpenAI Agent Testing
File Overview
This file provides a simple, interactive REPL (read-eval-print loop) utility for manually testing and debugging OpenAI-style agents from the command line. It preserves conversation state across turns, supports both streamed and non-streamed agent output, and displays tool calls and agent updates in real time. This is a valuable tool for rapid development, manual QA, and demonstrations.

Table of Contents
Key Function
Annotated Code Snippets
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Function
Name	Purpose
run_demo_loop	Runs an interactive REPL loop for agent testing, supporting both streaming and non-streaming output.
Annotated Code Snippets
1. REPL Loop for Agent Testing
async def run_demo_loop(agent: Agent[Any], *, stream: bool = True) -> None:
    """Run a simple REPL loop with the given agent.

    This utility allows quick manual testing and debugging of an agent from the
    command line. Conversation state is preserved across turns. Enter ``exit``
    or ``quit`` to stop the loop.

    Args:
        agent: The starting agent to run.
        stream: Whether to stream the agent output.
    """
    current_agent = agent
    input_items: list[TResponseInputItem] = []
    while True:
        try:
            user_input = input(" > ")
        except (EOFError, KeyboardInterrupt):
            print()
            break
        if user_input.strip().lower() in {"exit", "quit"}:
            break
        if not user_input:
            continue

        input_items.append({"role": "user", "content": user_input})

        result: RunResultBase
        if stream:
            result = Runner.run_streamed(current_agent, input=input_items)
            async for event in result.stream_events():
                if isinstance(event, RawResponsesStreamEvent):
                    if isinstance(event.data, ResponseTextDeltaEvent):
                        print(event.data.delta, end="", flush=True)
                elif isinstance(event, RunItemStreamEvent):
                    if event.item.type == "tool_call_item":
                        print("\n[tool called]", flush=True)
                    elif event.item.type == "tool_call_output_item":
                        print(f"\n[tool output: {event.item.output}]", flush=True)
                elif isinstance(event, AgentUpdatedStreamEvent):
                    print(f"\n[Agent updated: {event.new_agent.name}]", flush=True)
            print()
        else:
            result = await Runner.run(current_agent, input_items)
            if result.final_output is not None:
                print(result.final_output)

        current_agent = result.last_agent
        input_items = result.to_input_list()
Explanation:

Prompts the user for input, appends it to the conversation, and runs the agent.
In streaming mode, prints output as it is generated, including tool calls and agent updates.
In non-streaming mode, prints the final output after the agent completes.
Conversation state is preserved, allowing for multi-turn interactions.
Example Usage
1. Running the Demo Loop
import asyncio
from my_agent_module import MyAgent  # Your agent definition
from demo_loop import run_demo_loop

agent = MyAgent(...)
asyncio.run(run_demo_loop(agent, stream=True))
Type your input at the prompt (>).
Enter exit or quit to end the session.
Tips, Gotchas, and FAQ
Streaming vs. Non-Streaming:
Set stream=True to see output as it is generated (recommended for LLMs that support streaming). Use stream=False for a simple turn-based experience.

Conversation State:
The REPL preserves the full conversation history, enabling multi-turn interactions and context-aware agent behavior.

Interrupting the Loop:
Use Ctrl+C or type exit/quit to exit the loop gracefully.

Tool Calls and Agent Updates:
Tool calls and agent updates are displayed in the output for transparency and debugging.

Related Files
agent.py
: Agent definitions used in the demo loop.
run.py
: Runner logic for executing agents.
items.py
: Input/output item types for agent runs.
stream_events.py
: Stream event types for agent output.
For further details, see the source code and related modules.