import { MongoDBAtlasVectorSearch } from '@langchain/community/vectorstores/mongodb_atlas';
import { Document } from 'langchain/document';
import { Embeddings } from '@langchain/core/embeddings';
import { MongoClient } from 'mongodb';

export class MongoVectorStoreService {
  private client: MongoClient;

  constructor(
    private readonly mongoUri: string,
    private readonly dbName: string,
    private readonly collectionName: string,
  ) {
    this.client = new MongoClient(this.mongoUri);
  }

  async connect(): Promise<void> {
    await this.client.connect();
  }

  async getStore(embeddings: Embeddings): Promise<MongoDBAtlasVectorSearch> {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);

   return new MongoDBAtlasVectorSearch(embeddings, {
        collection,
        indexName: 'webscrapper-vector-index',
        embeddingKey: "embedding",
        textKey: 'text'
    });
  }

  async insertDocuments(
    docs: Document[],
    embeddings: Embeddings,
  ): Promise<MongoDBAtlasVectorSearch> {
    const db = this.client.db(this.dbName);
    const collection = db.collection(this.collectionName);
    console.log(this.collectionName)
    return MongoDBAtlasVectorSearch.fromDocuments(docs, embeddings, {
      collection,
      indexName: 'webscrapper-vector-index',
      embeddingKey: "embedding",
      textKey: 'text'
    });
  }

  async close(): Promise<void> {
    await this.client.close();
  }
}
