
from kronoslabs import KronosLabs
import os
import json

# Initialize the client
client = KronosLabs(api_key="undefined")

# Test prompt
prompt = "Generate a simple recipe for banana bread"

try:
    # Non-streaming chat completion
    response = client.chat.completions.create(
        prompt=prompt,
        model="hermes",
        temperature=0.7,
        is_stream=False
    )
    
    print(json.dumps({
        "success": True,
        "response": response.choices[0].message.content
    }))
except Exception as e:
    print(json.dumps({
        "success": False,
        "error": str(e)
    }))
