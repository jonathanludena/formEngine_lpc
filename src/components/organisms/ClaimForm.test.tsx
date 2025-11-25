import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ClaimForm } from './ClaimForm';

// Mock del módulo de copias
vi.mock('@/data', () => ({
  getBrandCopies: vi.fn(() => ({
    claimForm: {
      title: 'Formulario de Reclamo',
      subtitle: 'Complete los datos del reclamo',
      fields: {
        policyNumber: {
          label: 'Número de Póliza',
          placeholder: 'POL-123456',
        },
        incidentDate: {
          label: 'Fecha del Incidente',
        },
        description: {
          label: 'Descripción del Incidente',
          placeholder: 'Describa lo sucedido',
        },
      },
      buttons: {
        submit: 'Enviar Reclamo',
        cancel: 'Cancelar',
      },
    },
  })),
}));

describe('ClaimForm - Health Insurance', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders health claim form with all sections', () => {
    render(
      <ClaimForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Formulario de Reclamo')).toBeInTheDocument();
    expect(screen.getByText('Información de la Póliza')).toBeInTheDocument();
    expect(screen.getByText('Datos de Contacto')).toBeInTheDocument();
    expect(screen.getByText('Detalles del Incidente')).toBeInTheDocument();
    expect(screen.getByText('Información Médica')).toBeInTheDocument();
  });

  it('submits health claim with valid data', async () => {
    const user = userEvent.setup();
    
    render(
      <ClaimForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    // Expandir y llenar Información de la Póliza
    const policySection = screen.getByText('Información de la Póliza');
    await user.click(policySection);

    const policyNumberInput = screen.getByPlaceholderText('POL-123456');
    await user.type(policyNumberInput, 'POL-987654');

    const claimTypeButton = screen.getByRole('combobox', { name: /selecciona el tipo de reclamo/i });
    await user.click(claimTypeButton);
    await user.click(screen.getByText('Consulta Médica'));

    // Expandir y llenar Datos de Contacto
    const personalSection = screen.getByText('Datos de Contacto');
    await user.click(personalSection);

    await user.type(screen.getByPlaceholderText('Tu nombre'), 'Juan');
    await user.type(screen.getByPlaceholderText('Tu apellido'), 'Pérez');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'juan@test.com');
    await user.type(screen.getByPlaceholderText('9XXXXXXXX'), '991234567');

    // Expandir y llenar Detalles del Incidente
    const incidentSection = screen.getByText('Detalles del Incidente');
    await user.click(incidentSection);

    const dateInput = screen.getByLabelText('Fecha del Incidente');
    await user.type(dateInput, '2024-01-15');

    const descriptionInput = screen.getByPlaceholderText('Describa lo sucedido');
    await user.type(descriptionInput, 'Consulta médica por dolor abdominal que requirió exámenes adicionales');

    // Expandir y llenar Información Médica
    const medicalSection = screen.getByText('Información Médica');
    await user.click(medicalSection);

    await user.type(screen.getByPlaceholderText(/Hospital o clínica/), 'Hospital Metropolitano');
    await user.type(screen.getByPlaceholderText(/Diagnóstico/), 'Gastritis aguda');
    await user.type(screen.getByPlaceholderText('0.00'), '250.50');

    // Submit
    const submitButton = screen.getByRole('button', { name: /Enviar Reclamo/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          insuranceType: 'health',
          policyNumber: 'POL-987654',
          claimType: 'consultation',
          personalInfo: expect.objectContaining({
            firstName: 'Juan',
            lastName: 'Pérez',
            email: 'juan@test.com',
            phone: '991234567',
          }),
          medicalCenter: 'Hospital Metropolitano',
          totalAmount: 250.50,
        })
      );
    });
  });

  it('displays validation errors for health claim', async () => {
    const user = userEvent.setup();
    
    render(
      <ClaimForm
        insuranceType="health"
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Enviar Reclamo/i });
    // Submit should be disabled until required fields are completed
    expect(submitButton).toBeDisabled();

    await user.click(submitButton);
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  // 'Cancelar' button removed from UI; test intentionally omitted
});

