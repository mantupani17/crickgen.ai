import { Embeddings, EmbeddingsParams } from '@langchain/core/embeddings';

interface GoogleCustomEmbeddingsParams extends EmbeddingsParams {
  embedFn: (text: string) => Promise<number[]>;
}

export class GoogleCustomEmbeddings extends Embeddings {
    private embedFn: (text: string) => Promise<number[]>;
  
    constructor(fields: GoogleCustomEmbeddingsParams) {
        super(fields);
        this.embedFn = fields.embedFn;
    }

    async embedDocuments(texts: string[]): Promise<number[][]> {
        return Promise.all(texts.map(text => this.embedFn(text)));
    }

    async embedQuery(text: string): Promise<number[]> {
        return this.embedFn(text);
    }
}
