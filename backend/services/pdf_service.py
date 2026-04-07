from io import BytesIO
from pypdf import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document

class PDFService:
    @staticmethod
    def process_pdf_bytes(file_bytes: bytes) -> list[Document]:
        """Parses a PDF from bytes and chunks it."""
        reader = PdfReader(BytesIO(file_bytes))
        text = ""
        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"
        
        # Split text into chunks
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            separators=["\n\n", "\n", " ", ""]
        )
        # Create a document out of the combined text
        docs = [Document(page_content=text, metadata={"source": "upload"})]
        chunks = text_splitter.split_documents(docs)
        return chunks
