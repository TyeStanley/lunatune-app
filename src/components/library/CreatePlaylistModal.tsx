import { X, Plus } from 'lucide-react';
import { useState } from 'react';

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description: string) => void;
  error?: string | null;
  isLoading?: boolean;
}

export default function CreatePlaylistModal({
  isOpen,
  onClose,
  onCreate,
  error,
  isLoading,
}: CreatePlaylistModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreate = () => {
    onCreate(name.trim(), description.trim());
    setName('');
    setDescription('');
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-40 w-full max-w-md">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Plus size={20} className="text-primary" />
              <h2 className="text-xl font-semibold text-gray-200">Create Playlist</h2>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          <div className="mb-4 space-y-3">
            <input
              type="text"
              className="bg-background-lighter/40 focus:border-primary w-full rounded-md border border-white/10 px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none"
              placeholder="Playlist name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={50}
              autoFocus
            />
            <textarea
              className="bg-background-lighter/40 focus:border-primary w-full rounded-md border border-white/10 px-3 py-2 text-gray-200 placeholder-gray-400 focus:outline-none"
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              rows={3}
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              className="bg-primary hover:bg-primary/80 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              disabled={!name.trim() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
