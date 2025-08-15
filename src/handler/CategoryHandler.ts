import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Category } from "@/declarations/backend/backend.did";
import { optionalToUndefined } from "@/lib/utils";

export interface FrontendCategory {
  id: number;
  name: string;
  description: string;
}

export class CategoryHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapCategory(category: Category): FrontendCategory {
    return {
      id: Number(category.id),
      name: category.name,
      description: category.description,
    };
  }

  async createCategory(name: string, description: string): Promise<number> {
    const result = await this.actor.createCategory(name, description);
    return Number(result);
  }

  async getCategory(id: number): Promise<FrontendCategory | null> {
    const result = await this.actor.getCategory(BigInt(id));
    return optionalToUndefined(result)
      ? this.mapCategory(optionalToUndefined(result)!)
      : null;
  }
}
