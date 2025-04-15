'use client';

import { Moon } from 'lucide-react';
import Link from 'next/link';

export default function NavLogo() {
  return (
    <Link href="/" className="group flex cursor-pointer items-center gap-2">
      <Moon
        size={24}
        className="text-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
      />
      <h1 className="group-hover:text-primary text-xl font-semibold text-white transition-colors duration-300">
        Lunatune
      </h1>
    </Link>
  );
}
