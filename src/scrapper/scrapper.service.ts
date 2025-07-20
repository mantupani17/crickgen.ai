import { Injectable } from '@nestjs/common';
import { CheerioWebBaseLoader } from '@langchain/community/document_loaders/web/cheerio';

@Injectable()
export class ScrapperService {
    async scrape(url: string): Promise<string> {
        const loader = new CheerioWebBaseLoader(url);
        const docs = await loader.load();

        const fullText = docs.map(doc => doc.pageContent).join('\n\n');
        return fullText.slice(0, 5000); // Trim to Gemini prompt token limit
    }
}
