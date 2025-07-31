exceptions.py — Exception and Error Handling for OpenAI Agents
File Overview
This file defines the core exception classes and error diagnostics for agent execution in OpenAI-style agent systems. It includes custom exceptions for turn limits, model misbehavior, user errors, and guardrail violations, as well as a RunErrorDetails dataclass for collecting rich error context. These constructs enable robust error handling, debugging, and reporting throughout the agent lifecycle.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
RunErrorDetails	Collects detailed information about an agent run when an exception occurs.
AgentsException	Base class for all agent-specific exceptions.
MaxTurnsExceeded	Raised when the maximum number of agent turns is exceeded.
ModelBehaviorError	Raised when the model behaves unexpectedly (e.g., invalid tool call, malformed JSON).
UserError	Raised when the user misuses the SDK or provides invalid input.
InputGuardrailTripwireTriggered	Raised when an input guardrail tripwire is triggered.
OutputGuardrailTripwireTriggered	Raised when an output guardrail tripwire is triggered.
Annotated Code Snippets
1. Run Error Details
@dataclass
class RunErrorDetails:
    input: str | list[TResponseInputItem]
    new_items: list[RunItem]
    raw_responses: list[ModelResponse]
    last_agent: Agent[Any]
    context_wrapper: RunContextWrapper[Any]
    input_guardrail_results: list[InputGuardrailResult]
    output_guardrail_results: list[OutputGuardrailResult]

    def __str__(self) -> str:
        return pretty_print_run_error_details(self)
Explanation:
Captures all relevant information about an agent run at the time of an exception, including input, outputs, responses, agent state, context, and guardrail results. The __str__ method provides a human-readable summary for debugging.

2. Base Exception Class
class AgentsException(Exception):
    run_data: RunErrorDetails | None

    def __init__(self, *args: object) -> None:
        super().__init__(*args)
        self.run_data = None
Explanation:
All agent-specific exceptions inherit from this base class. It can optionally store RunErrorDetails for enhanced error reporting.

3. Specific Exception Types
class MaxTurnsExceeded(AgentsException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class ModelBehaviorError(AgentsException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)

class UserError(AgentsException):
    def __init__(self, message: str):
        self.message = message
        super().__init__(message)
Explanation:

MaxTurnsExceeded: Raised when the agent exceeds a configured turn limit.
ModelBehaviorError: Raised for unexpected model actions (e.g., invalid tool call, malformed output).
UserError: Raised for user mistakes in SDK usage or input.
4. Guardrail Tripwire Exceptions
class InputGuardrailTripwireTriggered(AgentsException):
    guardrail_result: InputGuardrailResult

    def __init__(self, guardrail_result: InputGuardrailResult):
        self.guardrail_result = guardrail_result
        super().__init__(
            f"Guardrail {guardrail_result.guardrail.__class__.__name__} triggered tripwire"
        )

class OutputGuardrailTripwireTriggered(AgentsException):
    guardrail_result: OutputGuardrailResult

    def __init__(self, guardrail_result: OutputGuardrailResult):
        self.guardrail_result = guardrail_result
        super().__init__(
            f"Guardrail {guardrail_result.guardrail.__class__.__name__} triggered tripwire"
        )
Explanation:

Raised when an input or output guardrail detects a violation (tripwire).
The exception carries the guardrail result for further inspection.
Function/Class Reference
RunErrorDetails
@dataclass
class RunErrorDetails:
    input: str | list[TResponseInputItem]
    new_items: list[RunItem]
    raw_responses: list[ModelResponse]
    last_agent: Agent[Any]
    context_wrapper: RunContextWrapper[Any]
    input_guardrail_results: list[InputGuardrailResult]
    output_guardrail_results: list[OutputGuardrailResult]

    def __str__(self) -> str
Purpose: Captures all relevant run context for debugging agent errors.
Parameters: See above.
Returns: Pretty-printed string for diagnostics.
AgentsException and Subclasses
Exception Class	Purpose	Extra Attributes
AgentsException	Base for all agent exceptions	run_data (optional)
MaxTurnsExceeded	Raised when turn limit is hit	message
ModelBehaviorError	Raised for unexpected model behavior	message
UserError	Raised for user mistakes	message
InputGuardrailTripwireTriggered	Raised for input guardrail violations	guardrail_result
OutputGuardrailTripwireTriggered	Raised for output guardrail violations	guardrail_result
Example Usage
1. Raising a Model Behavior Error
if invalid_tool_call:
    raise ModelBehaviorError("The model called a tool that does not exist.")
2. Handling Guardrail Violations
try:
    agent.run(input)
except InputGuardrailTripwireTriggered as e:
    print("Input guardrail tripped:", e.guardrail_result)
3. Attaching Run Data to Exceptions
try:
    agent.run(input)
except AgentsException as e:
    e.run_data = RunErrorDetails(...)
    print(str(e.run_data))
Tips, Gotchas, and FAQ
Always attach RunErrorDetails to exceptions when possible for better diagnostics.
Guardrail exceptions provide direct access to the triggering guardrail's result for custom handling or logging.
Use specific exception types to distinguish between user errors, model errors, and system errors in your agent orchestration code.
Related Files
agent.py
: Agent definitions that may raise these exceptions.
guardrail.py
: Guardrail logic and result types.
items.py
: Model response and run item definitions.
run_context.py
: Run context wrapper for agent execution.
For further details, see the source code and related modules.