import { Injectable } from '@nestjs/common';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';
import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import { ChatOpenAI, OpenAIEmbeddings } from '@langchain/openai';
import { ConfigService } from '@nestjs/config';
import { MongoVectorStoreService } from '../common/mongo-vector-store.service';
import { RunnableSequence } from '@langchain/core/runnables';
import { LangChainTracer } from '@langchain/core/dist/tracers/tracer_langchain';


@Injectable()
export class OpenaiService {
    private readonly dbName = this.configService.get<string>("MONGODB_DB");
    private readonly collectionName = this.configService.get<string>("MONGODB_COLLECTION");
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

    constructor(private readonly configService: ConfigService){
        this.mongoClient = new MongoVectorStoreService(this.dbUri, this.dbName, this.collectionName);
    }
    // webscrapper-vector-index

    /**
     * @description Scrap Webpages with openAI embeddings
     * @param url 
     */
    async scrapWebPages(url: string) {
        const loader = new CheerioWebBaseLoader(url);
        const docs = await loader.load();

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 100,
        });
        
        const splitDocs = await splitter.splitDocuments(docs);

        await this.mongoClient.connect();
        await this.mongoClient.insertDocuments(splitDocs, this.embeddings);
        await this.mongoClient.close();
        return "Documents ingested..."
    }

    async ask(question: string) {
        try {
            await this.mongoClient.connect();
            const vectorStore = await this.mongoClient.getStore(this.embeddings); // insert & index
            const retriever = vectorStore.asRetriever({k: 5});
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

    async askWithRunnable(question: string) {
        try {
            await this.mongoClient.connect();
            const vectorStore = await this.mongoClient.getStore(this.embeddings); // insert & index
            const retriever = vectorStore.asRetriever({k: 5});
            const chain = RunnableSequence.from([
                async (input: string) => {
                    const docs = await retriever.getRelevantDocuments(input);
                    const context = docs.map((d) => d.pageContent).join('\n\n');
                    return {
                        context,
                        question: input,
                    };
                },
                 async ({ context, question }) => {
                    const messages = [
                    {
                        role: 'system',
                        content: 'Use the context to answer the question as truthfully as possible.',
                    },
                    {
                        role: 'user',
                        content: `Context:\n${context}\n\nQuestion:\n${question}`,
                    },
                    ];

                    // Now call the model using `invoke`
                    return await this.llm.invoke(messages);
                },
            ]);
            const response = await chain.invoke(question, {
                metadata:{
                     run_name: 'askWithRunnable' 
                }
            });
            await this.mongoClient.close();
            return response.content
        } catch (error) {
            console.log(error)
        }
    }

    async scrapAPIs(api: string) {}
}
