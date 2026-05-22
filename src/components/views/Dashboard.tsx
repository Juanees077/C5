"use client";

import { useState, useEffect, useRef } from "react";
import {
  Phone, AlertTriangle, Clock, CheckCircle2,
  TrendingUp, TrendingDown, Zap, Shield,
  Users, Activity, Trophy, ArrowUpRight,
  Mic, Headphones, Radio, Globe, Languages
} from "lucide-react";

const INITIAL_CALLS = [
  { id: "NL-08441", caller: "María González",  type: "Emergencia médica",   priority: "critical", zone: "Monterrey Centro",   elapsed: 142, status: "active",   agent: "A. Torres" },
  { id: "NL-08440", caller: "Carlos Reyes",    type: "Accidente vial",       priority: "high",     zone: "Av. Constitución",   elapsed: 287, status: "active",   agent: "L. Morales" },
  { id: "NL-08439", caller: "Ana Flores",      type: "Robo con violencia",   priority: "high",     zone: "San Pedro Garza",    elapsed: 64,  status: "active",   agent: "R. Vega" },
  { id: "NL-08438", caller: "Pedro Martínez",  type: "Incendio estructural", priority: "critical", zone: "Apodaca Industrial", elapsed: 412, status: "resolved", agent: "M. Cruz" },
  { id: "NL-08437", caller: "Sofia Herrera",   type: "Persona extraviada",   priority: "medium",   zone: "Santa Catarina",     elapsed: 198, status: "active",   agent: "J. López" },
  { id: "NL-08436", caller: "Luis Ramírez",    type: "Disturbio vecinal",    priority: "low",      zone: "Guadalupe",          elapsed: 553, status: "resolved", agent: "T. Díaz" },
];

const HOURLY = [18,24,19,31,27,38,52,64,71,68,59,73,88,82,76,91,84,79,66,58,49,44,36,28];

const INCIDENT_TYPES = [
  { type: "Emergencia médica", count: 34, color: "var(--critical)",        pct: 34 },
  { type: "Accidente vial",    count: 28, color: "var(--warning)",         pct: 28 },
  { type: "Robo / delito",     count: 19, color: "var(--electric-bright)", pct: 19 },
  { type: "Incendio",          count: 11, color: "var(--mx-gold)",         pct: 11 },
  { type: "Otros",             count: 8,  color: "var(--text-02)",         pct: 8  },
];

const LANGUAGES = [
  { code: "es", name: "Español",    flag: "🇲🇽", calls: 142, color: "#10b981", live: false },
  { code: "en", name: "English",    flag: "🇺🇸", calls: 87,  color: "#3b82f6", live: true  },
  { code: "fr", name: "Français",   flag: "🇫🇷", calls: 31,  color: "#8b5cf6", live: false },
  { code: "pt", name: "Português",  flag: "🇧🇷", calls: 28,  color: "#f59e0b", live: false },
  { code: "ar", name: "العربية",    flag: "🇸🇦", calls: 19,  color: "#06b6d4", live: true  },
  { code: "de", name: "Deutsch",    flag: "🇩🇪", calls: 12,  color: "#64748b", live: false },
  { code: "ja", name: "日本語",      flag: "🇯🇵", calls: 8,   color: "#f43f5e", live: false },
  { code: "ko", name: "한국어",      flag: "🇰🇷", calls: 6,   color: "#ec4899", live: false },
];

const LANG_MAX = 142;

const P_COLOR: Record<string,string> = {
  critical: "var(--critical)", high: "var(--warning)",
  medium: "var(--electric-bright)", low: "var(--success)",
};
const P_BG: Record<string,string> = {
  critical: "var(--critical-dim)", high: "var(--warning-dim)",
  medium: "var(--electric-dim)",   low: "var(--success-dim)",
};
const P_LABEL: Record<string,string> = {
  critical: "CRÍTICO", high: "ALTO", medium: "MEDIO", low: "BAJO",
};

function fmt(s: number) {
  const m = Math.floor(s / 60), sec = s % 60;
  return `${m}:${sec.toString().padStart(2, "0")}`;
}

function Card({ children, style = {}, className = "" }: {
  children: React.ReactNode; style?: React.CSSProperties; className?: string;
}) {
  return <div className={`glass-card ${className}`} style={style}>{children}</div>;
}

