import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { AuthClient } from "@dfinity/auth-client";
import { ActorSubclass, HttpAgent } from "@dfinity/agent";
import { Principal } from "@dfinity/principal";
import { createActor, canisterId } from "@/declarations/backend";
import { _SERVICE, Role, User } from "@/declarations/backend/backend.did";
import {
  optionalToUndefined,
  principalToString,
  timeToDate,
} from "@/lib/utils";

const network = process.env.DFX_NETWORK || "local";
const identityProvider =
  network === "ic"
    ? "https://identity.ic0.app"
    : "http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943";
const wslIp = "127.0.0.1";

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

interface UserContextType {
  user: FrontendUser | null;
  actor: ActorSubclass<_SERVICE> | null;
  principal: string | null;
  authClient: AuthClient | null;
  isAuthenticated: boolean;
  isInitializing: boolean; // Added
  setUser: React.Dispatch<React.SetStateAction<FrontendUser | null>>;
  login: () => Promise<void>;
  saveToSession: (
    user: FrontendUser | null,
    isAuthenticated: boolean,
    principal: string | null
  ) => void;
  loadFromSession: () => {
    user: FrontendUser | null;
    isAuthenticated: boolean;
    principal: string | null;
  };
  clearSession: () => void;
  logout: (onSuccess: () => void) => Promise<void>;
  whoami: () => Promise<string>;
  getUser: (principal: string) => Promise<FrontendUser | null>;
  createUser: (
    name: string,
    email: string,
    bio: string,
    role: Role,
    profilePicUrl: string,
    linkedin?: string,
    instagram?: string,
    twitter?: string,
    address?: string,
    phoneNumber?: string
  ) => Promise<FrontendUser>;
  updateFranchisorProfile: (
    bio?: string,
    profilePicUrl?: string,
    linkedin?: string,
    instagram?: string,
    twitter?: string,
    address?: string,
    phoneNumber?: string
  ) => Promise<FrontendUser | null>;
  updateFranchiseeProfile: (
    bio?: string,
    profilePicUrl?: string
  ) => Promise<FrontendUser | null>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [principal, setPrincipal] = useState<string | null>(null);
  const [authClient, setAuthClient] = useState<AuthClient | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); // Added

  const mapUser = (backendUser: User): FrontendUser => {
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
  };

  const serializeUser = (user: FrontendUser | null): string => {
    if (!user) return "";
    return JSON.stringify({
      ...user,
      createdAt: user.createdAt.toISOString(),
    });
  };

  const deserializeUser = (stored: string): FrontendUser | null => {
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      createdAt: new Date(parsed.createdAt),
    };
  };

  const saveToSession = (
    user: FrontendUser | null,
    isAuthenticated: boolean,
    principal: string | null
  ) => {
    sessionStorage.setItem(
      "auth_isAuthenticated",
      JSON.stringify(isAuthenticated)
    );
    sessionStorage.setItem("auth_user", serializeUser(user));
    sessionStorage.setItem("auth_principal", JSON.stringify(principal));
  };

  const loadFromSession = () => {
    const storedUser = sessionStorage.getItem("auth_user");
    const storedIsAuthenticated = sessionStorage.getItem(
      "auth_isAuthenticated"
    );
    const storedPrincipal = sessionStorage.getItem("auth_principal");
    return {
      user: storedUser ? deserializeUser(storedUser) : null,
      isAuthenticated: storedIsAuthenticated
        ? JSON.parse(storedIsAuthenticated)
        : false,
      principal: storedPrincipal ? JSON.parse(storedPrincipal) : null,
    };
  };

  const clearSession = () => {
    sessionStorage.removeItem("auth_user");
    sessionStorage.removeItem("auth_isAuthenticated");
    sessionStorage.removeItem("auth_principal");
  };

  useEffect(() => {
    const init = async () => {
      const client = await AuthClient.create();
      setAuthClient(client);
      try {
        // Load session data first
        const {
          user: storedUser,
          isAuthenticated: storedIsAuthenticated,
          principal: storedPrincipal,
        } = loadFromSession();
        if (storedUser && storedIsAuthenticated && storedPrincipal) {
          setUser(storedUser);
          setIsAuthenticated(storedIsAuthenticated);
          setPrincipal(storedPrincipal);
          setIsInitializing(false); // Set to false if session data is loaded
          return; // Skip further initialization if session data exists
        }
        const identity = client.getIdentity();
        const principalObj = identity.getPrincipal();
        const principalStr = principalObj.toString();
        const agent = new HttpAgent({
          host:
            network === "local" ? `http://${wslIp}:4943` : "https://ic0.app",
          identity,
        });

        if (network === "local") {
          try {
            await agent.fetchRootKey();
          } catch (err) {
            console.warn("Failed to fetch root key:", err);
          }
        }

        const actor = createActor(canisterId, {
          agentOptions: { identity },
        });

        setActor(actor);
        setPrincipal(principalStr);
        setIsAuthenticated(await client.isAuthenticated());

        // Fetch user data if authenticated and no user is loaded from session
        if ((await client.isAuthenticated()) && !storedUser && principalStr) {
          try {
            const fetchedUser = await getUser(principalStr);
            if (fetchedUser && fetchedUser.name !== "") {
              setUser(fetchedUser);
              saveToSession(fetchedUser, true, principalStr);
            } else {
              console.error("Error fetching user on init");
            }
          } catch (err) {
            console.error("Error fetching user on init:", err);
          }
        }
      } finally {
        setIsInitializing(false); // Always set to false when initialization completes
      }
    };

    init();
  }, []); // Keep empty dependency array as per original

  const login = async (): Promise<void> => {
    if (!authClient || !actor || !principal) return;
    setIsInitializing(true);
    await authClient.login({
      identityProvider,
      onSuccess: async () => {
        try {
          const fetchedUser = await getUser(principal);
          if (!fetchedUser || fetchedUser.name === "") {
            console.log("No user");
          } else {
            setUser(fetchedUser);
            setIsAuthenticated(true);
            saveToSession(fetchedUser, true, principal);
          }
        } catch (err) {
          console.error("Error during login user fetch:", err);
        } finally {
          setIsInitializing(false);
          window.location.reload();
        }
      },
    });
  };

  const logout = async (onSuccess: () => void): Promise<void> => {
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(authClient);
    if (!authClient) return;
    console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
    setIsInitializing(true);
    await authClient.logout();
    setUser(null);
    setIsAuthenticated(false);
    clearSession();
    onSuccess();
    setIsInitializing(false);
  };

  const whoami = async (): Promise<string> => {
    if (!actor) throw new Error("Actor not initialized");
    const result = await actor.whoami();
    return result.toString();
  };

  const getUser = async (
    principalStr: string
  ): Promise<FrontendUser | null> => {
    if (!actor) return null;
    const principalObj = Principal.fromText(principalStr);
    const result = await actor.getUser(principalObj);
    const user = optionalToUndefined(result);
    return user ? mapUser(user) : null;
  };

  const createUser = async (
    name: string,
    email: string,
    bio: string,
    role: Role,
    profilePicUrl: string,
    linkedin?: string,
    instagram?: string,
    twitter?: string,
    address?: string,
    phoneNumber?: string
  ): Promise<FrontendUser> => {
    if (!actor) throw new Error("Actor not initialized");
    setIsInitializing(true); // Set to true during user creation
    try {
      const userArr = await actor.registerUser(
        name,
        email,
        bio,
        role,
        profilePicUrl,
        linkedin ? [linkedin] : [],
        instagram ? [instagram] : [],
        twitter ? [twitter] : [],
        address ? [address] : [],
        phoneNumber ? [phoneNumber] : []
      );
      const user = optionalToUndefined(userArr);
      if (!user) {
        throw new Error("User registration failed");
      }
      const mappedUser = mapUser(user);
      setUser(mappedUser); // Update context with new user
      saveToSession(mappedUser, true, principal);
      return mappedUser;
    } finally {
      setIsInitializing(false); // Set to false after user creation completes
    }
  };

  const updateFranchisorProfile = async (
    bio?: string,
    profilePicUrl?: string,
    linkedin?: string,
    instagram?: string,
    twitter?: string,
    address?: string,
    phoneNumber?: string
  ): Promise<FrontendUser | null> => {
    if (!actor) throw new Error("Actor not initialized");
    setIsInitializing(true); // Set to true during profile update
    try {
      const result = await actor.updateFranchisorProfile(
        bio ? [bio] : [],
        profilePicUrl ? [profilePicUrl] : [],
        linkedin ? [linkedin] : [],
        instagram ? [instagram] : [],
        twitter ? [twitter] : [],
        address ? [address] : [],
        phoneNumber ? [phoneNumber] : []
      );
      const user = optionalToUndefined(result);
      if (user) {
        const mappedUser = mapUser(user);
        setUser(mappedUser); // Update context with new user data
        saveToSession(mappedUser, isAuthenticated, principal);
        return mappedUser;
      }
      return null;
    } finally {
      setIsInitializing(false); // Set to false after profile update completes
    }
  };

  const updateFranchiseeProfile = async (
    bio?: string,
    profilePicUrl?: string
  ): Promise<FrontendUser | null> => {
    if (!actor) throw new Error("Actor not initialized");
    setIsInitializing(true); // Set to true during profile update
    try {
      const result = await actor.updateFranchiseeProfile(
        bio ? [bio] : [],
        profilePicUrl ? [profilePicUrl] : []
      );
      const user = optionalToUndefined(result);
      if (user) {
        const mappedUser = mapUser(user);
        setUser(mappedUser); // Update context with new user data
        saveToSession(mappedUser, isAuthenticated, principal);
        return mappedUser;
      }
      return null;
    } finally {
      setIsInitializing(false); // Set to false after profile update completes
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        actor,
        principal,
        authClient,
        isAuthenticated,
        isInitializing, // Added to context
        setUser,
        saveToSession,
        loadFromSession,
        clearSession,
        login,
        logout,
        whoami,
        getUser,
        createUser,
        updateFranchisorProfile,
        updateFranchiseeProfile,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
