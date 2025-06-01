import { Plus } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface DropdownOption {
  label: string;
  onClick: () => void;
  itemIcon?: React.ReactNode; // Use itemIcon for the menu item icon
}

interface LibraryDropdownProps {
  options: DropdownOption[];
  icon?: React.ReactNode; // Optional: allow custom trigger icon
  className?: string;
  btnClassName?: string;
}

export function LibraryDropdown({ options, icon, className, btnClassName }: LibraryDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={ref}>
      <button
        className={`hover:text-primary flex items-center justify-center rounded-full p-3 ${btnClassName ? btnClassName : 'bg-background-lighter/29 hover:bg-primary/20 text-gray-201 focus:outline-none'}`}
        onClick={() => setOpen((v) => !v)}
      >
        {icon || <Plus size={20} />}
      </button>
      {open && (
        <div className="bg-background-lighter/90 absolute right-0 z-10 mt-2 w-40 rounded-md border border-white/10 shadow-lg">
          {options.map((option, index) => (
            <button
              key={index}
              className="hover:bg-primary/10 hover:text-primary flex w-full items-center gap-2 rounded-md px-4 py-2 text-left whitespace-nowrap text-gray-200 transition-colors"
              onClick={() => {
                setOpen(false);
                option.onClick();
              }}
            >
              {option.itemIcon && <span className="mr-1">{option.itemIcon}</span>}
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
