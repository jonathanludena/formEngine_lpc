import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormTextarea } from './FormTextarea';

describe('FormTextarea', () => {
  it('renders with label', () => {
    render(<FormTextarea label="Description" />);
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(<FormTextarea placeholder="Enter description" />);
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(<FormTextarea label="Comments" error="Too short" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.getByText('Too short')).toHaveClass('text-destructive');
  });

  it('displays helper text when provided and no error', () => {
    render(
      <FormTextarea
        label="Bio"
        helperText="Tell us about yourself (max 500 characters)"
      />
    );
    expect(screen.getByText('Tell us about yourself (max 500 characters)')).toBeInTheDocument();
    expect(screen.getByText('Tell us about yourself (max 500 characters)')).toHaveClass('text-muted-foreground');
  });

  it('hides helper text when error is present', () => {
    render(
      <FormTextarea
        label="Message"
        helperText="Max 200 characters"
        error="Message is required"
      />
    );
    expect(screen.queryByText('Max 200 characters')).not.toBeInTheDocument();
    expect(screen.getByText('Message is required')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    render(<FormTextarea label="Feedback" placeholder="Enter your feedback" />);
    
    const textarea = screen.getByPlaceholderText('Enter your feedback');
    await user.type(textarea, 'This is my feedback');
    
    expect(textarea).toHaveValue('This is my feedback');
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<FormTextarea ref={ref} label="Test" />);
    expect(ref).toHaveBeenCalled();
  });

  it('passes HTML textarea attributes correctly', () => {
    render(
      <FormTextarea
        label="Notes"
        rows={10}
        maxLength={500}
        disabled
        placeholder="Enter notes"
      />
    );
    
    const textarea = screen.getByPlaceholderText('Enter notes');
    expect(textarea).toHaveAttribute('rows', '10');
    expect(textarea).toHaveAttribute('maxlength', '500');
    expect(textarea).toBeDisabled();
  });

  it('generates field id from label when id not provided', () => {
    render(<FormTextarea label="User Comments" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'field-user-comments');
  });

  it('uses custom id when provided', () => {
    render(<FormTextarea label="Description" id="custom-textarea-id" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveAttribute('id', 'custom-textarea-id');
  });

  it('applies custom className', () => {
    render(<FormTextarea label="Test" className="custom-textarea-class" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('custom-textarea-class');
  });

  it('applies error styling when error is present', () => {
    render(<FormTextarea label="Field" error="Error message" />);
    const textarea = screen.getByRole('textbox');
    expect(textarea).toHaveClass('border-destructive');
  });

  it('handles multiline text correctly', async () => {
    const user = userEvent.setup();
    render(<FormTextarea label="Address" />);
    
    const textarea = screen.getByRole('textbox');
    const multilineText = 'Line 1\nLine 2\nLine 3';
    await user.type(textarea, multilineText);
    
    expect(textarea).toHaveValue(multilineText);
  });
});
