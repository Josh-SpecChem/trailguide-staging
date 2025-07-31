# Agents SDK API Reference — Tracing

---

## Tracing Module

### TracingProcessor
**Bases:** `ABC`  
Interface for processing spans.

**Source code:** `src/agents/tracing/processor_interface.py`

#### Methods

- **on_trace_start(trace: Trace) -> None**  
  Called when a trace is started.  
  - **Parameters:**  
    - `trace` (`Trace`): The trace that started.

- **on_trace_end(trace: Trace) -> None**  
  Called when a trace is finished.  
  - **Parameters:**  
    - `trace` (`Trace`): The trace that finished.

- **on_span_start(span: Span[Any]) -> None**  
  Called when a span is started.  
  - **Parameters:**  
    - `span` (`Span[Any]`): The span that started.

- **on_span_end(span: Span[Any]) -> None**  
  Called when a span is finished. Should not block or raise exceptions.  
  - **Parameters:**  
    - `span` (`Span[Any]`): The span that finished.

- **shutdown() -> None**  
  Called when the application stops.

- **force_flush() -> None**  
  Forces an immediate flush of all queued spans/traces.

---

### TraceProvider
**Bases:** `ABC`  
Interface for creating traces and spans.

**Source code:** `src/agents/tracing/provider.py`

#### Methods

- **register_processor(processor: TracingProcessor) -> None**  
  Add a processor that will receive all traces and spans.

- **set_processors(processors: list[TracingProcessor]) -> None**  
  Replace the list of processors with processors.

- **get_current_trace() -> Trace | None**  
  Return the currently active trace, if any.

- **get_current_span() -> Span[Any] | None**  
  Return the currently active span, if any.

- **set_disabled(disabled: bool) -> None**  
  Enable or disable tracing globally.

- **time_iso() -> str**  
  Return the current time in ISO 8601 format.

- **gen_trace_id() -> str**  
  Generate a new trace identifier.

- **gen_span_id() -> str**  
  Generate a new span identifier.

- **gen_group_id() -> str**  
  Generate a new group identifier.

- **create_trace(...) -> Trace**  
  Create a new trace.

- **create_span(...) -> Span[TSpanData]**  
  Create a new span.

- **shutdown() -> None**  
  Clean up any resources used by the provider.

---

### Span Data Types

**Source code:** `src/agents/tracing/span_data.py`

