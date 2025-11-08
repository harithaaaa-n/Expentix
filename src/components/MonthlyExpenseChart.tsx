import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from "framer-motion";

interface MonthlyExpenseChartProps {
  data: { month: string; expenses: number }[];
}

const MonthlyExpenseChart: React.FC<MonthlyExpenseChartProps> = ({ data }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Monthly Expenses</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-2 md:p-6">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" stroke="hsl(var(--foreground))" />
                <YAxis stroke="hsl(var(--foreground))" tickFormatter={(value) => `$${value}`} />
                <Tooltip 
                  cursor={{ fill: 'hsl(var(--muted))', opacity: 0.5 }}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '0.5rem' 
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                  formatter={(value) => [`$${value}`, 'Expenses']}
                />
                <Bar dataKey="expenses" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No expense data available for charting.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MonthlyExpenseChart;