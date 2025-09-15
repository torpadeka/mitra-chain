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
  principal: Principal | null;
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
  getUser: (principal: Principal) => Promise<FrontendUser | null>;
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
  // init: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<FrontendUser | null>(null);
  const [actor, setActor] = useState<ActorSubclass<_SERVICE> | null>(null);
  const [principal, setPrincipal] = useState<Principal | null>(null);
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

  const init = async () => {
    const client = await AuthClient.create();
    setAuthClient(client);
    try {
      const {
        user: storedUser,
        isAuthenticated: storedIsAuthenticated,
        principal: storedPrincipal,
      } = loadFromSession();

      // Initialize agent and actor first
      const identity = client.getIdentity();
      const principalObj = identity.getPrincipal();
      const principalStr = principalObj.toString();
      const agent = new HttpAgent({
        host: network === "local" ? `http://${wslIp}:4943` : "https://ic0.app",
        identity,
      });

      if (network === "local") {
        try {
          await agent.fetchRootKey();
        } catch (err) {
          console.error("Failed to fetch root key:", err);
        }
      }

      const actor = createActor(canisterId, {
        agent,
      });
      if (!actor) {
        console.error("Failed to create actor with canisterId:", canisterId);
        setIsInitializing(false);
        return;
      }
      setActor(actor);
      setPrincipal(principalObj);

      // Handle session data
      if (storedUser && storedIsAuthenticated && storedPrincipal) {
        setUser(storedUser);
        setIsAuthenticated(storedIsAuthenticated);
        setPrincipal(storedPrincipal);
        setIsInitializing(false);
        return;
      }

      // Fetch user data if authenticated and no session user
      setIsAuthenticated(await client.isAuthenticated());
      if ((await client.isAuthenticated()) && !storedUser && principalStr) {
        try {
          const fetchedUser = await getUser(principalObj);
          if (fetchedUser && fetchedUser.name !== "") {
            setUser(fetchedUser);
            saveToSession(fetchedUser, true, principalStr);
          } else {
            console.warn("No user found for principal:", principalStr);
          }
        } catch (err) {
          console.error("Error fetching user on init:", err);
        }
      }
    } catch (err) {
      console.error("Initialization failed:", err);
    } finally {
      console.log("Actor:", actor);
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    init();
  }, []);

  const login = async (): Promise<void> => {
    console.log("Starting login process...");
    console.log("AuthClient:", authClient);
    console.log("Actor:", actor);
    console.log("Principal:", principal);
    if (!authClient || !actor || !principal) return;
    console.log("AuthClient, actor, and principal are available.");
    setIsInitializing(true);
    await authClient.login({
      identityProvider,
      onSuccess: async () => {
        try {
          // init();
          const fetchedUser = await getUser(principal);
          // console.log("Fetched user on login:", fetchedUser);
          if (!fetchedUser || fetchedUser.name === "") {
            window.location.href = "/register";
          } else {
            setUser(fetchedUser);
            setIsAuthenticated(true);
            saveToSession(fetchedUser, true, principal.toString());
          }
        } catch (err) {
          console.error("Error during login user fetch:", err);
          window.location.href = "/register";
        } finally {
          setIsInitializing(false);
        }
      },
    });
  };

  const logout = async (onSuccess: () => void): Promise<void> => {
    if (!authClient) return;
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
    principal: Principal
  ): Promise<FrontendUser | null> => {
    if (!actor) return null;
    const result = await actor.getUser(principal);
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
      saveToSession(mappedUser, true, principal?.toString() || "");
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
      console.log("try");
      const result = await actor.updateFranchisorProfile(
        bio ? [bio] : [],
        profilePicUrl ? [profilePicUrl] : [],
        linkedin ? [linkedin] : [],
        instagram ? [instagram] : [],
        twitter ? [twitter] : [],
        address ? [address] : [],
        phoneNumber ? [phoneNumber] : []
      );
      console.log(result);
      const user = optionalToUndefined(result);
      console.log(user);
      if (user) {
        const mappedUser = mapUser(user);
        setUser(mappedUser); // Update context with new user data
        saveToSession(mappedUser, isAuthenticated, principal?.toString() || "");
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
        saveToSession(mappedUser, isAuthenticated, principal?.toString() || "");
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
        // init,
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
