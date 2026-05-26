"use client";

import { useEffect, useRef, useState } from "react";
import {
  Activity,
  AudioLines,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  FileText,
  Headphones,
  Info,
  Languages,
  MapPin,
  Mic,
  Pause,
  Phone,
  Play,
  Route,
  Search,
  ShieldAlert,
  UserRound,
  Volume2,
  X,
} from "lucide-react";

type CallState = "Activa" | "En despacho" | "Resuelta" | "Seguimiento";
type Priority = "Critica" | "Alta" | "Media" | "Baja";

type TranscriptLine = {
  speaker: "Operador" | "Ciudadano" | "IA";
  time: string;
  text: string;
};

type CallRecord = {
  id: string;
  phone: string;
  emergencyType: string;
  incidentCount: number;
  location: string;
  state: CallState;
  priority: Priority;
  channel: string;
  agent: string;
  duration: string;
  language: string;
  sentiment: string;
  sentimentScore: number;
  summary: string;
  stateReasoning: string;
  sentimentReasoning: string;
  transcript: TranscriptLine[];
};

const CALLS: CallRecord[] = [
  {
    id: "conv_1001ks2gsJs8e8bbJ4n0nmJJvfk1",
    phone: "3122191354",
    emergencyType: "Seguimiento operativo",
    incidentCount: 1,
    location: "Rionegro",
    state: "En despacho",
    priority: "Alta",
    channel: "Voz IA",
    agent: "C5 IA",
    duration: "04:38",
    language: "Espanol",
    sentiment: "No determinable",
    sentimentScore: 52,
    summary:
      "La llamada fue iniciada por C5 USA para verificar el seguimiento operativo. Se detecto buzon de voz automatico; el agente dejo un mensaje solicitando contacto y registro la gestion.",
    stateReasoning:
      "El agente verifica el estado del incidente y el sistema mantiene la llamada como despacho operativo pendiente de confirmacion.",
    sentimentReasoning:
      "No se puede determinar el sentimiento porque la respuesta corresponde a un buzon de voz automatizado y no a una interaccion humana.",
    transcript: [
      { speaker: "Operador", time: "10:42:05", text: "Buenos dias, le contactamos para verificar el avance del incidente asignado." },
      { speaker: "IA", time: "10:42:08", text: "Se detecta buzon de voz. Preparando mensaje de seguimiento." },
      { speaker: "Operador", time: "10:42:15", text: "Por favor comuniquese con el centro de control para confirmar ubicacion y novedades." },
    ],
  },
  {
    id: "conv_1002mx911_avconst_08440",
    phone: "8112047720",
    emergencyType: "Accidente vial con lesionados",
    incidentCount: 3,
    location: "Av. Constitucion",
    state: "Activa",
    priority: "Critica",
    channel: "911",
    agent: "A. Torres",
    duration: "02:51",
    language: "Espanol",
    sentiment: "Ansiedad alta",
    sentimentScore: 84,
    summary:
      "Ciudadano reporta accidente vial con lesionados sobre Av. Constitucion. Se confirma punto de referencia, carril afectado y necesidad de ambulancia. Despacho medico y transito quedan activados.",
    stateReasoning:
      "La llamada contiene lesionados y via principal comprometida; se mantiene como activa hasta confirmar arribo de unidades.",
    sentimentReasoning:
      "El tono del ciudadano es urgente, con respiracion acelerada y frases repetidas sobre una persona herida.",
    transcript: [
      { speaker: "Ciudadano", time: "10:46:11", text: "Hay un choque fuerte, una persona no se puede mover." },
      { speaker: "Operador", time: "10:46:20", text: "Mantengase a salvo. Necesito el carril y un punto de referencia." },
      { speaker: "IA", time: "10:46:27", text: "Criterio IA: activar ambulancia, transito y cierre preventivo de carril." },
    ],
  },
  {
    id: "conv_1003fifa_bbva_gateA",
    phone: "8188804491",
    emergencyType: "Persona extraviada",
    incidentCount: 1,
    location: "Estadio BBVA - Acceso A",
    state: "Seguimiento",
    priority: "Media",
    channel: "FIFA Hotline",
    agent: "L. Morales",
    duration: "03:19",
    language: "Ingles -> Espanol",
    sentiment: "Preocupacion",
    sentimentScore: 66,
    summary:
      "Visitante extranjera solicita apoyo por menor extraviado en acceso A. Se registran rasgos, vestimenta y punto de ultimo contacto. Seguridad del estadio inicia protocolo de reunificacion familiar.",
    stateReasoning:
      "No hay lesionados, pero se requiere seguimiento en campo hasta localizar al menor y cerrar el protocolo FIFA.",
    sentimentReasoning:
      "La persona mantiene tono preocupado y solicita instrucciones claras; no hay agresividad ni panico extremo.",
    transcript: [
      { speaker: "Ciudadano", time: "10:39:03", text: "I lost my son near gate A, he is wearing a green shirt." },
      { speaker: "IA", time: "10:39:04", text: "Traduccion: perdi a mi hijo cerca del acceso A, viste camiseta verde." },
      { speaker: "Operador", time: "10:39:18", text: "Vamos a activar apoyo de seguridad. Permanezca junto al punto de informacion." },
    ],
  },
  {
    id: "conv_1004industrial_apodaca_318",
    phone: "8110027744",
    emergencyType: "Reporte sin novedad",
    incidentCount: 0,
    location: "Apodaca Industrial",
    state: "Resuelta",
    priority: "Baja",
    channel: "Operacion",
    agent: "R. Vega",
    duration: "01:57",
    language: "Espanol",
    sentiment: "Neutral",
    sentimentScore: 38,
    summary:
      "Ciudadano confirma ausencia de novedades en la zona asignada. Se valida ubicacion y cierre de seguimiento sin incidentes activos.",
    stateReasoning:
      "La gestion quedo confirmada sin incidentes y no requiere despacho adicional.",
    sentimentReasoning:
      "La interaccion es breve, cooperativa y sin indicadores de tension.",
    transcript: [
      { speaker: "Operador", time: "10:31:45", text: "Confirmamos estado de la zona Apodaca Industrial." },
      { speaker: "Ciudadano", time: "10:31:52", text: "Todo en orden, sin novedad en el area." },
      { speaker: "IA", time: "10:32:01", text: "Gestion cerrada. Sin criterios de riesgo activos." },
    ],
  },
];

