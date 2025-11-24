import { BrandId } from '@/lib/types';

export interface BrandCopies {
  quoteForm: {
    title: string;
    subtitle: string;
    steps: {
      personalInfo: string;
      insuranceDetails: string;
      review: string;
    };
    fields: {
      firstName: { label: string; placeholder: string; error: string };
      lastName: { label: string; placeholder: string; error: string };
      email: { label: string; placeholder: string; error: string };
      phone: { label: string; placeholder: string; error: string };
      birthDate: { label: string; placeholder: string; error: string };
      identificationType: { label: string; placeholder: string };
      identificationNumber: { label: string; placeholder: string; error: string };
      insuranceType: { label: string; placeholder: string };
      acceptTerms: { label: string; error: string };
    };
    buttons: {
      next: string;
      back: string;
      submit: string;
      cancel: string;
    };
    termsAndConditions: {
      title: string;
      content: string;
    };
    success: {
      title: string;
      message: string;
    };
  };
  claimForm: {
    title: string;
    subtitle: string;
    fields: {
      policyNumber: { label: string; placeholder: string; error: string };
      incidentDate: { label: string; placeholder: string; error: string };
      description: { label: string; placeholder: string; error: string };
    };
    buttons: {
      submit: string;
      cancel: string;
    };
    success: {
      title: string;
      message: string;
    };
  };
}

