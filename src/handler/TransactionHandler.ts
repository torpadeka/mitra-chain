import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Transaction } from "@/declarations/backend/backend.did";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

export interface FrontendTransaction {
  id: number;
  from: string;
  to: string;
  amount: number;
  timestamp: Date;
  purpose: string;
  relatedNftId?: number;
  relatedApplicationId?: number;
}

export class TransactionHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapTransaction(transaction: Transaction): FrontendTransaction {
    return {
      id: Number(transaction.id),
      from: principalToString(transaction.from),
      to: principalToString(transaction.to),
      amount: Number(transaction.amount),
      timestamp: timeToDate(transaction.timestamp),
      purpose: transaction.purpose,
      relatedNftId: optionalToUndefined(transaction.relatedNftId)
        ? Number(optionalToUndefined(transaction.relatedNftId)!)
        : undefined,
      relatedApplicationId: optionalToUndefined(
        transaction.relatedApplicationId
      )
        ? Number(optionalToUndefined(transaction.relatedApplicationId)!)
        : undefined,
    };
  }

  async getTransaction(id: number): Promise<FrontendTransaction | null> {
    const result = await this.actor.getTransaction(BigInt(id));
    return optionalToUndefined(result)
      ? this.mapTransaction(optionalToUndefined(result)!)
      : null;
  }

  async listTransactions(): Promise<FrontendTransaction[]> {
    const result = await this.actor.listTransactions();
    return result.map(this.mapTransaction);
  }
}
