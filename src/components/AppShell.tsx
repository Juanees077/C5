"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  LayoutDashboard, Trophy,
  Bell, LogOut, Zap, ChevronRight,
  Menu, X, Sun, Moon, Phone, // Phone kept for nav item usage
  Shield, Activity, Radio, Map
} from "lucide-react";
import Dashboard       from "./views/Dashboard";
import FifaPanel       from "./views/FifaPanel";
import InterpreterPanel from "./views/InterpreterPanel";

const MapView = dynamic(() => import("./views/MapView"), { ssr: false });

type Theme = "dark" | "light";
type ViewId = "dashboard" | "calls" | "map" | "fifa";

const NAV_ITEMS: {
  id: ViewId; label: string; sub: string;
  icon: React.ElementType; badge?: string; badgeType?: string; group?: string;
}[] = [
  { id: "dashboard", label: "Dashboard",          sub: "Centro operacional",  icon: LayoutDashboard, group: "OPERACIÓN" },
  { id: "calls",     label: "Centro de Llamadas", sub: "Emergencias activas", icon: Phone,  badge: "12", badgeType: "live" },
  { id: "map",       label: "Mapa Operativo",     sub: "Geolocalización",     icon: Map },
  { id: "fifa",      label: "Panel FIFA 2026",    sub: "Mundial México",      icon: Trophy, badge: "EN VIVO", badgeType: "live", group: "FIFA 2026" },
];

const SYSTEM_STATS = [
  { label: "Llamadas",  value: "12", color: "var(--electric-bright)" },
  { label: "Agentes en línea",  value: "47", color: "var(--success)" },
  { label: "Resp. promedio",    value: "7s", color: "var(--mx-gold)" },
];

