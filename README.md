# Minimalist RAG Chatbot

A clean, minimalist RAG (Retrieval-Augmented Generation) Chatbot leveraging the LangChain framework, Google's Gemini Flash model, FAISS for vector storage, and a React + Vite frontend.

## Prerequisites
- Node.js (v16+)
- Python (3.9+)
- A Free Google Gemini API Key from [Google AI Studio](https://aistudio.google.com/)

## Architecture
- **Frontend:** React, HTML5, Vanilla CSS with minimal Glassmorphism aesthetics.
- **Backend:** FastAPI mapping standard endpoints (`/api/upload`, `/api/chat`).
- **AI/RAG:** Langchain combined with GoogleGenerativeAIEmbeddings + FAISS vector memory + Gemini 2.5 Flash node.

## Running the Project

### 1. Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate the virtual environment:
   ```bash
   # Windows
   venv\Scripts\activate
   # Mac/Linux
   source venv/bin/activate
   ```
3. Create your `.env` file from the placeholder structure, and add your API key:
   ```env
   GOOGLE_API_KEY=your_actual_api_key_here
   ```
4. Start the server (runs on `http://localhost:8000`):
   ```bash
   uvicorn main:app --reload
   ```

### 2. Frontend React Client
1. Open a new terminal, navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install NodeJS dependencies:
   ```bash
   npm install
   ```
3. Start the dev server (runs on `http://localhost:5173`):
   ```bash
   npm run dev
   ```

Open up your browser to `http://localhost:5173`. Upload a PDF from the left sidebar and start interacting!
