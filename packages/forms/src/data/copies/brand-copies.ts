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
          placeholder: '991234567',
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
          label: 'Acepto los',
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
          <p>Al utilizar nuestro servicio de cotización de seguros, usted acepta estos términos y condiciones en su totalidad. Si no está de acuerdo con alguna parte de estos términos, le recomendamos no utilizar nuestro servicio.</p>
          
          <h2>2. Uso de la Información Personal</h2>
          <p>La información proporcionada será utilizada exclusivamente para:</p>
          <ul>
            <li>Generar cotizaciones personalizadas de seguros</li>
            <li>Contactarlo con ofertas relevantes a su perfil</li>
            <li>Mejorar nuestros servicios y productos</li>
            <li>Cumplir con obligaciones legales y regulatorias</li>
          </ul>
          <p>Sus datos no serán compartidos con terceros sin su consentimiento explícito, excepto cuando sea requerido por ley.</p>
          
          <h2>3. Protección de Datos y Privacidad</h2>
          <p>Nos comprometemos a proteger su información personal mediante:</p>
          <ul>
            <li>Cifrado de datos en tránsito y en reposo</li>
            <li>Acceso restringido solo a personal autorizado</li>
            <li>Auditorías de seguridad periódicas</li>
            <li>Cumplimiento con normativas de protección de datos vigentes</li>
          </ul>
          <p>Puede consultar nuestra Política de Privacidad completa para más detalles sobre cómo manejamos su información.</p>
          
          <h2>4. Exactitud de la Información</h2>
          <p>Usted se compromete a proporcionar información veraz, completa y actualizada. La exactitud de las cotizaciones depende directamente de la calidad de los datos proporcionados. Información incorrecta o incompleta puede resultar en cotizaciones inexactas o en la denegación de cobertura.</p>
          
          <h2>5. Naturaleza de las Cotizaciones</h2>
          <p>Las cotizaciones generadas son estimaciones basadas en la información proporcionada y están sujetas a:</p>
          <ul>
            <li>Verificación y aprobación final por parte de la aseguradora</li>
            <li>Evaluación médica o técnica cuando sea requerida</li>
            <li>Cambios en las condiciones del mercado</li>
            <li>Disponibilidad de productos en su región</li>
          </ul>
          <p>Una cotización no constituye una oferta vinculante ni garantiza la emisión de una póliza.</p>
          
          <h2>6. Responsabilidades del Usuario</h2>
          <p>El usuario se compromete a:</p>
          <ul>
            <li>Utilizar el servicio de manera legal y apropiada</li>
            <li>No proporcionar información falsa o engañosa</li>
            <li>Mantener la confidencialidad de sus credenciales de acceso</li>
            <li>Notificar cualquier uso no autorizado de su cuenta</li>
          </ul>
          
          <h2>7. Limitación de Responsabilidad</h2>
          <p>Nuestro servicio de cotización es proporcionado "tal cual" sin garantías de ningún tipo. No nos hacemos responsables por:</p>
          <ul>
            <li>Decisiones tomadas basadas únicamente en las cotizaciones</li>
            <li>Errores u omisiones en la información presentada</li>
            <li>Interrupciones temporales del servicio</li>
            <li>Cambios en precios o condiciones por parte de las aseguradoras</li>
          </ul>
          
          <h2>8. Modificaciones a los Términos</h2>
          <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios serán notificados a través de nuestro sitio web o por correo electrónico. El uso continuado del servicio después de dichas modificaciones constituye la aceptación de los nuevos términos.</p>
          
          <h2>9. Ley Aplicable y Jurisdicción</h2>
          <p>Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde opera nuestro servicio. Cualquier disputa será sometida a la jurisdicción exclusiva de los tribunales competentes.</p>
          
          <h2>10. Contacto</h2>
          <p>Para cualquier consulta sobre estos términos y condiciones, puede contactarnos a través de nuestros canales oficiales de atención al cliente.</p>
          
          <p><strong>Última actualización:</strong> Noviembre 2025</p>
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
          label: 'Acepto los',
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
          label: 'I accept the',
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
