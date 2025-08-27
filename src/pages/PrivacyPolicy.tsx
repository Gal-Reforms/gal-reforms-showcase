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
                Política de Privacidade
              </h1>
              
              <p className="text-foreground/80 leading-relaxed mb-8">
                Esta Política de Privacidade descreve como a Gal Reforms S.L coleta, utiliza e protege 
                suas informações pessoais quando você utiliza nossos serviços ou visita nosso site.
              </p>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  1. Informações que Coletamos
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Coletamos informações quando você entra em contato conosco através de nossos formulários, 
                  telefone, email ou WhatsApp. Estas informações podem incluir:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Nome completo</li>
                  <li>Endereço de email</li>
                  <li>Número de telefone</li>
                  <li>Endereço do projeto</li>
                  <li>Detalhes sobre o projeto desejado</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  2. Como Utilizamos suas Informações
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  Utilizamos suas informações para:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Responder às suas consultas e solicitações de orçamento</li>
                  <li>Fornecer informações sobre nossos serviços</li>
                  <li>Agendar visitas técnicas</li>
                  <li>Manter contato durante o desenvolvimento do projeto</li>
                  <li>Melhorar nossos serviços</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  3. Proteção de Dados
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Implementamos medidas de segurança adequadas para proteger suas informações pessoais 
                  contra acesso não autorizado, alteração, divulgação ou destruição. Seus dados são 
                  armazenados em servidores seguros e apenas nossa equipe autorizada tem acesso.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  4. Compartilhamento de Informações
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Não vendemos, comercializamos ou transferimos suas informações pessoais para terceiros, 
                  exceto quando necessário para prestar nossos serviços (como fornecedores de materiais) 
                  ou quando exigido por lei.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  5. Seus Direitos
                </h2>
                <p className="text-foreground/80 leading-relaxed mb-4">
                  De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem o direito de:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-foreground/80">
                  <li>Solicitar acesso aos seus dados pessoais</li>
                  <li>Corrigir dados incompletos ou incorretos</li>
                  <li>Solicitar a exclusão de seus dados</li>
                  <li>Revogar seu consentimento a qualquer momento</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  6. Contato
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Para exercer seus direitos ou esclarecer dúvidas sobre esta política, 
                  entre em contato conosco através do email: {settings?.email || 'contato@galreforms.com'} ou 
                  telefone: {settings?.phone_number || '+34 XXX XXX XXX'}.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  7. Alterações na Política
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Esta política pode ser atualizada periodicamente. Recomendamos que você 
                  verifique esta página regularmente para se manter informado sobre como 
                  protegemos suas informações.
                </p>
                <p className="text-foreground/60 text-sm mt-4">
                  Última atualização: {new Date().toLocaleDateString('pt-BR')}
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