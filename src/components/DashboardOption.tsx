import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface DashboardOptionProps {
  icon: LucideIcon;
  text: string;
  href: string;
}

export default function DashboardOption({ icon: Icon, text, href }: DashboardOptionProps) {
  return (
    <Link
      href={href}
      className="group hover:bg-background-light/40 bg-background-lighter/30 flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border border-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/10"
    >
      <div className="bg-background-light/40 flex h-16 w-16 items-center justify-center rounded-full border border-white/5 backdrop-blur-sm sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <Icon size={28} className="text-primary sm:h-8 sm:w-8 lg:h-10 lg:w-10" />
      </div>
      <div className="text-center">
        <p className="group-hover:text-primary text-base font-medium text-gray-200 sm:text-lg lg:text-xl">
          {text}
        </p>
      </div>
    </Link>
  );
}
