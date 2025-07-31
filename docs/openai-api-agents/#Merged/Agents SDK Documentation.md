## Agents

Agents are the core building block in your apps. An agent is a large language model (LLM), configured with instructions and tools.

### Basic configuration

The most common properties of an agent you'll configure are:

- **name**: A required string that identifies your agent.
- **instructions**: also known as a developer message or system prompt.
- **model**: which LLM to use, and optional model_settings to configure model tuning parameters like temperature, top_p, etc.
- **tools**: Tools that the agent can use to achieve its tasks.

```python
from agents import Agent, ModelSettings, function_tool

@function_tool
def get_weather(city: str) -> str:
     """returns weather info for the specified city."""
    return f"The weather in {city} is sunny"

agent = Agent(
    name="Haiku agent",
    instructions="Always respond in haiku form",
    model="o3-mini",
    tools=[get_weather],
)
```

---

### Context

Agents are generic on their context type. Context is a dependency-injection tool: it's an object you create and pass to Runner.run(), that is passed to every agent, tool, handoff etc, and it serves as a grab bag of dependencies and state for the agent run. You can provide any Python object as the context.

```python
@dataclass
class UserContext:
    uid: str
    is_pro_user: bool

    async def fetch_purchases() -> list[Purchase]:
        return ...

agent = Agent[UserContext](
    ...,
)
```

---

### Output types

By default, agents produce plain text (i.e. str) outputs. If you want the agent to produce a particular type of output, you can use the output_type parameter. A common choice is to use Pydantic objects, but we support any type that can be wrapped in a Pydantic TypeAdapter - dataclasses, lists, TypedDict, etc.

```python
from pydantic import BaseModel
from agents import Agent

class CalendarEvent(BaseModel):
    name: str
    date: str
    participants: list[str]

agent = Agent(
    name="Calendar extractor",
    instructions="Extract calendar events from text",
    output_type=CalendarEvent,
)
```

> **Note:** When you pass an output_type, that tells the model to use structured outputs instead of regular plain text responses.

---

### Handoffs

Handoffs are sub-agents that the agent can delegate to. You provide a list of handoffs, and the agent can choose to delegate to them if relevant. This is a powerful pattern that allows orchestrating modular, specialized agents that excel at a single task. Read more in the handoffs documentation.

```python
from agents import Agent

booking_agent = Agent(...)
refund_agent = Agent(...)

triage_agent = Agent(
    name="Triage agent",
    instructions=(
        "Help the user with their questions."
        "If they ask about booking, handoff to the booking agent."
        "If they ask about refunds, handoff to the refund agent."
    ),
    handoffs=[booking_agent, refund_agent],
)
```

---

### Dynamic instructions

In most cases, you can provide instructions when you create the agent. However, you can also provide dynamic instructions via a function. The function will receive the agent and context, and must return the prompt. Both regular and async functions are accepted.

```python
def dynamic_instructions(
    context: RunContextWrapper[UserContext], agent: Agent[UserContext]
) -> str:
    return f"The user's name is {context.context.name}. Help them with their questions."

agent = Agent[UserContext](
    name="Triage agent",
    instructions=dynamic_instructions,
)
```

---

### Lifecycle events (hooks)

Sometimes, you want to observe the lifecycle of an agent. For example, you may want to log events, or pre-fetch data when certain events occur. You can hook into the agent lifecycle with the hooks property. Subclass the AgentHooks class, and override the methods you're interested in.

---

### Guardrails

Guardrails allow you to run checks/validations on user input, in parallel to the agent running. For example, you could screen the user's input for relevance. Read more in the guardrails documentation.

---

### Cloning/copying agents

By using the clone() method on an agent, you can duplicate an Agent, and optionally change any properties you like.

```python
pirate_agent = Agent(
    name="Pirate",
    instructions="Write like a pirate",
    model="o3-mini",
)

robot_agent = pirate_agent.clone(
    name="Robot",
    instructions="Write like a robot",
)
```

---

### Forcing tool use

Supplying a list of tools doesn't always mean the LLM will use a tool. You can force tool use by setting ModelSettings.tool_choice. Valid values are:

- auto: allows the LLM to decide whether or not to use a tool.
- required: requires the LLM to use a tool (but it can intelligently decide which tool).
- none: requires the LLM to not use a tool.
- Setting a specific string e.g. my_tool, which requires the LLM to use that specific tool.

> **Note:** To prevent infinite loops, the framework automatically resets tool_choice to "auto" after a tool call. This behavior is configurable via agent.reset_tool_choice. The infinite loop is because tool results are sent to the LLM, which then generates another tool call because of tool_choice, ad infinitum.

If you want the Agent to completely stop after a tool call (rather than continuing with auto mode), you can set `[Agent.tool_use_behavior="stop_on_first_tool"]` which will directly use the tool output as the final response without further LLM processing.

---

## Running agents

You can run agents via the Runner class. You have 3 options:

- `Runner.run()`, which runs async and returns a RunResult.
- `Runner.run_sync()`, which is a sync method and just runs .run() under the hood.
- `Runner.run_streamed()`, which runs async and returns a RunResultStreaming. It calls the LLM in streaming mode, and streams those events to you as they are received.

```python
from agents import Agent, Runner

async def main():
    agent = Agent(name="Assistant", instructions="You are a helpful assistant")

    result = await Runner.run(agent, "Write a haiku about recursion in programming.")
    print(result.final_output)
    # Code within the code,
    # Functions calling themselves,
    # Infinite loop's dance
```

Read more in the results guide.

---

### The agent loop

When you use the run method in Runner, you pass in a starting agent and input. The input can either be a string (which is considered a user message), or a list of input items, which are the items in the OpenAI Responses API.

The runner then runs a loop:

1. We call the LLM for the current agent, with the current input.
2. The LLM produces its output.
3. If the LLM returns a final_output, the loop ends and we return the result.
4. If the LLM does a handoff, we update the current agent and input, and re-run the loop.
5. If the LLM produces tool calls, we run those tool calls, append the results, and re-run the loop.
6. If we exceed the max_turns passed, we raise a MaxTurnsExceeded exception.

> **Note:** The rule for whether the LLM output is considered as a "final output" is that it produces text output with the desired type, and there are no tool calls.

---

### Streaming

Streaming allows you to additionally receive streaming events as the LLM runs. Once the stream is done, the RunResultStreaming will contain the complete information about the run, including all the new outputs produced. You can call `.stream_events()` for the streaming events. Read more in the streaming guide.

---

### Run config

The run_config parameter lets you configure some global settings for the agent run:

- model: Allows setting a global LLM model to use, irrespective of what model each Agent has.
- model_provider: A model provider for looking up model names, which defaults to OpenAI.
- model_settings: Overrides agent-specific settings. For example, you can set a global temperature or top_p.
- input_guardrails, output_guardrails: A list of input or output guardrails to include on all runs.
- handoff_input_filter: A global input filter to apply to all handoffs, if the handoff doesn't already have one. The input filter allows you to edit the inputs that are sent to the new agent. See the documentation in Handoff.input_filter for more details.
- tracing_disabled: Allows you to disable tracing for the entire run.
- trace_include_sensitive_data: Configures whether traces will include potentially sensitive data, such as LLM and tool call inputs/outputs.
- workflow_name, trace_id, group_id: Sets the tracing workflow name, trace ID and trace group ID for the run. We recommend at least setting workflow_name. The group ID is an optional field that lets you link traces across multiple runs.
- trace_metadata: Metadata to include on all traces.

---

### Conversations/chat threads

Calling any of the run methods can result in one or more agents running (and hence one or more LLM calls), but it represents a single logical turn in a chat conversation. For example:

- User turn: user enter text
- Runner run: first agent calls LLM, runs tools, does a handoff to a second agent, second agent runs more tools, and then produces an output.

At the end of the agent run, you can choose what to show to the user. For example, you might show the user every new item generated by the agents, or just the final output. Either way, the user might then ask a followup question, in which case you can call the run method again.

---

### Manual conversation management

You can manually manage conversation history using the RunResultBase.to_input_list() method to get the inputs for the next turn:

```python
async def main():
    agent = Agent(name="Assistant", instructions="Reply very concisely.")

    thread_id = "thread_123"  # Example thread ID
    with trace(workflow_name="Conversation", group_id=thread_id):
        # First turn
        result = await Runner.run(agent, "What city is the Golden Gate Bridge in?")
        print(result.final_output)
        # San Francisco

        # Second turn
        new_input = result.to_input_list() + [{"role": "user", "content": "What state is it in?"}]
        result = await Runner.run(agent, new_input)
        print(result.final_output)
        # California
```

