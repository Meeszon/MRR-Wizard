import {
  ArrowLeft,
  Play,
  Pencil,
  PlusCircle,
  FolderOpen,
  Locate,
  Clock,
  Battery,
} from "lucide-react";
import type { Mission } from "../types";
import { calcMetrics } from "../constants";

interface MissionListScreenProps {
  missions: Mission[];
  onBack: () => void;
  onStart: (mission: Mission) => void;
  onEdit: (mission: Mission) => void;
}

export default function MissionListScreen({
  missions,
  onBack,
  onStart,
  onEdit,
}: MissionListScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-bg-secondary">
      {/* Header */}
      <div
        className="relative flex items-center bg-white border-b border-border px-4 flex-shrink-0"
        style={{ height: "56px" }}
      >
        <button
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0"
        >
          <ArrowLeft size={20} color="#5A5A5A" />
        </button>
        <span
          className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
          style={{ fontSize: "15px" }}
        >
          Mijn Missies
        </span>
        {missions.length > 0 && (
          <span
            className="ml-auto font-semibold"
            style={{ fontSize: "12px", color: "#AAAAAA" }}
          >
            {missions.length} {missions.length === 1 ? "missie" : "missies"}
          </span>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-8 py-4 flex flex-col gap-2.5 min-h-0">
        {/* Empty state */}
        {missions.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            <div
              className="flex items-center justify-center rounded-card"
              style={{ width: "52px", height: "52px", background: "#EBEBEB" }}
            >
              <FolderOpen size={22} color="#AAAAAA" strokeWidth={1.75} />
            </div>
            <p style={{ fontSize: "13px", color: "#888" }}>
              Nog geen missies aangemaakt
            </p>
            <button
              onClick={onBack}
              className="flex items-center gap-2 rounded-btn active:scale-[0.98] transition-transform"
              style={{
                padding: "8px 14px",
                background: "#3D5AF2",
                color: "white",
                fontSize: "13px",
                fontWeight: 600,
              }}
            >
              <PlusCircle size={15} color="white" />
              Maak je eerste missie
            </button>
          </div>
        )}

        {/* Mission cards */}
        {missions.map((mission) => {
          const { flightTime, batteryNeed, feasible } = calcMetrics(
            mission.quality,
          );
          return (
            <div
              key={mission.id}
              className="bg-white rounded-card border border-border flex items-center gap-3 w-full max-w-[560px] mx-auto"
              style={{
                padding: "12px 14px",
                boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
              }}
            >
              {/* Info */}
              <div className="flex-1 min-w-0">
                {/* Location */}
                <div className="flex items-center gap-1.5 min-w-0">
                  <Locate
                    size={13}
                    color="#3D5AF2"
                    strokeWidth={2}
                    className="flex-shrink-0"
                  />
                  <span
                    className="font-bold text-title truncate"
                    style={{ fontSize: "14px" }}
                  >
                    {mission.name}
                  </span>
                </div>

                {/* Metrics */}
                <div className="flex items-center gap-3 mt-1.5">
                  <div className="flex items-center gap-1">
                    <Clock size={12} color="#888" strokeWidth={2} />
                    <span style={{ fontSize: "12px", color: "#888" }}>
                      {flightTime} min
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Battery
                      size={12}
                      color={feasible ? "#888" : "#E0515F"}
                      strokeWidth={2}
                    />
                    <span
                      style={{
                        fontSize: "12px",
                        color: feasible ? "#888" : "#E0515F",
                        fontWeight: feasible ? 400 : 600,
                      }}
                    >
                      -{batteryNeed}%
                    </span>
                    {!feasible && (
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: 700,
                          color: "#E0515F",
                          background: "rgba(224,81,95,0.1)",
                          border: "1px solid rgba(224,81,95,0.25)",
                          borderRadius: "4px",
                          padding: "1px 5px",
                        }}
                      >
                        Onvoldoende
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => onEdit(mission)}
                  className="flex items-center gap-1.5 rounded-btn active:scale-95 transition-transform select-none bg-bg-secondary border border-border"
                  style={{
                    padding: "7px 10px",
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#5A5A5A",
                  }}
                >
                  <Pencil size={13} strokeWidth={2} />
                  Bewerk
                </button>
                <button
                  onClick={() => feasible && onStart(mission)}
                  disabled={!feasible}
                  className="flex items-center gap-1.5 rounded-btn transition-transform select-none"
                  style={{
                    padding: "7px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    color: feasible ? "white" : "#AAAAAA",
                    background: feasible ? "#3D5AF2" : "#EBEBEB",
                    boxShadow: feasible
                      ? "0 2px 8px rgba(61,90,242,0.25)"
                      : "none",
                    cursor: feasible ? "pointer" : "not-allowed",
                  }}
                >
                  <Play
                    size={12}
                    fill={feasible ? "white" : "#AAAAAA"}
                    strokeWidth={0}
                  />
                  Start
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
