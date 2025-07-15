import { ReactNode } from "react";

interface ProfileInfoItemProps {
  label: string;
  value: ReactNode;
}

export function ProfileInfoItem({ label, value }: ProfileInfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-base break-words">{value}</span>
    </div>
  );
} 