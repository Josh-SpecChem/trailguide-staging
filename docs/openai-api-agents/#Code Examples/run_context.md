run_context.py — Run Context Wrapper for OpenAI Agents
File Overview
This file defines the RunContextWrapper class, which encapsulates the context object and usage statistics for an agent run in OpenAI-style agent systems. The context object allows you to pass arbitrary state, dependencies, or configuration to tools, callbacks, and hooks, while the usage field tracks resource consumption throughout the run. This wrapper provides a consistent interface for accessing both context and usage data during agent execution.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
RunContextWrapper	Wraps the user-defined context and tracks agent run usage for each agent execution.
Annotated Code Snippet
from dataclasses import dataclass, field
from typing import Any, Generic
from typing_extensions import TypeVar

from .usage import Usage

TContext = TypeVar("TContext", default=Any)

@dataclass
class RunContextWrapper(Generic[TContext]):
    """This wraps the context object that you passed to `Runner.run()`. It also contains
    information about the usage of the agent run so far.

    NOTE: Contexts are not passed to the LLM. They're a way to pass dependencies and data to code
    you implement, like tool functions, callbacks, hooks, etc.
    """

    context: TContext
    """The context object (or None), passed by you to `Runner.run()`"""

    usage: Usage = field(default_factory=Usage)
    """The usage of the agent run so far. For streamed responses, the usage will be stale until the
    last chunk of the stream is processed.
    """
Explanation:

context: Holds the user-defined context object, which can be any type (e.g., dict, custom class, etc.).
usage: Tracks usage statistics (e.g., token counts, API calls) for the agent run.
Function/Class Reference
RunContextWrapper
Purpose: Wraps the context and usage for each agent run.
Fields:
context: The user-defined context object (any type).
usage: Usage statistics for the agent run (see 
usage.py
).
Usage: Passed to tools, hooks, and callbacks to provide access to run-specific state and usage data.
Example Usage
1. Passing Custom Context to an Agent Run
from my_agent_framework import Runner, RunContextWrapper

my_context = {"user_id": "123", "session_data": {}}
result = await Runner.run(my_agent, input="Hello", context=my_context)

# Access context in a tool function
def my_tool(context_wrapper: RunContextWrapper, ...):
    user_id = context_wrapper.context["user_id"]
    ...
2. Tracking Usage
# After the run
print(result.context_wrapper.usage.total_tokens)
Tips, Gotchas, and FAQ
Context is not sent to the LLM:
The context object is for your code only; it is never passed to the language model.

Usage is updated as the run progresses:
For streaming runs, usage statistics may be stale until the final chunk is processed.

Flexible Context Type:
You can use any type for the context (dict, custom class, etc.), depending on your application's needs.

Related Files
usage.py
: Defines the Usage class for tracking resource consumption.
run.py
: Main agent runner that uses RunContextWrapper.
tool.py
: Tool functions often receive the context wrapper as an argument.
lifecycle.py
: Hooks and callbacks receive the context wrapper.
For further details, see the source code and related modules.