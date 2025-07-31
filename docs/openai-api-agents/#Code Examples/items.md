items.py — Agent Run Item and Model Response Structures for OpenAI Agents
File Overview
This file defines the core data structures and utility methods for representing, processing, and extracting information from the input and output items generated during agent execution in OpenAI-style agent systems. It includes a hierarchy of RunItemBase subclasses for different item types (messages, tool calls, handoffs, reasoning, MCP interactions), the ModelResponse class for model outputs, and the ItemHelpers utility class for common item manipulations. The design is tightly integrated with the OpenAI Responses API and supports advanced agent features such as tool-calling, handoffs, and multi-agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunItemBase	Abstract base for all run items (input/output, tool calls, etc.).
MessageOutputItem	Represents a message from the LLM.
HandoffCallItem	Represents a tool call for a handoff between agents.
HandoffOutputItem	Represents the output of a handoff.
ToolCallItem	Represents a tool call (function, computer, file search, etc.).
ToolCallOutputItem	Represents the output of a tool call.
ReasoningItem	Represents a reasoning step/item.
MCPListToolsItem	Represents a call to an MCP server to list tools.
MCPApprovalRequestItem	Represents a request for MCP approval.
MCPApprovalResponseItem	Represents a response to an MCP approval request.
RunItem	Type alias for any of the above run item types.
ModelResponse	Represents a model's output, including usage and response ID.
ItemHelpers	Utility class for extracting and manipulating run items and model responses.
Annotated Code Snippets
1. Run Item Base and Subclasses
@dataclass
class RunItemBase(Generic[T], abc.ABC):
    agent: Agent[Any]
    raw_item: T

    def to_input_item(self) -> TResponseInputItem:
        ...
Explanation:
Abstract base for all run items, holding a reference to the agent and the raw item (input or output). The to_input_item method converts the item to a format suitable for model input.

2. ModelResponse Structure
@pydantic.dataclasses.dataclass
class ModelResponse:
    output: list[TResponseOutputItem]
    usage: Usage
    response_id: str | None

    def to_input_items(self) -> list[TResponseInputItem]:
        ...
Explanation:
Represents a model's output, including all output items, usage statistics, and an optional response ID. The to_input_items method converts outputs to input items for further processing.

3. ItemHelpers Utility Methods
class ItemHelpers:
    @classmethod
    def extract_last_content(cls, message: TResponseOutputItem) -> str: ...
    @classmethod
    def extract_last_text(cls, message: TResponseOutputItem) -> str | None: ...
    @classmethod
    def input_to_new_input_list(cls, input: str | list[TResponseInputItem]) -> list[TResponseInputItem]: ...
    @classmethod
    def text_message_outputs(cls, items: list[RunItem]) -> str: ...
    @classmethod
    def text_message_output(cls, message: MessageOutputItem) -> str: ...
    @classmethod
    def tool_call_output_item(cls, tool_call: ResponseFunctionToolCall, output: str) -> FunctionCallOutput: ...
Explanation:
Provides static methods for extracting text, converting input formats, and constructing tool call outputs from run items and model responses.

Function/Class Reference
RunItemBase and Subclasses
Class Name	Purpose/Description
RunItemBase	Abstract base for all run items.
MessageOutputItem	Represents a message from the LLM.
HandoffCallItem	Represents a handoff tool call.
HandoffOutputItem	Represents the output of a handoff, with source and target agents.
ToolCallItem	Represents a tool call (function, computer, etc.).
ToolCallOutputItem	Represents the output of a tool call.
ReasoningItem	Represents a reasoning step/item.
MCPListToolsItem	Represents a call to an MCP server to list tools.
MCPApprovalRequestItem	Represents a request for MCP approval.
MCPApprovalResponseItem	Represents a response to an MCP approval request.
ModelResponse
@pydantic.dataclasses.dataclass
class ModelResponse:
    output: list[TResponseOutputItem]
    usage: Usage
    response_id: str | None

    def to_input_items(self) -> list[TResponseInputItem]
Purpose: Holds all outputs, usage, and response ID from a model call.
Method: to_input_items converts outputs to input items for further processing.
ItemHelpers
Method Name	Purpose/Description
extract_last_content	Extracts the last text or refusal from a message output item.
extract_last_text	Extracts the last text content (ignores refusals).
input_to_new_input_list	Converts a string or list of input items to a new list of input items.
text_message_outputs	Concatenates all text content from a list of message output items.
text_message_output	Extracts all text content from a single message output item.
tool_call_output_item	Creates a tool call output item from a tool call and its output.
Example Usage
1. Extracting Text from Model Outputs
# Assume model_response is a ModelResponse instance
text_outputs = ItemHelpers.text_message_outputs(model_response.output)
2. Converting Output Items to Input Items
input_items = model_response.to_input_items()
3. Creating a Tool Call Output Item
tool_call_output = ItemHelpers.tool_call_output_item(tool_call, "result string")
4. Handling Handoff Output Items
handoff_item = HandoffOutputItem(
    agent=source_agent,
    raw_item=input_item,
    source_agent=source_agent,
    target_agent=target_agent
)
Tips, Gotchas, and FAQ
Type Safety:
All run items are strongly typed and correspond to OpenAI Responses API types for robust integration.

Deep Copy for Inputs:
input_to_new_input_list uses copy.deepcopy to avoid mutating original input data.

Text Extraction:
Use extract_last_content or extract_last_text to handle messages with refusals or multiple content types.

Custom Run Items:
Extend RunItemBase if you need to track additional item types in your agent system.

Related Files
agent.py
: Agent classes that generate and consume run items.
usage.py
: Usage tracking for model responses.
exceptions.py
: Exception types for error handling.
run_context.py
: Run context wrapper for agent execution.
For further details, see the source code and related modules.