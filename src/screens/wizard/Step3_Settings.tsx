import { useRef, useState } from "react";
import {
  ArrowRight,
  Camera,
  Mountain,
  Signal,
  Layers,
  ChevronRight,
  Check,
  ArrowLeft,
  Clock,
  Battery,
} from "lucide-react";
import type { WizardState } from "../../types";
import Toggle from "../../components/Toggle";
import BigSlider from "../../components/BigSlider";
import WizardBar from "../../components/WizardBar";
import { CURRENT_BATTERY, calcMetrics } from "../../constants";

function qualityLabel(q: number) {
  if (q <= 25) return "Snel";
  if (q <= 50) return "Normaal";
  if (q <= 75) return "Gedetailleerd";
  return "Maximaal";
}

interface Step3Props {
  wizard: WizardState;
  onChange: (updates: Partial<WizardState>) => void;
  onBack: () => void;
  onNext: () => void;
  hintsVisible: boolean;
  onToggleHints: () => void;
  onStepClick: (step: number) => void;
}

export default function Step3_Settings({
  wizard,
  onChange,
  onBack,
  onNext,
  hintsVisible,
  onToggleHints,
  onStepClick,
}: Step3Props) {
  const [showQualityScreen, setShowQualityScreen] = useState(false);

  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const holdInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const heightRef = useRef(wizard.highestPointMeters);
  heightRef.current = wizard.highestPointMeters;

  function startHold(delta: number) {
    holdTimer.current = setTimeout(() => {
      holdInterval.current = setInterval(() => {
        const next = Math.min(300, Math.max(0, heightRef.current + delta));
        onChange({ highestPointMeters: next });
      }, 120);
    }, 400);
  }

  function stopHold() {
    if (holdTimer.current) clearTimeout(holdTimer.current);
    if (holdInterval.current) clearInterval(holdInterval.current);
  }

return (
    <div className="w-full h-full flex flex-col bg-bg-secondary relative">
      <WizardBar
        currentStep={3}
        totalSteps={4}
        onBack={onBack}
        onStepClick={onStepClick}
        hintsVisible={hintsVisible}
        onToggleHints={onToggleHints}
      />

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pt-3 pb-2">
        <div className="bg-bg-primary rounded-card border border-border overflow-hidden max-w-[600px] mx-auto w-full">
          {/* Quality — drill-down */}
          <button
            className="w-full flex items-center gap-3 px-4 hover:bg-bg-secondary transition-colors"
            style={{ minHeight: 60, paddingBlock: 10 }}
            onClick={() => setShowQualityScreen(true)}
          >
            <Camera size={16} color="#3D5AF2" className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 13 }}>
              Kwaliteit
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <span style={{ fontSize: 13, color: "#23262F", fontWeight: 600 }}>
                {qualityLabel(wizard.quality)}
              </span>
              <ChevronRight
                size={16}
                color="#C0C0C0"
                className="flex-shrink-0"
              />
            </div>
          </button>

          <div className="h-px bg-border" />

          {/* Highest point — stepper */}
          <div
            className="px-4 flex items-center gap-3"
            style={{ minHeight: 60, paddingBlock: 10 }}
          >
            <Mountain size={16} color="#3D5AF2" className="flex-shrink-0" />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span
                className="font-semibold text-title"
                style={{ fontSize: 13 }}
              >
                Hoogste punt
              </span>
              {hintsVisible && (
                <span
                  style={{ fontSize: 11, color: "#5A5A5A", lineHeight: 1.3 }}
                >
                  Hoe hoog is het hoogste object in het vlieggebied?
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() =>
                  onChange({
                    highestPointMeters: Math.max(
                      0,
                      wizard.highestPointMeters - 5,
                    ),
                  })
                }
                onMouseDown={() => startHold(-5)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(-5)}
                onTouchEnd={stopHold}
                className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
                style={{
                  width: 36,
                  height: 36,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#5A5A5A",
                  lineHeight: 1,
                }}
              >
                −
              </button>
              <span
                className="font-bold text-title text-center"
                style={{ fontSize: 16, minWidth: 52 }}
              >
                {wizard.highestPointMeters} m
              </span>
              <button
                onClick={() =>
                  onChange({
                    highestPointMeters: Math.min(
                      300,
                      wizard.highestPointMeters + 5,
                    ),
                  })
                }
                onMouseDown={() => startHold(5)}
                onMouseUp={stopHold}
                onMouseLeave={stopHold}
                onTouchStart={() => startHold(5)}
                onTouchEnd={stopHold}
                className="flex items-center justify-center rounded-btn bg-bg-secondary border border-border active:scale-95 transition-transform select-none"
                style={{
                  width: 36,
                  height: 36,
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#5A5A5A",
                  lineHeight: 1,
                }}
              >
                +
              </button>
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* RTK precision — toggle */}
          <div
            className="px-4 flex items-center gap-3"
            style={{ minHeight: 60, paddingBlock: 10 }}
          >
            <Signal
              size={16}
              color={wizard.rtkEnabled ? "#3D5AF2" : "#C0C0C0"}
              className="flex-shrink-0"
            />
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span
                className="font-semibold text-title"
                style={{ fontSize: 13 }}
              >
                RTK Precisie
              </span>
              <span style={{ fontSize: 11, color: "#5A5A5A", lineHeight: 1.3 }}>
                Alleen beschikbaar voor de MRR Pro drone
              </span>
            </div>
            <div className="flex-shrink-0">
              <Toggle
                enabled={wizard.rtkEnabled}
                onChange={(val) => onChange({ rtkEnabled: val })}
              />
            </div>
          </div>

          <div className="h-px bg-border" />

          {/* Applicatie — read-only */}
          <div
            className="px-4 flex items-center gap-3"
            style={{ minHeight: 60 }}
          >
            <Layers size={16} color="#3D5AF2" className="flex-shrink-0" />
            <span className="font-semibold text-title" style={{ fontSize: 13 }}>
              Applicatie
            </span>
            <span
              className="ml-auto"
              style={{ fontSize: 13, color: "#5A5A5A" }}
            >
              {wizard.app}
            </span>
          </div>
        </div>
      </div>

      {/* Sticky footer */}
      <div className="flex-shrink-0 px-8 pt-2 pb-3">
        <button
          onClick={onNext}
          className="w-full max-w-[560px] mx-auto py-3 rounded-btn bg-primary flex items-center justify-center gap-2 shadow active:scale-[0.98] transition-transform"
        >
          <Check size={18} color="white" strokeWidth={3} />
          <span className="text-h3 text-white font-bold">Bevestig Instellingen</span>
        </button>
      </div>


