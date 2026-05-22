"use client";

import { useState } from "react";
import LoginPage from "@/components/LoginPage";
import AppShell from "@/components/AppShell";

export default function Home() {
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return <LoginPage onLogin={() => setAuthenticated(true)} />;
  }

  return <AppShell onLogout={() => setAuthenticated(false)} />;
}
