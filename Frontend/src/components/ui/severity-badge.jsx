import { Badge } from "./badge.jsx";
import { cn } from "@/lib/utils.js";

const severityConfig = {
  emergency: {
    label: 'Emergency',
    className: 'bg-destructive text-destructive-foreground',
  },
  urgent: {
    label: 'Urgent',
    className: 'bg-orange-500 text-white',
  },
  routine: {
    label: 'Routine',
    className: 'bg-green-500 text-white',
  },
};

export function SeverityBadge({ level, className }) {
  const config = severityConfig[level];
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
} 