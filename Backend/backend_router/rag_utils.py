import os
from .RagSystem.rag.pipeline import RAGPipeline
from .RagSystem.llm import create_client, get_response

# Global instances
rag_pipeline = None
groq_client = None

def init_rag():
    global rag_pipeline, groq_client
    if rag_pipeline is None:
        print("Initializing RAG Pipeline...")
        try:
            # The pipeline will load data using paths relative to its own location
            rag_pipeline = RAGPipeline()
            rag_pipeline.initialize()
        except Exception as e:
            print(f"RAG Init Error: {e}")

    if groq_client is None:
        api_key = os.getenv("GROQ_API_KEY")
        if api_key:
            groq_client = create_client(api_key)
            print("Groq Client initialized.")
        else:
            print("Warning: GROQ_API_KEY not found in environment.")

def get_expert_advice(disease_name):
    return query_expert(f"The model detected {disease_name}. Provide detailed expert advice about symptoms and management.")

def query_expert(question):
    global rag_pipeline, groq_client

    if not rag_pipeline or not rag_pipeline.is_ready():
        return "The expert system is currently initializing. Please try again in a moment."

    if not groq_client:
        return "Expert AI (Groq) not configured. Please check API key."

    # 1. Retrieve context from FAISS
    rag_results = rag_pipeline.query(question)

    # 2. Get response from LLM
    conversation = [{"role": "user", "content": question}]
    reply, error = get_response(
        client=groq_client,
        conversation=conversation,
        rag_results=rag_results
    )

    if error:
        return f"Error getting expert advice: {error}"

    return reply
