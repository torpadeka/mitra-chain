import { ActorSubclass } from "@dfinity/agent";
import { _SERVICE, Event } from "@/declarations/backend/backend.did";
import { Principal } from "@ic-reactor/react/dist/types";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

export interface FrontendEvent {
  id: number;
  organizerPrincipal: string;
  title: string;
  category:
    | "Expo"
    | "Webinar"
    | "Workshop"
    | "Networking"
    | "Bazaar"
    | "DiscoveryDay";
  description: string;
  startTime: Date;
  endTime: Date;
  location: { Online?: string; Physical?: { address: string; city: string } };
  imageUrl: string;
  featuredFranchises: number[];
  attendees: string[];
  registrationMode: "Open" | "InviteOnly";
  createdAt: Date;
}

export class EventHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapEvent(event: Event): FrontendEvent {
    return {
      id: Number(event.id),
      organizerPrincipal: principalToString(event.organizerPrincipal),
      title: event.title,
      category:
        "Expo" in event.category
          ? "Expo"
          : "Webinar" in event.category
            ? "Webinar"
            : "Workshop" in event.category
              ? "Workshop"
              : "Networking" in event.category
                ? "Networking"
                : "Bazaar" in event.category
                  ? "Bazaar"
                  : "DiscoveryDay",
      description: event.description,
      startTime: timeToDate(event.startTime),
      endTime: timeToDate(event.endTime),
      location:
        "Online" in event.location
          ? { Online: event.location.Online }
          : {
              Physical: {
                address: event.location.Physical.address,
                city: event.location.Physical.city,
              },
            },
      imageUrl: event.imageUrl,
      featuredFranchises: event.featuredFranchises.map(Number),
      attendees: event.attendees.map(principalToString),
      registrationMode:
        "Open" in event.registrationMode ? "Open" : "InviteOnly",
      createdAt: timeToDate(event.createdAt),
    };
  }

  async createNewEvent(
    title: string,
    category:
      | "Expo"
      | "Webinar"
      | "Workshop"
      | "Networking"
      | "Bazaar"
      | "DiscoveryDay",
    description: string,
    startTime: Date,
    endTime: Date,
    location: { Online?: string; Physical?: { address: string; city: string } },
    imageUrl: string,
    featuredFranchises: number[],
    registrationMode: "Open" | "InviteOnly"
  ): Promise<number> {
    const eventCategory =
      category === "Expo"
        ? { Expo: null }
        : category === "Webinar"
          ? { Webinar: null }
          : category === "Workshop"
            ? { Workshop: null }
            : category === "Networking"
              ? { Networking: null }
              : category === "Bazaar"
                ? { Bazaar: null }
                : { DiscoveryDay: null };

    const eventLocation = location.Online
      ? { Online: location.Online }
      : {
          Physical: {
            address: location.Physical!.address,
            city: location.Physical!.city,
          },
        };

    const eventRegistrationMode =
      registrationMode === "Open" ? { Open: null } : { InviteOnly: null };

    const result = await this.actor.createNewEvent(
      title,
      eventCategory,
      description,
      BigInt(startTime.getTime() * 1_000_000), // Convert to nanoseconds
      BigInt(endTime.getTime() * 1_000_000), // Convert to nanoseconds
      eventLocation,
      imageUrl,
      featuredFranchises.map(BigInt),
      eventRegistrationMode
    );
    return Number(result);
  }

  async getAllEvents(): Promise<FrontendEvent[]> {
    const result = await this.actor.getAllEvents();
    return result.map(this.mapEvent);
  }

  async getEventDetails(id: number): Promise<FrontendEvent | null> {
    const result = await this.actor.getEventDetails(BigInt(id));
    return optionalToUndefined(result)
      ? this.mapEvent(optionalToUndefined(result)!)
      : null;
  }

  async registerInEvents(eventId: number): Promise<boolean> {
    const result = await this.actor.registerInEvents(BigInt(eventId));
    return result;
  }

  async isAttendee(eventId: number, principal: Principal): Promise<boolean> {
    const result = await this.actor.isAttendee(BigInt(eventId), principal);
    return result;
  }

  async isOrganizer(eventId: number, principal: Principal): Promise<boolean> {
    const result = await this.actor.isOrganizer(BigInt(eventId), principal);
    return result;
  }
}
