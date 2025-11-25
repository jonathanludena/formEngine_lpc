import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InsuranceQuoteForm } from './InsuranceQuoteForm';

// Mock del módulo de copias
vi.mock('@/data', () => ({
  getBrandCopies: vi.fn(() => ({
    quoteForm: {
      title: 'Cotiza tu Seguro',
      subtitle: 'Complete el formulario para obtener su cotización',
      steps: {
        personalInfo: 'Información Personal',
        insuranceDetails: 'Detalles del Seguro',
      },
      fields: {
        firstName: { label: 'Nombre', placeholder: 'Tu nombre' },
        lastName: { label: 'Apellido', placeholder: 'Tu apellido' },
        email: { label: 'Email', placeholder: 'tu@email.com' },
        phone: { label: 'Teléfono', placeholder: '991234567' },
        birthDate: { label: 'Fecha de Nacimiento' },
        identificationType: { label: 'Tipo de Identificación', placeholder: 'Selecciona' },
        identificationNumber: { label: 'Número de Identificación', placeholder: '1234567890' },
        acceptTerms: { label: 'Acepto los' },
      },
      buttons: {
        submit: 'Obtener Cotización',
      },
      termsAndConditions: {
        title: 'Términos y Condiciones',
        content: 'Contenido de términos y condiciones...',
      },
    },
  })),
}));

describe('InsuranceQuoteForm - Health Insurance', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders health insurance quote form', () => {
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cotiza tu Seguro de Salud')).toBeInTheDocument();
    expect(screen.getByText('Información Personal')).toBeInTheDocument();
  });

  it('allows filling health insurance quote form', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    // Fill personal information
    const personalSection = screen.getByText('Información Personal');
    await user.click(personalSection);

    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Carlos');
    await user.type(screen.getByPlaceholderText('Tu apellido'), 'Sánchez');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'carlos@test.com');
    await user.type(screen.getByPlaceholderText('991234567'), '991234567');
    await user.type(screen.getByLabelText('Fecha de Nacimiento'), '1990-05-15');

    // Click the identification type select (uses placeholder 'Selecciona')
    const idTypeButton = screen.getByRole('combobox', { name: /Selecciona Tipo de Identificación/i });
    await user.click(idTypeButton);
    await user.click(screen.getByText('Cédula'));

    await user.type(screen.getByPlaceholderText('1234567890'), '1234567890');

    // Verify values were entered
    expect(screen.getByDisplayValue('Carlos')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Sánchez')).toBeInTheDocument();
    expect(screen.getByDisplayValue('carlos@test.com')).toBeInTheDocument();
    expect(screen.getByDisplayValue('991234567')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();

    // Fill insurance details
    const insuranceSection = screen.getByText('Detalles del Seguro');
    await user.click(insuranceSection);

    const coverageButton = screen.getByRole('combobox', { name: /selecciona el tipo/i });
    await user.click(coverageButton);
    await user.click(screen.getByText('Individual'));

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox', { name: /acepto los términos/i });
    await user.click(termsCheckbox);

    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: /Obtener Cotización/i });
    expect(submitButton).not.toBeDisabled();
  });

  it('shows dependents field for family coverage', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    const insuranceSection = screen.getByText('Detalles del Seguro');
    await user.click(insuranceSection);

    const coverageButton = screen.getByRole('combobox', { name: /selecciona el tipo de cobertura/i });
    await user.click(coverageButton);
    await user.click(screen.getByText('Familiar'));

    await waitFor(() => {
      expect(screen.getByLabelText(/Número de Dependientes/i)).toBeInTheDocument();
    });
  });

  it('disables submit button when terms not accepted', () => {
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Obtener Cotización/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when terms are accepted', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Obtener Cotización/i });
    expect(submitButton).toBeDisabled();

    const termsCheckbox = screen.getByRole('checkbox', { name: /acepto los/i });
    await user.click(termsCheckbox);

    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});

