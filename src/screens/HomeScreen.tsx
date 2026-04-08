import { Plus, FolderOpen } from "lucide-react";
import logo from "../../logo.png";

interface HomeScreenProps {
  onNewMission: () => void;
  onMyMissions: () => void;
  missionCount: number;
}

const BLUE = "#3D5AF2";

// Mock drone status — vervang later door echte apparaatstatus
const DRONE_CONNECTED = true;
const DRONE_BATTERY = 65;

export default function HomeScreen({
  onNewMission,
  onMyMissions,
  missionCount,
}: HomeScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* White header — zelfde stijl als WizardBar */}
      <div
        className="flex items-center bg-white border-b border-border px-4 flex-shrink-0"
        style={{ height: "56px" }}
      >
        <img
          src={logo}
          alt="MRR Drones"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "9px",
            marginTop: "-1px",
          }}
        />
        <span
          className="font-bold text-title ml-3"
          style={{ fontSize: "15px" }}
        >
          MRR Drones
        </span>
        <span className="ml-2" style={{ color: "#C8C8C8", fontSize: "13px" }}>
          —
        </span>
        <span className="ml-2" style={{ fontSize: "13px", color: "#888" }}>
          Autonome vluchten
        </span>

        {/* Drone status — rechts */}
        <div className="ml-auto flex items-center gap-2">
          {/* Dot + label */}
          <div className="flex items-center gap-1.5">
            <div style={{
              width: "7px", height: "7px", borderRadius: "50%",
              background: DRONE_CONNECTED ? "#22C55E" : "#CBCBCB",
            }} />
            <span style={{ fontSize: "12px", color: "#888", fontWeight: 500 }}>
              {DRONE_CONNECTED ? "Drone Verbonden" : "Geen drone"}
            </span>
          </div>

          {/* Separator */}
          {DRONE_CONNECTED && (
            <div style={{ width: "1px", height: "14px", background: "#E0E0E0", margin: "0 6px" }} />
          )}

          {/* Batterij met vulling */}
          {DRONE_CONNECTED && (
            <div className="flex items-center gap-1.5">
              <svg width="22" height="9" viewBox="0 0 22 9" fill="none">
                {/* Body */}
                <rect x="0.5" y="0.5" width="18" height="8" rx="1.5" stroke="#D0D0D0" strokeWidth="1" />
                {/* Terminal */}
                <rect x="19" y="2.5" width="2.5" height="4" rx="1" fill="#D0D0D0" />
                {/* Fill */}
                <rect
                  x="2" y="2"
                  width={Math.round((DRONE_BATTERY / 100) * 14)}
                  height="5"
                  rx="0.5"
                  fill={DRONE_BATTERY <= 20 ? "#E0515F" : "#22C55E"}
                />
              </svg>
              <span style={{ fontSize: "12px", color: "#888", fontWeight: 500 }}>
                {DRONE_BATTERY}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center gap-3 px-8 min-h-0">
        {/* Nieuwe Missie */}
        <button
          onClick={onNewMission}
          className="flex items-center gap-4 rounded-card active:scale-[0.98] transition-transform select-none w-full"
          style={{
            background: BLUE,
            padding: "14px 16px",
            boxShadow: "0 3px 14px rgba(61,90,242,0.28)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-btn flex-shrink-0"
            style={{
              width: "40px",
              height: "40px",
              background: "rgba(255,255,255,0.16)",
            }}
          >
            <Plus size={22} color="white" strokeWidth={2.5} />
          </div>
          <div className="text-left">
            <div className="font-bold text-white" style={{ fontSize: "15px" }}>
              Nieuwe Missie
            </div>
            <div
              style={{
                fontSize: "12px",
                color: "rgba(255,255,255,0.58)",
                marginTop: "2px",
              }}
            >
              Stap voor stap instellen
            </div>
          </div>
        </button>

        {/* Mijn Missies */}
        <button
          onClick={onMyMissions}
          className="flex items-center gap-4 rounded-card active:scale-[0.98] transition-transform select-none w-full bg-white border border-border"
          style={{
            padding: "14px 16px",
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-btn flex-shrink-0 relative"
            style={{ width: "40px", height: "40px", background: "#F0F0F0" }}
          >
            <FolderOpen size={20} color="#23262F" strokeWidth={1.75} />
            {missionCount > 0 && (
              <span
                className="absolute font-bold rounded-full flex items-center justify-center"
                style={{
                  top: "-5px",
                  right: "-5px",
                  width: "18px",
                  height: "18px",
                  fontSize: "9.5px",
                  background: BLUE,
                  color: "white",
                }}
              >
                {missionCount}
              </span>
            )}
          </div>
          <div className="text-left">
            <div className="font-bold text-title" style={{ fontSize: "15px" }}>
              Mijn Missies
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "2px" }}>
              Bestaande missies starten of aanpassen
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
