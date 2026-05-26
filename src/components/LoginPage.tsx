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

      {/* ══════════════════════════════════
          LEFT — PHOTO HERO PANEL
          ══════════════════════════════════ */}
      <div className="hidden lg:flex" style={{
        flex: "0 0 52%",
        position: "relative",
        flexDirection: "column",
        overflow: "hidden",
        zIndex: 2,
      }}>

        {/* Background photo */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: "url('/c5-quintana-roo-900x600.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }} />

        {/* Cinematic overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(5,10,24,0.82) 0%, rgba(10,20,45,0.75) 50%, rgba(5,10,24,0.88) 100%)",
        }} />
        {/* Bottom fade */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "55%",
          background: "linear-gradient(to top, rgba(5,10,24,0.96) 0%, rgba(5,10,24,0.60) 60%, transparent 100%)",
        }} />
        {/* Top fade */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "30%",
          background: "linear-gradient(to bottom, rgba(5,10,24,0.75) 0%, transparent 100%)",
        }} />
        {/* Scan-line texture */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.012) 3px, rgba(255,255,255,0.012) 4px)",
        }} />

        {/* ── CONTENT OVER PHOTO ── */}
        <div style={{
          position: "relative", zIndex: 1,
          display: "flex", flexDirection: "column",
          height: "100%", padding: "32px 48px 44px 48px",
        }}>

          {/* Top header bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 10,
                display: "flex", alignItems: "center", justifyContent: "center",
                overflow: "hidden",
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.14)",
              }}>
                <Image src="/IMG_2225.JPG.jpeg" alt="C5 Logo" width={44} height={44} style={{ objectFit: "contain" }} />
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800, fontSize: 16, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                  C5 México
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "rgba(255,255,255,0.50)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
                  Nuevo León
                </div>
              </div>
            </div>

            {/* Status chip */}
          
          </div>

          {/* Spacer */}
          <div style={{ flex: 1 }} />

          {/* Bottom hero text */}
          <div style={{ flexShrink: 0 }}>

            {/* Badge */}
           

            <h1 style={{
              fontFamily: "'Space Grotesk', sans-serif", fontWeight: 800,
              fontSize: "clamp(32px, 3.8vw, 50px)",
              letterSpacing: "-0.03em", lineHeight: 1.05,
              color: "#FFFFFF",
              marginBottom: 14,
            }}>
              Centro de Llamadas<br />
              <span style={{
                background: "linear-gradient(90deg, #60A5FA 0%, #34D399 100%)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                de Emergencias
              </span>
            </h1>

            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.55)", lineHeight: 1.65, maxWidth: 380, marginBottom: 28 }}>
              Plataforma operacional de monitoreo inteligente para el
              <span style={{ color: "rgba(255,255,255,0.85)", fontWeight: 600 }}> Mundial FIFA 2026™</span>
            </p>

            {/* Stats strip */}
            <div style={{
              display: "flex",
              background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)",
              border: "1px solid rgba(255,255,255,0.10)",
              borderRadius: 12, overflow: "hidden",
            }}>
             
            </div>
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
        alignItems: "center", justifyContent: "flex-start",
        position: "relative", zIndex: 2,
        background: "#FFFFFF",
        overflowY: "auto",
      }}>

        {/* Top-right time */}
        <div style={{
          width: "100%", display: "flex", justifyContent: "flex-end",
          padding: "28px 36px 0 36px", flexShrink: 0,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{time}</div>
        </div>

        {/* Content centered */}
        <div style={{
          flex: 1, display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          padding: "24px 40px 48px 40px", width: "100%",
        }}>

          {/* Mobile logo */}
          <div className="flex lg:hidden" style={{ alignItems: "center", gap: 12, marginBottom: 36 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Image src="/IMG_2225.JPG.jpeg" alt="C5 Logo" width={40} height={40} style={{ objectFit: "contain" }} />
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

              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "#374151", marginBottom: 7 }}>
                  Número de empleado
                </label>
                <div style={{ position: "relative" }}>
                  <User size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF", flexShrink: 0 }} />
                  <input
                    type="text" value={user}
                    onChange={e => { setUser(e.target.value); setError(""); }}
                    placeholder="NL-5099 · nombre.apellido"
                    autoComplete="username"
                    style={{
                      width: "100%", padding: "13px 14px 13px 44px",
                      fontSize: 14, borderRadius: 12, background: "#F8FAFC",
                      border: error ? "1.5px solid #EF4444" : "1.5px solid #E2E8F0",
                      color: "#0F172A", outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#006847"; e.target.style.boxShadow = "0 0 0 3px rgba(0,104,71,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = error ? "#EF4444" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>Contraseña</label>
                  <a href="#" style={{ fontSize: 11, color: "#006847", textDecoration: "none", fontWeight: 500 }}>¿Olvidaste tu acceso?</a>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }} />
                  <input
                    type={showPass ? "text" : "password"} value={pass}
                    onChange={e => { setPass(e.target.value); setError(""); }}
                    placeholder="••••••••••"
                    autoComplete="current-password"
                    style={{
                      width: "100%", padding: "13px 46px 13px 44px",
                      fontSize: 14, borderRadius: 12, background: "#F8FAFC",
                      border: error ? "1.5px solid #EF4444" : "1.5px solid #E2E8F0",
                      color: "#0F172A", outline: "none",
                      transition: "border-color 0.2s, box-shadow 0.2s", boxSizing: "border-box",
                    }}
                    onFocus={e => { e.target.style.borderColor = "#006847"; e.target.style.boxShadow = "0 0 0 3px rgba(0,104,71,0.12)"; }}
                    onBlur={e => { e.target.style.borderColor = error ? "#EF4444" : "#E2E8F0"; e.target.style.boxShadow = "none"; }}
                  />
                  <button
                    type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0 }}
                  >
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && (
                <div style={{
                  padding: "10px 14px", borderRadius: 10,
                  background: "#FEF2F2", border: "1px solid #FECACA",
                  fontSize: 12, color: "#DC2626", display: "flex", alignItems: "center", gap: 8,
                }}>
                  <span style={{ fontSize: 14 }}>⚠</span> {error}
                </div>
              )}

              <button
                type="submit" disabled={loading}
                style={{
                  width: "100%", padding: "14px 20px",
                  fontSize: 14, fontWeight: 700,
                  fontFamily: "'Space Grotesk', sans-serif",
                  borderRadius: 12, border: "none",
                  background: loading ? "#94A3B8" : "linear-gradient(135deg, #006847 0%, #00843D 100%)",
                  color: "#FFFFFF",
                  cursor: loading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  boxShadow: loading ? "none" : "0 4px 20px rgba(0,104,71,0.35), 0 1px 4px rgba(0,104,71,0.25)",
                  transition: "all 0.2s", letterSpacing: "-0.01em", marginTop: 4,
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
                {[{ Icon: Shield, label: "AES-256" }, { Icon: Wifi, label: "TLS 1.3" }].map(({ Icon, label }) => (
                  <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <Icon size={11} color="#10B981" />
                    <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>{label}</span>
                  </div>
                ))}
              </div>
              <a href="#" style={{ fontSize: 11, color: "#94A3B8", textDecoration: "none" }}>Mesa de ayuda DGTIC</a>
            </div>

            {/* Powered by */}
            <div style={{
              marginTop: 20, paddingTop: 16,
              borderTop: "1px solid #F1F5F9",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            }}>
              <p style={{ fontSize: 10, color: "#CBD5E1", textAlign: "center", margin: 0 }}>
                Acceso restringido y monitoreado · C5 México © 2026 · FIFA World Cup 2026™
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ fontSize: 9, color: "#CBD5E1", fontWeight: 500, letterSpacing: "0.06em" }}>POWERED BY</span>
                <Image src="/inter.PNG" alt="Interdomesti" width={80} height={20} style={{ objectFit: "contain", opacity: 0.65 }} />
              </div>
            </div>
          </div>
        </div>
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
