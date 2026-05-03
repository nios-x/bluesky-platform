export async function getDashboardMetrics(supabase) {
  // 1. Total Revenue and Total Orders
  const { data: allOrders, error: orderError } = await supabase
    .from("orders")
    .select("id, total_amount, order_status, created_at")
    .neq("order_status", "CANCELLED");

  if (orderError) throw new Error(orderError.message);

  let totalRevenue = 0;
  allOrders.forEach(o => totalRevenue += Number(o.total_amount));
  
  // 2. Active Customers
  const { count: activeCustomers, error: customerError } = await supabase
    .from("customers")
    .select("*", { count: 'exact', head: true })
    .eq("status", "ACTIVE");

  // 3. Pending Deliveries
  const { count: pendingDeliveries, error: pendingError } = await supabase
    .from("orders")
    .select("*", { count: 'exact', head: true })
    .in("order_status", ["CONFIRMED", "IN_TRANSIT"]);

  // 4. Chart Data (Last 90 days)
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
  
  const recentOrdersForChart = allOrders.filter(o => new Date(o.created_at) >= ninetyDaysAgo);
  
  // Group by date string YYYY-MM-DD
  const grouped = {};
  recentOrdersForChart.forEach(o => {
    const date = new Date(o.created_at).toISOString().split('T')[0];
    if (!grouped[date]) {
      grouped[date] = { revenue: 0, orders: 0 };
    }
    grouped[date].revenue += Number(o.total_amount);
    grouped[date].orders += 1;
  });

  const chartData = Object.keys(grouped).sort().map(date => ({
    date,
    revenue: grouped[date].revenue,
    orders: grouped[date].orders
  }));

  // 5. Recent Orders (limit 10) for DataTable
  const { data: recentOrdersTable, error: recentError } = await supabase
    .from("orders")
    .select(`
      id,
      total_amount,
      order_status,
      created_at,
      customers ( first_name, last_name )
    `)
    .order("created_at", { ascending: false })
    .limit(10);

  return {
    metrics: {
      totalRevenue,
      totalOrders: allOrders.length,
      activeCustomers: activeCustomers || 0,
      pendingDeliveries: pendingDeliveries || 0
    },
    chartData,
    recentOrdersTable: recentOrdersTable || []
  };
}
