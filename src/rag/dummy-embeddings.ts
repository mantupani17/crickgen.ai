import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';

export class DummyEmbeddings extends Embeddings {
    constructor(params: EmbeddingsParams = {}) {
        super(params); // ✅ Required by base class
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        return texts.map((_, i) => Array(384).fill(i)); // Fake vector
    }

    async embedQuery(text: string): Promise<number[]> {
        return Array(384).fill(0.5); // Constant query vector
    }
}