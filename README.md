# RAG Application - Shyftlabs Assessment

This application integrates a Next.js frontend with a Flask backend to deliver a full-stack Retrieval-Augmented Generation (RAG) system powered by various Large Language Models (LLMs).

## Getting Started

### Clone the Repository
```bash
git clone https://github.com/sharukat/rag-pdf-assessment.git
cd rag-pdf-assessment
```

### Frontend Setup (Next.js)

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory with the following content:
```
NEXT_PUBLIC_API_URL=http://localhost:5328
GROQ_API_KEY=your_groq_api_key_here
```

3. Start the server:

The Next.js frontend will be available at http://localhost:3000.

### Backend Setup (Flask)

1. Create and activate a virtual environment:
```bash
python -m venv venv

source venv/bin/activate
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory with the following content:
```
COHERE_API_KEY=your_cohere_api_key_here
NOMIC_API_KEY=your_nomic_api_key_here
```

4. Start the Flask server:
```bash
cd api
python3 index.py
```
OR
```bash
cd api
flask run --port=5328
```

The Flask backend will be available at http://localhost:5328.

# Technology Stack

### LLM Models

This application leverages two large language models (LLMs) through `Groq`:

- `llama-3.3-70b-versatil`: Used for Hypothetical Document Embedding (HyDE).
- `deepseek-r1-distill-llama-70b`: Used for final answer generationg when contextual information is provided.

### Embedding Models

- **Nomic Embediing**: A powerful embedding model that captures semantic relationships between text chunks, enabling accurate document retrieval.

### Advanced RAG Techniques

#### Chunking Strategy
Documents are processed using an `semantic chunking` strategy that:
- Leverage `Nomic` embeddings to determine breakpoints
- Automatically adjusts chunk sizes based semantics of the text

#### Hypothetical Document Embeddings (HyDE)
This system implements HyDE to improve retrieval relevance:
1. The user query is expanded into a hypothetical document that might answer it
2. The hypothetical embeddings are used to search for relevant document chunks

#### Searching Strategy
This system uses `Hybrid (Dense + Sparse)` embeddings search technique.
1. Leverage `Nomic` embeddings for dense retrieval identifying semantic relationship.
2. The `BM25` algorithm uses sparse embeddings to match specific terms.

#### Repacking & Reranking
1. **Reranking**: Improve the relevance of the retrieved documents to ensure the most important information appears first.
2. **Repacking**: The order of the chunks might affect response generation. This technique repacks the chunks in ascending order.


## API Documentation

The backend exposes the following endpoints:

- `POST /api/upload`: Upload new documents, perform semantic chunking, and create a vector database.
- `POST /api/getdocuments`: Retrieval of relevant contextual information from a vector database.”


## License

[MIT License](LICENSE)