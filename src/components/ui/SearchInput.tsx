import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search songs, artists',
}: SearchInputProps) {
  return (
    <div className="max-w-md flex-1">
      <div className="bg-background-lighter flex items-center gap-3 rounded-lg px-4 py-2">
        <Search className="text-gray-400" size={20} />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-background-lighter flex-1 text-gray-200 placeholder-gray-400 focus:outline-none"
        />
      </div>
    </div>
  );
}
