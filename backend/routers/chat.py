from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.vector_store import get_vector_store
from core.config import get_llm
from langchain.chains import create_retrieval_chain
from langchain.chains.combine_documents import create_stuff_documents_chain
from langchain_core.prompts import ChatPromptTemplate

router = APIRouter()

class ChatRequest(BaseModel):
    message: str

@router.post("/chat")
async def chat_interaction(request: ChatRequest):
    try:
        # Get the vector store and create retriever
        vector_store = get_vector_store()
        retriever = vector_store.as_retriever(search_kwargs={"k": 4})
        
        # Setup the LLM
        llm = get_llm()
        
        # Create prompt template
        system_prompt = (
            "You are an assistant for question-answering tasks. "
            "Use the following pieces of retrieved context to answer the user's question. "
            "If you don't know the answer based on the context, just say that you don't know. "
            "Context: {context}"
        )
        prompt = ChatPromptTemplate.from_messages([
            ("system", system_prompt),
            ("human", "{input}"),
        ])
        
        # Create Chains
        question_answer_chain = create_stuff_documents_chain(llm, prompt)
        rag_chain = create_retrieval_chain(retriever, question_answer_chain)
        
        # Invoke Chain
        response = rag_chain.invoke({"input": request.message})
        
        return {
            "status": "success",
            "answer": response["answer"]
        }
        
    except ValueError as ve: # To catch uninitialized vector store error
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
