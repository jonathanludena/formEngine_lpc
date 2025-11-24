import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import { TermsModal } from './TermsModal';

describe('TermsModal', () => {
  const mockOnClose = vi.fn();
  const mockOnAccept = vi.fn();
  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onAccept: mockOnAccept,
    title: 'Términos y Condiciones',
    content: '<p>Este es el contenido de los términos y condiciones.</p>',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders modal when isOpen is true', () => {
    render(<TermsModal {...defaultProps} />);
    expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
    expect(
      screen.getByText('Por favor, lee cuidadosamente los términos y condiciones antes de continuar.')
    ).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    render(<TermsModal {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Términos y Condiciones')).not.toBeInTheDocument();
  });

  it('renders content with dangerouslySetInnerHTML', () => {
    render(<TermsModal {...defaultProps} />);
    expect(
      screen.getByText('Este es el contenido de los términos y condiciones.')
    ).toBeInTheDocument();
  });

  it('displays accept button', () => {
    render(<TermsModal {...defaultProps} />);
    const acceptButton = screen.getByRole('button', { name: /Aceptar/i });
    expect(acceptButton).toBeInTheDocument();
  });

  it('calls onAccept when accept button is clicked', async () => {
    const user = userEvent.setup();
    render(<TermsModal {...defaultProps} />);

    const acceptButton = screen.getByRole('button', { name: /Aceptar/i });
    await user.click(acceptButton);
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<TermsModal {...defaultProps} />);

    const closeButton = screen.getByRole('button', { name: /Close/i });
    await user.click(closeButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders with scrollable content area', () => {
    const longContent = '<p>' + 'Este es un párrafo largo. '.repeat(100) + '</p>';
    const { container } = render(<TermsModal {...defaultProps} content={longContent} />);
    
    const scrollableDiv = container.querySelector('.overflow-y-auto');
    expect(scrollableDiv).toBeInTheDocument();
  });
});
