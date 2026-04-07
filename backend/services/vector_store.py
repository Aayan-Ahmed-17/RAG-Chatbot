from langchain_community.vectorstores import FAISS
from core.config import get_embeddings

# Global variable to hold the vector store in memory for simplicity
faiss_store = None

def init_vector_store(documents):
    """Initializes the FAISS vector store with provided documents in memory."""
    global faiss_store
    if not documents:
        raise ValueError("No documents provided for indexing.")
        
    embeddings = get_embeddings()
    faiss_store = FAISS.from_documents(documents, embeddings)
    return faiss_store

def get_vector_store():
    """Returns the current FAISS vector store if initialized."""
    global faiss_store
    if faiss_store is None:
        raise ValueError("Vector store has not been initialized. Please upload a PDF first.")
    return faiss_store
