guardrail.py — Guardrail Abstractions and Decorators for OpenAI Agents
File Overview
This file defines the core abstractions and decorators for "guardrails"—modular checks that run before or after agent execution to enforce safety, correctness, or business logic in OpenAI-style agent systems. It provides the InputGuardrail and OutputGuardrail classes, result types, and flexible decorators (@input_guardrail, @output_guardrail) for both synchronous and asynchronous validation. Guardrails can halt agent execution (tripwire) or provide additional diagnostics, making them essential for robust, production-grade agent workflows.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
GuardrailFunctionOutput	Output/result of a guardrail function, including tripwire status.
InputGuardrailResult	Result of an input guardrail run.
OutputGuardrailResult	Result of an output guardrail run.
InputGuardrail	Guardrail for validating/checking agent input before execution.
OutputGuardrail	Guardrail for validating/checking agent output after execution.
input_guardrail	Decorator for defining input guardrails (sync or async).
output_guardrail	Decorator for defining output guardrails (sync or async).
Annotated Code Snippets
1. Guardrail Function Output
@dataclass
class GuardrailFunctionOutput:
    output_info: Any
    tripwire_triggered: bool
Explanation:
Encapsulates the result of a guardrail check, including optional diagnostic info and whether the guardrail "tripwire" was triggered (which halts agent execution).

2. Input and Output Guardrail Results
@dataclass
class InputGuardrailResult:
    guardrail: InputGuardrail[Any]
    output: GuardrailFunctionOutput

@dataclass
class OutputGuardrailResult:
    guardrail: OutputGuardrail[Any]
    agent_output: Any
    agent: Agent[Any]
    output: GuardrailFunctionOutput
Explanation:
Wraps the result of running a guardrail, including references to the guardrail, the checked input/output, and the result.

3. InputGuardrail and OutputGuardrail Classes
@dataclass
class InputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], str | list[TResponseInputItem]], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, agent, input, context) -> InputGuardrailResult: ...
    def get_name(self) -> str: ...

@dataclass
class OutputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], Any], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, context, agent, agent_output) -> OutputGuardrailResult: ...
    def get_name(self) -> str: ...
Explanation:

Both classes wrap a guardrail function and provide a standard async run method.
The guardrail function can be synchronous or asynchronous.
The name is used for tracing and diagnostics.
4. Guardrail Decorators
def input_guardrail(func=None, *, name=None):
    # Decorator that transforms a sync or async function into an InputGuardrail
    ...

def output_guardrail(func=None, *, name=None):
    # Decorator that transforms a sync or async function into an OutputGuardrail
    ...
Explanation:

These decorators allow you to define guardrails with or without parentheses.
They support both sync and async functions.
The decorated function is wrapped in the appropriate guardrail class.
Function/Class Reference
GuardrailFunctionOutput
@dataclass
class GuardrailFunctionOutput:
    output_info: Any
    tripwire_triggered: bool
Purpose: Result of a guardrail function, including diagnostics and tripwire status.
InputGuardrail / OutputGuardrail
@dataclass
class InputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], str | list[TResponseInputItem]], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, agent, input, context) -> InputGuardrailResult
    def get_name(self) -> str

@dataclass
class OutputGuardrail(Generic[TContext]):
    guardrail_function: Callable[[RunContextWrapper[TContext], Agent[Any], Any], MaybeAwaitable[GuardrailFunctionOutput]]
    name: str | None = None

    async def run(self, context, agent, agent_output) -> OutputGuardrailResult
    def get_name(self) -> str
Purpose: Encapsulate guardrail logic for input or output validation.
Parameters: See above.
Methods:
run: Executes the guardrail function and returns the result.
get_name: Returns the guardrail's name.
input_guardrail / output_guardrail Decorators
@input_guardrail
def my_guardrail(context, agent, input): ...

@output_guardrail(name="custom_output_guardrail")
async def my_async_output_guardrail(context, agent, output): ...
Purpose: Ergonomic way to define guardrails as decorated functions.
Usage: With or without parentheses; supports sync and async functions.
Example Usage
1. Synchronous Input Guardrail
@input_guardrail
def block_empty_input(context, agent, input):
    if not input:
        return GuardrailFunctionOutput(output_info="Input was empty", tripwire_triggered=True)
    return GuardrailFunctionOutput(output_info="OK", tripwire_triggered=False)
2. Asynchronous Output Guardrail with Custom Name
@output_guardrail(name="check_output_length")
async def check_output_length(context, agent, output):
    if len(str(output)) > 1000:
        return GuardrailFunctionOutput(output_info="Output too long", tripwire_triggered=True)
    return GuardrailFunctionOutput(output_info="OK", tripwire_triggered=False)
3. Manual Guardrail Creation
def custom_guardrail(context, agent, input):
    ...
guardrail = InputGuardrail(guardrail_function=custom_guardrail, name="custom_guardrail")
Tips, Gotchas, and FAQ
Tripwire Logic:
If tripwire_triggered is True, agent execution is halted and an exception is raised.

Sync/Async Support:
Both sync and async guardrail functions are supported. The run method handles both transparently.

Decorator Flexibility:
Decorators can be used with or without parentheses and with custom names.

Guardrail Naming:
If no name is provided, the function's name is used for tracing and diagnostics.

Guardrail Function Signature:

Input guardrail: (context, agent, input)
Output guardrail: (context, agent, output)
Related Files
agent.py
: Agent classes that use guardrails for input/output validation.
exceptions.py
: Exception types raised when guardrails are tripped.
run_context.py
: Run context wrapper for agent execution.
items.py
: Input/output item types for agent runs.
For further details, see the source code and related modules.