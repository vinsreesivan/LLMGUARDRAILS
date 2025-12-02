#!/bin/bash

# Test Ollama connectivity script

echo "Testing Ollama connection..."
echo "OLLAMA_BASE_URL: ${OLLAMA_BASE_URL:-http://localhost:11502}"
echo ""

# Test health endpoint
echo "1. Testing health endpoint..."
curl -s http://localhost:11502/ && echo "✓ Health check passed" || echo "✗ Health check failed"
echo ""

# Test models list
echo "2. Testing models list..."
curl -s http://localhost:11502/api/tags && echo "" && echo "✓ Models list retrieved" || echo "✗ Failed to get models"
echo ""

# Test if port is listening
echo "3. Checking if port 11502 is listening..."
netstat -tuln 2>/dev/null | grep 11502 || ss -tuln 2>/dev/null | grep 11502 || echo "✗ Port 11502 is not listening"
echo ""

echo "Done!"
