import os
import logging
from typing import List
from dotenv import load_dotenv
from langchain_cohere import CohereRerank
from langchain_core.documents import Document
from langchain_core.prompts import PromptTemplate
from langchain.retrievers import contextual_compression
from langchain_core.output_parsers import StrOutputParser
from langchain_qdrant import QdrantVectorStore, RetrievalMode
from langchain_qdrant import FastEmbedSparse
from langchain_nomic import NomicEmbeddings

load_dotenv(dotenv_path="../.env")
os.environ["COHERE_API_KEY"] = os.getenv("COHERE_API_KEY")
os.environ["NOMIC_API_KEY"] = os.getenv("NOMIC_API_KEY")

# Load embedding models to the memory
dense_embeddings = NomicEmbeddings(model="nomic-embed-text-v1.5")
sparse_embeddings = FastEmbedSparse(model_name="Qdrant/bm25")


class Retriever:
    def __init__(self) -> None:
        pass

    @staticmethod
    def repacking(documents: List[Document]) -> List[Document]:
        try:
            return sorted(
                documents,
                key=lambda doc: doc.metadata["relevance_score"],
                reverse=False,
            )
        except Exception as e:
            logging.info(e)
            raise ValueError(f"Error sorting documents: {e}")

    def hyde_generation(self, question: str):
        prompt = PromptTemplate.from_template(
            """
            You are an expert in question answering.
            First, analyze the question carefully and think step by step.
            Provide accurate, factual answers based on verified information.

            Question:
            `{question}`.
            """
        )

        chain = prompt | self.get_hyde(max_tokens=512) | StrOutputParser()
        response = chain.invoke({
            "question": question})
        return response

    def retrieve(self, question: str):
        vectordb = QdrantVectorStore.from_existing_collection(
            embedding=dense_embeddings,
            sparse_embedding=sparse_embeddings,
            collection_name="qdrantdb",
            path="../qdrant",
            retrieval_mode=RetrievalMode.HYBRID,
        )
        retriever = vectordb.as_retriever(search_kwargs={"k": 10})

        compressor = CohereRerank(model="rerank-v3.5", top_n=5)
        c_retriever = contextual_compression.ContextualCompressionRetriever(
            base_compressor=compressor, base_retriever=retriever
        )

        reranked_docs = c_retriever.invoke(question)
        repacked_docs = self.repacking(reranked_docs)
        return repacked_docs
