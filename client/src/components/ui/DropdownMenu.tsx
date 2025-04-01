'use client';

import { ReactNode, useRef, useEffect, useState } from 'react';
import { MoreHorizontal } from 'lucide-react';

interface DropdownMenuItem {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  className?: string;
}

interface DropdownMenuProps {
  trigger?: ReactNode;
  items: DropdownMenuItem[];
  className?: string;
}

export function DropdownMenu({ trigger, items, className = '' }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const defaultTrigger = (
    <MoreHorizontal
      size={18}
      className="hover:text-primary invisible text-gray-400 group-focus-within:visible group-hover:visible"
      aria-label="More options"
    />
  );

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center"
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
      >
        {trigger || defaultTrigger}
      </button>
      {isOpen && (
        <div className="bg-background-lighter absolute top-[18px] right-0 z-50 min-w-[180px] rounded-md py-1 shadow-lg ring-1 ring-black/5 transition-all duration-200">
          {items.map((item, index) => (
            <button
              key={index}
              className={`hover:bg-primary/10 hover:text-primary flex w-full cursor-pointer items-center gap-2 px-3 py-1.5 text-sm text-gray-200 transition-colors duration-200 ${
                item.className || ''
              }`}
              onClick={() => {
                item.onClick();
                setIsOpen(false);
              }}
            >
              {item.icon && (
                <div className="flex h-4 w-4 items-center justify-center">{item.icon}</div>
              )}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
