1. openai_responses.py — OpenAI Responses API Model Integration
File Overview
Implements the Model interface for the OpenAI Responses API, supporting both batch and streaming responses, tool-calling, handoffs, schema conversion, and robust error/tracing support.

Key Classes
OpenAIResponsesModel
Purpose: Implements the Model interface for OpenAI’s Responses API.
Key Methods:
get_response(...): Calls the API and returns a ModelResponse.
stream_response(...): Streams response events as they are generated.
Features:
Handles tool-calling, handoffs, and output schema conversion.
Supports tracing and error handling.
Converter
Purpose: Helper class for converting agent tools, handoffs, and output schemas to OpenAI API-compatible formats.
Example Usage
model = OpenAIResponsesModel(model="gpt-4o", openai_client=AsyncOpenAI(api_key="sk-..."))
response = await model.get_response(
    system_instructions="You are a helpful assistant.",
    input="Hello!",
    model_settings=...,
    tools=[...],
    output_schema=...,
    handoffs=[...],
    tracing=ModelTracing.ENABLED,
    previous_response_id=None,
    prompt=None,
)
2. openai_provider.py — OpenAI Model Provider
File Overview
Defines the OpenAIProvider class, which implements the ModelProvider interface for OpenAI models. Manages API key, client, and model selection (including Responses API vs. Chat Completions).

Key Classes
OpenAIProvider
Purpose: Looks up and returns Model instances for OpenAI models.
Key Methods:
get_model(model_name): Returns a model instance for the given name.
shared_http_client()
Purpose: Returns a shared HTTP client for efficient connection pooling.
Example Usage
provider = OpenAIProvider(api_key="sk-...")
model = provider.get_model("gpt-4o")
3. interface.py — Model and Provider Abstractions
File Overview
Defines abstract base classes for model and model provider interfaces, including tracing configuration and streaming support.

Key Classes
ModelTracing (enum)
Purpose: Configures tracing (disabled, enabled, enabled without data).
Model (abstract base class)
Purpose: Interface for LLM models.
Key Methods: get_response(...), stream_response(...)
ModelProvider (abstract base class)
Purpose: Interface for model providers.
Key Method: get_model(model_name)
4. openai_shared.py — OpenAI Client and API Key Management
File Overview
Manages global/shared OpenAI client and API key, as well as default settings for using the Responses API.

Key Functions
set_default_openai_key(key), get_default_openai_key()
set_default_openai_client(client), get_default_openai_client()
set_use_responses_by_default(use_responses), get_use_responses_by_default()
Example Usage
from openai import AsyncOpenAI
from .openai_shared import set_default_openai_key, get_default_openai_client

set_default_openai_key("sk-...")
client = get_default_openai_client() or AsyncOpenAI(api_key="sk-...")
5. memory.py — Session and Conversation Memory Management
File Overview
Defines protocols, abstract base classes, and a concrete implementation for session (memory) management, supporting both in-memory and persistent (SQLite) storage.

Key Classes
Session (Protocol)
Purpose: Interface for session/memory implementations.
SessionABC (Abstract Base Class)
Purpose: Abstract base class for session implementations.
SQLiteSession
Purpose: Concrete, thread-safe, async implementation using SQLite.
Key Methods: get_items, add_items, pop_item, clear_session, close
Example Usage
session = SQLiteSession(session_id="user123", db_path="my_sessions.db")
await session.add_items([{"role": "user", "content": "Hello"}])
history = await session.get_items()
await session.clear_session()
session.close()
Related Files
tool.py
: Tool abstractions and types.
agent.py
: Agent and agent orchestration logic.
run.py
: Agent runner logic that uses models and sessions.
items.py
: Defines TResponseInputItem used in session storage.
For further details, see the source code and related modules.