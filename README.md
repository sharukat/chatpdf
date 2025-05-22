# Chat with PDF: AI-Powered Document Intelligence

An interactive web application that lets users upload any PDF and chat with it using Retrieval-Augmented Generation (RAG). Built to extract insights and answer questions with the power of Large Language Models (LLMs).

## 🌱 Motivation
Extracting meaningful information from dense PDFs is often slow and inefficient. This application bridges that gap by combining vector search with the reasoning capabilities of large language models to provide fast, accurate, and context-aware responses to user queries. Whether it’s technical manuals, research papers, or contracts — this tool empowers users to engage with documents conversationally and intelligently.

## 🚀 Getting Started

### Clone the Repository
```bash
git clone https://github.com/sharukat/chatpdf.git
cd chatpdf
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

## Technology Stack
<p align="center">
  <a href="https://go-skill-icons.vercel.app/">
    <img
      src="https://go-skill-icons.vercel.app/api/icons?i=python,typescript,flask,nextjs,tailwindcss,langchain,groq,deepseek,"
    />
  </a>
</p>

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

### Prefixing Query and Documents
1. Used `search_document` prefix for document chunks.
2. Used `search_query` prefix for the search query.

#### Repacking & Reranking
1. **Reranking**: Improve the relevance of the retrieved documents to ensure the most important information appears first.
2. **Repacking**: The order of the chunks might affect response generation. This technique repacks the chunks in ascending order.


## API Documentation

The backend exposes the following endpoints:

- `POST /api/upload`: Upload new documents, perform semantic chunking, and create a vector database.
- `POST /api/getdocuments`: Retrieval of relevant contextual information from a vector database.”

## 👏 Contributing
I would love your help! Contribute by forking the repo and opening pull requests.

## License

[MIT License](LICENSE)
