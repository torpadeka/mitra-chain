import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "@/context/AuthContext";

export type Role =
  | { Admin: null }
  | { Franchisee: null }
  | { Franchisor: null };

export function protectedPage(requiredRole: Role) {
  const { user, isAuthenticated } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user === null) {
      console.log("protectedPage: Waiting for user data to load");
      return;
    }

    if (!isAuthenticated) {
      console.log(
        "protectedPage: Redirecting to /register due to unauthenticated"
      );
      //   navigate("/register", { replace: true });
      return;
    }

    const hasRequiredRole =
      user && Object.keys(user.role)[0] === Object.keys(requiredRole)[0];

    if (!hasRequiredRole) {
      console.log(
        "protectedPage: Redirecting to /register due to incorrect role",
        {
          userRole: user?.role,
          requiredRole,
        }
      );
      //   navigate("/register", { replace: true });
    } else {
      console.log("protectedPage: Access granted", { userRole: user?.role });
    }
  }, [user, isAuthenticated, navigate, requiredRole]);

  return (
    isAuthenticated &&
    user !== null &&
    Object.keys(user.role)[0] === Object.keys(requiredRole)[0]
  );
}
