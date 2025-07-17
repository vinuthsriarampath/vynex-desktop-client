import { ReactNode } from "react";

interface AccountInfoItemProps {
  label: string;
  value: ReactNode;
  error?: string; 
}

export function AccountInfoItem({ label, value, error }: AccountInfoItemProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-base break-words">{value}</span>
      {error && (<p className="text-red-500 text-sm mt-1"> {error} </p>)}
    </div>
  );
} 