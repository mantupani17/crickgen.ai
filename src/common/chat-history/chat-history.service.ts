import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ChatHistory, ChatHistoryDocument } from './schemas/chat-history.schema';
import { CreateChatHistoryDto } from './dto/create-chat-history.dto';

@Injectable()
export class ChatHistoryService {
  private readonly logger = new Logger(ChatHistoryService.name);

  constructor(
    @InjectModel(ChatHistory.name)
    private chatModel: Model<ChatHistoryDocument>,
  ) {}

  async saveChatEntry(data: CreateChatHistoryDto): Promise<ChatHistory> {
    const created = new this.chatModel({...data});
    return await created.save();
  }

  async getUserChatHistory(userId: string, limit = 20): Promise<ChatHistory[]> {
    return this.chatModel
      .find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async getConversationHistory(conversationId: string, limit: number = 5): Promise<ChatHistory[]> {
    return this.chatModel
      .find({ sessionId: conversationId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .exec();
  }

  async deleteChatHistory(id: string, userId: string): Promise<boolean> {
    const result = await this.chatModel.deleteOne({
      _id: new Types.ObjectId(id),
      userId: new Types.ObjectId(userId),
    });

    return result.deletedCount > 0;
  }

  async clearUserHistory(userId: string): Promise<number> {
    const result = await this.chatModel.deleteMany({ userId });
    return result.deletedCount ?? 0;
  }

  async getUserDataForSideBar(userId: string): Promise<any> {
    return this.chatModel.aggregate([
        {
          $match: {
            sessionId: {
              $exists: true
            },
            userId
          }
        },
        {
          $sort: {
            _id: 1 // or your timestamp field (ascending order)
          }
        },
        {
          $group: {
            _id: "$sessionId",
            title: {$first: "$prompt"},
            groupedData: {
              $push: "$$ROOT"
            }
          }
        }
    ]).exec()
  }
}
