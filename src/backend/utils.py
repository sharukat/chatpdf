import os
from dotenv import load_dotenv
from langchain_qdrant import FastEmbedSparse
from langchain_nomic import NomicEmbeddings

load_dotenv(dotenv_path="../.env")
os.environ["NOMIC_API_KEY"] = os.getenv("NOMIC_API_KEY")


def load_embedding_models():
    dense_embeddings = NomicEmbeddings(model="nomic-embed-text-v1.5")
    sparse_embeddings = FastEmbedSparse(model_name="Qdrant/bm25")
    return dense_embeddings, sparse_embeddings
