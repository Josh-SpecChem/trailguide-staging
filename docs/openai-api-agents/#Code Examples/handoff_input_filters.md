1. handoff_input_filters.py — Common Handoff Input Filters
File Overview
This file provides utility functions for filtering tool-related items from the input data passed during agent handoffs. This is useful for controlling the context/history that is passed to sub-agents, ensuring that only relevant conversation items are included and tool-call clutter is removed.

Key Functions
remove_all_tools(handoff_input_data: HandoffInputData) -> HandoffInputData
Purpose: Removes all tool-related items (file search, web search, function calls, and their outputs) from the handoff input data.
Parameters:
handoff_input_data: The original input data for the handoff.
Returns:
A new HandoffInputData object with tool items filtered out from history, pre-handoff items, and new items.
Internal Helpers
_remove_tools_from_items(items: tuple[RunItem, ...]) -> tuple[RunItem, ...]
Filters out all tool-related RunItem types.
_remove_tool_types_from_input(items: tuple[TResponseInputItem, ...]) -> tuple[TResponseInputItem, ...]
Filters out all tool-related input items based on their "type" field.
Example Usage
filtered_data = remove_all_tools(handoff_input_data)
Tips
Use this filter when you want to ensure sub-agents receive only conversational context, not tool call history.
2. handoff_prompt_utils.py — Prompt Utilities for Handoff-Aware Agents
File Overview
This file provides a recommended prompt prefix and a utility function to prepend it to agent prompts. This ensures that agents using handoffs have clear, consistent system instructions about the multi-agent environment and handoff mechanics.

Key Constants and Functions
RECOMMENDED_PROMPT_PREFIX
Purpose: A string containing recommended system instructions for agents that use handoffs.
Usage: Prepend this to your agent’s prompt to ensure proper handoff behavior.
prompt_with_handoff_instructions(prompt: str) -> str
Purpose: Prepends the recommended handoff instructions to a given prompt.
Parameters:
prompt: The original agent prompt.
Returns:
The prompt with handoff instructions prepended.
Example Usage
agent_prompt = prompt_with_handoff_instructions("You are a helpful assistant.")
Tips
Always use this or similar instructions for agents that may perform handoffs, to ensure LLMs handle delegation correctly.
3. agent_graphviz.py — Agent Structure Visualization with Graphviz
File Overview
This file provides functions to generate and render a DOT/Graphviz representation of an agent’s structure, including its tools and handoffs. This is useful for debugging, documentation, and understanding complex agent workflows.

Key Functions
get_main_graph(agent: Agent) -> str
Purpose: Generates the main DOT graph structure for the given agent.
Returns: DOT format string.
get_all_nodes(agent: Agent, parent: Agent | None = None, visited: set[str] | None = None) -> str
Purpose: Recursively generates DOT nodes for the agent and its handoffs.
Returns: DOT format string for nodes.
get_all_edges(agent: Agent, parent: Agent | None = None, visited: set[str] | None = None) -> str
Purpose: Recursively generates DOT edges for the agent and its handoffs/tools.
Returns: DOT format string for edges.
draw_graph(agent: Agent, filename: str | None = None) -> graphviz.Source
Purpose: Draws and optionally saves the agent graph as a PNG file.
Parameters:
agent: The agent to visualize.
filename: Optional filename to save the PNG.
Returns: graphviz.Source object.
Example Usage
from agent_graphviz import draw_graph

graph = draw_graph(my_agent, filename="agent_structure")
graph.view()  # Opens the rendered image
Tips
Use this visualization to debug agent handoff/tool relationships and to document your agent architectures.
The graph includes start/end nodes, agent nodes, tool nodes, and handoff relationships.
Related Files
agents.py
: Where agent, tool, and handoff classes are defined.
handoffs.py
: Handoff logic and input data structures.
tool.py
: Tool abstractions and types.
For further details, see the source code and related modules.