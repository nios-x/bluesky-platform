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

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-12">
        <DetailedCard title="What's Included">
          <ul className="space-y-4">
            {product.included.map((item: string, i: number) => (
              <li key={i} className="flex gap-3 font-medium text-gray-700">
                <Check className="w-4 h-4 text-green-600" />
                {item}
              </li>
            ))}
          </ul>
        </DetailedCard>

        <DetailedCard
          title="Excluded Material"
          borderColor="border-red-100"
          titleColor="text-red-600"
        >
          <div className="grid grid-cols-4 gap-4">
            {[
              { icon: Ban, name: "Tires" },
              { icon: Droplet, name: "Liquid" },
              { icon: AlertTriangle, name: "Hazardous" },
              { icon: AlertOctagon, name: "Drums" },
              { icon: Flame, name: "Chemical" },
              { icon: Battery, name: "Batteries" },
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center text-center">
                <item.icon className="w-5 h-5 text-red-500 mb-1" />
                <span className="text-xs font-bold text-gray-600">
                  {item.name}
                </span>
              </div>
            ))}
          </div>
        </DetailedCard>

      </div>
    </>
  );
}