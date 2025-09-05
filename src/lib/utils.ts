import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Principal } from "@dfinity/principal";
import { Time } from "@/declarations/backend/backend.did";
import { Account } from "@dfinity/ledger-icp";

// Define List types to match backend.did.d.ts
export type List = [] | [[bigint, List]];
export type List_1 = [] | [[string, List_1]];
export type List_2 =
  | []
  | [[{ to: Account; from: Account; timestamp: Time }, List_2]];
export type List_3 = [] | [[Principal, List_3]];

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const listToArray = <
  T extends
    | string
    | bigint
    | { to: Account; from: Account; timestamp: Time }
    | Principal,
>(
  list: List | List_1 | List_2 | List_3
): T[] => {
  const result: T[] = [];
  let current = list;
  while (
    Array.isArray(current) &&
    current.length > 0 &&
    current[0] !== undefined
  ) {
    const [head, tail] = current[0] as [T, typeof current];
    result.push(head);
    current = tail;
  }
  return result;
};

export const timeToDate = (time: bigint): Date => {
  return new Date(Number(time) / 1_000_000); // Convert nanoseconds to milliseconds
};

export const optionalToUndefined = <T>(opt: [] | [T]): T | undefined => {
  return opt.length > 0 ? opt[0] : undefined;
};

export const principalToString = (principal: Principal): string => {
  return principal.toText();
};

export const stringToPrincipal = (principalText: string): Principal => {
  try {
    return Principal.fromText(principalText);
  } catch (error) {
    throw new Error(`Invalid Principal string: ${principalText}`);
  }
};

export function toBaseUnits(amount: number, decimals: number): bigint {
  return BigInt(Math.round(amount * 10 ** decimals));
}

export function toMainUnit(amount: bigint, decimals: number): number {
  return Number(amount) / 10 ** decimals;
}