function KpiCard({ label, value, sub, icon: Icon, color, trend, delay = 0 }: {
  label: string; value: string; sub: string;
  icon: React.ElementType; color: string;
  trend?: "up" | "down" | "neutral"; delay?: number;
}) {
  return (
    <Card className={`animate-count-in delay-${delay}`} style={{ padding: "22px 24px" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: 2,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.75,
      }} />
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: `0 0 18px ${color}20`,
        }}>
          <Icon size={19} style={{ color }} />
        </div>
        {trend && (
          <div style={{
            display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700,
            color: trend === "up" ? "var(--success)" : trend === "down" ? "var(--critical)" : "var(--text-02)",
          }}>
            {trend === "up" ? <TrendingUp size={13}/> : trend === "down" ? <TrendingDown size={13}/> : null}
            {trend === "up" ? "+8%" : trend === "down" ? "-3%" : "—"}
          </div>
        )}
      </div>
      <div style={{
        fontFamily: "var(--font-display)", fontWeight: 800,
        fontSize: 40, lineHeight: 1, letterSpacing: "-0.05em",
        color, marginBottom: 8, textShadow: `0 0 32px ${color}28`,
      }}>{value}</div>
      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-00)", marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--text-02)" }}>{sub}</div>
    </Card>
  );
}