const priorityColor: Record<Priority, string> = {
  Critica: "var(--critical)",
  Alta: "var(--warning)",
  Media: "var(--electric-bright)",
  Baja: "var(--success)",
};

const stateColor: Record<CallState, string> = {
  Activa: "var(--critical)",
  "En despacho": "var(--warning)",
  Resuelta: "var(--success)",
  Seguimiento: "var(--electric-bright)",
};

function Card({ children, style = {}, className = "" }: {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}) {
  return <div className={`glass-card ${className}`} style={style}>{children}</div>;
}

function ActionButton({
  active,
  color,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean;
  color: string;
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 6,
        minWidth: 96,
        height: 30,
        borderRadius: 999,
        border: `1px solid ${color}38`,
        background: active ? `${color}26` : `${color}12`,
        color,
        cursor: "pointer",
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: "0.04em",
        boxShadow: active ? `0 0 16px ${color}22` : "none",
      }}
      title={label}
    >
      <Icon size={13} />
      {label}
    </button>
  );
}

function DetailModal({ call, onClose }: { call: CallRecord; onClose: () => void }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 80,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        background: "rgba(2,6,23,0.68)",
        backdropFilter: "blur(18px)",
      }}
      onClick={onClose}
    >
      <section
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(980px, 96vw)",
          maxHeight: "90dvh",
          overflow: "auto",
          background: "var(--glass-01)",
          border: "1px solid var(--glass-border-bright)",
          borderTop: "4px solid var(--neon)",
          borderRadius: 18,
          boxShadow: "0 30px 120px rgba(0,0,0,0.48)",
        }}
      >
        <header style={{ padding: "22px 28px 18px", borderBottom: "1px solid var(--glass-border)", display: "flex", gap: 18 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10, fontWeight: 900, color: "var(--neon)", letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Dashboard analytics
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: 27, lineHeight: 1.05, color: "var(--text-00)", marginTop: 4 }}>
              Detalle de la llamada
            </h2>
            <div style={{ marginTop: 8, fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-02)" }}>{call.id}</div>
          </div>
          <button
            onClick={onClose}
            style={{ width: 38, height: 38, borderRadius: 10, border: "1px solid var(--glass-border)", background: "var(--s2)", color: "var(--text-02)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, padding: 0 }}
            aria-label="Cerrar detalle"
          >
            <X size={18} />
          </button>
        </header>

        <div style={{ padding: "24px 28px 30px", display: "flex", flexDirection: "column", gap: 24 }}>
          <section>
            <h3 style={{ fontSize: 14, color: "var(--critical)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              Contacto y emergencia
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px 44px" }}>
              {[
                ["Telefono", call.phone],
                ["Tipo de emergencia", call.emergencyType],
                ["Num. de incidentes", String(call.incidentCount)],
                ["Ubicacion", call.location],
                ["Agente", call.agent],
              ].map(([label, value]) => (
                <div key={label}>
                  <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-02)", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 15, color: "var(--text-00)", fontWeight: 600 }}>{value}</div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h3 style={{ fontSize: 14, color: "var(--critical)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>
              Resumen ejecutivo
            </h3>
            <p style={{ fontSize: 15, lineHeight: 1.75, color: "var(--text-01)" }}>{call.summary}</p>
          </section>

          <section>
            <h3 style={{ fontSize: 14, color: "var(--critical)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>
              Sentimiento y criterios IA
            </h3>
            <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: 18 }}>
              <div style={{ padding: 16, borderRadius: 12, background: "var(--s1)", border: "1px solid var(--glass-border)" }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-02)", textTransform: "uppercase", marginBottom: 8 }}>Analisis de sentimiento</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 24, fontWeight: 800, color: priorityColor[call.priority] }}>{call.sentiment}</div>
                <div style={{ marginTop: 12, height: 6, borderRadius: 999, background: "var(--s3)", overflow: "hidden" }}>
                  <div style={{ width: `${call.sentimentScore}%`, height: "100%", background: priorityColor[call.priority] }} />
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-02)", textTransform: "uppercase", marginBottom: 6 }}>Razonamiento - estado</div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-01)" }}>{call.stateReasoning}</p>
                </div>
                <div>
                  <div style={{ fontSize: 10, fontWeight: 900, color: "var(--text-02)", textTransform: "uppercase", marginBottom: 6 }}>Razonamiento - sentimiento</div>
                  <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-01)" }}>{call.sentimentReasoning}</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </div>
  );
}

export default function InterpreterPanel() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mode, setMode] = useState<"audio" | "transcript">("audio");
  const [playing, setPlaying] = useState(false);
  const [detailCall, setDetailCall] = useState<CallRecord | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selected = CALLS.find((call) => call.id === selectedId) ?? null;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [selectedId, mode]);

  const openAudio = (call: CallRecord) => {
    setSelectedId(call.id);
    setMode("audio");
    setPlaying(true);
  };

  const openTranscript = (call: CallRecord) => {
    setSelectedId(call.id);
    setMode("transcript");
    setPlaying(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
        {[
          { label: "Audios registrados", value: "189", color: "var(--electric-bright)", Icon: Headphones },
          { label: "Transcripciones IA", value: "176", color: "var(--neon)", Icon: FileText },
          { label: "Detalles auditados", value: "94%", color: "var(--success)", Icon: CheckCircle2 },
        ].map(({ label, value, color, Icon }) => (
          <Card key={label} style={{ padding: "17px 20px", display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: `${color}18`, border: `1px solid ${color}30`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon size={18} style={{ color }} />
            </div>
            <div>
              <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 27, color, lineHeight: 1 }}>{value}</div>
              <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 4 }}>{label}</div>
            </div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: selected ? "1.15fr 0.85fr" : "1fr", gap: 16 }}>
        <Card style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--glass-border)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Phone size={15} style={{ color: "var(--electric-bright)" }} />
              <div>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 15, color: "var(--text-00)" }}>Centro de llamadas IA</div>
                <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 2 }}>Audio, detalle ejecutivo y transcripcion por gestion</div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "8px 12px", borderRadius: 999, background: "var(--s1)", border: "1px solid var(--glass-border)" }}>
              <Search size={12} style={{ color: "var(--text-02)" }} />
              <span style={{ fontSize: 10, color: "var(--text-02)", fontFamily: "var(--font-mono)" }}>Filtro: turno actual</span>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.72fr 0.78fr", gap: 0, padding: "12px 22px", background: "var(--s2)", borderBottom: "1px solid var(--glass-border)" }}>
            <div className="label-xs" style={{ color: "var(--text-02)" }}>Llamada</div>
            <div className="label-xs" style={{ color: "var(--text-02)" }}>Ruta / estado</div>
            <div className="label-xs" style={{ color: "var(--text-02)", textAlign: "center" }}>Acciones</div>
          </div>

          <div style={{ maxHeight: 494, overflowY: "auto" }}>
            {CALLS.map((call, index) => {
              const isSelected = call.id === selectedId;
              return (
                <div
                  key={call.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1.2fr 0.72fr 0.78fr",
                    alignItems: "center",
                    gap: 0,
                    padding: "15px 22px",
                    borderBottom: "1px solid var(--glass-border)",
                    background: isSelected ? "var(--electric-dim)" : "transparent",
                    animation: `fade-up 0.35s ease ${index * 0.05}s both`,
                  }}
                >
                  <button
                    onClick={() => setSelectedId(call.id)}
                    style={{ minWidth: 0, textAlign: "left", border: 0, background: "transparent", cursor: "pointer" }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                      <div style={{ width: 38, height: 38, borderRadius: 12, background: `${priorityColor[call.priority]}16`, border: `1px solid ${priorityColor[call.priority]}30`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <UserRound size={16} style={{ color: priorityColor[call.priority] }} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span style={{ fontFamily: "var(--font-mono)", fontWeight: 800, color: "var(--text-00)", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{call.phone}</span>
                          <span style={{ fontSize: 9, fontWeight: 800, color: priorityColor[call.priority], background: `${priorityColor[call.priority]}14`, border: `1px solid ${priorityColor[call.priority]}28`, borderRadius: 999, padding: "2px 7px" }}>{call.priority}</span>
                        </div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-02)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {call.channel} | {call.duration}
                        </div>
                      </div>
                    </div>
                  </button>

                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 4 }}>
                      <MapPin size={12} style={{ color: "var(--text-02)", flexShrink: 0 }} />
                      <span style={{ color: "var(--text-01)", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{call.location}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                      <span style={{ width: 7, height: 7, borderRadius: "50%", background: stateColor[call.state], boxShadow: `0 0 8px ${stateColor[call.state]}55` }} />
                      <span style={{ color: stateColor[call.state], fontSize: 10, fontWeight: 800 }}>{call.state}</span>
                    </div>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7 }}>
                    <ActionButton active={isSelected && mode === "audio"} color="var(--violet)" icon={Headphones} label="AUDIO" onClick={() => openAudio(call)} />
                    <ActionButton color="var(--electric-bright)" icon={Info} label="DETALLE" onClick={() => setDetailCall(call)} />
                    <ActionButton active={isSelected && mode === "transcript"} color="var(--neon)" icon={FileText} label="TRANSCRIPCION" onClick={() => openTranscript(call)} />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {selected && <Card style={{ display: "flex", flexDirection: "column", minHeight: 620 }}>
          <div style={{ padding: "18px 22px", borderBottom: "1px solid var(--glass-border)", display: "flex", justifyContent: "space-between", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 5 }}>
                {mode === "audio" ? <AudioLines size={15} style={{ color: "var(--violet)" }} /> : <ClipboardList size={15} style={{ color: "var(--neon)" }} />}
                <span style={{ fontFamily: "var(--font-display)", fontSize: 15, fontWeight: 800, color: "var(--text-00)" }}>
                  {mode === "audio" ? "Audio de la llamada" : "Transcripcion operativa"}
                </span>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: 10, color: "var(--text-02)" }}>{selected.id}</div>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
              <div style={{ textAlign: "right" }}>
                <div style={{ color: stateColor[selected.state], fontSize: 11, fontWeight: 900 }}>{selected.state}</div>
                <div style={{ color: "var(--text-02)", fontSize: 10, marginTop: 4 }}>{selected.agent}</div>
              </div>
              <button
                onClick={() => { setSelectedId(null); setPlaying(false); }}
                style={{ width: 32, height: 32, borderRadius: 8, border: "1px solid var(--glass-border)", background: "var(--s2)", color: "var(--text-02)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}
                aria-label="Cerrar panel"
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {mode === "audio" ? (
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 18, flex: 1 }}>
              <div style={{ padding: 18, borderRadius: 14, background: "var(--s1)", border: "1px solid var(--glass-border)" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                      onClick={() => setPlaying((value) => !value)}
                      style={{ width: 48, height: 48, borderRadius: "50%", border: "1px solid rgba(139,92,246,0.38)", background: "var(--violet-dim)", color: "var(--violet)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}
                      aria-label={playing ? "Pausar audio" : "Reproducir audio"}
                    >
                      {playing ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 800, color: "var(--text-00)" }}>{selected.phone}</div>
                      <div style={{ fontSize: 10, color: "var(--text-02)", marginTop: 3 }}>{selected.channel} | {selected.language}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "var(--text-02)" }}>
                    <Volume2 size={14} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 12 }}>{selected.duration}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 4, height: 82, padding: "0 4px" }}>
                  {Array.from({ length: 54 }).map((_, i) => {
                    const h = 14 + ((i * 17) % 46);
                    return (
                      <div
                        key={i}
                        style={{
                          flex: 1,
                          height: playing && i % 3 === 0 ? h + 12 : h,
                          maxHeight: 74,
                          borderRadius: 999,
                          background: i < 34 ? "var(--violet)" : "var(--s4)",
                          opacity: i < 34 ? 0.72 : 0.5,
                          animation: playing ? `wave 1.15s ease-in-out ${i * 0.025}s infinite` : "none",
                        }}
                      />
                    );
                  })}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Telefono", value: selected.phone, Icon: Phone },
                  { label: "Tipo de emergencia", value: selected.emergencyType, Icon: ShieldAlert },
                  { label: "Num. incidentes", value: String(selected.incidentCount), Icon: Route },
                  { label: "Sentimiento", value: selected.sentiment, Icon: BrainCircuit },
                ].map(({ label, value, Icon }) => (
                  <div key={label} style={{ padding: 14, borderRadius: 12, background: "var(--s1)", border: "1px solid var(--glass-border)" }}>
                    <Icon size={14} style={{ color: "var(--electric-bright)", marginBottom: 8 }} />
                    <div style={{ fontSize: 9, color: "var(--text-02)", fontWeight: 900, letterSpacing: "0.08em", textTransform: "uppercase" }}>{label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-00)", marginTop: 5, fontWeight: 700 }}>{value}</div>
                  </div>
                ))}
              </div>

              <div style={{ padding: 16, borderRadius: 14, background: "var(--electric-dim)", border: "1px solid rgba(59,130,246,0.22)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 9 }}>
                  <BrainCircuit size={14} style={{ color: "var(--electric-bright)" }} />
                  <span style={{ fontSize: 12, fontWeight: 900, color: "var(--electric-bright)" }}>Resumen IA</span>
                </div>
                <p style={{ fontSize: 13, lineHeight: 1.65, color: "var(--text-01)" }}>{selected.summary}</p>
              </div>
            </div>
          ) : (
            <div style={{ padding: 22, display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
              {selected.transcript.map((line, i) => {
                const isAi = line.speaker === "IA";
                const isOperator = line.speaker === "Operador";
                return (
                  <div key={`${line.time}-${i}`} style={{ display: "flex", justifyContent: isOperator ? "flex-end" : "flex-start" }}>
                    <div style={{ maxWidth: "88%", padding: "12px 14px", borderRadius: 13, background: isAi ? "var(--electric-dim)" : isOperator ? "var(--s3)" : "var(--s1)", border: `1px solid ${isAi ? "rgba(59,130,246,0.22)" : "var(--glass-border)"}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                        {isAi ? <Languages size={12} style={{ color: "var(--electric-bright)" }} /> : <Mic size={12} style={{ color: isOperator ? "var(--success)" : "var(--warning)" }} />}
                        <span style={{ fontSize: 10, fontWeight: 900, color: isAi ? "var(--electric-bright)" : "var(--text-02)", letterSpacing: "0.04em" }}>{line.speaker}</span>
                        <span style={{ fontSize: 9, fontFamily: "var(--font-mono)", color: "var(--text-02)" }}>{line.time}</span>
                      </div>
                      <p style={{ fontSize: 13, color: "var(--text-00)", lineHeight: 1.55 }}>{line.text}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>
          )}

          <div style={{ padding: "11px 20px", borderTop: "1px solid var(--glass-border)", display: "flex", alignItems: "center", gap: 12, background: "var(--s1)" }}>
            <Activity size={12} style={{ color: "var(--success)" }} />
            <span style={{ fontSize: 11, color: "var(--text-02)" }}>Motor IA activo</span>
            <span style={{ width: 1, height: 14, background: "var(--glass-border)" }} />
            <span style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--success)" }}>187ms</span>
            <button
              onClick={() => setDetailCall(selected)}
              style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, padding: "8px 12px", borderRadius: 9, border: "1px solid rgba(59,130,246,0.25)", background: "var(--electric-dim)", color: "var(--electric-bright)", cursor: "pointer", fontSize: 11, fontWeight: 800 }}
            >
              <Info size={13} />
              Ver detalle
            </button>
          </div>
        </Card>}
      </div>

      {detailCall && <DetailModal call={detailCall} onClose={() => setDetailCall(null)} />}
    </div>
  );
}