describe('InsuranceQuoteForm - Life Insurance', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders life insurance specific fields', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="life"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cotiza tu Seguro de Vida')).toBeInTheDocument();

    const insuranceSection = screen.getByText('Detalles del Seguro');
    await user.click(insuranceSection);

    expect(screen.getByLabelText(/Monto de Cobertura/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Ocupación/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox', { name: /¿Fuma?/i })).toBeInTheDocument();
  });

  it('shows beneficiaries section for life insurance', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="life"
        onSubmit={mockOnSubmit}
      />
    );

    const beneficiariesSection = screen.getByText('Beneficiarios');
    await user.click(beneficiariesSection);

    expect(screen.getByText(/Agrega los beneficiarios de tu póliza/i)).toBeInTheDocument();
    
    const addButton = screen.getByRole('button', { name: /Agregar/i });
    expect(addButton).toBeInTheDocument();
  });

  it('can add and remove beneficiaries', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="life"
        onSubmit={mockOnSubmit}
      />
    );

    const beneficiariesSection = screen.getByText('Beneficiarios');
    await user.click(beneficiariesSection);

    const addButton = screen.getByRole('button', { name: /Agregar/i });
    
    // Add first beneficiary
    await user.click(addButton);
    expect(screen.getByText('Beneficiario 1')).toBeInTheDocument();

    // Add second beneficiary
    await user.click(addButton);
    expect(screen.getByText('Beneficiario 2')).toBeInTheDocument();

    // Both beneficiaries should be present
    expect(screen.getByText('Beneficiario 1')).toBeInTheDocument();
    expect(screen.getByText('Beneficiario 2')).toBeInTheDocument();
  });
});

describe('InsuranceQuoteForm - Life Savings Insurance', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders life savings specific fields', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="life_savings"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cotiza tu Seguro de Vida y Ahorro')).toBeInTheDocument();

    const insuranceSection = screen.getByText('Detalles del Seguro');
    await user.click(insuranceSection);

    expect(screen.getByLabelText(/Monto de Cobertura/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Meta de Ahorro/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Plazo \(años\)/i)).toBeInTheDocument();
  });
});

describe('InsuranceQuoteForm - Vehicle Insurance', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders vehicle insurance specific fields', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Cotiza tu Seguro Vehicular')).toBeInTheDocument();

    const vehicleSection = screen.getByText('Información del Vehículo');
    await user.click(vehicleSection);

    expect(screen.getByLabelText(/Marca/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Modelo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Año/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Valor del Vehículo/i)).toBeInTheDocument();
  });

  it('allows filling vehicle insurance quote form', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = vi.fn();
    
    render(
      <InsuranceQuoteForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
      />
    );

    // Fill personal info
    const personalSection = screen.getByText('Información Personal');
    await user.click(personalSection);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('Tu nombre')).toBeVisible();
    });

    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Ana');
    await user.type(screen.getByPlaceholderText('Tu apellido'), 'López');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'ana@test.com');
    await user.type(screen.getByPlaceholderText('991234567'), '987654321');
    await user.type(screen.getByLabelText('Fecha de Nacimiento'), '1985-08-20');

    // Click the identification type select by its aria label
    const idTypeButtons = screen.getByRole('combobox', { name: /Selecciona Tipo de Identificación/i });
    await user.click(idTypeButtons);
    
    await waitFor(() => {
      expect(screen.getByText('Cédula')).toBeVisible();
    });
    
    await user.click(screen.getByText('Cédula'));

    await user.type(screen.getByPlaceholderText('1234567890'), '0987654321');

    // Verify personal info was entered
    expect(screen.getByDisplayValue('Ana')).toBeInTheDocument();
    expect(screen.getByDisplayValue('López')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ana@test.com')).toBeInTheDocument();

    // Fill vehicle info
    const vehicleSection = screen.getByText('Información del Vehículo');
    await user.click(vehicleSection);

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /selecciona el tipo/i })).toBeVisible();
    });

    const vehicleTypeButton = screen.getByRole('combobox', { name: /selecciona el tipo/i });
    await user.click(vehicleTypeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Auto')).toBeVisible();
    });
    
    await user.click(screen.getByText('Auto'));

    // Select brand and model using selects (brand -> model are selects now)
    const brandButton = screen.getByRole('combobox', { name: /Selecciona la marca/i });
    await user.click(brandButton);
    await waitFor(() => expect(screen.getByText('Toyota')).toBeVisible());
    await user.click(screen.getByText('Toyota'));

    const modelButton = screen.getByRole('combobox', { name: /Selecciona el modelo|Selecciona el modelo/i });
    await user.click(modelButton);
    await waitFor(() => expect(screen.getByText('Corolla')).toBeVisible());
    await user.click(screen.getByText('Corolla'));
    await user.type(screen.getByPlaceholderText('2020'), '2020');
    await user.type(screen.getByPlaceholderText('15000'), '18000');

    // Verify vehicle info was entered
    expect(screen.getByText('Toyota')).toBeInTheDocument();
    expect(screen.getByText('Corolla')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2020')).toBeInTheDocument();
    expect(screen.getByDisplayValue('18000')).toBeInTheDocument();

    const coverageTypeButton = screen.getByRole('combobox', { name: /selecciona la cobertura/i });
    await user.click(coverageTypeButton);
    
    await waitFor(() => {
      expect(screen.getByText('Completa')).toBeVisible();
    });
    
    await user.click(screen.getByText('Completa'));

    // Accept terms
    const termsCheckbox = screen.getByRole('checkbox', { name: /acepto los/i });
    await user.click(termsCheckbox);

    // Submit button should be enabled
    const submitButton = screen.getByRole('button', { name: /Obtener Cotización/i });
    expect(submitButton).not.toBeDisabled();
  });
});

