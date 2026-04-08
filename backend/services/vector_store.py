import time
from langchain_community.vectorstores import FAISS
from core.config import get_embeddings

# Global variables to hold the vector store and its source chunks
faiss_store = None
document_chunks = {} # Format: {filename: [chunks]}

def update_vector_store(filename, documents):
    """Adds documents to the FAISS vector store and tracks them by filename."""
    global faiss_store, document_chunks
    
    if not documents:
        raise ValueError("No documents provided for indexing.")
        
    embeddings = get_embeddings()
    document_chunks[filename] = documents
    
    # Batch size for free tier to avoid RESOURCE_EXHAUSTED
    batch_size = 50
    
    # If store doesn't exist, initialize with first batch
    if faiss_store is None:
        first_batch = documents[:batch_size]
        faiss_store = FAISS.from_documents(first_batch, embeddings)
        remaining_docs = documents[batch_size:]
    else:
        remaining_docs = documents

    # Add chunks in batches
    for i in range(0, len(remaining_docs), batch_size):
        batch = remaining_docs[i : i + batch_size]
        faiss_store.add_documents(batch)
        time.sleep(1) # Respect free tier rate limits
            
    return faiss_store

def remove_document(filename):
    """Removes a document by filename and rebuilds the FAISS index."""
    global faiss_store, document_chunks
    
    if filename in document_chunks:
        del document_chunks[filename]
    
    # Rebuild index from remaining chunks
    all_docs = []
    for docs in document_chunks.values():
        all_docs.extend(docs)
    
    if not all_docs:
        faiss_store = None
    else:
        # Re-initialize from scratch to fully remove vectors
        embeddings = get_embeddings()
        batch_size = 50
        first_batch = all_docs[:batch_size]
        faiss_store = FAISS.from_documents(first_batch, embeddings)
        
        for i in range(batch_size, len(all_docs), batch_size):
            batch = all_docs[i : i + batch_size]
            faiss_store.add_documents(batch)
            time.sleep(1)

def get_vector_store():
    """Returns the current FAISS vector store if initialized."""
    global faiss_store
    if faiss_store is None:
        raise ValueError("Vector store has not been initialized. Please upload a PDF first.")
    return faiss_store
