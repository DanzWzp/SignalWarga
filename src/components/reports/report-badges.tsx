import {
  categoryBadgeClasses,
  categoryLabels,
  priorityBadgeClasses,
  priorityLabels,
  statusBadgeClasses,
  statusLabels,
} from "@/lib/constants";
import type {
  ReportCategory,
  ReportPriority,
  ReportStatus,
} from "@/types/database";
import { Badge } from "@/components/ui/badge";

export function StatusBadge({ status }: { status: ReportStatus }) {
  return <Badge className={statusBadgeClasses[status]}>{statusLabels[status]}</Badge>;
}

export function CategoryBadge({ category }: { category: ReportCategory }) {
  return (
    <Badge className={categoryBadgeClasses[category]}>{categoryLabels[category]}</Badge>
  );
}

export function PriorityBadge({ priority }: { priority: ReportPriority }) {
  return (
    <Badge className={priorityBadgeClasses[priority]}>{priorityLabels[priority]}</Badge>
  );
}