---

### Automatic conversation management with Sessions

For a simpler approach, you can use Sessions to automatically handle conversation history without manually calling .to_input_list():

```python
from agents import Agent, Runner, SQLiteSession

async def main():
    agent = Agent(name="Assistant", instructions="Reply very concisely.")

    # Create session instance
    session = SQLiteSession("conversation_123")

    with trace(workflow_name="Conversation", group_id=thread_id):
        # First turn
        result = await Runner.run(agent, "What city is the Golden Gate Bridge in?", session=session)
        print(result.final_output)
        # San Francisco

        # Second turn - agent automatically remembers previous context
        result = await Runner.run(agent, "What state is it in?", session=session)
        print(result.final_output)
        # California
```

Sessions automatically:

- Retrieves conversation history before each run
- Stores new messages after each run
- Maintains separate conversations for different session IDs

See the Sessions documentation for more details.

---

### Exceptions

The SDK raises exceptions in certain cases. The full list is in agents.exceptions. As an overview:

- AgentsException is the base class for all exceptions raised in the SDK.
- MaxTurnsExceeded is raised when the run exceeds the max_turns passed to the run methods.
- ModelBehaviorError is raised when the model produces invalid outputs, e.g. malformed JSON or using non-existent tools.
- UserError is raised when you (the person writing code using the SDK) make an error using the SDK.
- InputGuardrailTripwireTriggered, OutputGuardrailTripwireTriggered is raised when a guardrail is tripped.

---

## Sessions

The Agents SDK provides built-in session memory to automatically maintain conversation history across multiple agent runs, eliminating the need to manually handle .to_input_list() between turns.

Sessions stores conversation history for a specific session, allowing agents to maintain context without requiring explicit manual memory management. This is particularly useful for building chat applications or multi-turn conversations where you want the agent to remember previous interactions.

### Quick start

```python
from agents import Agent, Runner, SQLiteSession

# Create agent
agent = Agent(
    name="Assistant",
    instructions="Reply very concisely.",
)

# Create a session instance with a session ID
session = SQLiteSession("conversation_123")

# First turn
result = await Runner.run(
    agent,
    "What city is the Golden Gate Bridge in?",
    session=session
)
print(result.final_output)  # "San Francisco"

# Second turn - agent automatically remembers previous context
result = await Runner.run(
    agent,
    "What state is it in?",
    session=session
)
print(result.final_output)  # "California"

# Also works with synchronous runner
result = Runner.run_sync(
    agent,
    "What's the population?",
    session=session
)
print(result.final_output)  # "Approximately 39 million"
```

#### How it works

When session memory is enabled:

- **Before each run:** The runner automatically retrieves the conversation history for the session and prepends it to the input items.
- **After each run:** All new items generated during the run (user input, assistant responses, tool calls, etc.) are automatically stored in the session.
- **Context preservation:** Each subsequent run with the same session includes the full conversation history, allowing the agent to maintain context.

This eliminates the need to manually call .to_input_list() and manage conversation state between runs.

#### Memory operations

##### Basic operations

Sessions supports several operations for managing conversation history:

```python
from agents import SQLiteSession

session = SQLiteSession("user_123", "conversations.db")

# Get all items in a session
items = await session.get_items()

# Add new items to a session
new_items = [
    {"role": "user", "content": "Hello"},
    {"role": "assistant", "content": "Hi there!"}
]
await session.add_items(new_items)

# Remove and return the most recent item
last_item = await session.pop_item()
print(last_item)  # {"role": "assistant", "content": "Hi there!"}

# Clear all items from a session
await session.clear_session()
```

##### Using pop_item for corrections

The pop_item method is particularly useful when you want to undo or modify the last item in a conversation:

```python
from agents import Agent, Runner, SQLiteSession

agent = Agent(name="Assistant")
session = SQLiteSession("correction_example")

# Initial conversation
result = await Runner.run(
    agent,
    "What's 2 + 2?",
    session=session
)
print(f"Agent: {result.final_output}")

# User wants to correct their question
assistant_item = await session.pop_item()  # Remove agent's response
user_item = await session.pop_item()  # Remove user's question

# Ask a corrected question
result = await Runner.run(
    agent,
    "What's 2 + 3?",
    session=session
)
print(f"Agent: {result.final_output}")
```

##### Memory options

###### No memory (default)

```python
# Default behavior - no session memory
result = await Runner.run(agent, "Hello")
```

###### SQLite memory

```python
from agents import SQLiteSession

# In-memory database (lost when process ends)
session = SQLiteSession("user_123")

# Persistent file-based database
session = SQLiteSession("user_123", "conversations.db")

# Use the session
result = await Runner.run(
    agent,
    "Hello",
    session=session
)
```

###### Multiple sessions

```python
from agents import Agent, Runner, SQLiteSession

agent = Agent(name="Assistant")

# Different sessions maintain separate conversation histories
session_1 = SQLiteSession("user_123", "conversations.db")
session_2 = SQLiteSession("user_456", "conversations.db")

result1 = await Runner.run(
    agent,
    "Hello",
    session=session_1
)
result2 = await Runner.run(
    agent,
    "Hello",
    session=session_2
)
```

###### Custom memory implementations

You can implement your own session memory by creating a class that follows the Session protocol:

```python
from agents.memory import Session
from typing import List

class MyCustomSession:
    """Custom session implementation following the Session protocol."""

    def __init__(self, session_id: str):
        self.session_id = session_id
        # Your initialization here

    async def get_items(self, limit: int | None = None) -> List[dict]:
        """Retrieve conversation history for this session."""
        # Your implementation here
        pass

    async def add_items(self, items: List[dict]) -> None:
        """Store new items for this session."""
        # Your implementation here
        pass

    async def pop_item(self) -> dict | None:
        """Remove and return the most recent item from this session."""
        # Your implementation here
        pass

    async def clear_session(self) -> None:
        """Clear all items for this session."""
        # Your implementation here
        pass

# Use your custom session
agent = Agent(name="Assistant")
result = await Runner.run(
    agent,
    "Hello",
    session=MyCustomSession("my_session")
)
```

---

### Session management

#### Session ID naming

Use meaningful session IDs that help you organize conversations:

- User-based: `"user_12345"`
- Thread-based: `"thread_abc123"`
- Context-based: `"support_ticket_456"`

#### Memory persistence

- Use in-memory SQLite (`SQLiteSession("session_id")`) for temporary conversations
- Use file-based SQLite (`SQLiteSession("session_id", "path/to/db.sqlite")`) for persistent conversations
- Consider implementing custom session backends for production systems (Redis, PostgreSQL, etc.)

#### Session management

```python
# Clear a session when conversation should start fresh
await session.clear_session()

# Different agents can share the same session
support_agent = Agent(name="Support")
billing_agent = Agent(name="Billing")
session = SQLiteSession("user_123")

# Both agents will see the same conversation history
result1 = await Runner.run(
    support_agent,
    "Help me with my account",
    session=session
)
result2 = await Runner.run(
    billing_agent,
    "What are my charges?",
    session=session
)
```

---

### Complete example

Here's a complete example showing session memory in action:

```python
import asyncio
from agents import Agent, Runner, SQLiteSession

async def main():
    # Create an agent
    agent = Agent(
        name="Assistant",
        instructions="Reply very concisely.",
    )

    # Create a session instance that will persist across runs
    session = SQLiteSession("conversation_123", "conversation_history.db")

    print("=== Sessions Example ===")
    print("The agent will remember previous messages automatically.\n")

    # First turn
    print("First turn:")
    print("User: What city is the Golden Gate Bridge in?")
    result = await Runner.run(
        agent,
        "What city is the Golden Gate Bridge in?",
        session=session
    )
    print(f"Assistant: {result.final_output}")
    print()

    # Second turn - the agent will remember the previous conversation
    print("Second turn:")
    print("User: What state is it in?")
    result = await Runner.run(
        agent,
        "What state is it in?",
        session=session
    )
    print(f"Assistant: {result.final_output}")
    print()

    # Third turn - continuing the conversation
    print("Third turn:")
    print("User: What's the population of that state?")
    result = await Runner.run(
        agent,
        "What's the population of that state?",
        session=session
    )
    print(f"Assistant: {result.final_output}")
    print()

    print("=== Conversation Complete ===")
    print("Notice how the agent remembered the context from previous turns!")
    print("Sessions automatically handles conversation history.")

if __name__ == "__main__":
    asyncio.run(main())
```

