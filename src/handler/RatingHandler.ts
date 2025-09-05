import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE, Comment } from "@/declarations/backend/backend.did";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

export interface FrontendComment {
  commenter: string;
  text: string;
  timestamp: Date;
}

export class RatingHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapComment(comment: Comment): FrontendComment {
    return {
      commenter: principalToString(comment.commenter),
      text: comment.text,
      timestamp: timeToDate(comment.timestamp),
    };
  }

  async getFranchisorRating(franchisor: string): Promise<number | null> {
    const principal = Principal.fromText(franchisor);
    const result = await this.actor.getFranchisorRating(principal);
    return optionalToUndefined(result) ?? null;
  }

  async checkRateState(franchisor: string): Promise<boolean> {
    const principal = Principal.fromText(franchisor);
    return await this.actor.checkRateState(principal);
  }

  async rateFranchisor(franchisor: string, score: number): Promise<void> {
    const principal = Principal.fromText(franchisor);
    await this.actor.rateFranchisor(principal, BigInt(score));
  }

  async updateRate(franchisor: string, score: number): Promise<void> {
    const principal = Principal.fromText(franchisor);
    await this.actor.updateRate(principal, BigInt(score));
  }

  async sendComments(franchisor: string, text: string): Promise<void> {
    const principal = Principal.fromText(franchisor);
    await this.actor.sendComments(principal, text);
  }

  async getAllComments(franchisor: string): Promise<FrontendComment[]> {
    const principal = Principal.fromText(franchisor);
    const result = await this.actor.getAllComments(principal);
    return result.map(this.mapComment);
  }
}
