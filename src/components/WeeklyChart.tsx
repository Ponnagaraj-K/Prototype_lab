import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import apiClient from "@/lib/apiClient";

const WeeklyChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  const fetchWeeklyData = async () => {
    try {
      const weeklyData = await apiClient.get('/stats/weekly');
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      
      const formattedData = weeklyData.map((item: any) => {
        const date = new Date(item.date);
        return {
          day: days[date.getDay()],
          hours: +(item.duration / 60).toFixed(1)
        };
      });
      
      setData(formattedData);
    } catch (error) {
      console.error('Error fetching weekly data:', error);
      // Set empty data for 7 days on error
      const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      const emptyData = days.map(day => ({ day, hours: 0 }));
      setData(emptyData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="glass-card rounded-xl p-6"
    >
      <h3 className="font-display text-lg font-semibold mb-4">Weekly Overview</h3>
      {loading ? (
        <div className="flex justify-center items-center h-[220px]">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
            <YAxis tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} unit="h" />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value: number) => [`${value}h`, "Study Time"]}
            />
            <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  );
};

export default WeeklyChart;
