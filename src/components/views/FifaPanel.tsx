"use client";

import { useState, useEffect } from "react";
import { Trophy, MapPin, Clock, RefreshCw, AlertCircle } from "lucide-react";

/* ─── TYPES ───────────────────────────────────────────────── */
interface Team  { name: string; shortName: string; crest: string }
interface Score { home: number | null; away: number | null }
interface Match {
  id: number;
  utcDate: string;
  status: string;
  minute?: number;
  homeTeam: Team;
  awayTeam: Team;
  score: { fullTime: Score; halfTime: Score };
  venue?: string;
  stage: string;
  group?: string;
}
interface Standing {
  position: number;
  team: Team;
  playedGames: number;
  won: number; draw: number; lost: number;
  goalsFor: number; goalsAgainst: number; goalDifference: number;
  points: number;
  group: string;
}

/* ─── HELPERS ─────────────────────────────────────────────── */
const API_BASE = "https://api.football-data.org/v4";
const API_KEY  = process.env.NEXT_PUBLIC_FOOTBALL_API_KEY ?? "";

async function apiFetch(path: string) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "X-Auth-Token": API_KEY },
    next: { revalidate: 60 },
  } as RequestInit);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

function statusLabel(m: Match): { text: string; color: string; dot: boolean } {
  if (m.status === "IN_PLAY" || m.status === "PAUSED")
    return { text: m.minute ? `${m.minute}'` : "EN VIVO", color: "#EF4444", dot: true };
  if (m.status === "FINISHED")
    return { text: "FIN", color: "#64748B", dot: false };
  const d = new Date(m.utcDate);
  return { text: d.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }), color: "#F59E0B", dot: false };
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

/* ─── MATCH CARD ──────────────────────────────────────────── */
function MatchCard({ m }: { m: Match }) {
  const { text, color, dot } = statusLabel(m);
  const isLive    = m.status === "IN_PLAY" || m.status === "PAUSED";
  const isPlayed  = m.status === "FINISHED";
  const scoreHome = m.score.fullTime.home;
  const scoreAway = m.score.fullTime.away;

  return (
    <div style={{
      background: "var(--glass-00)",
      border: `1px solid ${isLive ? "rgba(239,68,68,0.35)" : "var(--glass-border)"}`,
      borderRadius: 14,
      padding: "16px 18px",
      position: "relative",
      overflow: "hidden",
      boxShadow: isLive ? "0 4px 20px rgba(239,68,68,0.10)" : "var(--card-shadow)",
    }}>
      {isLive && (
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,#EF4444,#F97316,#EF4444)", backgroundSize: "200%", animation: "shimmer 2s linear infinite" }} />
      )}

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        {dot && <div style={{ width: 6, height: 6, borderRadius: "50%", background: color, boxShadow: `0 0 6px ${color}`, animation: "ping 1.5s infinite", flexShrink: 0 }} />}
        <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.10em", color, textTransform: "uppercase" }}>{text}</span>
        {m.group && <span style={{ marginLeft: "auto", fontSize: 9, color: "var(--text-03)" }}>{m.group.replace("GROUP_", "Grupo ")}</span>}
      </div>

      {/* Teams + Score */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {/* Home */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
          {m.homeTeam.crest
            ? <img src={m.homeTeam.crest} alt="" width={24} height={24} style={{ objectFit: "contain" }} />
            : <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--s3)" }} />
          }
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-01)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {m.homeTeam.shortName || m.homeTeam.name}
          </span>
        </div>

        {/* Score / vs */}
        <div style={{ flexShrink: 0, minWidth: 56, textAlign: "center" }}>
          {isPlayed || isLive ? (
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 22, color: "var(--text-00)", letterSpacing: "-0.02em" }}>
              {scoreHome ?? 0} <span style={{ color: "var(--text-03)", fontWeight: 400 }}>–</span> {scoreAway ?? 0}
            </span>
          ) : (
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-03)" }}>vs</span>
          )}
        </div>

        {/* Away */}
        <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, justifyContent: "flex-end" }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-01)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textAlign: "right" }}>
            {m.awayTeam.shortName || m.awayTeam.name}
          </span>
          {m.awayTeam.crest
            ? <img src={m.awayTeam.crest} alt="" width={24} height={24} style={{ objectFit: "contain" }} />
            : <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--s3)" }} />
          }
        </div>
      </div>

      {/* Venue */}
      {m.venue && (
        <div style={{ marginTop: 10, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <MapPin size={9} style={{ color: "var(--text-03)" }} />
          <span style={{ fontSize: 9, color: "var(--text-03)" }}>{m.venue}</span>
        </div>
      )}
    </div>
  );
}

