import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormSelect, SelectOption } from './FormSelect';

const mockOptions: SelectOption[] = [
  { value: 'option1', label: 'Option 1' },
  { value: 'option2', label: 'Option 2' },
  { value: 'option3', label: 'Option 3' },
];

describe('FormSelect', () => {
  it('renders with label', () => {
    render(
      <FormSelect
        label="Select Option"
        options={mockOptions}
        placeholder="Choose an option"
      />
    );
    expect(screen.getByText('Select Option')).toBeInTheDocument();
  });

  it('renders without label', () => {
    render(
      <FormSelect
        options={mockOptions}
        placeholder="Choose an option"
      />
    );
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('displays placeholder when no value selected', () => {
    render(
      <FormSelect
        label="Country"
        options={mockOptions}
        placeholder="Select a country"
      />
    );
    expect(screen.getByText('Select a country')).toBeInTheDocument();
  });

  it('displays error message when error prop is provided', () => {
    render(
      <FormSelect
        label="Country"
        options={mockOptions}
        error="This field is required"
      />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('text-destructive');
  });

  it('displays helper text when provided and no error', () => {
    render(
      <FormSelect
        label="Country"
        options={mockOptions}
        helperText="Select your country of residence"
      />
    );
    expect(screen.getByText('Select your country of residence')).toBeInTheDocument();
  });

  it('hides helper text when error is present', () => {
    render(
      <FormSelect
        label="Country"
        options={mockOptions}
        helperText="Select your country"
        error="Required field"
      />
    );
    expect(screen.queryByText('Select your country')).not.toBeInTheDocument();
    expect(screen.getByText('Required field')).toBeInTheDocument();
  });

  it('calls onValueChange when selection changes', async () => {
    const handleChange = vi.fn();
    const user = userEvent.setup();
    
    render(
      <FormSelect
        label="Select"
        options={mockOptions}
        onValueChange={handleChange}
        placeholder="Choose"
      />
    );

    const trigger = screen.getByRole('button', { name: 'Choose' });
    await user.click(trigger);
    
    const option = screen.getByText('Option 1');
    await user.click(option);
    
    expect(handleChange).toHaveBeenCalledWith('option1');
  });

  it('displays selected value', () => {
    render(
      <FormSelect
        label="Select"
        options={mockOptions}
        value="option2"
        placeholder="Choose"
      />
    );
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  it('can be disabled', () => {
    render(
      <FormSelect
        label="Select"
        options={mockOptions}
        disabled
        placeholder="Choose"
      />
    );
    const trigger = screen.getByRole('button', { name: 'Choose' });
    expect(trigger).toBeDisabled();
  });

  it('renders all options when opened', async () => {
    const user = userEvent.setup();
    
    render(
      <FormSelect
        label="Select"
        options={mockOptions}
        placeholder="Choose"
      />
    );

    const trigger = screen.getByRole('button', { name: 'Choose' });
    await user.click(trigger);
    
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(
      <FormSelect
        ref={ref}
        label="Test"
        options={mockOptions}
      />
    );
    expect(ref).toHaveBeenCalled();
  });
});
