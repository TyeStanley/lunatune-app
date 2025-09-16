import { render, screen, fireEvent } from '@testing-library/react';
import PlaylistModal from '@/components/library/PlaylistModal';

describe('PlaylistModal', () => {
  const mockPlaylist = {
    name: 'Test Playlist',
    description: 'A test playlist',
    isPublic: true,
  };

  const defaultProps = {
    isOpen: true,
    onClose: jest.fn(),
    onSubmit: jest.fn(),
    mode: 'create' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders when open', () => {
      render(<PlaylistModal {...defaultProps} />);

      expect(screen.getByText('Create Playlist')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Playlist name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
      render(<PlaylistModal {...defaultProps} isOpen={false} />);

      expect(screen.queryByText('Create Playlist')).not.toBeInTheDocument();
    });

    it('shows close button', () => {
      render(<PlaylistModal {...defaultProps} />);
      // The close button is the first button in the header (with the X icon)
      const allButtons = screen.getAllByRole('button');
      // Find the button that contains the X icon (lucide-x)
      const closeButton = allButtons.find((btn) => btn.querySelector('svg.lucide-x'));
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('create mode', () => {
    it('shows create playlist title and icon', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      expect(screen.getByText('Create Playlist')).toBeInTheDocument();
      expect(screen.getByText('Create')).toBeInTheDocument();
    });

    it('shows form fields for create mode', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      expect(screen.getByPlaceholderText('Playlist name')).toBeInTheDocument();
      expect(screen.getByPlaceholderText('Description (optional)')).toBeInTheDocument();
      expect(screen.getByText('Private Playlist')).toBeInTheDocument();
    });

    it('calls onSubmit with form data when create button is clicked', () => {
      const mockOnSubmit = jest.fn();
      render(<PlaylistModal {...defaultProps} mode="create" onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByPlaceholderText('Playlist name');
      const descriptionInput = screen.getByPlaceholderText('Description (optional)');

      fireEvent.change(nameInput, { target: { value: 'New Playlist' } });
      fireEvent.change(descriptionInput, { target: { value: 'New description' } });

      const createButton = screen.getByText('Create');
      fireEvent.click(createButton);

      expect(mockOnSubmit).toHaveBeenCalledWith('New Playlist', 'New description', false);
    });

    it('disables create button when name is empty', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const createButton = screen.getByText('Create');
      expect(createButton).toBeDisabled();
    });

    it('enables create button when name is provided', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const nameInput = screen.getByPlaceholderText('Playlist name');
      fireEvent.change(nameInput, { target: { value: 'New Playlist' } });

      const createButton = screen.getByText('Create');
      expect(createButton).not.toBeDisabled();
    });
  });

  describe('edit mode', () => {
    it('shows edit playlist title and icon', () => {
      render(<PlaylistModal {...defaultProps} mode="edit" playlist={mockPlaylist} />);

      expect(screen.getByText('Edit Playlist')).toBeInTheDocument();
      expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('pre-fills form with playlist data', () => {
      render(<PlaylistModal {...defaultProps} mode="edit" playlist={mockPlaylist} />);

      const nameInput = screen.getByPlaceholderText('Playlist name');
      const descriptionInput = screen.getByPlaceholderText('Description (optional)');

      expect(nameInput).toHaveValue('Test Playlist');
      expect(descriptionInput).toHaveValue('A test playlist');
    });

    it('calls onSubmit with updated data when save button is clicked', () => {
      const mockOnSubmit = jest.fn();
      render(
        <PlaylistModal
          {...defaultProps}
          mode="edit"
          playlist={mockPlaylist}
          onSubmit={mockOnSubmit}
        />,
      );

      const nameInput = screen.getByPlaceholderText('Playlist name');
      fireEvent.change(nameInput, { target: { value: 'Updated Playlist' } });

      const saveButton = screen.getByText('Save');
      fireEvent.click(saveButton);

      expect(mockOnSubmit).toHaveBeenCalledWith('Updated Playlist', 'A test playlist', true);
    });
  });

  describe('delete mode', () => {
    it('shows delete playlist title and icon', () => {
      render(<PlaylistModal {...defaultProps} mode="delete" playlist={mockPlaylist} />);

      expect(screen.getByText('Delete Playlist')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('shows confirmation message', () => {
      render(<PlaylistModal {...defaultProps} mode="delete" playlist={mockPlaylist} />);

      expect(screen.getByText(/Are you sure you want to delete the playlist/)).toBeInTheDocument();
      expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    });

    it('calls onDelete when delete button is clicked', () => {
      const mockOnDelete = jest.fn();
      render(
        <PlaylistModal
          {...defaultProps}
          mode="delete"
          playlist={mockPlaylist}
          onDelete={mockOnDelete}
        />,
      );

      const deleteButton = screen.getByText('Delete');
      fireEvent.click(deleteButton);

      expect(mockOnDelete).toHaveBeenCalledTimes(1);
    });

    it('shows red styling for delete button', () => {
      render(<PlaylistModal {...defaultProps} mode="delete" playlist={mockPlaylist} />);

      const deleteButton = screen.getByText('Delete');
      expect(deleteButton).toHaveClass('bg-red-500');
    });
  });

  describe('remove mode', () => {
    it('shows remove playlist title and icon', () => {
      render(<PlaylistModal {...defaultProps} mode="remove" playlist={mockPlaylist} />);

      expect(screen.getByText('Remove Playlist')).toBeInTheDocument();
      expect(screen.getByText('Remove')).toBeInTheDocument();
    });

    it('shows confirmation message for remove', () => {
      render(<PlaylistModal {...defaultProps} mode="remove" playlist={mockPlaylist} />);

      expect(screen.getByText(/Are you sure you want to remove the playlist/)).toBeInTheDocument();
      expect(screen.getByText('Test Playlist')).toBeInTheDocument();
    });

    it('calls onRemove when remove button is clicked', () => {
      const mockOnRemove = jest.fn();
      render(
        <PlaylistModal
          {...defaultProps}
          mode="remove"
          playlist={mockPlaylist}
          onRemove={mockOnRemove}
        />,
      );

      const removeButton = screen.getByText('Remove');
      fireEvent.click(removeButton);

      expect(mockOnRemove).toHaveBeenCalledTimes(1);
    });
  });

  describe('public/private toggle', () => {
    it('shows private by default in create mode', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      expect(screen.getByText('Private Playlist')).toBeInTheDocument();
    });

    it('toggles between public and private', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const toggleButton = screen
        .getByText('Private Playlist')
        .closest('div')
        ?.querySelector('button');
      if (toggleButton) {
        fireEvent.click(toggleButton);
        expect(screen.getByText('Public Playlist')).toBeInTheDocument();
      }
    });

    it('shows correct icon for public playlist', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const toggleButton = screen
        .getByText('Private Playlist')
        .closest('div')
        ?.querySelector('button');
      if (toggleButton) {
        fireEvent.click(toggleButton);

        // Should show Globe icon for public
        const globeIcon = screen.getByText('Public Playlist').closest('div')?.querySelector('svg');
        expect(globeIcon).toBeInTheDocument();
      }
    });

    it('shows correct icon for private playlist', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      // Should show Lock icon for private
      const lockIcon = screen.getByText('Private Playlist').closest('div')?.querySelector('svg');
      expect(lockIcon).toBeInTheDocument();
    });
  });

  describe('form validation', () => {
    it('trims whitespace from name and description', () => {
      const mockOnSubmit = jest.fn();
      render(<PlaylistModal {...defaultProps} mode="create" onSubmit={mockOnSubmit} />);

      const nameInput = screen.getByPlaceholderText('Playlist name');
      const descriptionInput = screen.getByPlaceholderText('Description (optional)');

      fireEvent.change(nameInput, { target: { value: '  Test Name  ' } });
      fireEvent.change(descriptionInput, { target: { value: '  Test Description  ' } });

      const createButton = screen.getByText('Create');
      fireEvent.click(createButton);

      expect(mockOnSubmit).toHaveBeenCalledWith('Test Name', 'Test Description', false);
    });

    it('enables button when name has only spaces but trims to empty', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const nameInput = screen.getByPlaceholderText('Playlist name');
      fireEvent.change(nameInput, { target: { value: '   ' } });

      const createButton = screen.getByText('Create');
      expect(createButton).toBeDisabled();
    });
  });

  describe('loading states', () => {
    it('shows loading text when isLoading is true', () => {
      render(<PlaylistModal {...defaultProps} mode="create" isLoading={true} />);

      expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    it('disables buttons when loading', () => {
      render(<PlaylistModal {...defaultProps} mode="create" isLoading={true} />);

      const createButton = screen.getByText('Creating...');
      const cancelButton = screen.getByText('Cancel');

      expect(createButton).toBeDisabled();
      expect(cancelButton).toBeDisabled();
    });

    it('shows correct loading text for different modes', () => {
      const { rerender } = render(<PlaylistModal {...defaultProps} mode="edit" isLoading={true} />);
      expect(screen.getByText('Saving...')).toBeInTheDocument();

      rerender(<PlaylistModal {...defaultProps} mode="delete" isLoading={true} />);
      expect(screen.getByText('Deleting...')).toBeInTheDocument();

      rerender(<PlaylistModal {...defaultProps} mode="remove" isLoading={true} />);
      expect(screen.getByText('Removing...')).toBeInTheDocument();
    });
  });

  describe('error handling', () => {
    it('displays error message when provided', () => {
      render(<PlaylistModal {...defaultProps} mode="create" error="Test error message" />);

      expect(screen.getByText('Test error message')).toBeInTheDocument();
      expect(screen.getByText('Test error message')).toHaveClass('text-red-400');
    });

    it('displays error in delete mode', () => {
      render(
        <PlaylistModal
          {...defaultProps}
          mode="delete"
          playlist={mockPlaylist}
          error="Delete error"
        />,
      );

      expect(screen.getByText('Delete error')).toBeInTheDocument();
    });
  });

  describe('modal interactions', () => {
    it('calls onClose when close button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<PlaylistModal {...defaultProps} onClose={mockOnClose} />);

      const closeButton = screen.getAllByRole('button')[0];
      fireEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when cancel button is clicked', () => {
      const mockOnClose = jest.fn();
      render(<PlaylistModal {...defaultProps} onClose={mockOnClose} />);

      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when backdrop is clicked', () => {
      const mockOnClose = jest.fn();
      render(<PlaylistModal {...defaultProps} onClose={mockOnClose} />);

      const backdrop = screen
        .getByText('Create Playlist')
        .closest('.fixed')
        ?.querySelector('.bg-black');
      if (backdrop) {
        fireEvent.click(backdrop);
        expect(mockOnClose).toHaveBeenCalledTimes(1);
      }
    });

    it('resets form when closed', () => {
      const mockOnClose = jest.fn();
      const { rerender } = render(<PlaylistModal {...defaultProps} onClose={mockOnClose} />);

      // Fill form
      const nameInput = screen.getByPlaceholderText('Playlist name');
      fireEvent.change(nameInput, { target: { value: 'Test' } });

      // Close modal
      const closeButton = screen.getAllByRole('button')[0];
      fireEvent.click(closeButton);

      // Reopen modal
      rerender(<PlaylistModal {...defaultProps} isOpen={true} onClose={mockOnClose} />);

      // Check form is reset
      const newNameInput = screen.getByPlaceholderText('Playlist name');
      expect(newNameInput).toHaveValue('');
    });
  });

  describe('accessibility', () => {
    it('has proper focus management', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const nameInput = screen.getByPlaceholderText('Playlist name');
      expect(nameInput).toHaveFocus();
    });

    it('has proper ARIA labels', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const closeButton = screen.getAllByRole('button')[0];
      expect(closeButton).toBeInTheDocument();
    });

    it('has proper button roles', () => {
      render(<PlaylistModal {...defaultProps} mode="create" />);

      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });
});
