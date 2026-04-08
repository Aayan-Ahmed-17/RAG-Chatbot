from fastapi import APIRouter, UploadFile, File, HTTPException
from services.pdf_service import PDFService
from services.vector_store import update_vector_store

router = APIRouter()

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        contents = await file.read()
        documents = PDFService.process_pdf_bytes(contents)
        
        # Add to vector store and track by filename
        update_vector_store(file.filename, documents)
        
        return {
            "status": "success",
            "message": f"'{file.filename}' uploaded and indexed successfully.",
            "filename": file.filename,
            "chunks_processed": len(documents)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
