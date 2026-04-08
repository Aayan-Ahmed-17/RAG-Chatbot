from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.vector_store import remove_document

router = APIRouter()

class RemoveRequest(BaseModel):
    filename: str

@router.post("/remove")
async def remove_pdf(request: RemoveRequest):
    try:
        remove_document(request.filename)
        return {
            "status": "success",
            "message": f"'{request.filename}' removed from context successfully."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
