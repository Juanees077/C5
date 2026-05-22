"use client";

import { useState, useEffect } from "react";
import { Trophy, Users, Camera, Shield, Activity, MapPin, Zap, AlertTriangle } from "lucide-react";

const MATCHES = [
  { home: { name: "México",    flag: "🇲🇽", score: 2    }, away: { name: "Camerún",  flag: "🇨🇲", score: 0    }, venue: "Estadio BBVA, Monterrey", time: "EN VIVO · 67'", status: "live"     },
  { home: { name: "Argentina", flag: "🇦🇷", score: 1    }, away: { name: "Marruecos", flag: "🇲🇦", score: 1    }, venue: "AT&T Stadium, Dallas",    time: "FIN",           status: "finished"  },
  { home: { name: "Brasil",    flag: "🇧🇷", score: null  }, away: { name: "Portugal", flag: "🇵🇹", score: null  }, venue: "SoFi Stadium, LA",        time: "Mañana 18:00",  status: "upcoming"  },
];

const VENUE = { capacity: 53000, current: 47340, cameras: 412, units: 280, paramedics: 64, checkpoints: 18 };

const ZONES = [
  { zone: "Zona A — Acceso Norte",  status: "green",  people: 12400 },
  { zone: "Zona B — Acceso Sur",    status: "green",  people: 14800 },
  { zone: "Zona C — Tribuna Este",  status: "yellow", people: 11240 },
  { zone: "Zona D — Tribuna Oeste", status: "green",  people: 8900  },
  { zone: "Perímetro Externo",      status: "green",  people: 0     },
];

const INCIDENTS_FIFA = [
  { time: "67:23", type: "Médico",     desc: "Aficionado con desmayo — Zona C Row 44",         attending: true  },
  { time: "61:45", type: "Seguridad",  desc: "Individuo sin credencial — Acceso Norte",         attending: false },
  { time: "48:12", type: "Evacuación", desc: "Falsa alarma de incendio — Zona B",               attending: false },
];

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div className="glass-card" style={style}>{children}</div>;
}

