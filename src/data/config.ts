/**
 * Datos de contacto y servicios externos. Un solo lugar para cambiarlos.
 */
export const CONTACT = {
  whatsapp: '5491154922800',
  email: 'devfabri@gmail.com',
  /**
   * Página de reservas de Google Calendar. Mientras esté vacía, el botón
   * "Agendar una llamada" abre WhatsApp con un mensaje para coordinar.
   * Cómo crearla: Google Calendar → Crear → Agenda de citas → duración 20 min
   * → Compartir → copiar el link y pegarlo acá.
   */
  calendarUrl: '',
  /** Endpoint del formulario (FormSubmit). Ver docs/deploy.md. */
  formEndpoint: 'https://formsubmit.co/ajax/devfabri@gmail.com',
  github: 'https://github.com/FabrizioTurdo-Dev',
  linkedin: '',
};

/** ID de Google Analytics 4 (G-XXXXXXX). Vacío = no se carga nada. */
export const GA_ID = '';

export const SITE_URL = 'https://fabrizioturdo.com';

export function whatsappUrl(message: string): string {
  return `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(message)}`;
}
