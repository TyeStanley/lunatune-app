import { X, Plus, Pencil, Trash, Globe, Lock } from 'lucide-react';
import { useState, useEffect } from 'react';

type ModalMode = 'create' | 'edit' | 'delete' | 'remove';

interface PlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, description: string, isPublic: boolean) => void;
  onDelete?: () => void;
  onRemove?: () => void;
  error?: string | null;
  isLoading?: boolean;
  mode: ModalMode;
  playlist?: { name: string; description?: string; isPublic?: boolean };
}

export default function PlaylistModal({
  isOpen,
  onClose,
  onSubmit,
  onDelete,
  onRemove,
  error,
  isLoading,
  mode,
  playlist,
}: PlaylistModalProps) {
  const [name, setName] = useState(playlist?.name || '');
  const [description, setDescription] = useState(playlist?.description || '');
  const [isPublic, setIsPublic] = useState(playlist?.isPublic ?? false);

  useEffect(() => {
    if (isOpen) {
      setName(playlist?.name || '');
      setDescription(playlist?.description || '');
      setIsPublic(playlist?.isPublic ?? false);
    }
  }, [isOpen, playlist]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(name.trim(), description.trim(), isPublic);
    setName('');
    setDescription('');
    setIsPublic(false);
  };

  const handleClose = () => {
    setName('');
    setDescription('');
    setIsPublic(false);
    onClose();
  };

  let title = '';
  let icon = null;
  let actionText = '';
  let actionHandler = handleSubmit;

  if (mode === 'create') {
    title = 'Create Playlist';
    icon = <Plus size={20} className="text-primary" />;
    actionText = isLoading ? 'Creating...' : 'Create';
  } else if (mode === 'edit') {
    title = 'Edit Playlist';
    icon = <Pencil size={20} className="text-primary" />;
    actionText = isLoading ? 'Saving...' : 'Save';
  } else if (mode === 'delete') {
    title = 'Delete Playlist';
    icon = <Trash size={20} className="text-red-400" />;
    actionText = isLoading ? 'Deleting...' : 'Delete';
    actionHandler = onDelete!;
  } else if (mode === 'remove') {
    title = 'Remove Playlist';
    icon = <Trash size={20} className="text-red-400" />;
    actionText = isLoading ? 'Removing...' : 'Remove';
    actionHandler = onRemove!;
  }

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-40 w-full max-w-md">
        <div className="bg-background-lighter/20 rounded-xl border border-white/5 p-6 backdrop-blur-md">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <h2 className="text-xl font-semibold text-gray-200">{title}</h2>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-gray-400 hover:bg-white/5 hover:text-gray-200"
            >
              <X size={20} />
            </button>
          </div>

          {(mode === 'create' || mode === 'edit') && (
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
              <div className="bg-background-lighter/40 flex items-center justify-between rounded-md border border-white/10 px-3 py-2">
                <div className="flex items-center gap-2">
                  {isPublic ? (
                    <Globe size={18} className="text-primary" />
                  ) : (
                    <Lock size={18} className="text-gray-400" />
                  )}
                  <span className="text-sm text-gray-200">
                    {isPublic ? 'Public' : 'Private'} Playlist
                  </span>
                </div>
                <button
                  onClick={() => setIsPublic(!isPublic)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${
                    isPublic ? 'bg-primary' : 'bg-gray-600'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isPublic ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          )}

          {(mode === 'delete' || mode === 'remove') && (
            <div className="mb-4">
              <p className="text-gray-300">
                Are you sure you want to {mode} the playlist{' '}
                <span className="text-primary font-semibold">{playlist?.name}</span>?
              </p>
              {error && <p className="text-sm text-red-400">{error}</p>}
            </div>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={handleClose}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-400 hover:bg-white/5"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              onClick={actionHandler}
              className={`rounded-lg px-4 py-2 text-sm font-medium text-white disabled:opacity-50 ${
                mode === 'delete' || mode === 'remove'
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-primary hover:bg-primary/80'
              }`}
              disabled={isLoading || ((mode === 'create' || mode === 'edit') && !name.trim())}
            >
              {actionText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