export default function Dashboard() {
  const [calls, setCalls]   = useState(INITIAL_CALLS);
  const [activeHour]        = useState(new Date().getHours());
  const timerRef            = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setCalls(prev => prev.map(c =>
        c.status === "active" ? { ...c, elapsed: c.elapsed + 1 } : c
      ));
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const activeCalls   = calls.filter(c => c.status === "active").length;
  const resolvedToday = calls.filter(c => c.status === "resolved").length + 41;
  const maxBar        = Math.max(...HOURLY);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ─── ROW 1 · KPIs ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
        <KpiCard label="Llamadas"    value={String(activeCalls)} sub="En atención"    icon={Phone}         color="var(--electric-bright)" trend="up"      delay={100} />
        <KpiCard label="Resueltas hoy"       value={String(resolvedToday)} sub="Últimas 24 horas"  icon={CheckCircle2}  color="var(--success)"         trend="up"      delay={200} />
        <KpiCard label="Tiempo de respuesta" value="7.2s"                sub="Promedio del turno"   icon={Clock}         color="var(--mx-gold)"         trend="neutral" delay={300} />

      </div>

      {/* ─── ROW 2 · LIVE CALLS + CHARTS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 16 }}>

        {/* Live call feed */}
        <Card style={{ padding: 0 }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "18px 22px", borderBottom: "1px solid var(--glass-border)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "rgba(59,130,246,0.14)", border: "1px solid rgba(59,130,246,0.25)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Headphones size={16} style={{ color: "var(--electric-bright)" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>
                  Tiempo de respuesta
                </div>
                <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 1 }}>Centro de emergencias · ElevenLabs IA</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.28)",
                borderRadius: 20, padding: "5px 12px",
              }}>
                <div style={{ position: "relative", width: 6, height: 6 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--critical)" }} />
                  <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "rgba(244,63,94,0.25)", animation: "ping 1.5s ease infinite" }} />
                </div>
                <span style={{ fontSize: 10, fontWeight: 700, color: "var(--critical)", letterSpacing: "0.08em" }}>EN VIVO</span>
              </div>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>
                {activeCalls} activas
              </span>
            </div>
          </div>

          <div style={{ overflowY: "auto", maxHeight: 360 }}>
            {calls.map((call, i) => (
              <div key={call.id}
                style={{
                  display: "flex", alignItems: "center", gap: 14,
                  padding: "13px 22px",
                  borderBottom: "1px solid var(--glass-border)",
                  cursor: "pointer",
                  animation: `fade-up 0.35s ease ${i * 0.06}s both`,
                  transition: "background 0.2s",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--s1)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
                  <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: P_COLOR[call.priority] }} />
                  {call.status === "active" && (
                    <div style={{
                      position: "absolute", inset: -3, borderRadius: "50%",
                      background: `${P_COLOR[call.priority]}28`,
                      animation: "ping 2s ease infinite",
                    }} />
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-02)" }}>{call.id}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-00)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {call.caller}
                    </span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <span style={{
                      fontSize: 9, padding: "1px 7px", borderRadius: 4, fontWeight: 700,
                      background: P_BG[call.priority], color: P_COLOR[call.priority],
                    }}>{P_LABEL[call.priority]}</span>
                    <span style={{ fontSize: 11, color: "var(--text-02)" }}>{call.type}</span>
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontSize: 11, color: "var(--text-01)", marginBottom: 2 }}>{call.zone}</div>
                  <div style={{ fontSize: 10, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>{call.agent}</div>
                </div>
                <div style={{ textAlign: "right", minWidth: 58, flexShrink: 0 }}>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700,
                    color: call.status === "active" ? "var(--electric-bright)" : "var(--text-02)",
                    marginBottom: 3,
                  }}>{fmt(call.elapsed)}</div>
                  <span style={{
                    fontSize: 9, fontWeight: 700, padding: "2px 6px", borderRadius: 4,
                    background: call.status === "active" ? "rgba(59,130,246,0.12)" : "rgba(16,185,129,0.12)",
                    color: call.status === "active" ? "var(--electric-bright)" : "var(--success)",
                  }}>{call.status === "active" ? "ACTIVA" : "RESUELTA"}</span>
                </div>
                {call.status === "active" && (
                  <div style={{
                    width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                    background: "rgba(59,130,246,0.10)", border: "1px solid rgba(59,130,246,0.20)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Mic size={12} style={{ color: "var(--electric-bright)" }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Hourly chart */}
          <Card style={{ padding: "20px 22px", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-00)" }}>Volumen por hora</div>
                <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 2 }}>Llamadas recibidas · hoy</div>
              </div>
              <Zap size={14} style={{ color: "var(--neon)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 90, marginBottom: 8 }}>
              {HOURLY.map((h, i) => {
                const isNow = i === activeHour;
                const pct   = (h / maxBar) * 100;
                return (
                  <div key={i} style={{ flex: 1, height: "100%", display: "flex", alignItems: "flex-end" }}>
                    <div style={{
                      width: "100%", height: `${pct}%`, minHeight: 3,
                      borderRadius: "3px 3px 2px 2px",
                      background: isNow ? "linear-gradient(180deg,#60A5FA,#3B82F6)" : "var(--s3)",
                      boxShadow: isNow ? "0 0 12px rgba(59,130,246,0.45)" : "none",
                      transition: "height 0.8s cubic-bezier(0.4,0,0.2,1)",
                    }} />
                  </div>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>00h</span>
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--electric-bright)", fontWeight: 700 }}>↑ {activeHour}h actual</span>
              <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>23h</span>
            </div>
          </Card>

          {/* Incident breakdown */}
          <Card style={{ padding: "20px 22px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-00)" }}>Por tipo</div>
              <ArrowUpRight size={13} style={{ color: "var(--text-02)" }} />
            </div>
            {INCIDENT_TYPES.map(t => (
              <div key={t.type} style={{ marginBottom: 11 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 11, color: "var(--text-01)" }}>{t.type}</span>
                  <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: t.color, fontWeight: 700 }}>{t.count}</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: "var(--s3)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", width: `${t.pct}%`, borderRadius: 3,
                    background: t.color, boxShadow: `0 0 8px ${t.color}50`,
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* ─── ROW 3 · FIFA + IDIOMAS ─── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        {/* FIFA widget */}
        <Card style={{ padding: "20px 22px", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, #006847, #F59E0B, #CE1126)",
          }} />
          <div style={{
            position: "absolute", top: "-40%", right: "-20%",
            width: 200, height: 200, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(245,158,11,0.07) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
            <Trophy size={14} style={{ color: "var(--mx-gold)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-00)" }}>FIFA World Cup 2026™</span>
            <div style={{
              marginLeft: "auto", fontSize: 9, fontWeight: 700,
              background: "rgba(244,63,94,0.12)", border: "1px solid rgba(244,63,94,0.28)",
              color: "var(--critical)", padding: "2px 8px", borderRadius: 6,
              animation: "dot-blink 1.8s ease-in-out infinite",
            }}>EN VIVO</div>
          </div>

          <div style={{
            background: "var(--s1)", borderRadius: 12, border: "1px solid var(--glass-border)",
            padding: "16px 18px", marginBottom: 14,
          }}>
            <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--critical)", fontWeight: 700, letterSpacing: "0.10em", marginBottom: 10 }}>
              ● EN VIVO · 67'
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>🇲🇽</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-01)" }}>México</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 34,
                  color: "var(--text-00)", letterSpacing: "-0.04em",
                }}>2 — 0</div>
                <div style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>BBVA · Monterrey</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, marginBottom: 4 }}>🇨🇲</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-01)" }}>Camerún</div>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: 6 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <span style={{ fontSize: 11, color: "var(--text-02)" }}>Estadio BBVA · Ocupación</span>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--mx-gold)", fontWeight: 700 }}>89%</span>
            </div>
            <div style={{ height: 5, borderRadius: 3, background: "var(--s3)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: "89%", borderRadius: 3, background: "linear-gradient(90deg,#006847,#F59E0B)", boxShadow: "0 0 8px rgba(245,158,11,0.35)" }} />
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14 }}>
            {[
              { label: "Seguridad",   value: "280", color: "var(--electric-bright)" },
              { label: "Aficionados", value: "47K", color: "var(--mx-gold)" },
              { label: "Médicos",     value: "64",  color: "var(--success)" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 17, color: s.color, letterSpacing: "-0.03em" }}>{s.value}</div>
                <div style={{ fontSize: 9, color: "var(--text-02)", marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", gap: 6,
            background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)",
            borderRadius: 8, padding: "7px 12px",
          }}>
            <Shield size={11} style={{ color: "var(--success)" }} />
            <span style={{ fontSize: 10, color: "var(--success)", fontWeight: 600 }}>Operación FIFA · Sin incidentes</span>
          </div>
        </Card>

        {/* ── IDIOMAS WIDGET ── */}
        <Card style={{ padding: "20px 22px", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 3,
            background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #06b6d4)",
          }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 9,
              background: "rgba(139,92,246,0.15)", border: "1px solid rgba(139,92,246,0.28)",
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <Globe size={15} style={{ color: "#8b5cf6" }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: "var(--text-00)" }}>
                Transcripción multilingüe
              </div>
              <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 1 }}>
                IA activa · {LANGUAGES.reduce((a, l) => a + l.calls, 0)} llamadas · {LANGUAGES.length} idiomas detectados
              </div>
            </div>
            <div style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
              fontSize: 9, fontWeight: 700, color: "#8b5cf6",
              background: "rgba(139,92,246,0.10)", border: "1px solid rgba(139,92,246,0.25)",
              padding: "3px 9px", borderRadius: 6,
            }}>
              <Languages size={10} />
              AUTO
            </div>
          </div>

          {/* Live processing banner */}
          <div style={{
            margin: "12px 0",
            display: "flex", alignItems: "center", gap: 8,
            background: "rgba(59,130,246,0.08)", border: "1px solid rgba(59,130,246,0.20)",
            borderRadius: 8, padding: "8px 12px",
          }}>
            <div style={{ position: "relative", width: 6, height: 6, flexShrink: 0 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "var(--electric-bright)" }} />
              <div style={{ position: "absolute", inset: -3, borderRadius: "50%", background: "rgba(59,130,246,0.3)", animation: "ping 1.5s ease infinite" }} />
            </div>
            <span style={{ fontSize: 10, color: "var(--electric-bright)", fontWeight: 700 }}>Procesando ahora:</span>
            <span style={{ fontSize: 10, color: "var(--text-01)" }}>English · Arabic</span>
            <span style={{ marginLeft: "auto", fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>~187ms latencia</span>
          </div>

          {/* Language rows */}
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {LANGUAGES.map((lang) => (
              <div key={lang.code}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{lang.flag}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: "var(--text-00)", minWidth: 72 }}>{lang.name}</span>
                  {lang.live && (
                    <span style={{
                      fontSize: 8, fontWeight: 800, padding: "1px 5px", borderRadius: 4,
                      background: "rgba(244,63,94,0.12)", color: "var(--critical)",
                      border: "1px solid rgba(244,63,94,0.25)",
                    }}>LIVE</span>
                  )}
                  <span style={{ marginLeft: "auto", fontSize: 11, fontFamily: "var(--font-mono)", fontWeight: 700, color: lang.color }}>
                    {lang.calls}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: "var(--s3)", overflow: "hidden" }}>
                  <div style={{
                    height: "100%",
                    width: `${(lang.calls / LANG_MAX) * 100}%`,
                    borderRadius: 2,
                    background: lang.color,
                    boxShadow: lang.live ? `0 0 8px ${lang.color}70` : "none",
                    transition: "width 1s cubic-bezier(0.4,0,0.2,1)",
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            marginTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between",
            borderTop: "1px solid var(--glass-border)", paddingTop: 12,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <Mic size={11} style={{ color: "var(--neon)" }} />
              <span style={{ fontSize: 10, color: "var(--text-02)" }}>Traducción automática activa</span>
            </div>
            <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>
              ElevenLabs · Whisper v3
            </span>
          </div>
        </Card>

      </div>

      {/* ─── ROW 4 · BOTTOM STATS BAR ─── */}
      <Card style={{ padding: "16px 26px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {[
            { label: "Tasa de resolución",       value: "98%",   color: "var(--mx-gold)",         icon: CheckCircle2 },
            { label: "Tiempo prom. atención",    value: "4m 38s",color: "var(--violet)",          icon: Clock },
            { label: "Zonas monitoreadas",       value: "18",    color: "var(--warning)",         icon: Activity },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={s.label} style={{
                display: "flex", alignItems: "center", gap: 12, flex: 1,
                paddingRight: i < 2 ? 24 : 0,
                borderRight: i < 2 ? "1px solid var(--glass-border)" : "none",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${s.color}14`, border: `1px solid ${s.color}22`,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={15} style={{ color: s.color }} />
                </div>
                <div>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20,
                    color: s.color, lineHeight: 1, letterSpacing: "-0.03em",
                  }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 3 }}>{s.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

    </div>
  );
}
