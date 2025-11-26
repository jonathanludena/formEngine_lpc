import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from './FormField';

describe('FormField', () => {
  it('renders with label', () => {
    render(<FormField label="Test Field" />);
    expect(screen.getByText('Test Field')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<FormField placeholder="Enter text" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormField label="Email" error="Invalid email" />);
    expect(screen.getByText('Invalid email')).toBeInTheDocument();
    expect(screen.getByText('Invalid email')).toHaveClass('text-destructive');
  });

  it('displays helper text when provided and no error', () => {
    render(<FormField label="Username" helperText="Choose a unique username" />);
    expect(screen.getByText('Choose a unique username')).toBeInTheDocument();
    expect(screen.getByText('Choose a unique username')).toHaveClass('text-muted-foreground');
  });

  it('hides helper text when error is present', () => {
    render(
      <FormField
        label="Password"
        helperText="Min 8 characters"
        error="Password too short"
      />
    );
    expect(screen.queryByText('Min 8 characters')).not.toBeInTheDocument();
    expect(screen.getByText('Password too short')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<FormField label="Name" placeholder="Enter your name" />);
    
    const input = screen.getByPlaceholderText('Enter your name');
    await user.type(input, 'John Doe');
    
    expect(input).toHaveValue('John Doe');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<FormField ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });

  it('passes HTML input attributes correctly', () => {
    render(
      <FormField
        label="Age"
        type="number"
        min={0}
        max={100}
        disabled
        placeholder="Enter age"
      />
    );
    
    const input = screen.getByPlaceholderText('Enter age');
    expect(input).toHaveAttribute('type', 'number');
    expect(input).toHaveAttribute('min', '0');
    expect(input).toHaveAttribute('max', '100');
    expect(input).toBeDisabled();
  });

  it('generates field id from label when id not provided', () => {
    render(<FormField label="First Name" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'field-first-name');
  });

  it('uses custom id when provided', () => {
    render(<FormField label="Email" id="custom-email-id" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('id', 'custom-email-id');
  });

  it('applies custom className', () => {
    render(<FormField label="Test" className="custom-class" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('custom-class');
  });

  it('applies error styling when error is present', () => {
    render(<FormField label="Field" error="Error message" />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveClass('border-destructive');
  });
});
