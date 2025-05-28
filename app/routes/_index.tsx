import { useEffect } from "react";
import { useNavigate } from "@remix-run/react";

export default function Index() {
  const navigate = useNavigate();
  useEffect(() => {
    console.log('[Index] 自动跳转到 /sessions');
    navigate("/sessions", { replace: true });
  }, [navigate]);
  return null;
}
