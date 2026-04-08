import {
  Check,
  Clock,
  Battery,
  ArrowUp,
  Camera,
  Layers,
  AlertTriangle,
  Pencil,
  RotateCcw,
} from "lucide-react";
import type { WizardState } from "../../types";
import WizardBar from "../../components/WizardBar";
import MapPlaceholder from "../../components/MapPlaceholder";

const CURRENT_BATTERY = 65;

function qualityLabel(q: number) {
  if (q <= 25) return "Snel";
  if (q <= 50) return "Normaal";
  if (q <= 75) return "Gedetailleerd";
  return "Maximaal";
}

function calcMetrics(quality: number, highestPoint: number) {
  const q = (isNaN(quality) ? 50 : quality) / 100;
  const flightTime = Math.round(10 + 35 * q);
  const baseHeight = Math.round(80 - 65 * q);
  const flightHeight = baseHeight + highestPoint;
  const batteryNeed = Math.round(20 + 60 * q);
  const feasible = batteryNeed <= CURRENT_BATTERY;
  return { flightTime, flightHeight, batteryNeed, feasible };
}

interface Step4Props {
  wizard: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
  onBack: () => void;
  onEditMap: () => void;
  onSubmit: () => void;
  isEdit: boolean;
  hintsVisible: boolean;
  onToggleHints: () => void;
  onStepClick: (step: number) => void;
}

function InfoRow({
  icon,
  label,
  value,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-2.5 px-3"
      style={{ height: 34, borderBottom: "1px solid #F0F0F0" }}
    >
      <span style={{ color: "#C0C0C0", flexShrink: 0 }}>{icon}</span>
      <span
        className="flex-1"
        style={{ fontSize: 12, color: "#5A5A5A", fontWeight: 500 }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          color: error ? "#E0515F" : "#23262F",
        }}
      >
        {value}
      </span>
    </div>
  );
}

export default function Step4_Confirm({
  wizard,
  onChange,
  onBack,
  onEditMap,
  onSubmit,
  isEdit,
  hintsVisible,
  onToggleHints,
  onStepClick,
}: Step4Props) {
  const { flightTime, flightHeight, batteryNeed, feasible } = calcMetrics(
    wizard.quality,
    wizard.highestPointMeters,
  );
  const canSubmit = wizard.name.trim().length > 0;

  return (
    <div className="w-full h-full flex flex-col">
      <WizardBar
        currentStep={4}
        totalSteps={4}
        onBack={onBack}
        onStepClick={onStepClick}
        hintsVisible={hintsVisible}
        onToggleHints={onToggleHints}
      />

      <div className="flex flex-1 min-h-0">
        {/* Kaart — 55% */}
        <div className="relative" style={{ width: "55%" }}>
          <MapPlaceholder mode="confirm" className="absolute inset-0" />
          {!isEdit && (
            <button
              onClick={onEditMap}
              className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 rounded-btn shadow border border-border active:scale-95 transition-transform"
              style={{ padding: "6px 10px" }}
            >
              <RotateCcw size={12} color="#5A5A5A" />
              <span style={{ fontSize: 11, fontWeight: 600, color: "#5A5A5A" }}>
                Herteken gebied
              </span>
            </button>
          )}
        </div>

        {/* Rechter paneel — 45% */}
        <div
          className="flex flex-col bg-white border-l border-border"
          style={{ width: "45%" }}
        >
          {/* Naam invoerveld */}
          <div className="flex-shrink-0 px-3 pt-3 pb-2">
            <div
              className="flex items-center gap-2 rounded-btn px-2.5"
              style={{
                border: "1.5px solid #3D5AF2",
                background: "rgba(61,90,242,0.04)",
                height: 36,
              }}
            >
              <Pencil size={12} color="#3D5AF2" className="flex-shrink-0" />
              <input
                type="text"
                value={wizard.name}
                onChange={(e) => onChange({ name: e.target.value })}
                placeholder="Typ hier de naam van de missie…"
                className="flex-1 outline-none bg-transparent font-semibold"
                style={{ fontSize: 12, color: "#23262F" }}
                autoComplete="off"
              />
            </div>
          </div>

          {/* Info rijen */}
          <div className="flex-1 overflow-y-auto min-h-0 border-t border-border">
            <InfoRow
              icon={<Clock size={13} />}
              label="Vluchtduur"
              value={`${flightTime} min`}
            />
            <InfoRow
              icon={<ArrowUp size={13} />}
              label="Vlieghoogte"
              value={`${flightHeight} m`}
            />
            <InfoRow
              icon={<Battery size={13} />}
              label="Batterij"
              value={
                <span className="flex items-center gap-1">
                  {!feasible && <AlertTriangle size={11} color="#E0515F" />}-
                  {batteryNeed}%
                </span>
              }
              error={!feasible}
            />
            <InfoRow
              icon={<Camera size={13} />}
              label="Kwaliteit"
              value={qualityLabel(wizard.quality)}
            />
            <InfoRow
              icon={<Layers size={13} />}
              label="Applicatie"
              value={wizard.app}
            />
          </div>

          {/* Actieknoppen + opslaan */}
          <div className="flex-shrink-0 px-6 pt-2 pb-3 flex flex-col gap-2">
            {/* Primaire knop */}
            {canSubmit ? (
              <button
                onClick={onSubmit}
                className="w-full rounded-btn bg-primary flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
                style={{ height: 44 }}
              >
                <Check size={17} color="white" strokeWidth={3} />
                <span style={{ fontSize: 14, fontWeight: 700, color: "white" }}>
                  Missie Opslaan
                </span>
              </button>
            ) : (
              <button
                disabled
                className="w-full rounded-btn flex items-center justify-center gap-2"
                style={{ height: 44, background: "#E0E0E0" }}
              >
                <Check size={17} color="#AAAAAA" strokeWidth={3} />
                <span
                  style={{ fontSize: 14, fontWeight: 700, color: "#AAAAAA" }}
                >
                  Bevestig Missie
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
