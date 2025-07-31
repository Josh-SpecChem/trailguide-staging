1. mcp_server.py — MCP Server Implementations for Tool Integration
File Overview
This file provides abstract and concrete classes for connecting to Model Context Protocol (MCP) servers using various transports (stdio, SSE, streamable HTTP). It manages tool listing, invocation, prompt management, session lifecycle, and supports advanced features like tool filtering and caching.

Key Classes
MCPServer (abstract base class)
Purpose: Defines the interface for MCP servers, including connection management, tool listing, tool invocation, and prompt management.
Key Methods:
connect(), cleanup(): Manage server connection lifecycle.
list_tools(run_context, agent): List available tools.
call_tool(tool_name, arguments): Invoke a tool.
list_prompts(), get_prompt(name, arguments): Prompt management.
_MCPServerWithClientSession (abstract base class)
Purpose: Base for MCP servers using a ClientSession for communication, with support for tool filtering (static/dynamic), caching, and connection management.
Key Features:
Tool filtering via static allow/block lists or dynamic callables.
Tool list caching for performance.
Robust connection and cleanup logic.
MCPServerStdio, MCPServerSse, MCPServerStreamableHttp
Purpose: Concrete implementations for stdio, SSE, and streamable HTTP transports, respectively.
Parameters: Each accepts transport-specific parameters, tool filtering options, and caching configuration.
Key Method: create_streams() for establishing the underlying transport.
Example Usage
server = MCPServerStdio(
    params={"command": "python", "args": ["my_server.py"]},
    cache_tools_list=True,
    tool_filter=create_static_tool_filter(allowed_tool_names=["search", "summarize"])
)
await server.connect()
tools = await server.list_tools(run_context, agent)
result = await server.call_tool("search", {"query": "OpenAI"})
await server.cleanup()
Tips
Use tool filtering to control which tools are exposed to agents, either statically or dynamically.
Enable tool list caching for performance if your server's tool list is stable.
Always call connect() before using the server, and cleanup() when done.
2. mcp_util.py — MCP Utility Functions and Tool Filtering
File Overview
This file provides utility functions for converting MCP tools to agent-compatible tools, invoking MCP tools, and applying static/dynamic tool filters. It also includes helper types and context classes for tool filtering.

Key Classes and Functions
ToolFilterContext
Purpose: Provides context (run context, agent, server name) to dynamic tool filter functions.
ToolFilterCallable, ToolFilterStatic, ToolFilter
Purpose: Type definitions for tool filters:
Callable: Function-based dynamic filtering.
Static: Allow/block list filtering.
Union: Accepts either or None.
create_static_tool_filter(allowed_tool_names=None, blocked_tool_names=None)
Purpose: Convenience function for creating a static tool filter.
MCPUtil
Purpose: Utility class for MCP/Agents SDK interop.
Key Methods:
get_all_function_tools(servers, convert_schemas_to_strict, run_context, agent): Collects all tools from multiple servers, ensuring no name conflicts.
get_function_tools(server, convert_schemas_to_strict, run_context, agent): Collects tools from a single server.
to_function_tool(tool, server, convert_schemas_to_strict): Converts an MCP tool to a FunctionTool.
invoke_mcp_tool(server, tool, context, input_json): Invokes an MCP tool and returns the result as a string.
Example Usage
filter_ctx = ToolFilterContext(run_context, agent, server_name="my_server")
def dynamic_filter(ctx, tool):
    return tool.name.startswith("safe_")

tool_filter = dynamic_filter
server = MCPServerStdio(..., tool_filter=tool_filter)

tools = await MCPUtil.get_all_function_tools([server], True, run_context, agent)
Tips
Use ensure_strict_json_schema to convert tool schemas for OpenAI compatibility.
Dynamic tool filters can use any context (run context, agent, server name) for advanced filtering logic.
invoke_mcp_tool handles JSON parsing, error handling, and output formatting for you.
Related Files
tool.py
: Where FunctionTool and Tool abstractions are defined.
agent.py
: Agent and AgentBase classes.
run_context.py
: Run context wrappers.
exceptions.py
: Custom error types for robust error handling.
For further details, see the source code and related modules.