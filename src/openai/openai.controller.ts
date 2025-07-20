import { Body, Controller, Post } from '@nestjs/common';
import { OpenaiService } from './openai.service';

@Controller('openai')
export class OpenaiController {
    constructor(private readonly openaiService: OpenaiService) {}

    @Post("ask")
    ask(@Body("question") question:string) {
        return this.openaiService.ask(question)
    }

    @Post("scrap-web")
    scrapWebPage(@Body("url") url:string) {
        return this.openaiService.scrapWebPages(url)
    }

    @Post("scrap-api")
    scrapApi(@Body("url") url:string) {
        return this.openaiService.scrapAPIs(url)
    }
}
