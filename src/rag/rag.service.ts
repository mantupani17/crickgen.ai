import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { DummyEmbeddings } from './dummy-embeddings';
import { GeminiService } from '../gemini-service/gemini-service.service';
import { MongoVectorStoreService } from '../common/mongo-vector-store.service'; // 👈
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RagService {
  private dbUri = this.configService.get<string>("MONGODB_URI")
  private dbname = this.configService.get<string>("MONGODB_DB")
  private collection = this.configService.get<string>("MONGODB_COLLECTION")
  constructor(
    private readonly geminiService: GeminiService,
    private readonly configService: ConfigService
  ) {}

  async askFromWeb(question: string): Promise<string> {
    const embeddings = new DummyEmbeddings(); // Or real one
    const mongoStore = new MongoVectorStoreService(this.dbUri, this.dbname, this.collection);
    await mongoStore.connect();
    const vectorStore = await mongoStore.getStore(embeddings); // insert & index
    const retriever = vectorStore.asRetriever();
    const relevantDocs = await retriever.getRelevantDocuments(question);
    await mongoStore.close();

    const context = relevantDocs.map(doc => doc.pageContent).join('\n---\n');
    const prompt = `Use the following context to answer the question:\n${context}\n\nQuestion: ${question}`;
    return this.geminiService.ask(prompt);
  }

  async ingestURLDetails(url: string): Promise<any> {
    const loader = new CheerioWebBaseLoader(url);
    const docs = await loader.load();

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
    const splitDocs = await splitter.splitDocuments(docs);

    const embeddings = new DummyEmbeddings(); // Or real one

    const mongoStore = new MongoVectorStoreService(this.dbUri, this.dbname, this.collection);

    await mongoStore.connect();
    await mongoStore.insertDocuments(splitDocs, embeddings);
    await mongoStore.close();
    return "Ingested Successfully"
  }
}