export default function FifaPanel() {
  const [capacity, setCapacity] = useState(VENUE.current);
  const [minute,   setMinute]   = useState(67);

  useEffect(() => {
    const id = setInterval(() => {
      setMinute((m) => (m < 90 ? m + 1 : m));
      setCapacity((c) => c + Math.floor(Math.random() * 4));
    }, 60000);
    return () => clearInterval(id);
  }, []);

  const pct = Math.round((capacity / VENUE.capacity) * 100);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

      {/* Banner */}
      <Card style={{ padding: "22px 28px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, right: 0, width: 400, height: "100%", background: "radial-gradient(ellipse at right, rgba(245,158,11,0.09) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: "linear-gradient(135deg,rgba(245,158,11,0.20),rgba(251,191,36,0.12))", border: "1px solid rgba(245,158,11,0.30)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 24px rgba(245,158,11,0.14)" }}>
            <Trophy size={24} style={{ color: "var(--mx-gold)" }} />
          </div>
          <div>
            <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 22, background: "var(--grad-gold)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", letterSpacing: "-0.02em" }}>
              FIFA World Cup 2026™
            </div>
            <div style={{ fontSize: 12, color: "var(--text-02)", marginTop: 2 }}>
              Centro de Seguridad · Estadio BBVA Bancomer · Monterrey, México
            </div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, color: "var(--mx-gold)", lineHeight: 1 }}>{pct}%</div>
              <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 2 }}>Ocupación</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 30, color: "var(--text-00)", lineHeight: 1 }}>{capacity.toLocaleString()}</div>
              <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 2 }}>Aficionados</div>
            </div>
          </div>
        </div>
      </Card>

      {/* Match cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 }}>
        {MATCHES.map((m, i) => (
          <Card key={i} style={{ padding: 20 }}>
            {m.status === "live" && (
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--grad-critical)" }} />
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase",
                background: m.status === "live" ? "var(--critical-dim)" : m.status === "upcoming" ? "var(--warning-dim)" : "var(--s2)",
                border: `1px solid ${m.status === "live" ? "rgba(244,63,94,0.28)" : "var(--glass-border)"}`,
                color: m.status === "live" ? "var(--critical)" : m.status === "upcoming" ? "var(--mx-gold)" : "var(--text-02)",
                padding: "3px 8px", borderRadius: 6,
              }}>{m.time}</span>
              {m.status === "live" && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--critical)", animation: "ping 1.5s infinite" }} />}
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 30, marginBottom: 5 }}>{m.home.flag}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-01)" }}>{m.home.name}</div>
              </div>
              <div style={{ textAlign: "center", flexShrink: 0, minWidth: 64 }}>
                {m.status === "upcoming" ? (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: 14, color: "var(--text-02)" }}>vs</div>
                ) : (
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 32, color: m.status === "live" ? "var(--text-00)" : "var(--text-02)", letterSpacing: "-0.02em" }}>
                    {m.home.score} — {m.away.score}
                  </div>
                )}
              </div>
              <div style={{ textAlign: "center", flex: 1 }}>
                <div style={{ fontSize: 30, marginBottom: 5 }}>{m.away.flag}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: "var(--text-01)" }}>{m.away.name}</div>
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: "var(--text-02)", textAlign: "center", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
              <MapPin size={9} /> {m.venue}
            </div>
          </Card>
        ))}
      </div>

      {/* Security stats + zones */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <Shield size={14} style={{ color: "var(--mx-gold)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>Recursos de seguridad</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 18 }}>
            {[
              { label: "Cámaras",    value: VENUE.cameras,     color: "var(--electric-bright)", Icon: Camera   },
              { label: "Unidades",   value: VENUE.units,       color: "var(--success)",         Icon: Users    },
              { label: "Paramédicos",value: VENUE.paramedics,  color: "var(--warning)",         Icon: Activity },
              { label: "Checkpoints",value: VENUE.checkpoints, color: "var(--mx-gold)",          Icon: Shield   },
              { label: "Aforo máx.", value: "53K",             color: "var(--violet)",          Icon: Users    },
              { label: "Ocupación",  value: `${pct}%`,         color: "var(--neon)",             Icon: Zap      },
            ].map(({ label, value, color, Icon }) => (
              <div key={label} style={{ padding: "12px 10px", borderRadius: 10, textAlign: "center", background: "var(--s1)", border: "1px solid var(--glass-border)" }}>
                <Icon size={14} style={{ color, margin: "0 auto 5px" }} />
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color, lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: 9, color: "var(--text-02)", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 11, color: "var(--text-02)" }}>Ocupación del estadio</span>
              <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: pct > 80 ? "var(--warning)" : "var(--success)" }}>
                {capacity.toLocaleString()} / {VENUE.capacity.toLocaleString()}
              </span>
            </div>
            <div style={{ height: 8, borderRadius: 4, background: "var(--s3)", overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, borderRadius: 4, background: pct > 90 ? "var(--grad-critical)" : pct > 75 ? "linear-gradient(90deg,var(--warning),var(--mx-gold))" : "var(--grad-electric)", transition: "width 1s ease" }} />
            </div>
          </div>
        </Card>

        <Card style={{ padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
            <MapPin size={14} style={{ color: "var(--mx-gold)" }} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, color: "var(--text-00)" }}>Estado de zonas</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 18 }}>
            {ZONES.map((z) => (
              <div key={z.zone} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", borderRadius: 10, background: "var(--s1)", border: "1px solid var(--glass-border)" }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", flexShrink: 0, background: z.status === "green" ? "var(--success)" : "var(--warning)", boxShadow: `0 0 6px ${z.status === "green" ? "var(--mx-emerald-glow)" : "var(--mx-gold-glow)"}` }} />
                <span style={{ flex: 1, fontSize: 12, color: "var(--text-01)" }}>{z.zone}</span>
                {z.people > 0 && <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>{z.people.toLocaleString()}</span>}
              </div>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 10 }}>
              <AlertTriangle size={12} style={{ color: "var(--warning)" }} />
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-00)" }}>Incidentes del partido</span>
            </div>
            {INCIDENTS_FIFA.map((inc, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "8px 12px", borderRadius: 8, background: "var(--s1)", border: "1px solid var(--glass-border)", marginBottom: 7 }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--mx-gold)", flexShrink: 0, marginTop: 1 }}>{inc.time}</span>
                <div style={{ flex: 1 }}>
                  <span style={{ display: "inline-block", fontSize: 9, fontWeight: 700, padding: "1px 6px", borderRadius: 4, marginBottom: 3, background: "var(--warning-dim)", color: "var(--warning)" }}>{inc.type}</span>
                  <div style={{ fontSize: 11, color: "var(--text-02)" }}>{inc.desc}</div>
                </div>
                <span style={{ fontSize: 9, fontWeight: 700, flexShrink: 0, padding: "2px 7px", borderRadius: 5, alignSelf: "flex-start", background: inc.attending ? "var(--warning-dim)" : "var(--success-dim)", color: inc.attending ? "var(--warning)" : "var(--success)" }}>
                  {inc.attending ? "En atención" : "Resuelto"}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
