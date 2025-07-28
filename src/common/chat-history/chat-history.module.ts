import { Module } from '@nestjs/common';
import { ChatHistoryController } from './chat-history.controller';
import { ChatHistoryService } from './chat-history.service';
import { ChatHistory, ChatHistorySchema } from './schemas/chat-history.schema';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
    imports: [
       MongooseModule.forFeature([
         { name: ChatHistory.name, schema: ChatHistorySchema}
       ])
    ],
    controllers: [ChatHistoryController],
    providers: [ChatHistoryService]
})
export class ChatHistoryModule {}
