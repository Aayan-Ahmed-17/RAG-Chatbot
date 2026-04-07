from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.vector_store import get_vector_store
from core.config import get_llm

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_interaction(request: ChatRequest):
    try:
        # Get the vector store and create retriever
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        
        # Retrieve relevant docs
        retrieved_docs = retriever.invoke(request.message)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
        
        # Setup the LLM
        llm = get_llm()
        
        # Create prompt
        prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer the user's question. "
            "If you don't know the answer based on the context, just say that you don't know.\n\n"
            f"Context: {context}\n\n"
            f"Question: {request.message}"
        )
        
        # Invoke Chain manually (since the user told us to forget about testing LLM, this simple invoke is fine)
        response = llm.invoke(prompt)
        
        return {
            "status": "success",
            "answer": response.content if hasattr(response, "content") else str(response)
        }
        
    except ValueError as ve: # To catch uninitialized vector store error
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
