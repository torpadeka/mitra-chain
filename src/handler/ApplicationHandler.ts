import { ActorSubclass } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { _SERVICE, Application } from "@/declarations/backend/backend.did";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

export interface FrontendApplication {
  id: number;
  franchiseId: number;
  applicantPrincipal: string;
  status: "Submitted" | "InReview" | "Approved" | "Rejected" | "Pending Payment" | "Completed";
  coverLetter: string;
  createdAt: Date;
  updatedAt: Date;
  rejectionReason?: string;
  price: number;
  completedAt?: Date; 
}

export class ApplicationHandler {
  private actor: ActorSubclass<_SERVICE>;

  constructor(actor: ActorSubclass<_SERVICE>) {
    this.actor = actor;
  }

  private mapApplication(application: Application): FrontendApplication {
    const statusMap: Record<
      keyof Application["status"],
      FrontendApplication["status"]
    > = {
      Submitted: "Submitted",
      InReview: "InReview",
      Approved: "Approved",
      Rejected: "Rejected",
      PendingPayment: "Pending Payment",
      Completed: "Completed",
    };
    return {
      id: Number(application.id),
      franchiseId: Number(application.franchiseId),
      applicantPrincipal: principalToString(application.applicantPrincipal),
      status:
        statusMap[Object.keys(application.status)[0] as keyof typeof statusMap],
      coverLetter: application.coverLetter,
      createdAt: timeToDate(application.createdAt),
      updatedAt: timeToDate(application.updatedAt),
      rejectionReason: optionalToUndefined(application.rejectionReason),
      price: Number(application.price),
      completedAt: optionalToUndefined(application.completedAt)
        ? timeToDate(optionalToUndefined(application.completedAt)!)
        : undefined,
    };
  }

  async applyForFranchise(
    franchiseId: number,
    coverLetter: string
  ): Promise<number> {
    const result = await this.actor.applyForFranchise(
      BigInt(franchiseId),
      coverLetter
    );
    return Number(result);
  }

  async getApplication(id: number): Promise<FrontendApplication | null> {
    const result = await this.actor.getApplication(BigInt(id));
    return optionalToUndefined(result)
      ? this.mapApplication(optionalToUndefined(result)!)
      : null;
  }

  async getApplicationsByOwner(owner: string): Promise<FrontendApplication[]> {
    const principal = Principal.fromText(owner);
    const result = await this.actor.getApplicationsByOwner(principal);
    return result.map(this.mapApplication);
  }
  
  async payApplication(id: number){
    const result = await this.actor.payApplication(BigInt(id));
  }

  async getApplicationsByApplicant(
    applicant: string
  ): Promise<FrontendApplication[]> {
    const principal = Principal.fromText(applicant);
    const result = await this.actor.getApplicationsByApplicant(principal);
    return result.map(this.mapApplication);
  }

  async approveApplication(applicationId: number, price: number): Promise<number> {
    const result = await this.actor.approveApplication(BigInt(applicationId), BigInt(price));
    return Number(result);
  }

  async rejectApplication(
    applicationId: number,
    reason: string
  ): Promise<boolean> {
    return await this.actor.rejectApplication(BigInt(applicationId), reason);
  }
}
