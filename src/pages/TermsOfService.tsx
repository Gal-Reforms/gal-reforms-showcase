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
<<<<<<< HEAD
                Términos de Servicio
=======
                Termos de Serviço
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
              </h1>
              
              <div className="prose prose-lg max-w-none space-y-8">
                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
                    1. Aceptación de los Términos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Al contratar los servicios de Gal Reforms S.L., usted acepta estos términos y condiciones. 
                    Si no está de acuerdo con cualquier parte de estos términos, no debe utilizar nuestros servicios.
=======
                    1. Aceitação dos Termos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Ao contratar os serviços da Gal Reforms S.L., você concorda com estes termos e condições. 
                    Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
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
=======
                    2. Descrição dos Serviços
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    A Gal Reforms oferece serviços de:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                    <li>Construção residencial e commercial</li>
                    <li>Reformas completas e parciais</li>
                    <li>Reformas de cozinhas e banheiros</li>
                    <li>Reformas de fachadas e exteriores</li>
                    <li>Consultoria técnica em construção</li>
                    <li>Projetos personalizados</li>
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
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
=======
                    3. Orçamentos e Contratos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Todos os orçamentos são gratuitos e válidos por 30 dias
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • O contrato detalhado será fornecido antes do início dos trabalhos
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Alterações no projeto podem resultar em ajustes no orçamento
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • O cliente tem direito de desistência conforme legislação vigente
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
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
=======
                    4. Pagamentos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Formas de pagamento: dinheiro, transferência bancária, cartão
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Parcelamento conforme acordo no contrato
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Pagamentos em atraso estão sujeitos a juros conforme lei
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Materiais são adquiridos mediante pagamento das parcelas correspondentes
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
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
=======
                    5. Prazos e Execução
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Os prazos são estimados e podem variar conforme complexidade do projeto
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Fatores externos (clima, fornecedores, licenças) podem afetar cronograma
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Manteremos comunicação constante sobre o progresso dos trabalhos
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
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
=======
                    6. Garantias
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Oferecemos garantia de 2 anos para serviços estruturais
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Garantia de 1 ano para acabamentos e instalações
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Materiais seguem garantia do fabricante
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Garantias não cobrem danos por mau uso ou desgaste natural
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
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
=======
                    7. Responsabilidades do Cliente
                  </h2>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Fornecer acesso adequado ao local da obra
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Obter licenças e autorizações necessárias quando aplicável
                  </p>
                  <p className="text-foreground/80 leading-relaxed mb-4">
                    • Realizar pagamentos conforme cronograma acordado
                  </p>
                  <p className="text-foreground/80 leading-relaxed">
                    • Informar sobre características especiais do imóvel
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
                    8. Limitación de Responsabilidad
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Nuestra responsabilidad se limita a los servicios contratados. No nos responsabilizamos 
                    por daños a objetos personales no relacionados con la obra o por descubrimientos de problemas 
                    estructurales preexistentes no identificados en la evaluación inicial.
=======
                    8. Limitação de Responsabilidade
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Nossa responsabilidade limita-se aos serviços contratados. Não nos responsabilizamos 
                    por danos a objetos pessoais não relacionados à obra ou por descobertas de problemas 
                    estruturais preexistentes não identificados na avaliação inicial.
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
                    9. Resolución de Conflictos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Las posibles disputas se resolverán mediante negociación directa. En caso de no ser 
                    posible, se aplicará la legislación española y el foro competente será Madrid.
=======
                    9. Resolução de Conflitos
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Eventuais disputas serão resolvidas através de negociação direta. Caso não seja 
                    possível, será aplicada a legislação espanhola e o foro competente será Madrid.
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
<<<<<<< HEAD
                    10. Contacto
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Para aclarar dudas sobre estos términos o solicitar información adicional, 
                    póngase en contacto con nosotros a través del email: {settings?.email || 'contacto@galreforms.com'} o 
                    teléfono: {settings?.phone_number || '+34 XXX XXX XXX'}.
=======
                    6. Contato
                  </h2>
                  <p className="text-foreground/80 leading-relaxed">
                    Para esclarecer dúvidas sobre estes termos ou solicitar informações adicionais, 
                    entre em contato conosco através do email: {settings?.email || 'contato@galreforms.com'} ou 
                    telefone: {settings?.phone_number || '+34 XXX XXX XXX'}.
>>>>>>> 4b24c9a7762fca49ce2603841a5c86fb8237b196
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