#### API Reference

For detailed API documentation, see:

- Session - Protocol interface
- SQLiteSession - SQLite implementation

---

## Results

When you call the Runner.run methods, you either get a:

- RunResult if you call run or run_sync
- RunResultStreaming if you call run_streamed

Both of these inherit from RunResultBase, which is where most useful information is present.

### Final output

The final_output property contains the final output of the last agent that ran. This is either:

- a str, if the last agent didn't have an output_type defined
- an object of type last_agent.output_type, if the agent had an output type defined.

> **Note:** final_output is of type Any. We can't statically type this, because of handoffs. If handoffs occur, that means any Agent might be the last agent, so we don't statically know the set of possible output types.

---

### Inputs for the next turn

You can use result.to_input_list() to turn the result into an input list that concatenates the original input you provided, to the items generated during the agent run. This makes it convenient to take the outputs of one agent run and pass them into another run, or to run it in a loop and append new user inputs each time.

---

### Last agent

The last_agent property contains the last agent that ran. Depending on your application, this is often useful for the next time the user inputs something. For example, if you have a frontline triage agent that hands off to a language-specific agent, you can store the last agent, and re-use it the next time the user messages the agent.

---

### New items

The new_items property contains the new items generated during the run. The items are RunItems. A run item wraps the raw item generated by the LLM.

- MessageOutputItem indicates a message from the LLM. The raw item is the message generated.
- HandoffCallItem indicates that the LLM called the handoff tool. The raw item is the tool call item from the LLM.
- HandoffOutputItem indicates that a handoff occurred. The raw item is the tool response to the handoff tool call. You can also access the source/target agents from the item.
- ToolCallItem indicates that the LLM invoked a tool.
- ToolCallOutputItem indicates that a tool was called. The raw item is the tool response. You can also access the tool output from the item.
- ReasoningItem indicates a reasoning item from the LLM. The raw item is the reasoning generated.

---

### Other information

- **Guardrail results**: The input_guardrail_results and output_guardrail_results properties contain the results of the guardrails, if any. Guardrail results can sometimes contain useful information you want to log or store, so we make these available to you.
- **Raw responses**: The raw_responses property contains the ModelResponses generated by the LLM.
- **Original input**: The input property contains the original input you provided to the run method. In most cases you won't need this, but it's available in case you do.

---

## Streaming

Streaming lets you subscribe to updates of the agent run as it proceeds. This can be useful for showing the end-user progress updates and partial responses.

To stream, you can call Runner.run_streamed(), which will give you a RunResultStreaming. Calling result.stream_events() gives you an async stream of StreamEvent objects, which are described below.

### Raw response events

RawResponsesStreamEvent are raw events passed directly from the LLM. They are in OpenAI Responses API format, which means each event has a type (like response.created, response.output_text.delta, etc) and data. These events are useful if you want to stream response messages to the user as soon as they are generated.

For example, this will output the text generated by the LLM token-by-token.

```python
import asyncio
from openai.types.responses import ResponseTextDeltaEvent
from agents import Agent, Runner

async def main():
    agent = Agent(
        name="Joker",
        instructions="You are a helpful assistant.",
    )

    result = Runner.run_streamed(agent, input="Please tell me 5 jokes.")
    async for event in result.stream_events():
        if event.type == "raw_response_event" and isinstance(event.data, ResponseTextDeltaEvent):
            print(event.data.delta, end="", flush=True)

if __name__ == "__main__":
    asyncio.run(main())
```

---

### Run item events and agent events

RunItemStreamEvents are higher level events. They inform you when an item has been fully generated. This allows you to push progress updates at the level of "message generated", "tool ran", etc, instead of each token. Similarly, AgentUpdatedStreamEvent gives you updates when the current agent changes (e.g. as the result of a handoff).

For example, this will ignore raw events and stream updates to the user.

```python
import asyncio
import random
from agents import Agent, ItemHelpers, Runner, function_tool

@function_tool
def how_many_jokes() -> int:
    return random.randint(1, 10)

async def main():
    agent = Agent(
        name="Joker",
        instructions="First call the `how_many_jokes` tool, then tell that many jokes.",
        tools=[how_many_jokes],
    )

    result = Runner.run_streamed(
        agent,
        input="Hello",
    )
    print("=== Run starting ===")

    async for event in result.stream_events():
        # We'll ignore the raw responses event deltas
        if event.type == "raw_response_event":
            continue
        # When the agent updates, print that
        elif event.type == "agent_updated_stream_event":
            print(f"Agent updated: {event.new_agent.name}")
            continue
        # When items are generated, print them
        elif event.type == "run_item_stream_event":
            if event.item.type == "tool_call_item":
                print("-- Tool was called")
            elif event.item.type == "tool_call_output_item":
                print(f"-- Tool output: {event.item.output}")
            elif event.item.type == "message_output_item":
                print(f"-- Message output:\n {ItemHelpers.text_message_output(event.item)}")
            else:
                pass  # Ignore other event types

    print("=== Run complete ===")

if __name__ == "__main__":
    asyncio.run(main())
```

---

## REPL utility

The SDK provides run_demo_loop for quick interactive testing.

```python
import asyncio
from agents import Agent, run_demo_loop

async def main() -> None:
    agent = Agent(name="Assistant", instructions="You are a helpful assistant.")
    await run_demo_loop(agent)

if __name__ == "__main__":
    asyncio.run(main())
```

run_demo_loop prompts for user input in a loop, keeping the conversation history between turns. By default it streams model output as it is produced. Type quit or exit (or press Ctrl-D) to leave the loop.

---

## Tools

Tools let agents take actions: things like fetching data, running code, calling external APIs, and even using a computer. There are three classes of tools in the Agent SDK:

- **Hosted tools**: these run on LLM servers alongside the AI models. OpenAI offers retrieval, web search and computer use as hosted tools.
- **Function calling**: these allow you to use any Python function as a tool.
- **Agents as tools**: this allows you to use an agent as a tool, allowing Agents to call other agents without handing off to them.

### Hosted tools

OpenAI offers a few built-in tools when using the OpenAIResponsesModel:

- The WebSearchTool lets an agent search the web.
- The FileSearchTool allows retrieving information from your OpenAI Vector Stores.
- The ComputerTool allows automating computer use tasks.
- The CodeInterpreterTool lets the LLM execute code in a sandboxed environment.
- The HostedMCPTool exposes a remote MCP server's tools to the model.
- The ImageGenerationTool generates images from a prompt.
- The LocalShellTool runs shell commands on your machine.

```python
from agents import Agent, FileSearchTool, Runner, WebSearchTool

agent = Agent(
    name="Assistant",
    tools=[
        WebSearchTool(),
        FileSearchTool(
            max_num_results=3,
            vector_store_ids=["VECTOR_STORE_ID"],
        ),
    ],
)

async def main():
    result = await Runner.run(agent, "Which coffee shop should I go to, taking into account my preferences and the weather today in SF?")
    print(result.final_output)
```

---

### Function tools

You can use any Python function as a tool. The Agents SDK will setup the tool automatically:

- The name of the tool will be the name of the Python function (or you can provide a name)
- Tool description will be taken from the docstring of the function (or you can provide a description)
- The schema for the function inputs is automatically created from the function's arguments
- Descriptions for each input are taken from the docstring of the function, unless disabled

We use Python's inspect module to extract the function signature, along with griffe to parse docstrings and pydantic for schema creation.

```python
import json
from typing_extensions import TypedDict, Any
from agents import Agent, FunctionTool, RunContextWrapper, function_tool

class Location(TypedDict):
    lat: float
    long: float

@function_tool  
async def fetch_weather(location: Location) -> str:
    """Fetch the weather for a given location.

    Args:
        location: The location to fetch the weather for.
    """
    # In real life, we'd fetch the weather from a weather API
    return "sunny"

@function_tool(name_override="fetch_data")  
def read_file(ctx: RunContextWrapper[Any], path: str, directory: str | None = None) -> str:
    """Read the contents of a file.

    Args:
        path: The path to the file to read.
        directory: The directory to read the file from.
    """
    # In real life, we'd read the file from the file system
    return "<file contents>"

agent = Agent(
    name="Assistant",
    tools=[fetch_weather, read_file],  
)

for tool in agent.tools:
    if isinstance(tool, FunctionTool):
        print(tool.name)
        print(tool.description)
        print(json.dumps(tool.params_json_schema, indent=2))
        print()
```

