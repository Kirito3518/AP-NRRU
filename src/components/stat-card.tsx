import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: number;
  description?: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconBg,
  iconColor,
}: StatCardProps) {
  return (
    <Card size="sm">
      <CardHeader className="pb-3">
        <div
          className={cn(
            "w-9 h-9 rounded-lg flex items-center justify-center",
            iconBg,
          )}
        >
          <Icon className={cn("w-[18px] h-[18px]", iconColor)} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-[26px] font-medium leading-none">{value}</div>
        <CardTitle className="text-[13px] font-medium text-foreground mt-1.5">
          {title}
        </CardTitle>
        {description && (
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
