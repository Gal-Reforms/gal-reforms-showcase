import { useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const TermsOfService = () => {
  useEffect(() => {
    document.title = "Termos de Serviço - Gal Reforms";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Termos de serviço da Gal Reforms. Conheça os termos e condições dos nossos serviços de reforma e construção.');
    }
  }, []);

  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-20">
        <div className="container mx-auto px-4 lg:px-8 py-16">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
              Termos de Serviço
            </h1>
            
            <div className="prose prose-lg max-w-none space-y-8">
              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  1. Aceitação dos Termos
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Ao contratar os serviços da Gal Reforms S.L., você concorda com estes termos e condições. 
                  Se você não concordar com qualquer parte destes termos, não deverá utilizar nossos serviços.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
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
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
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
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
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
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
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
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
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
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
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
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  8. Limitação de Responsabilidade
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Nossa responsabilidade limita-se aos serviços contratados. Não nos responsabilizamos 
                  por danos a objetos pessoais não relacionados à obra ou por descobertas de problemas 
                  estruturais preexistentes não identificados na avaliação inicial.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  9. Resolução de Conflitos
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Eventuais disputas serão resolvidas através de negociação direta. Caso não seja 
                  possível, será aplicada a legislação espanhola e o foro competente será Madrid.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-semibold text-foreground mb-4">
                  10. Contato
                </h2>
                <p className="text-foreground/80 leading-relaxed">
                  Para questões relacionadas a estes termos, entre em contato: contato@galreforms.com 
                  ou +34 XXX XXX XXX.
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

export default TermsOfService;