- **SpanData** (`ABC`): Represents span data in the trace.
  - **type** (abstract property): `str` — Return the type of the span.
  - **export() -> dict[str, Any]`**: Export the span data as a dictionary.

- **AgentSpanData** (`SpanData`): Represents an Agent Span in the trace. Includes name, handoffs, tools, and output type.
- **FunctionSpanData** (`SpanData`): Represents a Function Span in the trace. Includes input, output and MCP data (if applicable).
- **GenerationSpanData** (`SpanData`): Represents a Generation Span in the trace. Includes input, output, model, model configuration, and usage.
- **ResponseSpanData** (`SpanData`): Represents a Response Span in the trace. Includes response and input.
- **HandoffSpanData** (`SpanData`): Represents a Handoff Span in the trace. Includes source and destination agents.
- **CustomSpanData** (`SpanData`): Represents a Custom Span in the trace. Includes name and data property bag.
- **GuardrailSpanData** (`SpanData`): Represents a Guardrail Span in the trace. Includes name and triggered status.
- **TranscriptionSpanData** (`SpanData`): Represents a Transcription Span in the trace. Includes input, output, model, and model configuration.
- **SpeechSpanData** (`SpanData`): Represents a Speech Span in the trace. Includes input, output, model, model configuration, and first content timestamp.
- **SpeechGroupSpanData** (`SpanData`): Represents a Speech Group Span in the trace.
- **MCPListToolsSpanData** (`SpanData`): Represents an MCP List Tools Span in the trace. Includes server and result.

---

### Spans

**Source code:** `src/agents/tracing/spans.py`

- **Span** (`ABC`, `Generic[TSpanData]`)
  - **start(mark_as_current: bool = False)**
    - Start the span.
    - **Parameters:**
      - `mark_as_current` (`bool`): If true, the span will be marked as the current span. Default: `False`.
  - **finish(reset_current: bool = False) -> None**
    - Finish the span.
    - **Parameters:**
      - `reset_current` (`bool`): If true, the span will be reset as the current span. Default: `False`.

- **NoOpSpan** (`Span[TSpanData]`): No-op implementation.
- **SpanImpl** (`Span[TSpanData]`): Implementation.

---

### Traces

**Source code:** `src/agents/tracing/traces.py`

- **Trace** (`ABC`)
  - **trace_id** (abstract property): `str` — The trace ID.
  - **name** (abstract property): `str` — The name of the workflow being traced.
  - **start(mark_as_current: bool = False)**
    - Start the trace.
    - **Parameters:**
      - `mark_as_current` (`bool`): If true, the trace will be marked as the current trace. Default: `False`.
  - **finish(reset_current: bool = False)**
    - Finish the trace.
    - **Parameters:**
      - `reset_current` (`bool`): If true, the trace will be reset as the current trace. Default: `False`.
  - **export() -> dict[str, Any] | None**
    - Export the trace as a dictionary.

- **NoOpTrace** (`Trace`): A no-op trace that will not be recorded.
- **TraceImpl** (`Trace`): A trace that will be recorded by the tracing library.

---

### Processor Interface

**Source code:** `src/agents/tracing/processor_interface.py`

- **TracingProcessor** (`ABC`): Interface for processing spans.
  - See above for methods.

- **TracingExporter** (`ABC`): Exports traces and spans. For example, could log them or send them to a backend.
  - **export(items: list[Trace | Span[Any]]) -> None**
    - Exports a list of traces and spans.
    - **Parameters:**
      - `items` (`list[Trace | Span[Any]]`): The items to export.

---

### Processors

**Source code:** `src/agents/tracing/processors.py`

- **ConsoleSpanExporter** (`TracingExporter`): Prints the traces and spans to the console.
- **BackendSpanExporter** (`TracingExporter`)
  - **__init__(...)**
    - **Parameters:**
      - `api_key` (`str | None`): The API key for the "Authorization" header. Defaults to `os.environ["OPENAI_API_KEY"]` if not provided.
      - `organization` (`str | None`): The OpenAI organization to use. Defaults to `os.environ["OPENAI_ORG_ID"]` if not provided.
      - `project` (`str | None`): The OpenAI project to use. Defaults to `os.environ["OPENAI_PROJECT_ID"]` if not provided.
      - `endpoint` (`str`): The HTTP endpoint to which traces/spans are posted. Default: `'https://api.openai.com/v1/traces/ingest'`
      - `max_retries` (`int`): Maximum number of retries upon failures. Default: `3`
      - `base_delay` (`float`): Base delay (in seconds) for the first backoff. Default: `1.0`
      - `max_delay` (`float`): Maximum delay (in seconds) for backoff growth. Default: `30.0`
  - **set_api_key(api_key: str)**
    - Set the OpenAI API key for the exporter.
    - **Parameters:**
      - `api_key` (`str`): The OpenAI API key to use. This is the same key used by the OpenAI Python client.
  - **close()**
    - Close the underlying HTTP client.

- **BatchTraceProcessor** (`TracingProcessor`)
  - **__init__(...)**
    - **Parameters:**
      - `exporter` (`TracingExporter`): The exporter to use.
      - `max_queue_size` (`int`): The maximum number of spans to store in the queue. After this, we will start dropping spans. Default: `8192`
      - `max_batch_size` (`int`): The maximum number of spans to export in a single batch. Default: `128`
      - `schedule_delay` (`float`): The delay between checks for new spans to export. Default: `5.0`
      - `export_trigger_ratio` (`float`): The ratio of the queue size at which we will trigger an export. Default: `0.7`
  - **shutdown(timeout: float | None = None)**
    - Called when the application stops. We signal our thread to stop, then join it.
  - **force_flush()**
    - Forces an immediate flush of all queued spans.
  - **default_exporter() -> BackendSpanExporter**
    - The default exporter, which exports traces and spans to the backend in batches.
  - **default_processor() -> BatchTraceProcessor**
    - The default processor, which exports traces and spans to the backend in batches.

---

### Scope

**Source code:** `src/agents/tracing/scope.py`

- **Scope**: Manages the current span and trace in the context.

---

### Setup

**Source code:** `src/agents/tracing/setup.py`

- **set_trace_provider(provider: TraceProvider) -> None**
  - Set the global trace provider used by tracing utilities.

- **get_trace_provider() -> TraceProvider**
  - Get the global trace provider used by tracing utilities.

---

### Span Data

See "Span Data Types" above.

---

### Utility Functions

**Source code:** `src/agents/tracing/util.py`

- **time_iso() -> str**
  - Return the current time in ISO 8601 format.

- **gen_trace_id() -> str**
  - Generate a new trace ID.

- **gen_span_id() -> str**
  - Generate a new span ID.

- **gen_group_id() -> str**
  - Generate a new group ID.

---

## Creating Traces and Spans

### trace

```python
trace(
    workflow_name: str,
    trace_id: str | None = None,
    group_id: str | None = None,
    metadata: dict[str, Any] | None = None,
    disabled: bool = False,
) -> Trace
Create a new trace. The trace will not be started automatically; you should either use it as a context manager (with trace(...):) or call trace.start() + trace.finish() manually.

