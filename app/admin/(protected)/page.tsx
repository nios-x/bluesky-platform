// app/admin/(protected)/page.tsx

export default function AdminDashboard() {
  const cards = [
    { title: "Orders Today", value: "--" },
    { title: "Revenue", value: "--" },
    { title: "Active Customers", value: "--" },
    { title: "Pending Deliveries", value: "--" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {cards.map((card) => (
          <div
            key={card.title}
            className="p-6 rounded-lg border border-border bg-card"
          >
            <div className="text-sm text-muted-foreground">
              {card.title}
            </div>

            <div className="text-2xl font-semibold mt-2">
              {card.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}