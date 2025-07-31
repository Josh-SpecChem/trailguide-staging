computer.py — Abstract Interfaces for Computer and Browser Control
File Overview
This file defines abstract base classes for controlling a computer or browser environment, both synchronously (Computer) and asynchronously (AsyncComputer). These interfaces standardize operations such as mouse clicks, keyboard input, screenshots, scrolling, and more. They are designed for use in agent systems that require automation, remote control, or simulation of desktop/browser environments.

Table of Contents
Key Classes and Types
Annotated Code Snippets
Function/Class Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Classes and Types
Name	Purpose
Environment	Type alias for supported environments: "mac", "windows", "ubuntu", "browser".
Button	Type alias for mouse buttons: "left", "right", "wheel", "back", "forward".
Computer	Abstract base class for synchronous computer/browser control.
AsyncComputer	Abstract base class for asynchronous computer/browser control.
Annotated Code Snippets
1. Environment and Button Type Aliases
Environment = Literal["mac", "windows", "ubuntu", "browser"]
Button = Literal["left", "right", "wheel", "back", "forward"]
Explanation:
Defines the allowed values for the environment and mouse button parameters, ensuring type safety and clarity.

2. Synchronous Computer Interface
class Computer(abc.ABC):
    @property
    @abc.abstractmethod
    def environment(self) -> Environment: ...
    @property
    @abc.abstractmethod
    def dimensions(self) -> tuple[int, int]: ...
    @abc.abstractmethod
    def screenshot(self) -> str: ...
    @abc.abstractmethod
    def click(self, x: int, y: int, button: Button) -> None: ...
    # ... other abstract methods ...
Explanation:

Specifies the required methods and properties for a synchronous computer/browser controller.
Includes mouse, keyboard, screenshot, and navigation operations.
3. Asynchronous Computer Interface
class AsyncComputer(abc.ABC):
    @property
    @abc.abstractmethod
    def environment(self) -> Environment: ...
    @property
    @abc.abstractmethod
    def dimensions(self) -> tuple[int, int]: ...
    @abc.abstractmethod
    async def screenshot(self) -> str: ...
    @abc.abstractmethod
    async def click(self, x: int, y: int, button: Button) -> None: ...
    # ... other async abstract methods ...
Explanation:

Mirrors the Computer interface, but all operational methods are asynchronous (async def).
Useful for integration with event loops or async agent frameworks.
Function/Class Reference
Computer
class Computer(abc.ABC):
    @property
    def environment(self) -> Environment: ...
    @property
    def dimensions(self) -> tuple[int, int]: ...
    def screenshot(self) -> str: ...
    def click(self, x: int, y: int, button: Button) -> None: ...
    def double_click(self, x: int, y: int) -> None: ...
    def scroll(self, x: int, y: int, scroll_x: int, scroll_y: int) -> None: ...
    def type(self, text: str) -> None: ...
    def wait(self) -> None: ...
    def move(self, x: int, y: int) -> None: ...
    def keypress(self, keys: list[str]) -> None: ...
    def drag(self, path: list[tuple[int, int]]) -> None: ...
Purpose: Abstracts all necessary operations for controlling a computer or browser synchronously.
Parameters/Returns: See method signatures above.
Summary: Implement this interface to provide a concrete controller for automation or agentic tasks.
AsyncComputer
class AsyncComputer(abc.ABC):
    @property
    def environment(self) -> Environment: ...
    @property
    def dimensions(self) -> tuple[int, int]: ...
    async def screenshot(self) -> str: ...
    async def click(self, x: int, y: int, button: Button) -> None: ...
    async def double_click(self, x: int, y: int) -> None: ...
    async def scroll(self, x: int, y: int, scroll_x: int, scroll_y: int) -> None: ...
    async def type(self, text: str) -> None: ...
    async def wait(self) -> None: ...
    async def move(self, x: int, y: int) -> None: ...
    async def keypress(self, keys: list[str]) -> None: ...
    async def drag(self, path: list[tuple[int, int]]) -> None: ...
Purpose: Same as Computer, but for asynchronous operation.
Summary: Use this interface for async agent frameworks or environments.
Example Usage
1. Implementing a Synchronous Computer Controller
class MyComputer(Computer):
    @property
    def environment(self) -> Environment:
        return "mac"

    @property
    def dimensions(self) -> tuple[int, int]:
        return (1920, 1080)

    def screenshot(self) -> str:
        # Return base64-encoded screenshot
        return "..."

    def click(self, x: int, y: int, button: Button) -> None:
        # Perform click
        pass

    # Implement other methods...
2. Implementing an Asynchronous Computer Controller
class MyAsyncComputer(AsyncComputer):
    @property
    def environment(self) -> Environment:
        return "browser"

    @property
    def dimensions(self) -> tuple[int, int]:
        return (1280, 720)

    async def screenshot(self) -> str:
        # Async screenshot logic
        return "..."

    async def click(self, x: int, y: int, button: Button) -> None:
        # Async click logic
        pass

    # Implement other async methods...
Tips, Gotchas, and FAQ
Sync vs. Async:
Choose the interface (Computer or AsyncComputer) that matches your agent's runtime model. Do not mix sync and async methods in the same implementation.

Environment Values:
Only use the allowed values for environment ("mac", "windows", "ubuntu", "browser").

Button Values:
Only use the allowed values for button ("left", "right", "wheel", "back", "forward").

Not Implemented:
These are abstract base classes; you must implement all methods in a subclass.

Related Files
agent.py
: Agent classes that may use computer/browser controllers for tool actions.
tool.py
: For integrating computer control as agent tools.
For further details, see the source code and related modules.