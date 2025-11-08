import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { motion } from "framer-motion";

const mockCategoryData = [
  { name: 'Food', value: 500, color: '#ef4444' }, // Red
  { name: 'Housing', value: 800, color: '#3b82f6' }, // Blue
  { name: 'Transport', value: 200, color: '#f59e0b' }, // Amber
  { name: 'Entertainment', value: 150, color: '#10b981' }, // Emerald
  { name: 'Other', value: 50, color: '#6366f1' }, // Indigo
];

const CategoryPieChart = () => {
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
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockCategoryData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                labelLine={false}
              >
                {mockCategoryData.map((entry, index) => (
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
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CategoryPieChart;