describe('InsuranceQuoteForm - Common Features', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('displays loading state when submitting', () => {
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Obtener Cotización/i });
    expect(submitButton).toBeDisabled();
    
    const loadingIcon = submitButton.querySelector('svg.animate-spin');
    expect(loadingIcon).toBeInTheDocument();
  });

  it('opens terms modal when clicking view terms', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    const viewTermsButton = screen.getByRole('button', { name: /términos y condiciones/i });
    await user.click(viewTermsButton);

    await waitFor(() => {
      expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
    });
  });

  it('does not auto-check the terms checkbox when accepting the modal', async () => {
    const user = userEvent.setup();
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    // Open the terms modal via the link
    const viewTermsButton = screen.getByRole('button', { name: /términos y condiciones/i });
    await user.click(viewTermsButton);

    await waitFor(() => {
      expect(screen.getByText('Términos y Condiciones')).toBeInTheDocument();
    });

    // Click the modal accept button
    const acceptButton = screen.getByRole('button', { name: /Aceptar/i });
    await user.click(acceptButton);

    // The checkbox should remain unchecked; user must check it manually
    const termsCheckbox = screen.getByRole('checkbox', { name: /acepto los/i });
    expect(termsCheckbox).not.toBeChecked();
  });

  it('populates form with initial data', () => {
    const initialData = {
      personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
        phone: '999999999',
        birthDate: '1990-01-01',
        identificationType: 'cedula' as const,
        identificationNumber: '1234567890',
      },
      acceptTerms: false,
    };

    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    
    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    // Accept terms to enable submit
    const termsCheckbox = screen.getByRole('checkbox', { name: /acepto los/i });
    await user.click(termsCheckbox);

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Obtener Cotización/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Should show validation errors and not call onSubmit
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });

  it('accepts custom coverage options', () => {
    const customCoverageOptions = [
      { value: 'bronze', label: 'Bronce' },
      { value: 'silver', label: 'Plata' },
      { value: 'gold', label: 'Oro' },
    ];

    render(
      <InsuranceQuoteForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
        coverageOptions={customCoverageOptions}
      />
    );

    // The custom options should be available in the select
    expect(screen.queryByText('Bronce')).not.toBeInTheDocument(); // Not visible until opened
  });
});
