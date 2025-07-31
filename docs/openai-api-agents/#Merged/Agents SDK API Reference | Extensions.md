Extensions
Handoff Filters
remove_all_tools
remove_all_tools(
    handoff_input_data: HandoffInputData,
) -> HandoffInputData
Filters out all tool items: file search, web search, and function calls+output.

Source code in src/agents/extensions/handoff_filters.py

Implementation
def remove_all_tools(handoff_input_data: HandoffInputData) -> HandoffInputData:
    """Filters out all tool items: file search, web search and function calls+output."""

    history = handoff_input_data.input_history
    new_items = handoff_input_data.new_items

    filtered_history = (
        _remove_tool_types_from_input(history) if isinstance(history, tuple) else history
    )
    filtered_pre_handoff_items = _remove_tools_from_items(handoff_input_data.pre_handoff_items)
    filtered_new_items = _remove_tools_from_items(new_items)

    return HandoffInputData(
        input_history=filtered_history,
        pre_handoff_items=filtered_pre_handoff_items,
        new_items=filtered_new_items,
    )
Handoff Prompt
RECOMMENDED_PROMPT_PREFIX (module-attribute)
RECOMMENDED_PROMPT_PREFIX = "# System context\nYou are part of a multi-agent system called the Agents SDK, designed to make agent coordination and execution easy. Agents uses two primary abstraction: **Agents** and **Handoffs**. An agent encompasses instructions and tools and can hand off a conversation to another agent when appropriate. Handoffs are achieved by calling a handoff function, generally named `transfer_to_<agent_name>`. Transfers between agents are handled seamlessly in the background; do not mention or draw attention to these transfers in your conversation with the user.\n"
prompt_with_handoff_instructions
prompt_with_handoff_instructions(prompt: str) -> str
Add recommended instructions to the prompt for agents that use handoffs.

Source code in src/agents/extensions/handoff_prompt.py

LiteLLM Models
LitellmModel
Bases: Model

This class enables using any model via LiteLLM. LiteLLM allows you to access OpenAPI, Anthropic, Gemini, Mistral, and many other models. See supported models here: litellm models.

Source code in src/agents/extensions/models/litellm_model.py