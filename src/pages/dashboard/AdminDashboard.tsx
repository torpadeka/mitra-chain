import { useUser } from "@/context/AuthContext";
import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role !== "Admin") navigate("/");
  }, [user]);

  return (
    <div>
      <div></div>
    </div>
  );
}