---

### Custom function tools

Sometimes, you don't want to use a Python function as a tool. You can directly create a FunctionTool if you prefer. You'll need to provide:

- name
- description
- params_json_schema, which is the JSON schema for the arguments
- on_invoke_tool, which is an async function that receives a ToolContext and the arguments as a JSON string, and must return the tool output as a string.

```python
from typing import Any
from pydantic import BaseModel
from agents import RunContextWrapper, FunctionTool

def do_some_work(data: str) -> str:
    return "done"

class FunctionArgs(BaseModel):
    username: str
    age: int

async def run_function(ctx: RunContextWrapper[Any], args: str) -> str:
    parsed = FunctionArgs.model_validate_json(args)
    return do_some_work(data=f"{parsed.username} is {parsed.age} years old")

tool = FunctionTool(
    name="process_user",
    description="Processes extracted user data",
    params_json_schema=FunctionArgs.model_json_schema(),
    on_invoke_tool=run_function,
)
```

---

### Automatic argument and docstring parsing

As mentioned before, we automatically parse the function signature to extract the schema for the tool, and we parse the docstring to extract descriptions for the tool and for individual arguments. Some notes on that:

- The signature parsing is done via the inspect module. We use type annotations to understand the types for the arguments, and dynamically build a Pydantic model to represent the overall schema. It supports most types, including Python primitives, Pydantic models, TypedDicts, and more.
- We use griffe to parse docstrings. Supported docstring formats are google, sphinx and numpy. We attempt to automatically detect the docstring format, but this is best-effort and you can explicitly set it when calling function_tool. You can also disable docstring parsing by setting use_docstring_info to False.
- The code for the schema extraction lives in agents.function_schema.

---

### Agents as tools

In some workflows, you may want a central agent to orchestrate a network of specialized agents, instead of handing off control. You can do this by modeling agents as tools.

```python
from agents import Agent, Runner
import asyncio

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You translate the user's message to Spanish",
)

french_agent = Agent(
    name="French agent",
    instructions="You translate the user's message to French",
)

orchestrator_agent = Agent(
    name="orchestrator_agent",
    instructions=(
        "You are a translation agent. You use the tools given to you to translate."
        "If asked for multiple translations, you call the relevant tools."
    ),
    tools=[
        spanish_agent.as_tool(
            tool_name="translate_to_spanish",
            tool_description="Translate the user's message to Spanish",
        ),
        french_agent.as_tool(
            tool_name="translate_to_french",
            tool_description="Translate the user's message to French",
        ),
    ],
)

async def main():
    result = await Runner.run(orchestrator_agent, input="Say 'Hello, how are you?' in Spanish.")
    print(result.final_output)
```

#### Customizing tool-agents

The agent.as_tool function is a convenience method to make it easy to turn an agent into a tool. It doesn't support all configuration though; for example, you can't set max_turns. For advanced use cases, use Runner.run directly in your tool implementation:

```python
@function_tool
async def run_my_agent() -> str:
    """A tool that runs the agent with custom configs"""

    agent = Agent(name="My agent", instructions="...")

    result = await Runner.run(
        agent,
        input="...",
        max_turns=5,
        run_config=...
    )

    return str(result.final_output)
```

#### Custom output extraction

In certain cases, you might want to modify the output of the tool-agents before returning it to the central agent. This may be useful if you want to:

- Extract a specific piece of information (e.g., a JSON payload) from the sub-agent's chat history.
- Convert or reformat the agent’s final answer (e.g., transform Markdown into plain text or CSV).
- Validate the output or provide a fallback value when the agent’s response is missing or malformed.

You can do this by supplying the custom_output_extractor argument to the as_tool method:

```python
async def extract_json_payload(run_result: RunResult) -> str:
    # Scan the agent’s outputs in reverse order until we find a JSON-like message from a tool call.
    for item in reversed(run_result.new_items):
        if isinstance(item, ToolCallOutputItem) and item.output.strip().startswith("{"):
            return item.output.strip()
    # Fallback to an empty JSON object if nothing was found
    return "{}"

json_tool = data_agent.as_tool(
    tool_name="get_data_json",
    tool_description="Run the data agent and return only its JSON payload",
    custom_output_extractor=extract_json_payload,
)
```

#### Handling errors in function tools

When you create a function tool via @function_tool, you can pass a failure_error_function. This is a function that provides an error response to the LLM in case the tool call crashes.

