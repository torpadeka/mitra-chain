import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE, User } from "@/declarations/backend/backend.did";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

export interface FrontendUser {
  principal: string;
  name: string;
  email: string;
  bio: string;
  role: "Franchisor" | "Franchisee" | "Admin";
  createdAt: Date;
  profilePicUrl: string;
  linkedin?: string;
  instagram?: string;
  twitter?: string;
  address?: string;
  phoneNumber?: string;
}

export class UserHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapUser(backendUser: User): FrontendUser {
    return {
      principal: principalToString(backendUser.principal),
      name: backendUser.name,
      email: backendUser.email,
      bio: backendUser.bio,
      role:
        "Franchisor" in backendUser.role
          ? "Franchisor"
          : "Franchisee" in backendUser.role
            ? "Franchisee"
            : "Admin",
      createdAt: timeToDate(backendUser.createdAt),
      profilePicUrl: backendUser.profilePicUrl,
      linkedin: optionalToUndefined(backendUser.linkedin),
      instagram: optionalToUndefined(backendUser.instagram),
      twitter: optionalToUndefined(backendUser.twitter),
      address: optionalToUndefined(backendUser.address),
      phoneNumber: optionalToUndefined(backendUser.phoneNumber),
    };
  }

  async listUsers(): Promise<FrontendUser[]> {
    const result = await this.actor.listUsers();
    return result.map(this.mapUser);
  }
}
