import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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

  it('displays accept button as disabled initially', () => {
    render(<TermsModal {...defaultProps} />);
    const acceptButton = screen.getByRole('button', { name: /Desplázate hasta el final/i });
    expect(acceptButton).toBeDisabled();
  });

  it('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<TermsModal {...defaultProps} />);
    const cancelButton = screen.getByRole('button', { name: /Cancelar/i });
    await user.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('enables accept button after scrolling to bottom', async () => {
    render(<TermsModal {...defaultProps} />);
    
    const scrollArea = screen.getByText('Este es el contenido de los términos y condiciones.').closest('.prose');
    if (!scrollArea || !scrollArea.parentElement) {
      throw new Error('ScrollArea not found');
    }

    // Simulate scroll to bottom
    const scrollContainer = scrollArea.parentElement;
    Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(scrollContainer, 'scrollTop', { value: 600, configurable: true });
    Object.defineProperty(scrollContainer, 'clientHeight', { value: 400, configurable: true });

    const scrollEvent = new Event('scroll', { bubbles: true });
    await act(async () => {
      scrollContainer.dispatchEvent(scrollEvent);
    });

    await waitFor(() => {
      const acceptButton = screen.getByRole('button', { name: /Acepto los Términos/i });
      expect(acceptButton).toBeEnabled();
    });
  });

  it('calls onAccept when accept button is clicked after scrolling', async () => {
    const user = userEvent.setup();
    render(<TermsModal {...defaultProps} />);

    const scrollArea = screen.getByText('Este es el contenido de los términos y condiciones.').closest('.prose');
    if (!scrollArea || !scrollArea.parentElement) {
      throw new Error('ScrollArea not found');
    }

    // Simulate scroll to bottom
    const scrollContainer = scrollArea.parentElement;
    Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(scrollContainer, 'scrollTop', { value: 600, configurable: true });
    Object.defineProperty(scrollContainer, 'clientHeight', { value: 400, configurable: true });

    const scrollEvent = new Event('scroll', { bubbles: true });
    await act(async () => {
      scrollContainer.dispatchEvent(scrollEvent);
    });

    await waitFor(() => {
      const acceptButton = screen.getByRole('button', { name: /Acepto los Términos/i });
      expect(acceptButton).toBeEnabled();
    });

    const acceptButton = screen.getByRole('button', { name: /Acepto los Términos/i });
    await user.click(acceptButton);
    expect(mockOnAccept).toHaveBeenCalledTimes(1);
  });

  it('does not enable accept button if not scrolled far enough', () => {
    render(<TermsModal {...defaultProps} />);

    const scrollArea = screen.getByText('Este es el contenido de los términos y condiciones.').closest('.prose');
    if (!scrollArea || !scrollArea.parentElement) {
      throw new Error('ScrollArea not found');
    }

    // Simulate partial scroll (not at bottom)
    const scrollContainer = scrollArea.parentElement;
    Object.defineProperty(scrollContainer, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(scrollContainer, 'scrollTop', { value: 200, configurable: true });
    Object.defineProperty(scrollContainer, 'clientHeight', { value: 400, configurable: true });

    const scrollEvent = new Event('scroll', { bubbles: true });
    scrollContainer.dispatchEvent(scrollEvent);

    const acceptButton = screen.getByRole('button', { name: /Desplázate hasta el final/i });
    expect(acceptButton).toBeDisabled();
  });
});