- By default (i.e. if you don't pass anything), it runs a default_tool_error_function which tells the LLM an error occurred.
- If you pass your own error function, it runs that instead, and sends the response to the LLM.
- If you explicitly pass None, then any tool call errors will be re-raised for you to handle. This could be a ModelBehaviorError if the model produced invalid JSON, or a UserError if your code crashed, etc.
- If you are manually creating a FunctionTool object, then you must handle errors inside the on_invoke_tool function.

---

## Model context protocol (MCP)

The Model context protocol (aka MCP) is a way to provide tools and context to the LLM. From the MCP docs:

> MCP is an open protocol that standardizes how applications provide context to LLMs. Think of MCP like a USB-C port for AI applications. Just as USB-C provides a standardized way to connect your devices to various peripherals and accessories, MCP provides a standardized way to connect AI models to different data sources and tools.

The Agents SDK has support for MCP. This enables you to use a wide range of MCP servers to provide tools and prompts to your Agents.

### MCP servers

Currently, the MCP spec defines three kinds of servers, based on the transport mechanism they use:

- stdio servers run as a subprocess of your application. You can think of them as running "locally".
- HTTP over SSE servers run remotely. You connect to them via a URL.
- Streamable HTTP servers run remotely using the Streamable HTTP transport defined in the MCP spec.

You can use the MCPServerStdio, MCPServerSse, and MCPServerStreamableHttp classes to connect to these servers.

For example, this is how you'd use the official MCP filesystem server.

```python
from agents.run_context import RunContextWrapper

async with MCPServerStdio(
    params={
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
    }
) as server:
    # Note: In practice, you typically add the server to an Agent
    # and let the framework handle tool listing automatically.
    # Direct calls to list_tools() require run_context and agent parameters.
    run_context = RunContextWrapper(context=None)
    agent = Agent(name="test", instructions="test")
    tools = await server.list_tools(run_context, agent)
```

### Using MCP servers

MCP servers can be added to Agents. The Agents SDK will call list_tools() on the MCP servers each time the Agent is run. This makes the LLM aware of the MCP server's tools. When the LLM calls a tool from an MCP server, the SDK calls call_tool() on that server.

```python
agent=Agent(
    name="Assistant",
    instructions="Use the tools to achieve the task",
    mcp_servers=[mcp_server_1, mcp_server_2]
)
```

---

### Tool filtering

You can filter which tools are available to your Agent by configuring tool filters on MCP servers. The SDK supports both static and dynamic tool filtering.

#### Static tool filtering

For simple allow/block lists, you can use static filtering:

```python
from agents.mcp import create_static_tool_filter

# Only expose specific tools from this server
server = MCPServerStdio(
    params={
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
    },
    tool_filter=create_static_tool_filter(
        allowed_tool_names=["read_file", "write_file"]
    )
)

# Exclude specific tools from this server
server = MCPServerStdio(
    params={
        "command": "npx", 
        "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
    },
    tool_filter=create_static_tool_filter(
        blocked_tool_names=["delete_file"]
    )
)
```

When both allowed_tool_names and blocked_tool_names are configured, the processing order is:

1. First apply allowed_tool_names (allowlist) - only keep the specified tools
2. Then apply blocked_tool_names (blocklist) - exclude specified tools from the remaining tools

For example, if you configure allowed_tool_names=["read_file", "write_file", "delete_file"] and blocked_tool_names=["delete_file"], only read_file and write_file tools will be available.

#### Dynamic tool filtering

For more complex filtering logic, you can use dynamic filters with functions:

```python
from agents.mcp import ToolFilterContext

# Simple synchronous filter
def custom_filter(context: ToolFilterContext, tool) -> bool:
    """Example of a custom tool filter."""
    # Filter logic based on tool name patterns
    return tool.name.startswith("allowed_prefix")

# Context-aware filter
def context_aware_filter(context: ToolFilterContext, tool) -> bool:
    """Filter tools based on context information."""
    # Access agent information
    agent_name = context.agent.name

    # Access server information  
    server_name = context.server_name

    # Implement your custom filtering logic here
    return some_filtering_logic(agent_name, server_name, tool)

# Asynchronous filter
async def async_filter(context: ToolFilterContext, tool) -> bool:
    """Example of an asynchronous filter."""
    # Perform async operations if needed
    result = await some_async_check(context, tool)
    return result

server = MCPServerStdio(
    params={
        "command": "npx",
        "args": ["-y", "@modelcontextprotocol/server-filesystem", samples_dir],
    },
    tool_filter=custom_filter  # or context_aware_filter or async_filter
)
```

The ToolFilterContext provides access to:

- run_context: The current run context
- agent: The agent requesting the tools
- server_name: The name of the MCP server

---

### Prompts

MCP servers can also provide prompts that can be used to dynamically generate agent instructions. This allows you to create reusable instruction templates that can be customized with parameters.

#### Using prompts

MCP servers that support prompts provide two key methods:

- list_prompts(): Lists all available prompts on the server
- get_prompt(name, arguments): Gets a specific prompt with optional parameters

```python
# List available prompts
prompts_result = await server.list_prompts()
for prompt in prompts_result.prompts:
    print(f"Prompt: {prompt.name} - {prompt.description}")

# Get a specific prompt with parameters
prompt_result = await server.get_prompt(
    "generate_code_review_instructions",
    {"focus": "security vulnerabilities", "language": "python"}
)
instructions = prompt_result.messages[0].content.text

# Use the prompt-generated instructions with an Agent
agent = Agent(
    name="Code Reviewer",
    instructions=instructions,  # Instructions from MCP prompt
    mcp_servers=[server]
)
```

---

### Caching

Every time an Agent runs, it calls list_tools() on the MCP server. This can be a latency hit, especially if the server is a remote server. To automatically cache the list of tools, you can pass cache_tools_list=True to MCPServerStdio, MCPServerSse, and MCPServerStreamableHttp. You should only do this if you're certain the tool list will not change.

If you want to invalidate the cache, you can call invalidate_tools_cache() on the servers.

---

### End-to-end examples

View complete working examples at examples/mcp.

---

### Tracing

Tracing automatically captures MCP operations, including:

- Calls to the MCP server to list tools
- MCP-related info on function calls

---

## Handoffs

Handoffs allow an agent to delegate tasks to another agent. This is particularly useful in scenarios where different agents specialize in distinct areas. For example, a customer support app might have agents that each specifically handle tasks like order status, refunds, FAQs, etc.

Handoffs are represented as tools to the LLM. So if there's a handoff to an agent named Refund Agent, the tool would be called transfer_to_refund_agent.

### Creating a handoff

All agents have a handoffs param, which can either take an Agent directly, or a Handoff object that customizes the Handoff.

You can create a handoff using the handoff() function provided by the Agents SDK. This function allows you to specify the agent to hand off to, along with optional overrides and input filters.

#### Basic Usage

Here's how you can create a simple handoff:

```python
from agents import Agent, handoff

billing_agent = Agent(name="Billing agent")
refund_agent = Agent(name="Refund agent")

triage_agent = Agent(name="Triage agent", handoffs=[billing_agent, handoff(refund_agent)])
```

#### Customizing handoffs via the handoff() function

The handoff() function lets you customize things.

- agent: This is the agent to which things will be handed off.
- tool_name_override: By default, the Handoff.default_tool_name() function is used, which resolves to transfer_to_<agent_name>. You can override this.
- tool_description_override: Override the default tool description from Handoff.default_tool_description()
- on_handoff: A callback function executed when the handoff is invoked. This is useful for things like kicking off some data fetching as soon as you know a handoff is being invoked. This function receives the agent context, and can optionally also receive LLM generated input. The input data is controlled by the input_type param.
- input_type: The type of input expected by the handoff (optional).
- input_filter: This lets you filter the input received by the next agent. See below for more.

```python
from agents import Agent, handoff, RunContextWrapper

def on_handoff(ctx: RunContextWrapper[None]):
    print("Handoff called")

agent = Agent(name="My agent")

handoff_obj = handoff(
    agent=agent,
    on_handoff=on_handoff,
    tool_name_override="custom_handoff_tool",
    tool_description_override="Custom description",
)
```

#### Handoff inputs

In certain situations, you want the LLM to provide some data when it calls a handoff. For example, imagine a handoff to an "Escalation agent". You might want a reason to be provided, so you can log it.

```python
from pydantic import BaseModel
from agents import Agent, handoff, RunContextWrapper

class EscalationData(BaseModel):
    reason: str

async def on_handoff(ctx: RunContextWrapper[None], input_data: EscalationData):
    print(f"Escalation agent called with reason: {input_data.reason}")

agent = Agent(name="Escalation agent")

handoff_obj = handoff(
    agent=agent,
    on_handoff=on_handoff,
    input_type=EscalationData,
)
```

#### Input filters

When a handoff occurs, it's as though the new agent takes over the conversation, and gets to see the entire previous conversation history. If you want to change this, you can set an input_filter. An input filter is a function that receives the existing input via a HandoffInputData, and must return a new HandoffInputData.

There are some common patterns (for example removing all tool calls from the history), which are implemented for you in agents.extensions.handoff_filters

```python
from agents import Agent, handoff
from agents.extensions import handoff_filters

agent = Agent(name="FAQ agent")

handoff_obj = handoff(
    agent=agent,
    input_filter=handoff_filters.remove_all_tools, 
)
```

#### Recommended prompts

To make sure that LLMs understand handoffs properly, we recommend including information about handoffs in your agents. We have a suggested prefix in agents.extensions.handoff_prompt.RECOMMENDED_PROMPT_PREFIX, or you can call agents.extensions.handoff_prompt.prompt_with_handoff_instructions to automatically add recommended data to your prompts.

```python
from agents import Agent
from agents.extensions.handoff_prompt import RECOMMENDED_PROMPT_PREFIX

billing_agent = Agent(
    name="Billing agent",
    instructions=f"""{RECOMMENDED_PROMPT_PREFIX}
    <Fill in the rest of your prompt here>.""",
)
```

---

## Tracing

The Agents SDK includes built-in tracing, collecting a comprehensive record of events during an agent run: LLM generations, tool calls, handoffs, guardrails, and even custom events that occur. Using the Traces dashboard, you can debug, visualize, and monitor your workflows during development and in production.

> **Note:** Tracing is enabled by default. There are two ways to disable tracing:
>
> - You can globally disable tracing by setting the env var `OPENAI_AGENTS_DISABLE_TRACING=1`
> - You can disable tracing for a single run by setting `agents.run.RunConfig.tracing_disabled` to True
>
> For organizations operating under a Zero Data Retention (ZDR) policy using OpenAI's APIs, tracing is unavailable.

### Traces and spans

Traces represent a single end-to-end operation of a "workflow". They're composed of Spans. Traces have the following properties:

- workflow_name: This is the logical workflow or app. For example "Code generation" or "Customer service".
- trace_id: A unique ID for the trace. Automatically generated if you don't pass one. Must have the format trace_<32_alphanumeric>.
- group_id: Optional group ID, to link multiple traces from the same conversation. For example, you might use a chat thread ID.
- disabled: If True, the trace will not be recorded.
- metadata: Optional metadata for the trace.

Spans represent operations that have a start and end time. Spans have:

- started_at and ended_at timestamps.
- trace_id, to represent the trace they belong to
- parent_id, which points to the parent Span of this Span (if any)
- span_data, which is information about the Span. For example, AgentSpanData contains information about the Agent, GenerationSpanData contains information about the LLM generation, etc.

#### Default tracing

By default, the SDK traces the following:

- The entire Runner.{run, run_sync, run_streamed}() is wrapped in a trace().
- Each time an agent runs, it is wrapped in agent_span()
- LLM generations are wrapped in generation_span()
- Function tool calls are each wrapped in function_span()
- Guardrails are wrapped in guardrail_span()
- Handoffs are wrapped in handoff_span()
- Audio inputs (speech-to-text) are wrapped in a transcription_span()
- Audio outputs (text-to-speech) are wrapped in a speech_span()
- Related audio spans may be parented under a speech_group_span()

By default, the trace is named "Agent workflow". You can set this name if you use trace, or you can configure the name and other properties with the RunConfig.

In addition, you can set up custom trace processors to push traces to other destinations (as a replacement, or secondary destination).

#### Higher level traces

Sometimes, you might want multiple calls to run() to be part of a single trace. You can do this by wrapping the entire code in a trace().

```python
from agents import Agent, Runner, trace

async def main():
    agent = Agent(name="Joke generator", instructions="Tell funny jokes.")

    with trace("Joke workflow"): 
        first_result = await Runner.run(agent, "Tell me a joke")
        second_result = await Runner.run(agent, f"Rate this joke: {first_result.final_output}")
        print(f"Joke: {first_result.final_output}")
        print(f"Rating: {second_result.final_output}")
```

#### Creating traces

You can use the trace() function to create a trace. Traces need to be started and finished. You have two options to do so:

- Recommended: use the trace as a context manager, i.e. with trace(...) as my_trace. This will automatically start and end the trace at the right time.
- You can also manually call trace.start() and trace.finish().

The current trace is tracked via a Python contextvar. This means that it works with concurrency automatically. If you manually start/end a trace, you'll need to pass mark_as_current and reset_current to start()/finish() to update the current trace.

#### Creating spans

You can use the various *_span() methods to create a span. In general, you don't need to manually create spans. A custom_span() function is available for tracking custom span information.

Spans are automatically part of the current trace, and are nested under the nearest current span, which is tracked via a Python contextvar.

#### Sensitive data

Certain spans may capture potentially sensitive data.

The generation_span() stores the inputs/outputs of the LLM generation, and function_span() stores the inputs/outputs of function calls. These may contain sensitive data, so you can disable capturing that data via RunConfig.trace_include_sensitive_data.

Similarly, Audio spans include base64-encoded PCM data for input and output audio by default. You can disable capturing this audio data by configuring VoicePipelineConfig.trace_include_sensitive_audio_data.

#### Custom tracing processors

The high level architecture for tracing is:

- At initialization, we create a global TraceProvider, which is responsible for creating traces.
- We configure the TraceProvider with a BatchTraceProcessor that sends traces/spans in batches to a BackendSpanExporter, which exports the spans and traces to the OpenAI backend in batches.

To customize this default setup, to send traces to alternative or additional backends or modifying exporter behavior, you have two options:

- add_trace_processor() lets you add an additional trace processor that will receive traces and spans as they are ready. This lets you do your own processing in addition to sending traces to OpenAI's backend.
- set_trace_processors() lets you replace the default processors with your own trace processors. This means traces will not be sent to the OpenAI backend unless you include a TracingProcessor that does so.

#### External tracing processors list

- Weights & Biases
- Arize-Phoenix
- Future AGI
- MLflow (self-hosted/OSS
- MLflow (Databricks hosted
- Braintrust
- Pydantic Logfire
- AgentOps
- Scorecard
- Keywords AI
- LangSmith
- Maxim AI
- Comet Opik
- Langfuse
- Langtrace
- Okahu-Monocle
- Galileo
- Portkey AI
- LangDB AI

---

## Context management

Context is an overloaded term. There are two main classes of context you might care about:

- Context available locally to your code: this is data and dependencies you might need when tool functions run, during callbacks like on_handoff, in lifecycle hooks, etc.
- Context available to LLMs: this is data the LLM sees when generating a response.

### Local context

This is represented via the RunContextWrapper class and the context property within it. The way this works is:

- You create any Python object you want. A common pattern is to use a dataclass or a Pydantic object.
- You pass that object to the various run methods (e.g. Runner.run(..., **context=whatever**)).
- All your tool calls, lifecycle hooks etc will be passed a wrapper object, RunContextWrapper[T], where T represents your context object type which you can access via wrapper.context.

The most important thing to be aware of: every agent, tool function, lifecycle etc for a given agent run must use the same type of context.

You can use the context for things like:

- Contextual data for your run (e.g. things like a username/uid or other information about the user)
- Dependencies (e.g. logger objects, data fetchers, etc)
- Helper functions

> **Note:** The context object is not sent to the LLM. It is purely a local object that you can read from, write to and call methods on it.

```python
import asyncio
from dataclasses import dataclass

from agents import Agent, RunContextWrapper, Runner, function_tool

@dataclass
class UserInfo:  
    name: str
    uid: int

@function_tool
async def fetch_user_age(wrapper: RunContextWrapper[UserInfo]) -> str:  
    """Fetch the age of the user. Call this function to get user's age information."""
    return f"The user {wrapper.context.name} is 47 years old"

async def main():
    user_info = UserInfo(name="John", uid=123)

    agent = Agent[UserInfo](  
        name="Assistant",
        tools=[fetch_user_age],
    )

    result = await Runner.run(  
        starting_agent=agent,
        input="What is the age of the user?",
        context=user_info,
    )

    print(result.final_output)  
    # The user John is 47 years old.

if __name__ == "__main__":
    asyncio.run(main())
```

---

### Agent/LLM context

When an LLM is called, the only data it can see is from the conversation history. This means that if you want to make some new data available to the LLM, you must do it in a way that makes it available in that history. There are a few ways to do this:

- You can add it to the Agent instructions. This is also known as a "system prompt" or "developer message". System prompts can be static strings, or they can be dynamic functions that receive the context and output a string. This is a common tactic for information that is always useful (for example, the user's name or the current date).
- Add it to the input when calling the Runner.run functions. This is similar to the instructions tactic, but allows you to have messages that are lower in the chain of command.
- Expose it via function tools. This is useful for on-demand context - the LLM decides when it needs some data, and can call the tool to fetch that data.
- Use retrieval or web search. These are special tools that are able to fetch relevant data from files or databases (retrieval), or from the web (web search). This is useful for "grounding" the response in relevant contextual data.

---

## Guardrails

Guardrails run in parallel to your agents, enabling you to do checks and validations of user input. For example, imagine you have an agent that uses a very smart (and hence slow/expensive) model to help with customer requests. You wouldn't want malicious users to ask the model to help them with their math homework. So, you can run a guardrail with a fast/cheap model. If the guardrail detects malicious usage, it can immediately raise an error, which stops the expensive model from running and saves you time/money.

There are two kinds of guardrails:

- Input guardrails run on the initial user input
- Output guardrails run on the final agent output

### Input guardrails

Input guardrails run in 3 steps:

1. First, the guardrail receives the same input passed to the agent.
2. Next, the guardrail function runs to produce a GuardrailFunctionOutput, which is then wrapped in an InputGuardrailResult
3. Finally, we check if .tripwire_triggered is true. If true, an InputGuardrailTripwireTriggered exception is raised, so you can appropriately respond to the user or handle the exception.

> **Note:** Input guardrails are intended to run on user input, so an agent's guardrails only run if the agent is the first agent. You might wonder, why is the guardrails property on the agent instead of passed to Runner.run? It's because guardrails tend to be related to the actual Agent - you'd run different guardrails for different agents, so colocating the code is useful for readability.

---

### Output guardrails

Output guardrails run in 3 steps:

1. First, the guardrail receives the output produced by the agent.
2. Next, the guardrail function runs to produce a GuardrailFunctionOutput, which is then wrapped in an OutputGuardrailResult
3. Finally, we check if .tripwire_triggered is true. If true, an OutputGuardrailTripwireTriggered exception is raised, so you can appropriately respond to the user or handle the exception.

> **Note:** Output guardrails are intended to run on the final agent output, so an agent's guardrails only run if the agent is the last agent. Similar to the input guardrails, we do this because guardrails tend to be related to the actual Agent - you'd run different guardrails for different agents, so colocating the code is useful for readability.

---

### Tripwires

If the input or output fails the guardrail, the Guardrail can signal this with a tripwire. As soon as we see a guardrail that has triggered the tripwires, we immediately raise a {Input,Output}GuardrailTripwireTriggered exception and halt the Agent execution.

---

### Implementing a guardrail

You need to provide a function that receives input, and returns a GuardrailFunctionOutput. In this example, we'll do this by running an Agent under the hood.

```python
from pydantic import BaseModel
from agents import (
    Agent,
    GuardrailFunctionOutput,
    InputGuardrailTripwireTriggered,
    RunContextWrapper,
    Runner,
    TResponseInputItem,
    input_guardrail,
)

class MathHomeworkOutput(BaseModel):
    is_math_homework: bool
    reasoning: str

guardrail_agent = Agent( 
    name="Guardrail check",
    instructions="Check if the user is asking you to do their math homework.",
    output_type=MathHomeworkOutput,
)

@input_guardrail
async def math_guardrail( 
    ctx: RunContextWrapper[None], agent: Agent, input: str | list[TResponseInputItem]
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, input, context=ctx.context)

    return GuardrailFunctionOutput(
        output_info=result.final_output, 
        tripwire_triggered=result.final_output.is_math_homework,
    )

agent = Agent(  
    name="Customer support agent",
    instructions="You are a customer support agent. You help customers with their questions.",
    input_guardrails=[math_guardrail],
)

async def main():
    # This should trip the guardrail
    try:
        await Runner.run(agent, "Hello, can you help me solve for x: 2x + 3 = 11?")
        print("Guardrail didn't trip - this is unexpected")

    except InputGuardrailTripwireTriggered:
        print("Math homework guardrail tripped")
```

Output guardrails are similar.

```python
from pydantic import BaseModel
from agents import (
    Agent,
    GuardrailFunctionOutput,
    OutputGuardrailTripwireTriggered,
    RunContextWrapper,
    Runner,
    output_guardrail,
)
class MessageOutput(BaseModel): 
    response: str

class MathOutput(BaseModel): 
    reasoning: str
    is_math: bool

guardrail_agent = Agent(
    name="Guardrail check",
    instructions="Check if the output includes any math.",
    output_type=MathOutput,
)

@output_guardrail
async def math_guardrail(  
    ctx: RunContextWrapper, agent: Agent, output: MessageOutput
) -> GuardrailFunctionOutput:
    result = await Runner.run(guardrail_agent, output.response, context=ctx.context)

    return GuardrailFunctionOutput(
        output_info=result.final_output,
        tripwire_triggered=result.final_output.is_math,
    )

agent = Agent( 
    name="Customer support agent",
    instructions="You are a customer support agent. You help customers with their questions.",
    output_guardrails=[math_guardrail],
    output_type=MessageOutput,
)

async def main():
    # This should trip the guardrail
    try:
        await Runner.run(agent, "Hello, can you help me solve for x: 2x + 3 = 11?")
        print("Guardrail didn't trip - this is unexpected")

    except OutputGuardrailTripwireTriggered:
        print("Math output guardrail tripped")
```

---

## Orchestrating multiple agents

Orchestration refers to the flow of agents in your app. Which agents run, in what order, and how do they decide what happens next? There are two main ways to orchestrate agents:

- Allowing the LLM to make decisions: this uses the intelligence of an LLM to plan, reason, and decide on what steps to take based on that.
- Orchestrating via code: determining the flow of agents via your code.

You can mix and match these patterns. Each has their own tradeoffs, described below.

### Orchestrating via LLM

An agent is an LLM equipped with instructions, tools and handoffs. This means that given an open-ended task, the LLM can autonomously plan how it will tackle the task, using tools to take actions and acquire data, and using handoffs to delegate tasks to sub-agents. For example, a research agent could be equipped with tools like:

- Web search to find information online
- File search and retrieval to search through proprietary data and connections
- Computer use to take actions on a computer
- Code execution to do data analysis
- Handoffs to specialized agents that are great at planning, report writing and more.

This pattern is great when the task is open-ended and you want to rely on the intelligence of an LLM. The most important tactics here are:

- Invest in good prompts. Make it clear what tools are available, how to use them, and what parameters it must operate within.
- Monitor your app and iterate on it. See where things go wrong, and iterate on your prompts.
- Allow the agent to introspect and improve. For example, run it in a loop, and let it critique itself; or, provide error messages and let it improve.
- Have specialized agents that excel in one task, rather than having a general purpose agent that is expected to be good at anything.
- Invest in evals. This lets you train your agents to improve and get better at tasks.

### Orchestrating via code

While orchestrating via LLM is powerful, orchestrating via code makes tasks more deterministic and predictable, in terms of speed, cost and performance. Common patterns here are:

- Using structured outputs to generate well formed data that you can inspect with your code. For example, you might ask an agent to classify the task into a few categories, and then pick the next agent based on the category.
- Chaining multiple agents by transforming the output of one into the input of the next. You can decompose a task like writing a blog post into a series of steps - do research, write an outline, write the blog post, critique it, and then improve it.
- Running the agent that performs the task in a while loop with an agent that evaluates and provides feedback, until the evaluator says the output passes certain criteria.
- Running multiple agents in parallel, e.g. via Python primitives like asyncio.gather. This is useful for speed when you have multiple tasks that don't depend on each other.

We have a number of examples in examples/agent_patterns.

---

## Models

The Agents SDK comes with out-of-the-box support for OpenAI models in two flavors:

- **Recommended:** the OpenAIResponsesModel, which calls OpenAI APIs using the new Responses API.
- The OpenAIChatCompletionsModel, which calls OpenAI APIs using the Chat Completions API.

### Non-OpenAI models

You can use most other non-OpenAI models via the LiteLLM integration. First, install the litellm dependency group:

```bash
pip install "openai-agents[litellm]"
```

Then, use any of the supported models with the litellm/ prefix:

```python
claude_agent = Agent(model="litellm/anthropic/claude-3-5-sonnet-20240620", ...)
gemini_agent = Agent(model="litellm/gemini/gemini-2.5-flash-preview-04-17", ...)
```

#### Other ways to use non-OpenAI models

You can integrate other LLM providers in 3 more ways (examples here):

- set_default_openai_client is useful in cases where you want to globally use an instance of AsyncOpenAI as the LLM client. This is for cases where the LLM provider has an OpenAI compatible API endpoint, and you can set the base_url and api_key. See a configurable example in examples/model_providers/custom_example_global.py.
- ModelProvider is at the Runner.run level. This lets you say "use a custom model provider for all agents in this run". See a configurable example in examples/model_providers/custom_example_provider.py.
- Agent.model lets you specify the model on a specific Agent instance. This enables you to mix and match different providers for different agents. See a configurable example in examples/model_providers/custom_example_agent.py. An easy way to use most available models is via the LiteLLM integration.

In cases where you do not have an API key from platform.openai.com, we recommend disabling tracing via set_tracing_disabled(), or setting up a different tracing processor.

> **Note:** In these examples, we use the Chat Completions API/model, because most LLM providers don't yet support the Responses API. If your LLM provider does support it, we recommend using Responses.

---

### Mixing and matching models

Within a single workflow, you may want to use different models for each agent. For example, you could use a smaller, faster model for triage, while using a larger, more capable model for complex tasks. When configuring an Agent, you can select a specific model by either:

- Passing the name of a model.
- Passing any model name + a ModelProvider that can map that name to a Model instance.
- Directly providing a Model implementation.

> **Note:** While our SDK supports both the OpenAIResponsesModel and the OpenAIChatCompletionsModel shapes, we recommend using a single model shape for each workflow because the two shapes support a different set of features and tools. If your workflow requires mixing and matching model shapes, make sure that all the features you're using are available on both.

```python
from agents import Agent, Runner, AsyncOpenAI, OpenAIChatCompletionsModel
import asyncio

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
    model="o3-mini", 
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
    model=OpenAIChatCompletionsModel( 
        model="gpt-4o",
        openai_client=AsyncOpenAI()
    ),
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
    model="gpt-3.5-turbo",
)

async def main():
    result = await Runner.run(triage_agent, input="Hola, ¿cómo estás?")
    print(result.final_output)
```

When you want to further configure the model used for an agent, you can pass ModelSettings, which provides optional model configuration parameters such as temperature.

```python
from agents import Agent, ModelSettings

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
    model="gpt-4o",
    model_settings=ModelSettings(temperature=0.1),
)
```

Also, when you use OpenAI's Responses API, there are a few other optional parameters (e.g., user, service_tier, and so on). If they are not available at the top level, you can use extra_args to pass them as well.

```python
from agents import Agent, ModelSettings

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
    model="gpt-4o",
    model_settings=ModelSettings(
        temperature=0.1,
        extra_args={"service_tier": "flex", "user": "user_12345"},
    ),
)
```

#### Common issues with using other LLM providers

##### Tracing client error 401

If you get errors related to tracing, this is because traces are uploaded to OpenAI servers, and you don't have an OpenAI API key. You have three options to resolve this:

- Disable tracing entirely: set_tracing_disabled(True).
- Set an OpenAI key for tracing: set_tracing_export_api_key(...). This API key will only be used for uploading traces, and must be from platform.openai.com.
- Use a non-OpenAI trace processor. See the tracing docs.

##### Responses API support

The SDK uses the Responses API by default, but most other LLM providers don't yet support it. You may see 404s or similar issues as a result. To resolve, you have two options:

- Call set_default_openai_api("chat_completions"). This works if you are setting OPENAI_API_KEY and OPENAI_BASE_URL via environment vars.
- Use OpenAIChatCompletionsModel. There are examples here.

##### Structured outputs support

Some model providers don't have support for structured outputs. This sometimes results in an error that looks something like this:

```
BadRequestError: Error code: 400 - {'error': {'message': "'response_format.type' : value is not one of the allowed values ['text','json_object']", 'type': 'invalid_request_error'}}
```

This is a shortcoming of some model providers - they support JSON outputs, but don't allow you to specify the json_schema to use for the output. We are working on a fix for this, but we suggest relying on providers that do have support for JSON schema output, because otherwise your app will often break because of malformed JSON.

##### Mixing models across providers

You need to be aware of feature differences between model providers, or you may run into errors. For example, OpenAI supports structured outputs, multimodal input, and hosted file search and web search, but many other providers don't support these features. Be aware of these limitations:

- Don't send unsupported tools to providers that don't understand them
- Filter out multimodal inputs before calling models that are text-only
- Be aware that providers that don't support structured JSON outputs will occasionally produce invalid JSON.

---

## Using any model via LiteLLM

> **Note:** The LiteLLM integration is in beta. You may run into issues with some model providers, especially smaller ones. Please report any issues via Github issues and we'll fix quickly.

LiteLLM is a library that allows you to use 100+ models via a single interface. We've added a LiteLLM integration to allow you to use any AI model in the Agents SDK.

### Setup

You'll need to ensure litellm is available. You can do this by installing the optional litellm dependency group:

```bash
pip install "openai-agents[litellm]"
```

Once done, you can use LitellmModel in any agent.

### Example

This is a fully working example. When you run it, you'll be prompted for a model name and API key. For example, you could enter:

- openai/gpt-4.1 for the model, and your OpenAI API key
- anthropic/claude-3-5-sonnet-20240620 for the model, and your Anthropic API key
- etc

For a full list of models supported in LiteLLM, see the litellm providers docs.

```python
from __future__ import annotations

import asyncio

from agents import Agent, Runner, function_tool, set_tracing_disabled
from agents.extensions.models.litellm_model import LitellmModel

@function_tool
def get_weather(city: str):
    print(f"[debug] getting weather for {city}")
    return f"The weather in {city} is sunny."

async def main(model: str, api_key: str):
    agent = Agent(
        name="Assistant",
        instructions="You only respond in haikus.",
        model=LitellmModel(model=model, api_key=api_key),
        tools=[get_weather],
    )

    result = await Runner.run(agent, "What's the weather in Tokyo?")
    print(result.final_output)

if __name__ == "__main__":
    # First try to get model/api key from args
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, required=False)
    parser.add_argument("--api-key", type=str, required=False)
    args = parser.parse_args()

    model = args.model
    if not model:
        model = input("Enter a model name for Litellm: ")

    api_key = args.api_key
    if not api_key:
        api_key = input("Enter an API key for Litellm: ")

    asyncio.run(main(model, api_key))
```

---

## Configuring the SDK

### API keys and clients

By default, the SDK looks for the OPENAI_API_KEY environment variable for LLM requests and tracing, as soon as it is imported. If you are unable to set that environment variable before your app starts, you can use the set_default_openai_key() function to set the key.

```python
from agents import set_default_openai_key

set_default_openai_key("sk-...")
```

Alternatively, you can also configure an OpenAI client to be used. By default, the SDK creates an AsyncOpenAI instance, using the API key from the environment variable or the default key set above. You can change this by using the set_default_openai_client() function.

```python
from openai import AsyncOpenAI
from agents import set_default_openai_client

custom_client = AsyncOpenAI(base_url="...", api_key="...")
set_default_openai_client(custom_client)
```

Finally, you can also customize the OpenAI API that is used. By default, we use the OpenAI Responses API. You can override this to use the Chat Completions API by using the set_default_openai_api() function.

```python
from agents import set_default_openai_api

set_default_openai_api("chat_completions")
```

### Tracing

Tracing is enabled by default. It uses the OpenAI API keys from the section above by default (i.e. the environment variable or the default key you set). You can specifically set the API key used for tracing by using the set_tracing_export_api_key function.

```python
from agents import set_tracing_export_api_key

set_tracing_export_api_key("sk-...")
```

You can also disable tracing entirely by using the set_tracing_disabled() function.

```python
from agents import set_tracing_disabled

set_tracing_disabled(True)
```

### Debug logging

The SDK has two Python loggers without any handlers set. By default, this means that warnings and errors are sent to stdout, but other logs are suppressed.

To enable verbose logging, use the enable_verbose_stdout_logging() function.

```python
from agents import enable_verbose_stdout_logging

enable_verbose_stdout_logging()
```

Alternatively, you can customize the logs by adding handlers, filters, formatters, etc. You can read more in the Python logging guide.

```python
import logging

logger = logging.getLogger("openai.agents") # or openai.agents.tracing for the Tracing logger

# To make all logs show up
logger.setLevel(logging.DEBUG)
# To make info and above show up
logger.setLevel(logging.INFO)
# To make warning and above show up
logger.setLevel(logging.WARNING)
# etc

# You can customize this as needed, but this will output to `stderr` by default
logger.addHandler(logging.StreamHandler())
```

#### Sensitive data in logs

Certain logs may contain sensitive data (for example, user data). If you want to disable this data from being logged, set the following environment variables.

To disable logging LLM inputs and outputs:

```bash
export OPENAI_AGENTS_DONT_LOG_MODEL_DATA=1
```

To disable logging tool inputs and outputs:

```bash
export OPENAI_AGENTS_DONT_LOG_TOOL_DATA=1
```

---

## Agent Visualization

Agent visualization allows you to generate a structured graphical representation of agents and their relationships using Graphviz. This is useful for understanding how agents, tools, and handoffs interact within an application.

### Installation

Install the optional viz dependency group:

```bash
pip install "openai-agents[viz]"
```

### Generating a Graph

You can generate an agent visualization using the draw_graph function. This function creates a directed graph where:

- Agents are represented as yellow boxes.
- Tools are represented as green ellipses.
- Handoffs are directed edges from one agent to another.

#### Example Usage

```python
from agents import Agent, function_tool
from agents.extensions.visualization import draw_graph

@function_tool
def get_weather(city: str) -> str:
    return f"The weather in {city} is sunny."

spanish_agent = Agent(
    name="Spanish agent",
    instructions="You only speak Spanish.",
)

english_agent = Agent(
    name="English agent",
    instructions="You only speak English",
)

triage_agent = Agent(
    name="Triage agent",
    instructions="Handoff to the appropriate agent based on the language of the request.",
    handoffs=[spanish_agent, english_agent],
    tools=[get_weather],
)

draw_graph(triage_agent)
```

#### Understanding the Visualization

The generated graph includes:

- A start node (__start__) indicating the entry point.
- Agents represented as rectangles with yellow fill.
- Tools represented as ellipses with green fill.
- Directed edges indicating interactions:
    - Solid arrows for agent-to-agent handoffs.
    - Dotted arrows for tool invocations.
- An end node (__end__) indicating where execution terminates.

#### Customizing the Graph

##### Showing the Graph

By default, draw_graph displays the graph inline. To show the graph in a separate window, write the following:

```python
draw_graph(triage_agent).view()
```

##### Saving the Graph

By default, draw_graph displays the graph inline. To save it as a file, specify a filename:

```python
draw_graph(triage_agent, filename="agent_graph")
```

This will generate agent_graph.png in the working directory.

---

## Release process/changelog

The project follows a slightly modified version of semantic versioning using the form 0.Y.Z. The leading 0 indicates the SDK is still evolving rapidly. Increment the components as follows:

### Minor (Y) versions

We will increase minor versions Y for breaking changes to any public interfaces that are not marked as beta. For example, going from 0.0.x to 0.1.x might include breaking changes.

If you don't want breaking changes, we recommend pinning to 0.0.x versions in your project.

### Patch (Z) versions

We will increment Z for non-breaking changes:

- Bug fixes
- New features
- Changes to private interfaces
- Updates to beta features

#### Breaking change changelog

##### 0.2.0

In this version, a few places that used to take Agent as an arg, now take AgentBase as an arg instead. For example, the list_tools() call in MCP servers. This is a purely typing change, you will still receive Agent objects. To update, just fix type errors by replacing Agent with AgentBase.

##### 0.1.0

In this version, MCPServer.list_tools() has two new params: run_context and agent. You'll need to add these params to any classes that subclass MCPServer.