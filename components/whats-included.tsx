import {
  Check,
  Battery,
  Truck,
  Ban,
  Droplet,
  AlertTriangle,
  AlertOctagon,
  Flame,
} from "lucide-react";

// 🔹 Reusable Small Card
const InfoCard = ({ title, icon: Icon, iconColor, children }: any) => (
  <div className="p-6 bg-white rounded-xl border border-gray-200">
    <h3 className="flex items-center gap-2 text-lg font-bold text-gray-900 mb-4">
      <Icon className={`w-5 h-5 ${iconColor}`} />
      {title}
    </h3>
    {children}
  </div>
);

// 🔹 Reusable Detailed Card
const DetailedCard = ({
  title,
  children,
  borderColor = "border-blue-100",
  titleColor = "text-[#008CBA]",
}: any) => (
  <div className={`bg-white ${borderColor} border rounded-xl p-8 `}>
    <h3 className={`text-xl font-bold ${titleColor} mb-6 border-b pb-4`}>
      {title}
    </h3>
    {children}
  </div>
);

// 🔹 MAIN COMPONENT
export default function ProductInfoSection({ product }: any) {
  return (
    <>

    </>
  );
}