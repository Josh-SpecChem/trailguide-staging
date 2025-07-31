strict_schema.py — Strict JSON Schema Enforcement for OpenAI Agents
File Overview
This file provides utilities for mutating and validating JSON schemas to ensure they conform to the "strict" standard required by the OpenAI API for function/tool-calling and structured outputs. The main entry point, ensure_strict_json_schema, recursively processes schemas to enforce strictness, handle $ref resolution, property requirements, and other schema features. This is essential for reliable function/tool-calling, agent output validation, and OpenAI API interoperability.

Table of Contents
Key Functions and Types
Annotated Code Snippets
Function Reference
Example Usage
Tips, Gotchas, and FAQ
Related Files
Key Functions and Types
Name	Purpose
ensure_strict_json_schema	Main entry point for enforcing strict JSON schema compatibility.
_ensure_strict_json_schema	Internal recursive function for schema mutation and validation.
resolve_ref	Resolves $ref references within a schema.
is_dict, is_list	Type guards for dict/list objects.
has_more_than_n_keys	Utility to check the number of keys in a dict.
Annotated Code Snippets
1. Main Entry Point
def ensure_strict_json_schema(
    schema: dict[str, Any],
) -> dict[str, Any]:
    """Mutates the given JSON schema to ensure it conforms to the `strict` standard
    that the OpenAI API expects.
    """
    if schema == {}:
        return _EMPTY_SCHEMA
    return _ensure_strict_json_schema(schema, path=(), root=schema)
Explanation:

Ensures the provided schema is strict and OpenAI-compatible.
Returns a new schema or a default empty schema if input is empty.
2. Recursive Schema Mutation
def _ensure_strict_json_schema(
    json_schema: object,
    *,
    path: tuple[str, ...],
    root: dict[str, object],
) -> dict[str, Any]:
    # Recursively enforces strictness for objects, arrays, unions, intersections, and $refs.
    # - Sets "additionalProperties": False for objects.
    # - Ensures all properties are required.
    # - Resolves $refs and inlines them if needed.
    # - Removes unsupported or ambiguous features.
    ...
Explanation:

Handles all schema types, including objects, arrays, unions (anyOf), intersections (allOf), and $ref references.
Raises errors for non-strict features or misconfigurations.
3. Reference Resolution
def resolve_ref(*, root: dict[str, object], ref: str) -> object:
    if not ref.startswith("#/"):
        raise ValueError(f"Unexpected $ref format {ref!r}; Does not start with #/")
    path = ref[2:].split("/")
    resolved = root
    for key in path:
        value = resolved[key]
        assert is_dict(value), (
            f"encountered non-dictionary entry while resolving {ref} - {resolved}"
        )
        resolved = value
    return resolved
Explanation:

Resolves a $ref within the schema, following the JSON pointer path.
4. Type Guards and Utilities
def is_dict(obj: object) -> TypeGuard[dict[str, object]]:
    return isinstance(obj, dict)

def is_list(obj: object) -> TypeGuard[list[object]]:
    return isinstance(obj, list)

def has_more_than_n_keys(obj: dict[str, object], n: int) -> bool:
    i = 0
    for _ in obj.keys():
        i += 1
        if i > n:
            return True
    return False
Explanation:

Type guards for dict/list and utility for counting dict keys.
Function Reference
ensure_strict_json_schema
Purpose: Enforces strict JSON schema compatibility for OpenAI APIs.
Parameters: schema — the input JSON schema dict.
Returns: A strict, OpenAI-compatible JSON schema dict.
Raises: TypeError, UserError, or ValueError for invalid or non-strict schemas.
_ensure_strict_json_schema
Purpose: Internal recursive function for schema mutation and validation.
Parameters: json_schema, path, root.
Returns: A strict JSON schema dict.
resolve_ref
Purpose: Resolves a $ref pointer within a schema.
Parameters: root (root schema), ref (JSON pointer).
Returns: The resolved schema object.
is_dict, is_list, has_more_than_n_keys
Purpose: Type guards and utility for schema processing.
Example Usage
1. Enforcing Strict Schema
from strict_schema import ensure_strict_json_schema

schema = {
    "type": "object",
    "properties": {
        "foo": {"type": "string"},
        "bar": {"type": "integer"},
    }
}
strict_schema = ensure_strict_json_schema(schema)
# strict_schema now has "additionalProperties": False and all properties required
2. Handling $ref
schema = {
    "definitions": {
        "MyType": {
            "type": "object",
            "properties": {"x": {"type": "number"}}
        }
    },
    "type": "object",
    "properties": {"foo": {"$ref": "#/definitions/MyType"}}
}
strict_schema = ensure_strict_json_schema(schema)
Tips, Gotchas, and FAQ
additionalProperties:
All objects must have "additionalProperties": False for strict mode.

Required Properties:
All properties are made required by default.

$ref Handling:
$ref is inlined if other properties are present on the same object.

Union/Intersection:
Handles anyOf (union) and allOf (intersection) recursively.

Error Handling:
Raises clear errors for non-strict schemas or misconfigurations.

Related Files
agent_output.py
: Uses strict schema enforcement for output validation.
function_schema.py
: Uses strict schema enforcement for tool/function schemas.
handoffs.py
: Uses strict schema enforcement for handoff input schemas.
exceptions.py
: Defines UserError for schema errors.
For further details, see the source code and related modules.