__version__.py — Package Version Utility for OpenAI Agent Framework
File Overview
This file exposes the current version of the agent package as __version__. It attempts to retrieve the version using Python's importlib.metadata (from installed package metadata), and falls back to "0.0.0" if the package is not installed (e.g., when running from source). This is a best practice for Python libraries and agent frameworks, enabling programmatic version checks for debugging, compatibility, and reproducibility.

Annotated Code Snippet
import importlib.metadata

try:
    __version__ = importlib.metadata.version("openai-agents")
except importlib.metadata.PackageNotFoundError:
    # Fallback if running from source without being installed
    __version__ = "0.0.0"
Explanation:

Tries to get the installed package version for "openai-agents".
If not installed, sets __version__ to "0.0.0" as a fallback.
Example Usage
from .__version__ import __version__

print(f"Agent framework version: {__version__}")
Tips, Gotchas, and FAQ
Always use __version__ for version checks in your code or for user-facing diagnostics.
Fallback value ensures the code works even in development or source-only environments.
Update the package name in the code if your distribution uses a different name.
Related Files
All files in the agent framework can import and use __version__ for version checks or logging.
For further details, see the Python 
importlib.metadata
 documentation.