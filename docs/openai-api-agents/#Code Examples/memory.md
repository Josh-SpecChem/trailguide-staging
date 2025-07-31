memory.py — Session and Conversation Memory Management for OpenAI Agents
File Overview
This file defines protocols, abstract base classes, and a concrete implementation for session (memory) management in OpenAI agent systems. It enables agents to persist and retrieve conversation history across turns and sessions, supporting both in-memory and persistent (SQLite) storage. This is essential for maintaining context, supporting long conversations, and implementing session-based memory features.

Table of Contents
Key Classes and Protocols
Annotated Code Snippet
Class/Type Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Protocols
Name	Purpose
Session	Protocol for session implementations (async, for conversation memory).
SessionABC	Abstract base class for session implementations (internal use or subclassing).
SQLiteSession	Concrete implementation of session storage using SQLite (in-memory or file-based).
Annotated Code Snippet
@runtime_checkable
class Session(Protocol):
    session_id: str

    async def get_items(self, limit: int | None = None) -> list[TResponseInputItem]: ...
    async def add_items(self, items: list[TResponseInputItem]) -> None: ...
    async def pop_item(self) -> TResponseInputItem | None: ...
    async def clear_session(self) -> None: ...
Explanation:

Session protocol defines the required async methods for any session implementation: retrieving, adding, popping, and clearing conversation items.
SQLiteSession Implementation
class SQLiteSession(SessionABC):
    def __init__(
        self,
        session_id: str,
        db_path: str | Path = ":memory:",
        sessions_table: str = "agent_sessions",
        messages_table: str = "agent_messages",
    ):
        ...
    async def get_items(self, limit: int | None = None) -> list[TResponseInputItem]: ...
    async def add_items(self, items: list[TResponseInputItem]) -> None: ...
    async def pop_item(self) -> TResponseInputItem | None: ...
    async def clear_session(self) -> None: ...
    def close(self) -> None: ...
Explanation:

Stores conversation history in SQLite, supporting both in-memory and file-based databases.
Provides thread-safe, asynchronous methods for all session operations.
Handles schema creation, connection management, and concurrency.
Class/Type Reference
Session (Protocol)
Purpose: Defines the interface for session/memory implementations.
Key Methods:
get_items(limit=None): Retrieve conversation history (optionally limited to N most recent).
add_items(items): Add new items to the session.
pop_item(): Remove and return the most recent item.
clear_session(): Clear all items for the session.
SessionABC (Abstract Base Class)
Purpose: Abstract base class for session implementations; provides the same interface as Session.
SQLiteSession
Purpose: Concrete, thread-safe, async implementation using SQLite.
Constructor Parameters:
session_id: Unique identifier for the session.
db_path: Path to the SQLite database file (default :memory: for in-memory).
sessions_table, messages_table: Table names for session and message storage.
Key Methods: Implements all required session methods, plus close() for cleanup.
Example Usage
1. Creating and Using a SQLiteSession
session = SQLiteSession(session_id="user123", db_path="my_sessions.db")
await session.add_items([{"role": "user", "content": "Hello"}])
history = await session.get_items()
await session.clear_session()
session.close()
2. Using with an Agent
result = await Runner.run(agent, input="Hi", session=session)
Tips, Gotchas, and FAQ
In-Memory vs. File-Based:
Use db_path=":memory:" for ephemeral sessions, or a file path for persistent storage.

Thread Safety:
The implementation uses thread-local connections for file databases and a shared connection for in-memory databases.

Async Methods:
All session methods are async and thread-safe, suitable for use in async agent frameworks.

Schema Management:
The schema is created automatically if it does not exist.

Related Files
run.py
: Uses session objects for conversation memory.
items.py
: Defines TResponseInputItem used in session storage.
agent.py
: Agents can be configured to use session memory.
For further details, see the source code and related modules.