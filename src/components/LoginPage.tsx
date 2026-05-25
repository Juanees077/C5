"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Lock, User, ArrowRight, Shield, Wifi } from "lucide-react";
import Image from "next/image";

interface Props { onLogin: () => void; }

export default function LoginPage({ onLogin }: Props) {
  const [user, setUser]       = useState("");
  const [pass, setPass]       = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [time, setTime]       = useState("");

  useEffect(() => {
    const t = () => setTime(new Date().toLocaleTimeString("es-MX", { hour12: false }));
    t(); const id = setInterval(t, 1000); return () => clearInterval(id);
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !pass) { setError("Ingresa tus credenciales de acceso"); return; }
    setError(""); setLoading(true);
    await new Promise(r => setTimeout(r, 1100));
    setLoading(false); onLogin();
  };

  return (
    <div style={{
      minHeight: "100dvh", display: "flex",
      background: "#F0F4FA",
      position: "relative", overflow: "hidden",
      fontFamily: "Inter, sans-serif",
    }}>

      {/* ── BACKGROUND MEXICO FLAG ACCENT ── */}
      {/* Green stripe far left */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0, width: "6px",
        background: "#006847",
        zIndex: 1,
      }} />
      {/* Red stripe far right */}
      <div style={{
        position: "absolute", right: 0, top: 0, bottom: 0, width: "6px",
        background: "#CE1126",
        zIndex: 1,
      }} />

      {/* Soft light orbs */}
      <div style={{
        position: "absolute", width: 800, height: 800, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(0,104,71,0.07) 0%, transparent 65%)",
        top: "-20%", left: "-8%", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(206,17,38,0.05) 0%, transparent 65%)",
        bottom: "-15%", right: "-5%", pointerEvents: "none", zIndex: 0,
      }} />
      <div style={{
        position: "absolute", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 65%)",
        top: "30%", left: "40%", pointerEvents: "none", zIndex: 0,
      }} />

      {/* ══════════════════════════════════
          LEFT — FLAG + BRAND HERO PANEL
          ══════════════════════════════════ */}
      <div className="hidden lg:flex" style={{
        flex: "0 0 52%", position: "relative",
        flexDirection: "column", justifyContent: "center", alignItems: "center",
        padding: "60px 64px",
        zIndex: 2,
      }}>

        {/* Top logo bar */}
        <div style={{
          position: "absolute", top: 36, left: 48,
          display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden",
          }}>
            <Image src="/c5-logo.png" alt="C5 Logo" width={44} height={44} style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, color: "#0F172A", letterSpacing: "-0.02em" }}>
              C5 México
            </div>
            <div style={{ fontSize: 10, fontWeight: 600, color: "#64748B", letterSpacing: "0.10em", textTransform: "uppercase" }}>
              Nuevo León
            </div>
          </div>
        </div>

        {/* Status chip top right */}
        <div style={{
          position: "absolute", top: 36, right: 48,
          display: "flex", alignItems: "center", gap: 6,
          background: "rgba(16,185,129,0.10)", border: "1px solid rgba(16,185,129,0.25)",
          borderRadius: 20, padding: "5px 12px",
        }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", animation: "ping 2s infinite" }} />
          <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", letterSpacing: "0.08em" }}>SISTEMA EN LÍNEA</span>
        </div>

        {/* ── MEXICO FLAG HERO ── */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: 480 }}>

          {/* Flag block */}
          <div style={{
            width: "100%", maxWidth: 400, height: 240,
            borderRadius: 24,
            overflow: "hidden",
            display: "flex",
            boxShadow: "0 24px 80px rgba(0,0,0,0.14), 0 8px 24px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.80)",
            position: "relative",
            marginBottom: 44,
          }}>
            {/* Green stripe */}
            <div style={{ flex: 1, background: "linear-gradient(180deg, #006847 0%, #00843D 100%)", display: "flex", alignItems: "center", justifyContent: "center" }} />
            {/* White stripe */}
            <div style={{ flex: 1, background: "linear-gradient(180deg, #FFFFFF 0%, #F5F5F0 100%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
              {/* Coat of arms placeholder — stylized eagle SVG */}
              <svg viewBox="0 0 80 80" width="72" height="72" style={{ opacity: 0.85 }}>
                {/* Snake */}
                <ellipse cx="40" cy="62" rx="18" ry="5" fill="none" stroke="#8B4513" strokeWidth="2.5" />
                {/* Cactus */}
                <rect x="37" y="28" width="6" height="32" rx="3" fill="#006847" />
                <rect x="28" y="34" width="22" height="5" rx="2.5" fill="#006847" />
                <rect x="26" y="28" width="6" height="16" rx="3" fill="#006847" />
                <rect x="48" y="28" width="6" height="16" rx="3" fill="#006847" />
                {/* Rock */}
                <ellipse cx="40" cy="62" rx="16" ry="6" fill="#8B6914" opacity="0.35" />
                {/* Eagle body */}
                <ellipse cx="40" cy="30" rx="12" ry="14" fill="#4A3728" />
                {/* Eagle head */}
                <circle cx="40" cy="16" r="8" fill="#4A3728" />
                {/* Eagle beak */}
                <polygon points="46,16 52,18 46,20" fill="#DAA520" />
                {/* Eagle wings */}
                <path d="M28,28 Q18,20 12,28 Q22,36 28,32Z" fill="#4A3728" />
                <path d="M52,28 Q62,20 68,28 Q58,36 52,32Z" fill="#4A3728" />
                {/* Eye */}
                <circle cx="44" cy="15" r="2" fill="#DAA520" />
                <circle cx="44" cy="15" r="1" fill="#333" />
              </svg>
            </div>
            {/* Red stripe */}
            <div style={{ flex: 1, background: "linear-gradient(180deg, #CE1126 0%, #A50F1E 100%)", display: "flex", alignItems: "center", justifyContent: "center" }} />

            {/* Shine overlay */}
            <div style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              background: "linear-gradient(135deg, rgba(255,255,255,0.18) 0%, transparent 50%, rgba(0,0,0,0.06) 100%)",
            }} />
          </div>

          {/* Hero text */}
          <h1 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
            fontSize: "clamp(38px, 4.5vw, 58px)",
            letterSpacing: "-0.04em", lineHeight: 0.95,
            color: "#0F172A",
            textAlign: "center", marginBottom: 18,
          }}>
            Centro de<br />
            <span style={{
              background: "linear-gradient(135deg, #006847 20%, #059669 80%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              Llamadas
            </span>{" "}
            <span style={{
              background: "linear-gradient(135deg, #CE1126 20%, #EF4444 80%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>
              de Emergencias
            </span>
          </h1>

          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.65, textAlign: "center", maxWidth: 360 }}>
            Plataforma de atención inteligente de emergencias con IA vocal para el
            <strong style={{ color: "#0F172A", fontWeight: 600 }}> Mundial FIFA 2026™</strong> —
            operación 24/7
          </p>

          {/* Stats row */}
          <div style={{
            display: "flex", gap: 32, marginTop: 44,
            paddingTop: 32, borderTop: "1px solid rgba(15,23,42,0.08)",
            width: "100%", justifyContent: "center",
          }}>
            {[
              { value: "47", label: "Agentes activos", color: "#006847" },
              { value: "24/7", label: "Operación continua", color: "#1D4ED8" },
              { value: "< 8s", label: "Tiempo respuesta", color: "#CE1126" },
            ].map(s => (
              <div key={s.label} style={{ textAlign: "center" }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 26,
                  color: s.color, lineHeight: 1, marginBottom: 5,
                }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Vertical divider */}
      <div className="hidden lg:block" style={{
        width: 1, alignSelf: "stretch",
        background: "linear-gradient(180deg, transparent 0%, rgba(15,23,42,0.10) 30%, rgba(15,23,42,0.10) 70%, transparent 100%)",
        flexShrink: 0, zIndex: 2,
      }} />

      {/* ══════════════════════════════════
          RIGHT — LOGIN FORM PANEL
          ══════════════════════════════════ */}
      <div style={{
        flex: 1, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "48px 40px",
        position: "relative", zIndex: 2,
        background: "#FFFFFF",
      }}>

        {/* Top-right time */}
        <div style={{
          position: "absolute", top: 28, right: 36,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
          color: "#94A3B8", fontWeight: 500,
        }}>{time}</div>

        {/* Mobile logo (visible < lg) */}
        <div className="flex lg:hidden" style={{ alignItems: "center", gap: 12, marginBottom: 36 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Image src="/c5-logo.png" alt="C5 Logo" width={40} height={40} style={{ objectFit: "contain" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 15, color: "#0F172A" }}>C5 México</div>
            <div style={{ fontSize: 9, color: "#94A3B8", letterSpacing: "0.10em" }}>NUEVO LEÓN</div>
          </div>
        </div>

        {/* Card */}
        <div style={{ width: "100%", maxWidth: 384 }}>

          {/* Heading */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981" }} />
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "#10B981", textTransform: "uppercase" }}>
                Acceso Seguro
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
              fontSize: 32, letterSpacing: "-0.03em", color: "#0F172A",
              marginBottom: 8, lineHeight: 1.1,
            }}>
              Bienvenido
            </h2>
            <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.55 }}>
              Plataforma restringida a personal autorizado de C5 Nuevo León. Ingresa tus credenciales institucionales.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

            {/* Username */}
            <div>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600,
                color: "#374151", marginBottom: 7,
              }}>
                Número de empleado
              </label>
              <div style={{ position: "relative" }}>
                <User size={15} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "#9CA3AF", flexShrink: 0,
                }} />
                <input
                  type="text" value={user}
                  onChange={e => { setUser(e.target.value); setError(""); }}
                  placeholder="NL-5099 · nombre.apellido"
                  autoComplete="username"
                  style={{
                    width: "100%", padding: "13px 14px 13px 44px",
                    fontSize: 14, borderRadius: 12,
                    background: "#F8FAFC",
                    border: error ? "1.5px solid #EF4444" : "1.5px solid #E2E8F0",
                    color: "#0F172A", outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#006847"; e.target.style.boxShadow = "0 0 0 3px rgba(0,104,71,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = error ? "#EF4444" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>
                  Contraseña
                </label>
                <a href="#" style={{ fontSize: 11, color: "#006847", textDecoration: "none", fontWeight: 500 }}>
                  ¿Olvidaste tu acceso?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: 14, top: "50%",
                  transform: "translateY(-50%)", color: "#9CA3AF",
                }} />
                <input
                  type={showPass ? "text" : "password"} value={pass}
                  onChange={e => { setPass(e.target.value); setError(""); }}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  style={{
                    width: "100%", padding: "13px 46px 13px 44px",
                    fontSize: 14, borderRadius: 12,
                    background: "#F8FAFC",
                    border: error ? "1.5px solid #EF4444" : "1.5px solid #E2E8F0",
                    color: "#0F172A", outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    boxSizing: "border-box",
                  }}
                  onFocus={e => { e.target.style.borderColor = "#006847"; e.target.style.boxShadow = "0 0 0 3px rgba(0,104,71,0.12)"; }}
                  onBlur={e => { e.target.style.borderColor = error ? "#EF4444" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button" onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute", right: 14, top: "50%",
                    transform: "translateY(-50%)", background: "none",
                    border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0,
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding: "10px 14px", borderRadius: 10,
                background: "#FEF2F2", border: "1px solid #FECACA",
                fontSize: 12, color: "#DC2626", display: "flex", alignItems: "center", gap: 8,
              }}>
                <span style={{ fontSize: 14 }}>⚠</span> {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit" disabled={loading}
              style={{
                width: "100%", padding: "14px 20px",
                fontSize: 14, fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                borderRadius: 12, border: "none",
                background: loading
                  ? "#94A3B8"
                  : "linear-gradient(135deg, #006847 0%, #00843D 100%)",
                color: "#FFFFFF",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: loading ? "none" : "0 4px 20px rgba(0,104,71,0.35), 0 1px 4px rgba(0,104,71,0.25)",
                transition: "all 0.2s",
                letterSpacing: "-0.01em",
                marginTop: 4,
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 16, height: 16, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.35)", borderTopColor: "#fff",
                    display: "inline-block", animation: "spin 0.7s linear infinite",
                  }} />
                  Verificando credenciales...
                </>
              ) : (
                <>Ingresar al sistema <ArrowRight size={16} /></>
              )}
            </button>
          </form>

          {/* Security footer */}
          <div style={{
            marginTop: 28, paddingTop: 22,
            borderTop: "1px solid #F1F5F9",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <div style={{ display: "flex", gap: 16 }}>
              {[
                { Icon: Shield, label: "AES-256" },
                { Icon: Wifi, label: "TLS 1.3" },
              ].map(({ Icon, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon size={11} color="#10B981" />
                  <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>{label}</span>
                </div>
              ))}
            </div>
            <a href="#" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none" }}>
              Mesa de ayuda DGTIC
            </a>
          </div>
        </div>

        {/* Bottom note */}
        <p style={{
          position: "absolute", bottom: 22,
          fontSize: 10, color: "#CBD5E1", textAlign: "center",
        }}>
          Acceso restringido y monitoreado · C5 México © 2026 · FIFA World Cup 2026™
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
