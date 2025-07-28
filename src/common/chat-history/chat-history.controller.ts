import { Controller, Get } from '@nestjs/common';
import { ChatHistoryService } from './chat-history.service';
import { Locals } from 'common-core-pkg';

@Controller('chats')
export class ChatHistoryController {
    constructor(private readonly chatSErvice: ChatHistoryService) {}

    @Get()
    getChatHistory(@Locals() locals: any) {
        return this.chatSErvice.getUserDataForSideBar(locals.user.id)
    }
}
