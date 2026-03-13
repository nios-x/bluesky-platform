export default function AdminHeader({ admin }: any) {
  return (
    <header className="bg-white shadow-sm px-8 py-4 flex justify-between">
      <h1 className="text-lg font-semibold">
        Admin Dashboard
      </h1>

      <div className="text-sm">
        {admin.name} ({admin.admin_role})
      </div>
    </header>
  );
}