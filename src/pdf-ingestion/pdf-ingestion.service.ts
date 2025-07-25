import { Injectable } from '@nestjs/common';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { MongoVectorStoreService } from '../common/mongo-vector-store.service'; // 👈
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs'

@Injectable()
export class PdfIngestionService {
    private readonly dbname = this.configService.get<string>("MONGODB_DB");
    private readonly collection = 'pdf_ingested_datas';
    private readonly dbUri = this.configService.get<string>("MONGODB_URI")
    private readonly openAiKey = this.configService.get<string>("OPENAI_API_KEY")
    private mongoClient: any = null 
    private embeddings = new OpenAIEmbeddings({
        openAIApiKey: this.openAiKey,
        model:'text-embedding-3-small'
    });

    private llm = new ChatOpenAI({
        openAIApiKey: this.openAiKey,
        modelName: 'gpt-3.5-turbo',
        temperature: 0.7
    });

  constructor(private readonly configService: ConfigService) {
    this.mongoClient = new MongoVectorStoreService(this.dbUri, this.dbname, this.collection);
  }

  async ingestPdf(filePath: string) {
    // 1. Load PDF file
    const loader = new PDFLoader(filePath);
    const rawDocs = await loader.load();

    // 2. Split into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const docs = await splitter.splitDocuments(rawDocs);

    await this.mongoClient.connect();
    await this.mongoClient.insertDocuments(docs, this.embeddings);
    await this.mongoClient.close();
    fs.unlinkSync(filePath)
    return { chunks: docs.length, file: path.basename(filePath) };
  }


  async ask(question: string) {
        try {
            await this.mongoClient.connect();
            const vectorStore = await this.mongoClient.getStore(this.embeddings); // insert & index
            const retriever = vectorStore.asRetriever({k: 10});
            const relevantDocs = await retriever.getRelevantDocuments(question);
            await this.mongoClient.close();
            const context = relevantDocs.map(doc => doc.pageContent).join('\n---\n');
            const prompt = `You are an assistant that only answers based strictly on the given context. 
                If the answer to the question cannot be found verbatim or very clearly within the context, respond with "Information not found in the provided context."

                Context:
                ${context}

                Question: ${question}`;
            const response = await this.llm.invoke([{ role: 'user', content: prompt }]);
            return response.content;
        } catch (error) {
            console.log(error)
        }
    }
}
