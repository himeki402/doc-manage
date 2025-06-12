// components/analytics/stats-overview-cards.tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DocumentStats } from '@/lib/types/document';
import { TrendingUp, TrendingDown, FileText, Clock } from 'lucide-react';


interface StatsOverviewCardsProps {
  stats: DocumentStats;
}

export function StatsOverviewCards({ stats }: StatsOverviewCardsProps) {
  const {
    totalDocuments,
    newDocumentsThisMonth,
    growthPercentage,
    growthCount,
    recentDocuments,
  } = stats;

  const isPositiveGrowth = growthPercentage >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Tổng số tài liệu */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tổng số tài liệu
          </CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalDocuments}</div>
        </CardContent>
      </Card>

      {/* Tài liệu tháng này */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tài liệu tháng này
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newDocumentsThisMonth}</div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground">
            {isPositiveGrowth ? (
              <TrendingUp className="h-3 w-3 text-green-500" />
            ) : (
              <TrendingDown className="h-3 w-3 text-red-500" />
            )}
            <span className={isPositiveGrowth ? 'text-green-600' : 'text-red-600'}>
              {growthPercentage > 0 ? '+' : ''}{growthPercentage}%
            </span>
            <span>so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      {/* Tăng trưởng */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tăng trưởng
          </CardTitle>
          {isPositiveGrowth ? (
            <TrendingUp className="h-4 w-4 text-green-500" />
          ) : (
            <TrendingDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${isPositiveGrowth ? 'text-green-600' : 'text-red-600'}`}>
            {growthCount > 0 ? '+' : ''}{growthCount}
          </div>
          <p className="text-xs text-muted-foreground">
            {isPositiveGrowth ? 'Tăng' : 'Giảm'} so với tháng trước
          </p>
        </CardContent>
      </Card>

      {/* Tài liệu gần đây */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            7 ngày qua
          </CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentDocuments}</div>
          <p className="text-xs text-muted-foreground">
            Tài liệu được tạo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}