Parameters:

workflow_name (str): The name of the logical app or workflow. For example, you might provide "code_bot" for a coding agent, or "customer_support_agent" for a customer support agent. required
trace_id (str | None): The ID of the trace. Optional. If not provided, we will generate an ID. We recommend using util.gen_trace_id() to generate a trace ID, to guarantee that IDs are correctly formatted.
group_id (str | None): Optional grouping identifier to link multiple traces from the same conversation or process. For instance, you might use a chat thread ID.
metadata (dict[str, Any] | None): Optional dictionary of additional metadata to attach to the trace.
disabled (bool): If True, we will return a Trace but the Trace will not be recorded. Default: False
Returns:

Trace: The newly created trace object.
get_current_trace
get_current_trace() -> Trace | None
Returns the currently active trace, if present.

get_current_span
get_current_span() -> Span[Any] | None
Returns the currently active span, if present.

agent_span
agent_span(
    name: str,
    handoffs: list[str] | None = None,
    tools: list[str] | None = None,
    output_type: str | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[AgentSpanData]
Create a new agent span. The span will not be started automatically, you should either do with agent_span() ... or call span.start() + span.finish() manually.

Parameters:

name (str): The name of the agent. required
handoffs (list[str] | None): Optional list of agent names to which this agent could hand off control.
tools (list[str] | None): Optional list of tool names available to this agent.
output_type (str | None): Optional name of the output type produced by the agent.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID. We recommend using util.gen_span_id() to generate a span ID, to guarantee that IDs are correctly formatted.
parent (Trace | Span[Any] | None): The parent span or trace. If not provided, we will automatically use the current trace/span as the parent.
disabled (bool): If True, we will return a Span but the Span will not be recorded. Default: False
Returns:

Span[AgentSpanData]: The newly created agent span.
function_span
function_span(
    name: str,
    input: str | None = None,
    output: str | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[FunctionSpanData]
Create a new function span. The span will not be started automatically, you should either do with function_span() ... or call span.start() + span.finish() manually.

Parameters:

name (str): The name of the function. required
input (str | None): The input to the function.
output (str | None): The output of the function.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[FunctionSpanData]: The newly created function span.
generation_span
generation_span(
    input: Sequence[Mapping[str, Any]] | None = None,
    output: Sequence[Mapping[str, Any]] | None = None,
    model: str | None = None,
    model_config: Mapping[str, Any] | None = None,
    usage: dict[str, Any] | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[GenerationSpanData]
Create a new generation span. The span will not be started automatically, you should either do with generation_span() ... or call span.start() + span.finish() manually.

Parameters:

input (Sequence[Mapping[str, Any]] | None): The sequence of input messages sent to the model.
output (Sequence[Mapping[str, Any]] | None): The sequence of output messages received from the model.
model (str | None): The model identifier used for the generation.
model_config (Mapping[str, Any] | None): The model configuration (hyperparameters) used.
usage (dict[str, Any] | None): A dictionary of usage information (input tokens, output tokens, etc.).
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[GenerationSpanData]: The newly created generation span.
response_span
response_span(
    response: Response | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[ResponseSpanData]
Create a new response span. The span will not be started automatically, you should either do with response_span() ... or call span.start() + span.finish() manually.

Parameters:

response (Response | None): The OpenAI Response object.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[ResponseSpanData]: The newly created response span.
handoff_span
handoff_span(
    from_agent: str | None = None,
    to_agent: str | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[HandoffSpanData]
Create a new handoff span. The span will not be started automatically, you should either do with handoff_span() ... or call span.start() + span.finish() manually.

Parameters:

from_agent (str | None): The name of the agent that is handing off.
to_agent (str | None): The name of the agent that is receiving the handoff.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[HandoffSpanData]: The newly created handoff span.
custom_span
custom_span(
    name: str,
    data: dict[str, Any] | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[CustomSpanData]
Create a new custom span, to which you can add your own metadata. The span will not be started automatically, you should either do with custom_span() ... or call span.start() + span.finish() manually.

Parameters:

name (str): The name of the custom span. required
data (dict[str, Any] | None): Arbitrary structured data to associate with the span.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[CustomSpanData]: The newly created custom span.
guardrail_span
guardrail_span(
    name: str,
    triggered: bool = False,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[GuardrailSpanData]
Create a new guardrail span. The span will not be started automatically, you should either do with guardrail_span() ... or call span.start() + span.finish() manually.

Parameters:

name (str): The name of the guardrail. required
triggered (bool): Whether the guardrail was triggered. Default: False
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[GuardrailSpanData]: The newly created guardrail span.
transcription_span
transcription_span(
    model: str | None = None,
    input: str | None = None,
    input_format: str | None = "pcm",
    output: str | None = None,
    model_config: Mapping[str, Any] | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[TranscriptionSpanData]
Create a new transcription span. The span will not be started automatically, you should either do with transcription_span() ... or call span.start() + span.finish() manually.

Parameters:

model (str | None): The name of the model used for the speech-to-text.
input (str | None): The audio input of the speech-to-text transcription, as a base64 encoded string of audio bytes.
input_format (str | None): The format of the audio input (defaults to "pcm").
output (str | None): The output of the speech-to-text transcription.
model_config (Mapping[str, Any] | None): The model configuration (hyperparameters) used.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[TranscriptionSpanData]: The newly created speech-to-text span.
speech_span
speech_span(
    model: str | None = None,
    input: str | None = None,
    output: str | None = None,
    output_format: str | None = "pcm",
    model_config: Mapping[str, Any] | None = None,
    first_content_at: str | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[SpeechSpanData]
Create a new speech span. The span will not be started automatically, you should either do with speech_span() ... or call span.start() + span.finish() manually.

Parameters:

model (str | None): The name of the model used for the text-to-speech.
input (str | None): The text input of the text-to-speech.
output (str | None): The audio output of the text-to-speech as base64 encoded string of PCM audio bytes.
output_format (str | None): The format of the audio output (defaults to "pcm").
model_config (Mapping[str, Any] | None): The model configuration (hyperparameters) used.
first_content_at (str | None): The time of the first byte of the audio output.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[SpeechSpanData]: The newly created speech span.
speech_group_span
speech_group_span(
    input: str | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[SpeechGroupSpanData]
Create a new speech group span. The span will not be started automatically, you should either do with speech_group_span() ... or call span.start() + span.finish() manually.

Parameters:

input (str | None): The input text used for the speech request.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[SpeechGroupSpanData]: The newly created speech group span.
mcp_tools_span
mcp_tools_span(
    server: str | None = None,
    result: list[str] | None = None,
    span_id: str | None = None,
    parent: Trace | Span[Any] | None = None,
    disabled: bool = False,
) -> Span[MCPListToolsSpanData]
Create a new MCP list tools span. The span will not be started automatically, you should either do with mcp_tools_span() ... or call span.start() + span.finish() manually.

Parameters:

server (str | None): The name of the MCP server.
result (list[str] | None): The result of the MCP list tools call.
span_id (str | None): The ID of the span. Optional. If not provided, we will generate an ID.
parent (Trace | Span[Any] | None): The parent span or trace.
disabled (bool): If True, we will return a Span but the Span will not be recorded.
Returns:

Span[MCPListToolsSpanData]: The newly created MCP list tools span.
Utility Functions
time_iso() -> str
Return the current time in ISO 8601 format.

gen_trace_id() -> str
Generate a new trace ID.

gen_span_id() -> str
Generate a new span ID.

gen_group_id() -> str
Generate a new group ID.

Tracing Setup and Control
set_trace_provider(provider: TraceProvider) -> None
Set the global trace provider used by tracing utilities.

get_trace_provider() -> TraceProvider
Get the global trace provider used by tracing utilities.

add_trace_processor(span_processor: TracingProcessor) -> None
Adds a new trace processor. This processor will receive all traces/spans.

set_trace_processors(processors: list[TracingProcessor]) -> None
Set the list of trace processors. This will replace the current list of processors.

set_tracing_disabled(disabled: bool) -> None
Set whether tracing is globally disabled.

set_tracing_export_api_key(api_key: str) -> None
Set the OpenAI API key for the backend exporter.