export default function AppShell({ onLogout }: { onLogout?: () => void }) {
  const [active, setActive]       = useState<ViewId>("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [theme, setTheme]         = useState<Theme>("light");
  const [time, setTime]           = useState("");
  const [date, setDate]           = useState("");
  const [notifications]           = useState(5);
  const [callPulse, setCallPulse] = useState(false);
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const saved = localStorage.getItem("c5-theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setTheme(saved);
    } else {
      localStorage.setItem("c5-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("c5-theme", next);
  };

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString("es-MX", { hour12: false }));
      setDate(now.toLocaleDateString("es-MX", { weekday: "short", day: "2-digit", month: "short" }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  /* Periodic call pulse for attention */
  useEffect(() => {
    pulseRef.current = setInterval(() => {
      setCallPulse(true);
      setTimeout(() => setCallPulse(false), 800);
    }, 6000);
    return () => { if (pulseRef.current) clearInterval(pulseRef.current); };
  }, []);

  const currentNav = NAV_ITEMS.find(n => n.id === active);
  const isDark = theme === "dark";

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "var(--bg-app)" }}>

      {/* ── AMBIENT ORBS ── */}
      {isDark && (
        <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
          <div style={{
            position: "absolute", width: 1000, height: 1000, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 65%)",
            top: "-25%", left: "0%", animation: "ambient-drift 40s ease-in-out infinite",
          }} />
          <div style={{
            position: "absolute", width: 700, height: 700, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 65%)",
            bottom: "-15%", right: "5%", animation: "ambient-drift 30s ease-in-out infinite reverse",
          }} />
          <div style={{
            position: "absolute", width: 500, height: 500, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.05) 0%, transparent 65%)",
            top: "40%", right: "30%", animation: "ambient-drift 22s ease-in-out infinite",
            animationDelay: "-8s",
          }} />
        </div>
      )}

      {/* ══════════════════════
          SIDEBAR
          ══════════════════════ */}
      <aside style={{
        position: "relative", zIndex: 20, flexShrink: 0,
        width: collapsed ? 70 : 248,
        transition: "width 0.38s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
        background: isDark
          ? "linear-gradient(180deg, rgba(6,10,26,0.97) 0%, rgba(8,14,34,0.97) 100%)"
          : "rgba(255,255,255,0.96)",
        backdropFilter: "blur(40px) saturate(200%)",
        WebkitBackdropFilter: "blur(40px) saturate(200%)",
        borderRight: `1px solid ${isDark ? "rgba(100,140,255,0.10)" : "rgba(148,163,210,0.22)"}`,
        overflow: "hidden",
      }}>

        {/* Sidebar left glow */}
        {isDark && (
          <div style={{
            position: "absolute", left: 0, top: "20%", bottom: "20%", width: 1,
            background: "linear-gradient(180deg, transparent, rgba(59,130,246,0.35), transparent)",
          }} />
        )}

        {/* ── LOGO ── */}
        <div style={{
          display: "flex", alignItems: "center",
          gap: collapsed ? 0 : 12,
          padding: collapsed ? "20px 17px" : "20px 18px",
          borderBottom: `1px solid ${isDark ? "rgba(100,140,255,0.09)" : "rgba(148,163,210,0.18)"}`,
          minHeight: 72, flexShrink: 0,
          justifyContent: collapsed ? "center" : "flex-start",
        }}>
          {/* Logo mark */}
          <div style={{
            width: 38, height: 38, borderRadius: 11, flexShrink: 0,
            overflow: "hidden",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <img src="/IMG_2225.JPG.jpeg" alt="C5 Logo" width={38} height={38} style={{ objectFit: "contain", display: "block" }} />
          </div>

          {!collapsed && (
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{
                fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16,
                color: isDark ? "#60A5FA" : "#1D4ED8",
                letterSpacing: "-0.02em",
              }}>C5 México</div>
              <div style={{
                fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)",
                letterSpacing: "0.14em", marginTop: 1, textTransform: "uppercase",
              }}>Nuevo León · Emergencias</div>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            style={{
              marginLeft: collapsed ? 0 : "auto", flexShrink: 0,
              background: "none", border: "none", cursor: "pointer",
              color: "var(--text-02)", padding: 4, borderRadius: 6,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            aria-label="Toggle sidebar"
          >
            {collapsed ? <Menu size={15} /> : <X size={14} />}
          </button>
        </div>

        {/* ── SYSTEM STATUS STRIP ── */}
        {!collapsed && (
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${isDark ? "rgba(100,140,255,0.08)" : "rgba(148,163,210,0.15)"}` }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              background: isDark ? "rgba(16,185,129,0.08)" : "rgba(16,185,129,0.08)",
              border: "1px solid rgba(16,185,129,0.18)",
              borderRadius: 10, padding: "8px 12px",
            }}>
              <div style={{ position: "relative", width: 8, height: 8, flexShrink: 0 }}>
                <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--success)" }} />
                <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "rgba(16,185,129,0.25)", animation: "ping 2s ease infinite" }} />
              </div>
              <span style={{ fontSize: 10, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--success)", flex: 1, letterSpacing: "0.08em" }}>
                SISTEMA OPERACIONAL
              </span>
              <Radio size={10} style={{ color: "var(--success)", opacity: 0.7 }} />
            </div>
          </div>
        )}

        {/* ── NAV ── */}
        <nav style={{ flex: 1, overflowY: "auto", padding: "10px 10px" }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            const isCallItem = item.id === "calls";

            return (
              <div key={item.id}>
                {item.group && !collapsed && (
                  <div style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: "0.16em",
                    color: "var(--text-02)", textTransform: "uppercase",
                    padding: "16px 8px 7px", opacity: 0.55,
                  }}>{item.group}</div>
                )}

                <button
                  onClick={() => setActive(item.id)}
                  title={collapsed ? item.label : undefined}
                  style={{
                    width: "100%",
                    display: "flex", alignItems: "center",
                    gap: 10,
                    padding: collapsed ? "11px 16px" : "11px 12px",
                    borderRadius: 11, marginBottom: 3,
                    cursor: "pointer",
                    position: "relative",
                    background: isActive
                      ? isDark
                        ? "linear-gradient(135deg, rgba(59,130,246,0.18) 0%, rgba(6,182,212,0.10) 100%)"
                        : "rgba(59,130,246,0.09)"
                      : "transparent",
                    border: isActive
                      ? `1px solid ${isDark ? "rgba(59,130,246,0.28)" : "rgba(59,130,246,0.20)"}`
                      : "1px solid transparent",
                    boxShadow: isActive
                      ? isDark ? "0 4px 20px rgba(59,130,246,0.14), inset 0 1px 0 rgba(255,255,255,0.05)" : "0 2px 12px rgba(59,130,246,0.10)"
                      : "none",
                    color: isActive ? "var(--text-00)" : "var(--text-02)",
                    fontSize: 13, fontWeight: isActive ? 600 : 400,
                    textAlign: "left",
                    transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                    justifyContent: collapsed ? "center" : "flex-start",
                    transform: isCallItem && callPulse ? "scale(1.01)" : "scale(1)",
                  }}
                >
                  {/* Active left bar */}
                  {isActive && !collapsed && (
                    <div style={{
                      position: "absolute", left: 0, top: "18%", bottom: "18%",
                      width: 3, borderRadius: "0 2px 2px 0",
                      background: "var(--grad-electric)",
                      boxShadow: "0 0 10px var(--electric-glow)",
                    }} />
                  )}

                  <Icon size={16} style={{
                    color: isActive ? "var(--electric-bright)" : "var(--text-02)",
                    flexShrink: 0, transition: "color 0.22s",
                    filter: isActive ? "drop-shadow(0 0 6px rgba(59,130,246,0.5))" : "none",
                  }} />

                  {!collapsed && (
                    <>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ lineHeight: 1.2 }}>{item.label}</div>
                        <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 1, opacity: 0.8 }}>{item.sub}</div>
                      </div>

                      {item.badge && (
                        <span style={{
                          fontSize: 9, fontWeight: 700, padding: "2px 7px",
                          borderRadius: 6, letterSpacing: "0.05em", flexShrink: 0,
                          background:
                            item.badgeType === "live"   ? "rgba(244,63,94,0.14)" :
                            item.badgeType === "danger" ? "var(--critical-dim)" :
                            "var(--electric-dim)",
                          color:
                            item.badgeType === "live"   ? "var(--critical)" :
                            item.badgeType === "danger" ? "var(--critical)" :
                            "var(--electric-bright)",
                          border:
                            item.badgeType === "live" ? "1px solid rgba(244,63,94,0.30)" : "none",
                          animation: item.badgeType === "live" ? "dot-blink 2s ease-in-out infinite" : "none",
                        }}>
                          {item.badge}
                        </span>
                      )}

                      {isActive && (
                        <ChevronRight size={12} style={{ color: "var(--electric-bright)", opacity: 0.5, flexShrink: 0 }} />
                      )}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </nav>


        {/* ── USER FOOTER ── */}
        <div style={{ padding: "12px 10px", flexShrink: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "8px 6px" : "10px 12px",
            borderRadius: 11,
            background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.035)",
            border: "1px solid var(--glass-border)",
            justifyContent: collapsed ? "center" : "flex-start",
          }}>
            {/* Avatar */}
            <div style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 12, fontWeight: 800, color: "#fff",
              boxShadow: "0 0 14px rgba(59,130,246,0.35)",
              fontFamily: "var(--font-display)",
            }}>AT</div>

            {!collapsed && (
              <>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-00)" }}>Agente Torres</div>
                  <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)", marginTop: 1 }}>
                    Ext. 5099 · Turno Matutino
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-02)", padding: 5, borderRadius: 7 }}
                  aria-label="Cerrar sesión"
                >
                  <LogOut size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* ══════════════════════
          MAIN COLUMN
          ══════════════════════ */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, position: "relative", zIndex: 10 }}>

        {/* ── TOPBAR ── */}
        <header style={{
          display: "flex", alignItems: "center",
          padding: "0 28px", height: 62, flexShrink: 0,
          background: isDark
            ? "rgba(6,10,26,0.88)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(40px) saturate(200%)",
          WebkitBackdropFilter: "blur(40px) saturate(200%)",
          borderBottom: `1px solid ${isDark ? "rgba(100,140,255,0.09)" : "rgba(148,163,210,0.20)"}`,
          position: "relative",
          gap: 0,
        }}>


          {/* LEFT — Page title */}
          <div style={{ flex: "0 0 220px" }}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15,
              color: "var(--text-00)", letterSpacing: "-0.02em",
            }}>
              {currentNav?.label}
            </div>
            <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)", letterSpacing: "0.12em", marginTop: 2 }}>
              C5 MX · {currentNav?.id.toUpperCase()}
            </div>
          </div>

          {/* CENTER — Live status pills */}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 12 }}>
            {/* Active calls */}

          </div>

          {/* RIGHT — Controls */}
          <div style={{ flex: "0 0 auto", display: "flex", alignItems: "center", gap: 6 }}>

            {/* Clock */}
            <div style={{
              display: "flex", alignItems: "center", gap: 9,
              background: "var(--s2)", border: "1px solid var(--glass-border)",
              borderRadius: 10, padding: "7px 14px",
            }}>
              <Activity size={11} style={{ color: "var(--neon)" }} />
              <div>
                <div style={{ fontSize: 13, fontFamily: "var(--font-mono)", fontWeight: 700, color: "var(--text-00)", lineHeight: 1 }}>{time}</div>
                <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)", marginTop: 2, letterSpacing: "0.05em" }}>{date}</div>
              </div>
            </div>

            {/* Divider */}
            <div style={{ width: 1, height: 26, background: "var(--glass-border)", margin: "0 2px" }} />

            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "var(--s2)", border: "1px solid var(--glass-border)",
                borderRadius: 10, padding: "8px 13px", cursor: "pointer",
                color: isDark ? "var(--mx-gold)" : "var(--electric-bright)",
                fontSize: 11, fontWeight: 600, fontFamily: "var(--font-body)",
              }}
            >
              {isDark ? <><Sun size={13} /><span>Claro</span></> : <><Moon size={13} /><span>Oscuro</span></>}
            </button>

            {/* Notifications */}
            <button style={{
              position: "relative",
              background: "var(--s2)", border: "1px solid var(--glass-border)",
              borderRadius: 10, padding: "8px 11px", cursor: "pointer", color: "var(--text-01)",
              display: "flex", alignItems: "center",
            }}>
              <Bell size={15} />
              {notifications > 0 && (
                <span style={{
                  position: "absolute", top: 3, right: 3,
                  width: 15, height: 15, borderRadius: "50%",
                  background: "var(--critical)", color: "#fff",
                  fontSize: 8, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 8px rgba(244,63,94,0.50)",
                  animation: "dot-blink 2s ease-in-out infinite",
                }}>{notifications}</span>
              )}
            </button>

          </div>
        </header>

        {/* ── CONTENT ── */}
        <main
          key={active}
          style={{
            flex: 1,
            overflowY: active === "map" ? "hidden" : "auto",
            padding: active === "map" ? 0 : "24px 28px",
            display: active === "map" ? "flex" : "block",
            flexDirection: "column",
          }}
        >
          <div className={active !== "map" ? "animate-in" : undefined} style={active === "map" ? { flex: 1, display: "flex", flexDirection: "column", height: "100%" } : undefined}>
            {active === "dashboard" && <Dashboard />}
            {active === "calls"     && <InterpreterPanel />}
            {active === "map"       && <MapView />}
            {active === "fifa"      && <FifaPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}
