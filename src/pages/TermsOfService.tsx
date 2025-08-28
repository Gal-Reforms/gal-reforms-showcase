import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { useSiteSettings } from '@/hooks/useSiteSettings';

const TermsOfService = () => {
  const { data: settings } = useSiteSettings();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-20 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
                Términos de Servicio
              </h1>
              
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    1. Aceptación de los Términos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Al contratar los servicios de Gal Reforms S.L., usted acepta estos términos y condiciones. 
                    Si no está de acuerdo con cualquier parte de estos términos, no debe utilizar nuestros servicios.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    2. Descripción de los Servicios
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    Gal Reforms ofrece servicios de:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                    <li>Construcción residencial y comercial</li>
                    <li>Reformas completas y parciales</li>
                    <li>Reformas de cocinas y baños</li>
                    <li>Reformas de fachadas y exteriores</li>
                    <li>Consultoría técnica en construcción</li>
                    <li>Proyectos personalizados</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    3. Presupuestos y Contratos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Todos los presupuestos son gratuitos y válidos por 30 días
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • El contrato detallado se proporcionará antes del inicio de los trabajos
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Los cambios en el proyecto pueden resultar en ajustes en el presupuesto
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • El cliente tiene derecho de desistimiento conforme a la legislación vigente
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    4. Pagos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Formas de pago: efectivo, transferencia bancaria, tarjeta
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Fraccionamiento según acuerdo en el contrato
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Los pagos atrasados están sujetos a intereses conforme a la ley
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Los materiales se adquieren mediante el pago de las cuotas correspondientes
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    5. Plazos y Ejecución
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Los plazos son estimados y pueden variar según la complejidad del proyecto
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Factores externos (clima, proveedores, licencias) pueden afectar el cronograma
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Mantendremos comunicación constante sobre el progreso de los trabajos
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    6. Garantías
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Ofrecemos garantía de 2 años para servicios estructurales
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Garantía de 1 año para acabados e instalaciones
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Los materiales siguen la garantía del fabricante
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Las garantías no cubren daños por mal uso o desgaste natural
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    7. Responsabilidades del Cliente
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Proporcionar acceso adecuado al lugar de la obra
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Obtener licencias y autorizaciones necesarias cuando sea aplicable
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Realizar pagos según el cronograma acordado
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Informar sobre características especiales del inmueble
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    8. Limitación de Responsabilidad
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Nuestra responsabilidad se limita a los servicios contratados. No nos responsabilizamos 
                    por daños a objetos personales no relacionados con la obra o por descubrimientos de problemas 
                    estructurales preexistentes no identificados en la evaluación inicial.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    9. Resolución de Conflictos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Las posibles disputas se resolverán mediante negociación directa. En caso de no ser 
                    posible, se aplicará la legislación española y el foro competente será Madrid.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                    10. Contacto
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Para aclarar dudas sobre estos términos o solicitar información adicional, 
                    póngase en contacto con nosotros a través del email: {settings?.email || 'contacto@galreforms.com'} o 
                    teléfono: {settings?.phone_number || '+34 XXX XXX XXX'}.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default TermsOfService;