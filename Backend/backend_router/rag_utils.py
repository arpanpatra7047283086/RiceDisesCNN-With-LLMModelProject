import os
import requests


RAG_BACKEND_URL = os.getenv('RAG_BACKEND_URL')
# The external RAG Backend URL provided by the user
RAG_BACKEND_URL = RAG_BACKEND_URL

def init_rag():
    """
    No local initialization required for external API.
    """
    pass

def get_expert_advice(disease_name):
    """
    Wrapper to get initial advice for a detected disease.
    """
    return query_expert(f"The model detected {disease_name}. Provide detailed expert advice about symptoms and management.")

def query_expert(question):
    """
    Queries the external RAG Backend service on Render.
    """
    try:
        # Construct the URL for the chat endpoint on the Render-hosted RAG Backend
        api_url = f"{RAG_BACKEND_URL.rstrip('/')}/api/chat/"

        # Prepare the payload expected by the RagBackend api
        payload = {
            "message": question,
            "history": [] # Can be expanded if Frontend supports history
        }

        # Timeout is set to 60s as LLMs on free-tier Render can be slow
        response = requests.post(api_url, json=payload, timeout=60)

        if response.status_code == 200:
            result = response.json()
            # The RagBackend returns the response in the 'reply' field
            return result.get("reply", "No response from expert.")
        else:
            print(f"RAG External API Error: {response.status_code} - {response.text}")
            return f"The expert system is currently unavailable (Status {response.status_code})."

    except Exception as e:
        print(f"Error connecting to RAG Backend: {e}")
        return "I'm having trouble connecting to the expert system. Please try again later."
