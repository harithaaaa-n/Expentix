import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  colorClass: string;
  delay: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({
  title,
  value,
  icon: Icon,
  colorClass,
  delay,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.03 }}
      transition={{ duration: 0.5, delay: delay, type: "spring", stiffness: 150 }}
      className="relative group" // Main container for hover effect
    >
      {/* Glow element */}
      <div
        className={cn(
          "absolute -inset-0.5 bg-gradient-to-r from-sky-blue to-lavender-violet rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-300"
        )}
      />
      {/* Card content */}
      <Card className="relative bg-card/60 backdrop-blur-md border-border/50 shadow-md lg:shadow-lg group-hover:shadow-xl transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={cn("h-4 w-4", colorClass)} />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{value}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SummaryCard;