usage.py — Usage Tracking for OpenAI Agent Runs
File Overview
This file defines the Usage dataclass, which tracks resource usage statistics for agent runs in OpenAI-style agent systems. It records total requests, input/output tokens, and detailed token breakdowns, supporting aggregation and reporting of LLM usage. The design is compatible with OpenAI's Responses API usage details and is essential for monitoring, analytics, and cost control in production agent systems.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
Usage	Tracks requests, input/output tokens, and detailed token usage for agent runs.
Annotated Code Snippet
from dataclasses import field
from openai.types.responses.response_usage import InputTokensDetails, OutputTokensDetails
from pydantic.dataclasses import dataclass

@dataclass
class Usage:
    requests: int = 0
    """Total requests made to the LLM API."""

    input_tokens: int = 0
    """Total input tokens sent, across all requests."""

    input_tokens_details: InputTokensDetails = field(
        default_factory=lambda: InputTokensDetails(cached_tokens=0)
    )
    """Details about the input tokens, matching responses API usage details."""

    output_tokens: int = 0
    """Total output tokens received, across all requests."""

    output_tokens_details: OutputTokensDetails = field(
        default_factory=lambda: OutputTokensDetails(reasoning_tokens=0)
    )
    """Details about the output tokens, matching responses API usage details."""

    total_tokens: int = 0
    """Total tokens sent and received, across all requests."""

    def add(self, other: "Usage") -> None:
        self.requests += other.requests if other.requests else 0
        self.input_tokens += other.input_tokens if other.input_tokens else 0
        self.output_tokens += other.output_tokens if other.output_tokens else 0
        self.total_tokens += other.total_tokens if other.total_tokens else 0
        self.input_tokens_details = InputTokensDetails(
            cached_tokens=self.input_tokens_details.cached_tokens
            + other.input_tokens_details.cached_tokens
        )
        self.output_tokens_details = OutputTokensDetails(
            reasoning_tokens=self.output_tokens_details.reasoning_tokens
            + other.output_tokens_details.reasoning_tokens
        )
Explanation:

Tracks total requests, input tokens, output tokens, and total tokens.
Includes detailed breakdowns for input and output tokens.
The add method aggregates usage from another Usage instance.
Function/Class Reference
Usage
Purpose: Tracks and aggregates resource usage for agent runs.
Fields:
requests: Total requests made to the LLM API.
input_tokens: Total input tokens sent.
input_tokens_details: Detailed breakdown of input tokens.
output_tokens: Total output tokens received.
output_tokens_details: Detailed breakdown of output tokens.
total_tokens: Total tokens sent and received.
Methods:
add(other: Usage): Aggregates usage statistics from another Usage instance.
Example Usage
1. Tracking and Aggregating Usage
usage1 = Usage(requests=1, input_tokens=100, output_tokens=50, total_tokens=150)
usage2 = Usage(requests=2, input_tokens=200, output_tokens=100, total_tokens=300)
usage1.add(usage2)
# usage1 now has requests=3, input_tokens=300, output_tokens=150, total_tokens=450
2. Accessing Token Details
print(usage1.input_tokens_details.cached_tokens)
print(usage1.output_tokens_details.reasoning_tokens)
Tips, Gotchas, and FAQ
Default Details:
input_tokens_details and output_tokens_details are initialized with zero values for safe aggregation.

Aggregation:
Use the add method to combine usage statistics across multiple runs or components.

OpenAI Compatibility:
The details fields are designed to match OpenAI's Responses API usage details.

Related Files
run_context.py
: Wraps and tracks usage for each agent run.
result.py
: Includes usage statistics in run results.
run.py
: Aggregates and updates usage during agent execution.
For further details, see the source code and related modules.

No file chosenNo file chosen
import importlib.metadata

try:
version = importlib.metadata.version("openai-agents")
except importlib.metadata.PackageNotFoundError:
# Fallback if running from source without being installed
version = "0.0.0"