{/* ── Quality dashboard screen ─────────────────────────────── */}
      {showQualityScreen &&
        (() => {
          const m = calcMetrics(wizard.quality);
          return (
            <div className="absolute inset-0 bg-bg-secondary flex flex-col z-10 overflow-hidden">
              {/* Section 1 — Header (matches WizardBar) */}
              <div className="relative flex items-center bg-white border-b border-border px-4 py-3 flex-shrink-0">
                <button
                  onClick={() => setShowQualityScreen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-btn hover:bg-bg-secondary transition-colors flex-shrink-0 relative z-10"
                >
                  <ArrowLeft size={20} color="#5A5A5A" />
                </button>
                <span
                  className="absolute inset-0 flex items-center justify-center font-bold text-title pointer-events-none"
                  style={{ fontSize: 15 }}
                >
                  Kwaliteit
                </span>
                {m.feasible ? (
                  <div
                    className="flex-shrink-0 rounded-full px-3 py-1 ml-auto relative z-10 flex items-center gap-1.5"
                    style={{
                      background: "rgba(103,215,163,0.15)",
                      border: "1px solid rgba(103,215,163,0.5)",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#2a9d6e",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#2a9d6e",
                      }}
                    >
                      Vlucht mogelijk
                    </span>
                  </div>
                ) : (
                  <div
                    className="flex-shrink-0 rounded-full px-3 py-1 ml-auto relative z-10 flex items-center gap-1.5"
                    style={{
                      background: "rgba(224,81,95,0.12)",
                      border: "1px solid rgba(224,81,95,0.5)",
                    }}
                  >
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#E0515F",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#E0515F",
                      }}
                    >
                      Vlucht te lang
                    </span>
                  </div>
                )}
              </div>

              {/* Scrollable body */}
              <div className="flex-1 overflow-y-auto min-h-0">

              <div className="max-w-[560px] mx-auto w-full">

              {/* Section 2 — Metrics Dashboard */}
              <div className="grid grid-cols-2 gap-2 px-4 py-4 min-[480px]:grid-cols-4">
                <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
                  <Clock size={16} color="#3D5AF2" />
                  <span
                    className="font-bold text-title"
                    style={{ fontSize: 22, lineHeight: 1.1 }}
                  >
                    {m.flightTime}
                  </span>
                  <span style={{ fontSize: 10, color: "#5A5A5A" }}>min</span>
                </div>

                <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
                  <ArrowRight
                    size={16}
                    color="#3D5AF2"
                    style={{ transform: "rotate(90deg)" }}
                  />
                  <span
                    className="font-bold text-title"
                    style={{ fontSize: 22, lineHeight: 1.1 }}
                  >
                    {m.flightHeight}
                  </span>
                  <span style={{ fontSize: 10, color: "#5A5A5A" }}>
                    m hoogte
                  </span>
                </div>

                <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
                  <Camera size={16} color="#3D5AF2" />
                  <span
                    className="font-bold text-title"
                    style={{ fontSize: 22, lineHeight: 1.1 }}
                  >
                    {m.photos}
                  </span>
                  <span style={{ fontSize: 10, color: "#5A5A5A" }}>foto's</span>
                </div>

                <div className="bg-white rounded-card border border-border flex flex-col items-center justify-center gap-1 py-4">
                  <Battery
                    size={16}
                    color={m.feasible ? "#3D5AF2" : "#E0515F"}
                  />
                  <span
                    className="font-bold"
                    style={{
                      fontSize: 22,
                      lineHeight: 1.1,
                      color: m.feasible ? "#23262F" : "#E0515F",
                    }}
                  >
                    -{m.batteryNeed}%
                  </span>
                  <span style={{ fontSize: 10, color: "#9A9A9A" }}>
                    Huidig: {CURRENT_BATTERY}%
                  </span>
                </div>
              </div>

              {/* Section 3 — Slider & Controls */}
              <div className="px-4 pb-4">
                <div className="bg-white rounded-card border border-border px-5 py-4">
                  <div className="flex justify-between mb-4">
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5A5A5A",
                      }}
                    >
                      Snel (Minder detail)
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#5A5A5A",
                      }}
                    >
                      Traag (Veel detail)
                    </span>
                  </div>
                  <BigSlider
                    value={wizard.quality}
                    onChange={(val) => onChange({ quality: val })}
                  />
                </div>
                {hintsVisible && (
                  <span className="block text-center mt-3" style={{ fontSize: 11, color: '#5A5A5A' }}>
                    Hogere kwaliteit = meer batterij en langzamere vlucht
                  </span>
                )}
              </div>

              </div>{/* end max-w wrapper */}

              </div>{/* end scrollable body */}
            </div>
          );
        })()}
    </div>
  );
}
