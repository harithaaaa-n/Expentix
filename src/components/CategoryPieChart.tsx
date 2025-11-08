import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from "framer-motion";

interface CategoryExpenseData {
  name: string;
  value: number;
}

interface CategoryPieChartProps {
  data: CategoryExpenseData[];
}

// Define colors for categories consistently
const CATEGORY_COLORS: { [key: string]: string } = {
  'Food': '#ef4444', // Red
  'Housing': '#3b82f6', // Blue
  'Transport': '#f59e0b', // Amber
  'Entertainment': '#10b981', // Emerald
  'Utilities': '#8b5cf6', // Violet
  'Healthcare': '#ec4899', // Pink
  'Personal': '#6366f1', // Indigo
  'Other': '#64748b', // Slate
};

const CategoryPieChart: React.FC<CategoryPieChartProps> = ({ data }) => {
  // Filter out categories with zero value
  const chartData = data.filter(d => d.value > 0).map(d => ({
    ...d,
    color: CATEGORY_COLORS[d.name] || CATEGORY_COLORS['Other'],
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 1.0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Expense Categories</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] p-2 md:p-6">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  labelLine={false}
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [`$${value}`, name]}
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))', 
                    borderRadius: '0.5rem' 
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Legend layout="vertical" verticalAlign="middle" align="right" />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              No category data available for charting.
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryPieChart;