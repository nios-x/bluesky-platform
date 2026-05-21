"use client";

import { AlertCircle, CheckCircle2, Truck } from "lucide-react";

interface DumpsterDetailSectionProps {
  dumpsterType: string;
  selectedSize: number;
  sizes: Array<{ value: number; label: string; dimensions: string }>;
  onSizeChange: (size: number) => void;
}

const DUMPSTER_SPECS: Record<string, Record<number, { included: string; tons: number }>> = {
  "roll-off": {
    10: {
      included: "Delivery + Pickup + 14-day rental",
      tons: 3,
    },
    20: {
      included: "Delivery + Pickup + 14-day rental",
      tons: 4,
    },
    30: {
      included: "Delivery + Pickup + 14-day rental",
      tons: 5,
    },
    40: {
      included: "Delivery + Pickup + 14-day rental",
      tons: 5,
    },
  },
  "rubber-wheel": {
    10: {
      included: "Delivery + Pickup + 7-day rental",
      tons: 2,
    },
    20: {
      included: "Delivery + Pickup + 7-day rental",
      tons: 3,
    },
    30: {
      included: "Delivery + Pickup + 7-day rental",
      tons: 3.5,
    },
  },
  "permanent": {
    2: {
      included: "Regular pickup + Lockable lid",
      tons: 0.5,
    },
    4: {
      included: "Regular pickup + Lockable lid",
      tons: 1,
    },
    6: {
      included: "Regular pickup + Lockable lid",
      tons: 1.5,
    },
    8: {
      included: "Regular pickup + Lockable lid",
      tons: 2,
    },
  },
};

const RESTRICTED_ITEMS = [
  "Hazardous waste (paint, chemicals, asbestos, motor oil)",
  "Tires and batteries",
  "Electronics (TVs, computers — must go to e-waste)",
  "Medical / biohazardous waste",
  "Flammable liquids or gases",
  "Food waste in large quantities",
];

const DELIVERY_INSTRUCTIONS = [
  {
    title: "When Dumpster Arrives",
    steps: [
      "Ensure clear access — at least 60 feet of clearance for the truck",
      "Mark where you want the dumpster placed (driveway, street, etc.)",
      "Do not place objects under or around the drop zone",
      "Have a contact person available on delivery day",
    ],
  },
  {
    title: "When Dumpster Is Picked Up",
    steps: [
      "Do not overfill — debris must be at or below the top rail",
      "Remove any locks or chains before scheduled pickup",
      "Ensure truck access is clear — no vehicles blocking the dumpster",
      "Be ready for same-day pickup within the scheduled window",
    ],
  },
];

export function DumpsterDetailSection({
  dumpsterType,
  selectedSize,
  sizes,
  onSizeChange,
}: DumpsterDetailSectionProps) {
  // Determine dumpster category
  let category = "roll-off";
  if (dumpsterType?.toLowerCase().includes("rubber")) {
    category = "rubber-wheel";
  } else if (dumpsterType?.toLowerCase().includes("permanent")) {
    category = "permanent";
  }

  const spec = DUMPSTER_SPECS[category]?.[selectedSize];

  return (
    <div className="space-y-8 mt-8">
      {/* Size Switcher - WM.com Style */}
      <div className="bg-white border-2 border-[#142A52]/10 rounded-lg p-6">
        <h3 className="text-lg font-bold text-[#142A52] mb-4">
          Choose Your Size
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {sizes.map((size) => (
            <button
              key={size.value}
              onClick={() => onSizeChange(size.value)}
              className={`p-4 rounded-lg border-2 transition-all text-center ${selectedSize === size.value
                  ? "border-[#C89B2B] bg-[#C89B2B]/10"
                  : "border-[#142A52]/30 hover:border-[#C89B2B]/50 bg-white"
                }`}
            >
              <div className="font-bold text-[#142A52]">{size.label}</div>
              <div className="text-xs text-[#142A52]/60 mt-1">{size.dimensions}</div>
            </button>
          ))}
        </div>
      </div>

      {/* What's Included */}
      {spec && (
        <div className="bg-white border-2 border-[#142A52]/10 rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#142A52] mb-4">
            What's Included
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#142A52]">{spec.included}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-[#142A52]">
                  {spec.tons} tons included
                </p>
                <p className="text-sm text-[#142A52]/70">
                  Overage: price per ton displayed at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* What's NOT Allowed */}
      <div className="bg-red-50 border-2 border-red-300 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-4">
          <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <h3 className="text-lg font-bold text-red-800">
            What's NOT Allowed
          </h3>
        </div>
        <ul className="space-y-2">
          {RESTRICTED_ITEMS.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-red-700 text-sm">
              <span className="text-red-500 font-bold">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Delivery & Pickup Instructions */}
      <div className="bg-white border-2 border-[#142A52]/10 rounded-lg p-6">
        <div className="flex items-start gap-3 mb-6">
          <Truck className="w-6 h-6 text-[#142A52] flex-shrink-0 mt-0.5" />
          <h3 className="text-lg font-bold text-[#142A52]">
            Delivery & Pickup Instructions
          </h3>
        </div>

        <div className="space-y-6">
          {DELIVERY_INSTRUCTIONS.map((section, idx) => (
            <div key={idx}>
              <h4 className="font-bold text-[#142A52] mb-3">{section.title}</h4>
              <ul className="space-y-2 ml-4">
                {section.steps.map((step, stepIdx) => (
                  <li
                    key={stepIdx}
                    className="flex gap-3 text-[#142A52]/80 text-sm"
                  >
                    <span className="font-bold text-[#C89B2B] min-w-fit">
                      {stepIdx + 1}.
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
