import { render, screen, fireEvent } from '@testing-library/react';
import { LibraryDropdown } from '@/components/library/LibraryDropdown';
import { Music } from 'lucide-react';

describe('LibraryDropdown', () => {
  const mockOptions = [
    {
      label: 'Create Playlist',
      onClick: jest.fn(),
      itemIcon: <Music size={16} className="text-gray-400" />,
    },
    {
      label: 'Import Playlist',
      onClick: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('renders with default Plus icon', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass('hover:text-primary');
    });

    it('renders with custom icon', () => {
      const customIcon = <Music size={20} />;
      render(<LibraryDropdown options={mockOptions} icon={customIcon} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<LibraryDropdown options={mockOptions} className="custom-class" />);

      const container = screen.getByRole('button').closest('.relative');
      expect(container).toHaveClass('custom-class');
    });

    it('applies custom button className', () => {
      render(<LibraryDropdown options={mockOptions} btnClassName="custom-btn-class" />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('custom-btn-class');
    });
  });

  describe('dropdown functionality', () => {
    it('opens dropdown when clicked', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('Create Playlist')).toBeInTheDocument();
      expect(screen.getByText('Import Playlist')).toBeInTheDocument();
    });

    it('closes dropdown when clicking outside', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('Create Playlist')).toBeInTheDocument();

      // Click outside
      fireEvent.mouseDown(document.body);

      expect(screen.queryByText('Create Playlist')).not.toBeInTheDocument();
    });

    it('calls onClick when option is clicked', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const createOption = screen.getByText('Create Playlist');
      fireEvent.click(createOption);

      expect(mockOptions[0].onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Create Playlist')).not.toBeInTheDocument();
    });

    it('closes dropdown after option click', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const importOption = screen.getByText('Import Playlist');
      fireEvent.click(importOption);

      expect(mockOptions[1].onClick).toHaveBeenCalledTimes(1);
      expect(screen.queryByText('Import Playlist')).not.toBeInTheDocument();
    });
  });

  describe('option rendering', () => {
    it('renders options with icons', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const createOption = screen.getByText('Create Playlist');
      expect(createOption).toBeInTheDocument();

      // Check if icon is rendered
      const icon = createOption.querySelector('svg');
      expect(icon).toBeInTheDocument();
    });

    it('renders options without icons', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const importOption = screen.getByText('Import Playlist');
      expect(importOption).toBeInTheDocument();
    });

    it('renders multiple options correctly', () => {
      const manyOptions = [
        { label: 'Option 1', onClick: jest.fn() },
        { label: 'Option 2', onClick: jest.fn() },
        { label: 'Option 3', onClick: jest.fn() },
      ];

      render(<LibraryDropdown options={manyOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('has proper button role', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });

    it('dropdown options are clickable', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const options = screen.getAllByRole('button');
      expect(options).toHaveLength(3); // 1 trigger + 2 options
    });
  });

  describe('styling', () => {
    it('has correct default button styling', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      expect(button).toHaveClass('bg-background-lighter/29');
      expect(button).toHaveClass('hover:bg-primary/20');
    });

    it('dropdown has correct positioning', () => {
      render(<LibraryDropdown options={mockOptions} />);

      const button = screen.getByRole('button');
      fireEvent.click(button);

      const dropdown = screen.getByText('Create Playlist').closest('.absolute');
      expect(dropdown).toHaveClass('absolute right-0 z-10');
    });
  });
});
