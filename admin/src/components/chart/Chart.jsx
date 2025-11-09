import "./chart.scss";
import {
  AreaChart,
  Area,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import useFetch from "../../hooks/useFetch";

const Chart = ({ aspect = 2, title }) => {
  // Fetch all bookings from existing endpoint
  const { data, loading, error } = useFetch("/api/bookings");

  // Process the data to get monthly revenue totals
  const processChartData = () => {
    if (!data || data.length === 0) return [];

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    // Group bookings by month
    const monthlyData = {};

    data.forEach((booking) => {
      // Only count confirmed and paid bookings
      if (booking.status === "confirmed" && booking.isPaid) {
        const date = new Date(booking.createdAt);
        const monthYear = `${date.getFullYear()}-${date.getMonth()}`;
        const monthName = monthNames[date.getMonth()];

        if (!monthlyData[monthYear]) {
          monthlyData[monthYear] = {
            name: monthName,
            Total: 0,
            date: date,
            month: date.getMonth(),
            year: date.getFullYear(),
          };
        }

        // Add booking revenue
        monthlyData[monthYear].Total += booking.totalPrice || 0;
      }
    });

    // Convert to array and sort by date
    return Object.values(monthlyData)
      .sort((a, b) => {
        if (a.year !== b.year) return a.year - b.year;
        return a.month - b.month;
      })
      .slice(-6) // Get last 6 months
      .map(({ name, Total }) => ({
        name,
        Total: Math.round(Total), // Round to nearest whole number
      }));
  };

  const chartData = processChartData();

  if (loading) {
    return (
      <div className="chart">
        <h3 className="title">{title}</h3>
        <div className="chartWrapper">
          <p>Loading chart data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="chart">
        <h3 className="title">{title}</h3>
        <div className="chartWrapper">
          <p>Error loading chart data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="chart">
      <h3 className="title">{title}</h3>
      <div className="chartWrapper">
        <ResponsiveContainer width="100%" aspect={aspect}>
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="total" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="name" stroke="gray" />
            <CartesianGrid strokeDasharray="3 3" className="chartGrid" />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="Total"
              stroke="#8884d8"
              fillOpacity={1}
              fill="url(#total)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