export const brandCopies: Record<BrandId, BrandCopies> = {
  brand_A: {
    quoteForm: {
      title: 'Cotiza tu Seguro',
      subtitle: 'Compara y elige la mejor opción para ti y tu familia',
      steps: {
        personalInfo: 'Información Personal',
        insuranceDetails: 'Detalles del Seguro',
        review: 'Revisión',
      },
      fields: {
        firstName: {
          label: 'Nombre',
          placeholder: 'Ingresa tu nombre',
          error: 'El nombre es requerido',
        },
        lastName: {
          label: 'Apellido',
          placeholder: 'Ingresa tu apellido',
          error: 'El apellido es requerido',
        },
        email: {
          label: 'Correo Electrónico',
          placeholder: 'tu@email.com',
          error: 'Email inválido',
        },
        phone: {
          label: 'Teléfono',
          placeholder: '+593 99 123 4567',
          error: 'Teléfono inválido',
        },
        birthDate: {
          label: 'Fecha de Nacimiento',
          placeholder: 'DD/MM/AAAA',
          error: 'Fecha inválida',
        },
        identificationType: {
          label: 'Tipo de Identificación',
          placeholder: 'Selecciona un tipo',
        },
        identificationNumber: {
          label: 'Número de Identificación',
          placeholder: 'Ingresa tu número',
          error: 'Número inválido',
        },
        insuranceType: {
          label: 'Tipo de Seguro',
          placeholder: 'Selecciona un tipo',
        },
        acceptTerms: {
          label: 'Acepto los términos y condiciones',
          error: 'Debes aceptar los términos',
        },
      },
      buttons: {
        next: 'Siguiente',
        back: 'Atrás',
        submit: 'Obtener Cotización',
        cancel: 'Cancelar',
      },
      termsAndConditions: {
        title: 'Términos y Condiciones',
        content: `
          <h2>1. Aceptación de los Términos</h2>
          <p>Al utilizar nuestro servicio de cotización, usted acepta estos términos y condiciones.</p>
          
          <h2>2. Uso de la Información</h2>
          <p>La información proporcionada será utilizada únicamente para generar cotizaciones de seguros.</p>
          
          <h2>3. Privacidad</h2>
          <p>Nos comprometemos a proteger su información personal según nuestra política de privacidad.</p>
          
          <h2>4. Exactitud de la Información</h2>
          <p>Usted se compromete a proporcionar información veraz y actualizada.</p>
        `,
      },
      success: {
        title: '¡Cotización Generada!',
        message: 'Hemos enviado las opciones de seguros a tu correo electrónico.',
      },
    },
    claimForm: {
      title: 'Reportar un Reclamo',
      subtitle: 'Ingresa los detalles de tu reclamo para procesarlo',
      fields: {
        policyNumber: {
          label: 'Número de Póliza',
          placeholder: 'POL-123456',
          error: 'Número de póliza inválido',
        },
        incidentDate: {
          label: 'Fecha del Incidente',
          placeholder: 'DD/MM/AAAA',
          error: 'Fecha inválida',
        },
        description: {
          label: 'Descripción del Incidente',
          placeholder: 'Describe lo ocurrido...',
          error: 'La descripción es requerida',
        },
      },
      buttons: {
        submit: 'Enviar Reclamo',
        cancel: 'Cancelar',
      },
      success: {
        title: '¡Reclamo Registrado!',
        message: 'Hemos recibido tu reclamo. Te contactaremos pronto.',
      },
    },
  },
  brand_B: {
    quoteForm: {
      title: 'Solicita tu Cotización',
      subtitle: 'Encuentra el seguro perfecto para tus necesidades',
      steps: {
        personalInfo: 'Tus Datos',
        insuranceDetails: 'Tu Seguro',
        review: 'Confirmar',
      },
      fields: {
        firstName: {
          label: 'Nombres',
          placeholder: 'Tus nombres',
          error: 'Requerido',
        },
        lastName: {
          label: 'Apellidos',
          placeholder: 'Tus apellidos',
          error: 'Requerido',
        },
        email: {
          label: 'Email',
          placeholder: 'correo@ejemplo.com',
          error: 'Email no válido',
        },
        phone: {
          label: 'Celular',
          placeholder: '099 123 4567',
          error: 'Número no válido',
        },
        birthDate: {
          label: 'Nacimiento',
          placeholder: 'Fecha',
          error: 'Inválido',
        },
        identificationType: {
          label: 'Tipo ID',
          placeholder: 'Selecciona',
        },
        identificationNumber: {
          label: 'Número ID',
          placeholder: 'Tu número',
          error: 'Inválido',
        },
        insuranceType: {
          label: 'Seguro',
          placeholder: 'Elige uno',
        },
        acceptTerms: {
          label: 'Acepto términos y condiciones',
          error: 'Debes aceptar',
        },
      },
      buttons: {
        next: 'Continuar',
        back: 'Volver',
        submit: 'Cotizar Ahora',
        cancel: 'Salir',
      },
      termsAndConditions: {
        title: 'Términos del Servicio',
        content: `
          <h2>Términos de Uso</h2>
          <p>Estos términos regulan el uso de nuestro servicio de cotización.</p>
          
          <h2>Datos Personales</h2>
          <p>Tus datos serán tratados con confidencialidad.</p>
        `,
      },
      success: {
        title: 'Cotización Lista',
        message: 'Revisa tu email para ver las opciones disponibles.',
      },
    },
    claimForm: {
      title: 'Nuevo Reclamo',
      subtitle: 'Completa el formulario para iniciar tu reclamo',
      fields: {
        policyNumber: {
          label: 'Póliza No.',
          placeholder: 'Número',
          error: 'Inválido',
        },
        incidentDate: {
          label: 'Fecha',
          placeholder: 'Cuándo ocurrió',
          error: 'Requerido',
        },
        description: {
          label: 'Detalles',
          placeholder: 'Qué pasó...',
          error: 'Requerido',
        },
      },
      buttons: {
        submit: 'Registrar',
        cancel: 'Cancelar',
      },
      success: {
        title: 'Reclamo Recibido',
        message: 'Procesaremos tu solicitud a la brevedad.',
      },
    },
  },
  default: {
    quoteForm: {
      title: 'Insurance Quote',
      subtitle: 'Get your personalized insurance quote',
      steps: {
        personalInfo: 'Personal Information',
        insuranceDetails: 'Insurance Details',
        review: 'Review',
      },
      fields: {
        firstName: {
          label: 'First Name',
          placeholder: 'Enter your first name',
          error: 'First name is required',
        },
        lastName: {
          label: 'Last Name',
          placeholder: 'Enter your last name',
          error: 'Last name is required',
        },
        email: {
          label: 'Email',
          placeholder: 'your@email.com',
          error: 'Invalid email',
        },
        phone: {
          label: 'Phone',
          placeholder: '+1 234 567 8900',
          error: 'Invalid phone',
        },
        birthDate: {
          label: 'Birth Date',
          placeholder: 'MM/DD/YYYY',
          error: 'Invalid date',
        },
        identificationType: {
          label: 'ID Type',
          placeholder: 'Select type',
        },
        identificationNumber: {
          label: 'ID Number',
          placeholder: 'Enter your ID',
          error: 'Invalid ID',
        },
        insuranceType: {
          label: 'Insurance Type',
          placeholder: 'Select type',
        },
        acceptTerms: {
          label: 'I accept the terms and conditions',
          error: 'You must accept the terms',
        },
      },
      buttons: {
        next: 'Next',
        back: 'Back',
        submit: 'Get Quote',
        cancel: 'Cancel',
      },
      termsAndConditions: {
        title: 'Terms and Conditions',
        content: `
          <h2>Terms of Service</h2>
          <p>By using our service, you agree to these terms.</p>
        `,
      },
      success: {
        title: 'Quote Generated!',
        message: 'Check your email for insurance options.',
      },
    },
    claimForm: {
      title: 'File a Claim',
      subtitle: 'Enter your claim details',
      fields: {
        policyNumber: {
          label: 'Policy Number',
          placeholder: 'POL-123456',
          error: 'Invalid policy number',
        },
        incidentDate: {
          label: 'Incident Date',
          placeholder: 'MM/DD/YYYY',
          error: 'Invalid date',
        },
        description: {
          label: 'Description',
          placeholder: 'Describe what happened...',
          error: 'Description required',
        },
      },
      buttons: {
        submit: 'Submit Claim',
        cancel: 'Cancel',
      },
      success: {
        title: 'Claim Submitted!',
        message: 'We will contact you soon.',
      },
    },
  },
};

export const getBrandCopies = (brand: BrandId = 'default'): BrandCopies => {
  return brandCopies[brand] || brandCopies.default;
};
