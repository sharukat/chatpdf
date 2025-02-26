import os
from typing import List
from dotenv import load_dotenv
from langchain_qdrant import QdrantVectorStore, RetrievalMode
from backend.text_splitter import SemanticChunker
from langchain_community.document_loaders import PyPDFLoader
from langchain_community.document_loaders import UnstructuredHTMLLoader
from langchain_core.documents import Document
from langchain_qdrant import FastEmbedSparse
from langchain_nomic import NomicEmbeddings

load_dotenv(dotenv_path="../.env")
os.environ["NOMIC_API_KEY"] = os.getenv("NOMIC_API_KEY")


class VectorDB:
    def __init__(self) -> None:
        self.dense_embeddings = NomicEmbeddings(model="nomic-embed-text-v1.5")
        self.sparse_embeddings = FastEmbedSparse(model_name="Qdrant/bm25")

    def chunking(self, documents: List[Document]) -> List[dict]:
        chunker = SemanticChunker(
            embeddings=self.dense_embeddings,
            breakpoint_threshold_type="percentile"
        )
        chunks = chunker.split_documents(documents)
        return chunks

    def create_vectordb(self, folder_path: str):
        try:
            if not os.path.exists("qdrant"):
                os.makedirs("qdrant")

            all_documents = []
            if not os.path.isdir(folder_path):
                raise ValueError("Not a valid directory")

            for filename in os.listdir(folder_path):
                file_path = os.path.join(folder_path, filename)

                if not os.path.isfile(file_path):
                    continue

                if filename.lower().endswith('.pdf'):
                    loader = PyPDFLoader(file_path)
                    documents = loader.load()
                    all_documents.extend(documents)
                elif filename.lower().endswith('.html'):
                    loader = UnstructuredHTMLLoader(file_path)
                    documents = loader.load()
                    all_documents.extend(documents)

            if all_documents:
                chunks = self.chunking(all_documents)
                QdrantVectorStore.from_documents(
                    documents=chunks,
                    collection_name="qdrantdb",
                    embedding=self.dense_embeddings,
                    sparse_embedding=self.sparse_embeddings,
                    prefer_grpc=False,
                    path="../qdrant",
                    retrieval_mode=RetrievalMode.HYBRID,
                )
                print(f"{len(chunks)} documents added to the vector store.")
        except Exception as e:
            raise e
