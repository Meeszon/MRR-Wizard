import { useState } from "react";
import { Check, Info, PenLine, RotateCcw } from "lucide-react";
import MapPlaceholder from "../../components/MapPlaceholder";
import Button from "../../components/Button";
import WizardBar from "../../components/WizardBar";

interface Step2Props {
  onBack: () => void;
  onNext: () => void;
  hintsVisible: boolean;
  onToggleHints: () => void;
  onStepClick: (step: number) => void;
}

export default function Step2_Area({
  onBack,
  onNext,
  hintsVisible,
  onToggleHints,
  onStepClick,
}: Step2Props) {
  const [clicks, setClicks] = useState(0);
  const isClosed = clicks >= 4;

  function reset(e: React.MouseEvent) {
    e.stopPropagation();
    setClicks(0);
  }

  return (
    <div className="w-full h-full flex flex-col">
      <WizardBar
        currentStep={2}
        totalSteps={4}
        onBack={onBack}
        onStepClick={onStepClick}
        hintsVisible={hintsVisible}
        onToggleHints={onToggleHints}
      />

      <div className="flex-1 relative min-h-0">
        <div
          className="absolute inset-0 cursor-crosshair"
          onClick={() => setClicks((c) => Math.min(c + 1, 4))}
        >
          <MapPlaceholder
            mode={isClosed ? "confirm" : "draw"}
            className="absolute inset-0"
          />
        </div>

        {/* Reset button — always top-right */}
        <div className="absolute top-3 right-3">
          <button
            onClick={reset}
            className="bg-white rounded-btn shadow-md border border-border px-2.5 py-2 flex items-center gap-1.5 active:scale-95 transition-transform"
          >
            <RotateCcw size={15} color="#5A5A5A" strokeWidth={2} />
          </button>
        </div>

        {hintsVisible && (
          <div className="absolute bottom-16 left-3 right-3 flex justify-center pointer-events-none">
            <div className="bg-white/90 rounded-btn px-3 py-1.5 flex items-center gap-1.5 shadow-sm">
              <Info size={12} color="#5A5A5A" className="flex-shrink-0" />
              <span className="text-body font-medium">
                {isClosed
                  ? "Controleer het gebied en bevestig"
                  : clicks === 0
                    ? "Tik op de kaart om je eerste hoekpunt te plaatsen"
                    : clicks < 3
                      ? "Tik en maak meer hoekpunten. Teken hiermee de omtrek van het gebied"
                      : "Als je klaar bent, tik je op je eerste hoekpunt om het gebied te sluiten"}
              </span>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 left-6 right-6">
          {!isClosed ? (
            <div className="w-full py-3 px-4 rounded-btn border-2 border-dashed border-body/25 bg-white/80 flex items-center justify-center gap-2.5">
              <PenLine size={18} color="#5A5A5A" strokeWidth={2} />
              <span className="text-body-lg text-body font-semibold">
                Teken het gebied dat gescand moet worden
              </span>
            </div>
          ) : (
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={onNext}
              icon={<Check size={18} color="white" strokeWidth={2.5} />}
            >
              Bevestig Gebied
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
