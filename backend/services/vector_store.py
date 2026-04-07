import time
from langchain_community.vectorstores import FAISS
from core.config import get_embeddings

# Global variable to hold the vector store in memory for simplicity
faiss_store = None

def init_vector_store(documents):
    """Initializes the FAISS vector store with provided documents in memory using batching for free tier."""
    global faiss_store
    if not documents:
        raise ValueError("No documents provided for indexing.")
        
    embeddings = get_embeddings()
    
    # Batch size for free tier to avoid RESOURCE_EXHAUSTED
    batch_size = 50
    
    # Initialize with the first batch
    first_batch = documents[:batch_size]
    faiss_store = FAISS.from_documents(first_batch, embeddings)
    
    # Add subsequent batches with a small delay
    for i in range(batch_size, len(documents), batch_size):
        batch = documents[i : i + batch_size]
        faiss_store.add_documents(batch)
        # Small sleep to respect rate limits if documents are many
        if i + batch_size < len(documents):
            time.sleep(1) 
            
    return faiss_store

def get_vector_store():
    """Returns the current FAISS vector store if initialized."""
    global faiss_store
    if faiss_store is None:
        raise ValueError("Vector store has not been initialized. Please upload a PDF first.")
    return faiss_store
