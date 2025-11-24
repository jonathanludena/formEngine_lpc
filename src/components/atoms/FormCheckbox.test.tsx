import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormCheckbox } from './FormCheckbox';

describe('FormCheckbox', () => {
  it('renders with label', () => {
    render(<FormCheckbox label="Accept terms" />);
    expect(screen.getByText('Accept terms')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormCheckbox label="Subscribe" error="You must agree" />);
    expect(screen.getByText('You must agree')).toBeInTheDocument();
    expect(screen.getByText('You must agree')).toHaveClass('text-destructive');
  });

  it('displays helper text when provided and no error', () => {
    render(
      <FormCheckbox
        label="Newsletter"
        helperText="Receive weekly updates"
      />
    );
    expect(screen.getByText('Receive weekly updates')).toBeInTheDocument();
    expect(screen.getByText('Receive weekly updates')).toHaveClass('text-muted-foreground');
  });

  it('hides helper text when error is present', () => {
    render(
      <FormCheckbox
        label="Terms"
        helperText="Read our terms"
        error="Required field"
      />
    );
    expect(screen.queryByText('Read our terms')).not.toBeInTheDocument();
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('can be checked and unchecked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <FormCheckbox
        label="Agree"
        onCheckedChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(true);
    
    await user.click(checkbox);
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('displays as checked when checked prop is true', () => {
    render(<FormCheckbox label="Enabled" checked={true} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('displays as unchecked when checked prop is false', () => {
    render(<FormCheckbox label="Disabled" checked={false} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('can be disabled', () => {
    render(<FormCheckbox label="Unavailable" disabled />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeDisabled();
  });

  it('generates field id from label when id not provided', () => {
    render(<FormCheckbox label="Accept Terms" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'checkbox-accept-terms');
  });

  it('uses custom id when provided', () => {
    render(<FormCheckbox label="Terms" id="custom-checkbox-id" />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('id', 'custom-checkbox-id');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<FormCheckbox ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });

  it('label is associated with checkbox', () => {
    render(<FormCheckbox label="Privacy Policy" id="privacy" />);
    const label = screen.getByText('Privacy Policy');
    const checkbox = screen.getByRole('checkbox');
    
    expect(label).toHaveAttribute('for', 'privacy');
    expect(checkbox).toHaveAttribute('id', 'privacy');
  });

  it('does not call onCheckedChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    
    render(
      <FormCheckbox
        label="Disabled"
        disabled
        onCheckedChange={handleChange}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);
    
    expect(handleChange).not.toHaveBeenCalled();
  });
});