/* ─── STANDINGS TABLE ─────────────────────────────────────── */
function StandingsGroup({ group, rows }: { group: string; rows: Standing[] }) {
  return (
    <div style={{ background: "var(--glass-00)", border: "1px solid var(--glass-border)", borderRadius: 14, overflow: "hidden", boxShadow: "var(--card-shadow)" }}>
      {/* Group header */}
      <div style={{ padding: "10px 16px", background: "var(--s2)", borderBottom: "1px solid var(--glass-border)" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "var(--text-00)", letterSpacing: "0.06em" }}>
          {group.replace("GROUP_", "Grupo ")}
        </span>
      </div>

      {/* Column headers */}
      <div style={{ display: "grid", gridTemplateColumns: "24px 1fr 28px 28px 28px 28px 36px", gap: 0, padding: "6px 14px", borderBottom: "1px solid var(--glass-border)" }}>
        {["#", "Equipo", "PJ", "G", "E", "GD", "PTS"].map((h) => (
          <span key={h} style={{ fontSize: 8, fontWeight: 700, color: "var(--text-03)", letterSpacing: "0.08em", textAlign: h === "Equipo" ? "left" : "center" }}>{h}</span>
        ))}
      </div>

      {rows.map((r, i) => (
        <div key={r.team.name} style={{ display: "grid", gridTemplateColumns: "24px 1fr 28px 28px 28px 28px 36px", gap: 0, padding: "8px 14px", alignItems: "center", borderBottom: i < rows.length - 1 ? "1px solid var(--glass-border)" : "none", background: i < 2 ? "rgba(16,185,129,0.04)" : "transparent" }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: i < 2 ? "#10B981" : "var(--text-03)", textAlign: "center" }}>{r.position}</span>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
            {r.team.crest
              ? <img src={r.team.crest} alt="" width={16} height={16} style={{ objectFit: "contain", flexShrink: 0 }} />
              : <div style={{ width: 16, height: 16, borderRadius: "50%", background: "var(--s3)", flexShrink: 0 }} />
            }
            <span style={{ fontSize: 11, fontWeight: i < 2 ? 600 : 400, color: i < 2 ? "var(--text-00)" : "var(--text-02)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.team.shortName || r.team.name}
            </span>
          </div>
          {[r.playedGames, r.won, r.draw, r.goalDifference > 0 ? `+${r.goalDifference}` : r.goalDifference].map((v, vi) => (
            <span key={vi} style={{ fontSize: 10, color: "var(--text-02)", textAlign: "center", fontFamily: "var(--font-mono)" }}>{v}</span>
          ))}
          <span style={{ fontSize: 12, fontWeight: 800, color: i < 2 ? "#10B981" : "var(--text-01)", textAlign: "center", fontFamily: "var(--font-display)" }}>{r.points}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── SKELETON ────────────────────────────────────────────── */
function Skeleton({ w = "100%", h = 20 }: { w?: string | number; h?: number }) {
  return <div style={{ width: w, height: h, borderRadius: 6, background: "var(--s3)", animation: "pulse 1.5s ease-in-out infinite" }} />;
}

/* ─── MAIN ────────────────────────────────────────────────── */
export default function FifaPanel() {
  const [matches,   setMatches]   = useState<Match[] | null>(null);
  const [standings, setStandings] = useState<Record<string, Standing[]> | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [lastSync,  setLastSync]  = useState<Date | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const t = today();
      const [mData, sData] = await Promise.all([
        apiFetch(`/competitions/WC/matches?dateFrom=${t}&dateTo=${t}`),
        apiFetch(`/competitions/WC/standings`),
      ]);

      setMatches((mData.matches ?? []) as Match[]);

      const groups: Record<string, Standing[]> = {};
      for (const table of (sData.standings ?? [])) {
        if (table.type === "TOTAL" && table.group) {
          groups[table.group] = table.table as Standing[];
        }
      }
      setStandings(groups);
      setLastSync(new Date());
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Error al cargar datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  /* Auto-refresh every 60s while there are live matches */
  useEffect(() => {
    const hasLive = matches?.some(m => m.status === "IN_PLAY" || m.status === "PAUSED");
    if (!hasLive) return;
    const id = setInterval(load, 60_000);
    return () => clearInterval(id);
  }, [matches]);

  const liveMatches     = matches?.filter(m => m.status === "IN_PLAY" || m.status === "PAUSED") ?? [];
  const otherMatches    = matches?.filter(m => m.status !== "IN_PLAY" && m.status !== "PAUSED") ?? [];
  const groupKeys       = standings ? Object.keys(standings).sort() : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

      {/* ── BANNER ──────────────────────────────────────────── */}
      <div style={{
        background: "linear-gradient(135deg, #1A3A6E 0%, #0D2347 100%)",
        borderRadius: 16,
        padding: "22px 28px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        boxShadow: "0 4px 32px rgba(13,35,71,0.18)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", right: -30, top: -30, width: 200, height: 200, borderRadius: "50%", background: "rgba(245,158,11,0.08)" }} />
        <div style={{ position: "absolute", right: 60, bottom: -40, width: 140, height: 140, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />

        <div style={{ width: 56, height: 56, borderRadius: 14, background: "rgba(245,158,11,0.15)", border: "1px solid rgba(245,158,11,0.30)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Trophy size={28} style={{ color: "#F59E0B" }} />
        </div>

        <div style={{ flex: 1, position: "relative" }}>
          <div style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: 24, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1 }}>
            FIFA World Cup 2026™
          </div>
          <div style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", marginTop: 5 }}>
            🇺🇸 USA &nbsp;·&nbsp; 🇲🇽 México &nbsp;·&nbsp; 🇨🇦 Canadá &nbsp;·&nbsp; 11 Jun – 19 Jul 2026
          </div>
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {["48 selecciones", "16 sedes", "104 partidos"].map((t) => (
              <span key={t} style={{ fontSize: 9, fontWeight: 600, padding: "2px 8px", borderRadius: 4, background: "rgba(255,255,255,0.10)", color: "rgba(255,255,255,0.65)", letterSpacing: "0.04em" }}>{t}</span>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          <button
            onClick={load}
            disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 10, fontWeight: 600, padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.80)", cursor: loading ? "default" : "pointer", transition: "background 0.2s" }}
          >
            <RefreshCw size={11} style={{ animation: loading ? "spin 1s linear infinite" : "none" }} />
            {loading ? "Cargando..." : lastSync ? `Actualizado ${lastSync.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" })}` : "Actualizar"}
          </button>
        </div>
      </div>

      {/* ── ERROR ─────────────────────────────────────────────── */}
      {error && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.20)" }}>
          <AlertCircle size={16} style={{ color: "#EF4444", flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text-00)", marginBottom: 2 }}>No se pudieron cargar los datos</div>
            <div style={{ fontSize: 11, color: "var(--text-02)" }}>
              {!API_KEY
                ? "Configura NEXT_PUBLIC_FOOTBALL_API_KEY en tu .env.local (clave gratuita en football-data.org)"
                : error}
            </div>
          </div>
        </div>
      )}

      {/* ── PARTIDOS DE HOY ─────────────────────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Clock size={13} style={{ color: "var(--text-02)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-00)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Partidos de Hoy</span>
          {liveMatches.length > 0 && (
            <span style={{ fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 10, background: "rgba(239,68,68,0.10)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444" }}>
              {liveMatches.length} EN VIVO
            </span>
          )}
        </div>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ background: "var(--glass-00)", border: "1px solid var(--glass-border)", borderRadius: 14, padding: "16px 18px" }}>
                <Skeleton h={10} w="40%" /><div style={{ height: 12 }} />
                <Skeleton h={28} /><div style={{ height: 8 }} />
                <Skeleton h={8} w="60%" />
              </div>
            ))}
          </div>
        )}

        {!loading && !error && matches !== null && matches.length === 0 && (
          <div style={{ padding: "28px 20px", textAlign: "center", background: "var(--glass-00)", border: "1px solid var(--glass-border)", borderRadius: 14 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>⚽</div>
            <div style={{ fontSize: 13, color: "var(--text-02)" }}>No hay partidos programados para hoy</div>
          </div>
        )}

        {!loading && matches && matches.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {[...liveMatches, ...otherMatches].map(m => <MatchCard key={m.id} m={m} />)}
          </div>
        )}
      </div>

      {/* ── TABLA DE GRUPOS ──────────────────────────────────── */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
          <Trophy size={13} style={{ color: "var(--text-02)" }} />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 13, color: "var(--text-00)", letterSpacing: "0.06em", textTransform: "uppercase" }}>Tabla de Grupos</span>
        </div>

        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {[1, 2, 3, 4].map(i => (
              <div key={i} style={{ background: "var(--glass-00)", border: "1px solid var(--glass-border)", borderRadius: 14, padding: 16 }}>
                <Skeleton h={10} w="30%" /><div style={{ height: 12 }} />
                {[1,2,3,4].map(j => <div key={j} style={{ marginBottom: 8 }}><Skeleton h={10} /></div>)}
              </div>
            ))}
          </div>
        )}

        {!loading && standings && groupKeys.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {groupKeys.map(gk => (
              <StandingsGroup key={gk} group={gk} rows={standings[gk]} />
            ))}
          </div>
        )}

        {!loading && standings && groupKeys.length === 0 && !error && (
          <div style={{ padding: "28px 20px", textAlign: "center", background: "var(--glass-00)", border: "1px solid var(--glass-border)", borderRadius: 14 }}>
            <div style={{ fontSize: 13, color: "var(--text-02)" }}>La fase de grupos aún no ha comenzado</div>
          </div>
        )}
      </div>

      {/* ── FOOTER NOTE ──────────────────────────────────────── */}
      <div style={{ textAlign: "center", paddingBottom: 8 }}>
        <span style={{ fontSize: 9, color: "var(--text-03)" }}>
          Datos vía <strong>football-data.org</strong> · Plan gratuito · Actualización cada 60 s en partidos en vivo
        </span>
      </div>

    </div>
  );
}
