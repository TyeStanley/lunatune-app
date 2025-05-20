import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
}

export function PageHeader({ icon: Icon, title }: PageHeaderProps) {
  return (
    <div className="mb-12">
      <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Icon size={28} className="text-primary" />
          <h1 className="text-2xl font-semibold text-gray-200">{title}</h1>
        </div>
      </div>
    </div>
  );
}
