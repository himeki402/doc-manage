import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type StatsCardsProps = {
  title: string;
  value: number | string;
  growthPercentage: number;
  icon: React.ReactNode;
};

export default function StatsCards({ 
  title, 
  value, 
  growthPercentage, 
  icon 
}: StatsCardsProps) {
  const isPositiveGrowth = growthPercentage && growthPercentage >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">
          <span className={`flex items-center ${isPositiveGrowth ? 'text-emerald-500' : 'text-red-500'}`}>
            {isPositiveGrowth ? (
              <ArrowUpRight className="mr-1 h-4 w-4" />
            ) : (
              <ArrowDownRight className="mr-1 h-4 w-4" />
            )}
            {growthPercentage}% so với tháng trước
          </span>
        </p>
      </CardContent>
    </Card>
  );
}