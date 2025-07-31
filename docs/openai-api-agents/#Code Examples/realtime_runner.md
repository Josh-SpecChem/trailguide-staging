realtime_runner.py — Realtime Runner for Voice and Streaming OpenAI Agents
File Overview
This file defines the RealtimeRunner class, the real-time/voice agent equivalent of the standard Runner for text-based agents. It manages the session lifecycle, persistent model connection, tool execution, guardrails, and agent handoffs for real-time agents. This is the main entry point for starting and managing real-time agent sessions, providing a high-level, ergonomic API for developers building voice, streaming, or interactive agents.

Table of Contents
Key Class
Annotated Code Snippet
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Class
Name	Purpose
RealtimeRunner	Orchestrates the lifecycle and session management for real-time/voice agent workflows.
Annotated Code Snippet
class RealtimeRunner:
    """A `RealtimeRunner` is the equivalent of `Runner` for realtime agents. It automatically
    handles multiple turns by maintaining a persistent connection with the underlying model
    layer.

    The session manages the local history copy, executes tools, runs guardrails and facilitates
    handoffs between agents.

    Since this code runs on your server, it uses WebSockets by default. You can optionally create
    your own custom model layer by implementing the `RealtimeModel` interface.
    """

    def __init__(
        self,
        starting_agent: RealtimeAgent,
        *,
        model: RealtimeModel | None = None,
        config: RealtimeRunConfig | None = None,
    ) -> None:
        ...
        self._starting_agent = starting_agent
        self._config = config
        self._model = model or OpenAIRealtimeWebSocketModel()

    async def run(
        self, *, context: TContext | None = None, model_config: RealtimeModelConfig | None = None
    ) -> RealtimeSession:
        """Start and returns a realtime session.

        Returns:
            RealtimeSession: A session object that allows bidirectional communication with the
            realtime model.

        Example:
            ```python
            runner = RealtimeRunner(agent)
            async with await runner.run() as session:
                await session.send_message("Hello")
                async for event in session:
                    print(event)
            ```
        """
        session = RealtimeSession(
            model=self._model,
            agent=self._starting_agent,
            context=context,
            model_config=model_config,
            run_config=self._config,
        )
        return session
Explanation:

Handles persistent model connection and session lifecycle for real-time agents.
Manages agent handoffs, tool execution, and guardrails.
Returns a RealtimeSession object for bidirectional communication and event streaming.
Function/Class Reference
RealtimeRunner
Purpose: Orchestrates real-time agent sessions, managing persistent model connections, session state, tools, guardrails, and handoffs.
Constructor Parameters:
starting_agent: The initial RealtimeAgent to start the session with.
model: (Optional) Custom real-time model implementation. Defaults to OpenAI's WebSocket model.
config: (Optional) Run configuration for the session.
Key Method:
async run(context=None, model_config=None) -> RealtimeSession: Starts a real-time session and returns a RealtimeSession object for communication and event streaming.
Example Usage
1. Running a Realtime Agent Session
runner = RealtimeRunner(my_realtime_agent)
async with await runner.run() as session:
    await session.send_message("Hello, agent!")
    async for event in session:
        print(event)
2. Using a Custom Model Layer
my_model = MyCustomRealtimeModel()
runner = RealtimeRunner(my_realtime_agent, model=my_model)
session = await runner.run()
Tips, Gotchas, and FAQ
Persistent Connection:
The runner maintains a persistent connection with the model for low-latency, interactive sessions.

Custom Model Support:
You can provide your own RealtimeModel implementation for advanced or non-OpenAI use cases.

Session Management:
The returned RealtimeSession object allows for bidirectional communication and event streaming.

Guardrails and Handoffs:
The session manages tool execution, guardrails, and agent handoffs automatically.

Related Files
realtime_agent.py
: Realtime agent class used as the starting agent.
openai_realtime.py
: Default OpenAI WebSocket model implementation.
session.py
: Realtime session class for bidirectional communication.
model.py
: Realtime model interface for custom model layers.
For further details, see the source code and related modules.