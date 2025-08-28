import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const PrivacyPolicy = () => {
  const { data: settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
                Política de Privacidad
              </h1>
              
              <p className="text-foreground/80 leading-relaxed mb-8">
                Esta Política de Privacidad describe cómo Gal Reforms S.L recopila, utiliza y protege 
                su información personal cuando utiliza nuestros servicios o visita nuestro sitio web.
              </p>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  1. Información que Recopilamos
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Recopilamos información cuando se pone en contacto con nosotros a través de nuestros formularios, 
                  teléfono, email o WhatsApp. Esta información puede incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Nombre completo</li>
                  <li>Dirección de correo electrónico</li>
                  <li>Número de teléfono</li>
                  <li>Dirección del proyecto</li>
                  <li>Detalles sobre el proyecto deseado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  2. Cómo Utilizamos su Información
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Utilizamos su información para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Responder a sus consultas y solicitudes de presupuesto</li>
                  <li>Proporcionar información sobre nuestros servicios</li>
                  <li>Programar visitas técnicas</li>
                  <li>Mantener contacto durante el desarrollo del proyecto</li>
                  <li>Mejorar nuestros servicios</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  3. Protección de Datos
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Implementamos medidas de seguridad adecuadas para proteger su información personal 
                  contra acceso no autorizado, alteración, divulgación o destrucción. Sus datos se 
                  almacenan en servidores seguros y solo nuestro equipo autorizado tiene acceso.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  4. Compartir Información
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  No vendemos, comercializamos o transferimos su información personal a terceros, 
                  excepto cuando sea necesario para prestar nuestros servicios (como proveedores de materiales) 
                  o cuando sea requerido por ley.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  5. Sus Derechos
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  De acuerdo con el RGPD (Reglamento General de Protección de Datos), usted tiene derecho a:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Solicitar acceso a sus datos personales</li>
                  <li>Corregir datos incompletos o incorrectos</li>
                  <li>Solicitar la eliminación de sus datos</li>
                  <li>Revocar su consentimiento en cualquier momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  6. Contacto
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Para ejercer sus derechos o aclarar dudas sobre esta política, 
                  póngase en contacto con nosotros a través del email: {settings?.email || 'contacto@galreforms.com'} o 
                  teléfono: {settings?.phone_number || '+34 XXX XXX XXX'}.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  7. Cambios en la Política
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Esta política puede actualizarse periódicamente. Recomendamos que 
                  revise esta página regularmente para mantenerse informado sobre cómo 
                  protegemos su información.
                </p>
                <p className="text-foreground/60 text-sm mt-4">
                  Última actualización: {new Date().toLocaleDateString('es-ES')}
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default PrivacyPolicy;