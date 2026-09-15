import { Badge } from "./badge.jsx";
import { cn } from "@/lib/utils.js";

const levelConfig = {
  general: {
    label: 'General',
    className: 'bg-blue-500 text-white',
  },
  junior: {
    label: 'Junior',
    className: 'bg-green-500 text-white',
  },
  senior: {
    label: 'Senior',
    className: 'bg-purple-500 text-white',
  },
};

const defaultConfig = {
  label: 'Unknown',
  className: 'bg-gray-400 text-white',
};

export function DoctorLevelBadge({ level, className }) {
  // Normalize level to lowercase to match keys
  const normalizedLevel = level?.toLowerCase();
  const config = levelConfig[normalizedLevel] || defaultConfig;
  
  return (
    <Badge className={cn(config.className, className)}>
      {config.label}
    </Badge>
  );
}
