import { ActorSubclass } from "@dfinity/agent";
import {
  _SERVICE,
  Conversation,
  Message,
} from "@/declarations/backend/backend.did";
import {
  List_3,
  listToArray,
  timeToDate,
  principalToString,
} from "@/lib/utils";
import { Principal } from "@dfinity/principal";

export interface FrontendMessage {
  messageId: number;
  senderPrincipal: string;
  recipientPrincipal: string;
  text: string;
  timestamp: Date;
  conversationId: number;
}

export interface FrontendConversation {
  conversationId: number;
  participants: string[];
}

export class ChatHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapMessage(message: Message): FrontendMessage {
    return {
      messageId: Number(message.messageId),
      senderPrincipal: principalToString(message.senderPrincipal),
      recipientPrincipal: principalToString(message.recipientPrincipal),
      text: message.text,
      timestamp: timeToDate(message.timestamp),
      conversationId: Number(message.conversationId),
    };
  }

  private mapConversation(conversation: Conversation): FrontendConversation {
    return {
      conversationId: Number(conversation.conversationId),
      participants: listToArray<Principal>(
        conversation.participants as List_3
      ).map(principalToString),
    };
  }

  async createConversation(participant: string): Promise<number> {
    const callerPrincipal = await this.actor.whoami();
    const participantPrincipal = Principal.fromText(participant);
    const participants = [callerPrincipal, participantPrincipal];

    const result = await this.actor.createConversation(participants);
    return Number(result);
  }

  async getAllConversationsByPrincipal(
    principal: Principal
  ): Promise<FrontendConversation[]> {
    const result = await this.actor.getAllConversationsByPrincipal(principal);
    return result.map(this.mapConversation);
  }

  async getAllMessagesByConversation(
    conversationId: number
  ): Promise<FrontendMessage[]> {
    const result = await this.actor.getAllMessagesByConversation(
      BigInt(conversationId)
    );
    return result.map(this.mapMessage);
  }

  async sendMessage(
    conversationId: number,
    recipientPrincipal: string,
    text: string
  ): Promise<number> {
    const recipient = Principal.fromText(recipientPrincipal);
    const result = await this.actor.sendMessage(
      BigInt(conversationId),
      recipient,
      text
    );
    return Number(result);
  }
}