describe('ClaimForm - Vehicle Insurance', () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders vehicle claim form with all sections', () => {
    render(
      <ClaimForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Formulario de Reclamo')).toBeInTheDocument();
    expect(screen.getByText('Información de la Póliza')).toBeInTheDocument();
    expect(screen.getByText('Datos de Contacto')).toBeInTheDocument();
    expect(screen.getByText('Detalles del Incidente')).toBeInTheDocument();
    expect(screen.getByText('Información del Vehículo')).toBeInTheDocument();
  });

  it('shows police report number field when police report is checked', async () => {
    const user = userEvent.setup();
    
    render(
      <ClaimForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
      />
    );

    // Expandir sección de vehículo
    const vehicleSection = screen.getByText('Información del Vehículo');
    await user.click(vehicleSection);

    // Verificar que el campo de número de reporte no existe inicialmente
    expect(screen.queryByLabelText(/Número de Reporte Policial/i)).not.toBeInTheDocument();

    // Marcar checkbox de reporte policial
    const policeReportCheckbox = screen.getByRole('checkbox', { 
      name: /Se generó reporte policial/i 
    });
    await user.click(policeReportCheckbox);

    // Verificar que ahora aparece el campo
    await waitFor(() => {
      expect(screen.getByLabelText(/Número de Reporte Policial/i)).toBeInTheDocument();
    });
  });

  it('submits vehicle claim with police report', async () => {
    const user = userEvent.setup();
    
    render(
      <ClaimForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
      />
    );

    // Llenar información de póliza
    const policySection = screen.getByText('Información de la Póliza');
    await user.click(policySection);

    await user.type(screen.getByPlaceholderText('POL-123456'), 'POL-VEH123');
    
    const claimTypeButton = screen.getByRole('combobox', { name: /selecciona el tipo de reclamo/i });
    await user.click(claimTypeButton);
    await user.click(screen.getByText('Accidente'));

    // Llenar datos personales
    const personalSection = screen.getByText('Datos de Contacto');
    await user.click(personalSection);

    await user.type(screen.getByPlaceholderText('Tu nombre'), 'María');
    await user.type(screen.getByPlaceholderText('Tu apellido'), 'González');
    await user.type(screen.getByPlaceholderText('tu@email.com'), 'maria@test.com');
    await user.type(screen.getByPlaceholderText('9XXXXXXXX'), '987654321');

    // Llenar detalles del incidente
    const incidentSection = screen.getByText('Detalles del Incidente');
    await user.click(incidentSection);

    await user.type(screen.getByLabelText('Fecha del Incidente'), '2024-02-20');
    await user.type(
      screen.getByPlaceholderText('Describa lo sucedido'),
      'Colisión frontal en intersección con otro vehículo que no respetó señal de alto'
    );

    // Llenar información del vehículo
    const vehicleSection = screen.getByText('Información del Vehículo');
    await user.click(vehicleSection);

    await user.type(screen.getByPlaceholderText('ABC-1234'), 'GYE-7890');
    await user.type(
      screen.getByPlaceholderText(/Dirección donde ocurrió/),
      'Av. Francisco de Orellana y Av. Carlos Julio Arosemena'
    );

    const policeReportCheckbox = screen.getByRole('checkbox');
    await user.click(policeReportCheckbox);

    await waitFor(() => {
      expect(screen.getByPlaceholderText('REP-123456')).toBeInTheDocument();
    });

    await user.type(screen.getByPlaceholderText('REP-123456'), 'REP-2024-00123');
    await user.type(screen.getByPlaceholderText('0.00'), '5000');

    // Submit
    const submitButton = screen.getByRole('button', { name: /Enviar Reclamo/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          insuranceType: 'vehicle',
          claimType: 'accident',
          vehiclePlate: 'GYE-7890',
          policeReport: true,
          policeReportNumber: 'REP-2024-00123',
          estimatedDamage: 5000,
        })
      );
    });
  });

  it('displays loading state when submitting', async () => {
    render(
      <ClaimForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
        isLoading={true}
      />
    );

    const submitButton = screen.getByRole('button', { name: /Enviar Reclamo/i });
    expect(submitButton).toBeDisabled();
    
    // Verificar que el ícono de loading está presente
    const loadingIcon = submitButton.querySelector('svg.animate-spin');
    expect(loadingIcon).toBeInTheDocument();
  });

  it('populates form with initial data', () => {
    const initialData = {
      policyNumber: 'POL-INITIAL',
      claimType: 'damage' as const,
        personalInfo: {
        firstName: 'Test',
        lastName: 'User',
        email: 'test@example.com',
          phone: '999999999',
      },
    };

    render(
      <ClaimForm
        insuranceType="vehicle"
        onSubmit={mockOnSubmit}
        initialData={initialData}
      />
    );

    expect(screen.getByDisplayValue('POL-INITIAL')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test')).toBeInTheDocument();
    expect(screen.getByDisplayValue('User')).toBeInTheDocument();
  });
});
