logger.py — Logging Utility for OpenAI Agent Framework
File Overview
This file sets up a module-level logger named "openai.agents". It provides a consistent logging interface for all components of the agent framework, supporting structured logging, debugging, and diagnostics across the codebase.

Annotated Code Snippet
import logging

logger = logging.getLogger("openai.agents")
Explanation:

Imports Python's standard logging module.
Creates a logger instance with the name "openai.agents".
Use this logger throughout the agent framework for all logging needs.
Example Usage
from .logger import logger

logger.info("Agent started successfully.")
logger.error("Failed to process tool call.", exc_info=True)
Tips, Gotchas, and FAQ
Consistent Logging:
Always use this logger (logger) for logging in your agent framework to ensure consistent output and easy configuration.

Configuration:
Logging configuration (handlers, formatters, levels)