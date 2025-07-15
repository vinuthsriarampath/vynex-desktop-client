import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";

interface ProfileInfoSectionProps {
  title: string;
  onEdit?: () => void;
  children: ReactNode;
}

export function ProfileInfoSection({ title, onEdit, children }: ProfileInfoSectionProps) {
  return (
    <section className="border border-gray-200/20 rounded-md p-4 mx-1 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold text-lg">{title}</h2>
        {onEdit && (
          <Button variant="outline" className="rounded-full cursor-pointer" onClick={onEdit}>
            <PenLine className="mr-1 h-4 w-4" />Edit
          </Button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </section>
  );
} 