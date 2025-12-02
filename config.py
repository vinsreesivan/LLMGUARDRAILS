# Guardrails.AI Configuration File

from guardrails_api.classes import Config

# Basic configuration for Guardrails.AI server
config = Config(
    # Server settings
    server={
        "host": "0.0.0.0",
        "port": 8000,
    },

    # Enable in-memory storage (no Postgres required)
    use_in_memory_storage=True,

    # LLM API Keys (optional - can be set via environment variables)
    llm_api_keys={
        # "openai": "your-openai-api-key",
        # "anthropic": "your-anthropic-api-key",
        # "cohere": "your-cohere-api-key",
    },

    # Telemetry settings
    telemetry={
        "enabled": False,  # Set to True if you want usage analytics
    },

    # Logging
    log_level="INFO",
)
