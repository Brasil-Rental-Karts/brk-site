import { motion } from "framer-motion";

export function Privacy() {
  return (
    <div className="min-h-screen bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="prose prose-lg dark:prose-invert"
        >
          <h1 className="font-heading text-3xl md:text-4xl mb-8">
            Política de Privacidade – BRK Soluções em Tecnologia
          </h1>

          <p className="text-muted-foreground mt-4 mb-8">
            Data da última atualização: 05 de junho de 2025
          </p>

          <p className="lead">
            A BRK Soluções em Tecnologia valoriza a sua privacidade e está
            comprometida com a proteção dos seus dados pessoais. Esta Política
            de Privacidade explica como coletamos, usamos, compartilhamos e
            protegemos suas informações, conforme a Lei Geral de Proteção de
            Dados Pessoais (Lei nº 13.709/2018 – LGPD).
          </p>

          <h2 className="font-heading text-2xl mt-8">
            1. Controlador dos Dados
          </h2>
          <ul>
            <li>
              <strong>Razão Social:</strong> BRK Soluções em Tecnologia
            </li>
            <li>
              <strong>E-mail de contato para assuntos de privacidade:</strong>
              falecom@brasilrentalkarts.com.br
            </li>
          </ul>

          <h2 className="font-heading text-2xl mt-8">
            2. Quais dados coletamos
          </h2>
          <p>
            Durante o uso da plataforma BRK, podemos coletar os seguintes dados
            pessoais:
          </p>
          <ul>
            <li>
              <strong>Dados de identificação:</strong> nome completo, data de
              nascimento, CPF, e-mail, telefone.
            </li>
            <li>
              <strong>Dados de acesso:</strong> login, senha criptografada, foto
              de perfil (se disponibilizada).
            </li>
            <li>
              <strong>Dados de menores de idade:</strong> mediante associação e
              consentimento do responsável legal.
            </li>
            <li>
              <strong>Dados de navegação:</strong> endereço IP, geolocalização,
              tipo de dispositivo, navegador, tempo de acesso e páginas
              visitadas.
            </li>
            <li>
              <strong>Cookies e rastreadores:</strong> informações obtidas
              através de tecnologias como Google Analytics, Microsoft Clarity e
              Meta Pixel.
            </li>
          </ul>

          <h2 className="font-heading text-2xl mt-8">
            3. Como coletamos os dados
          </h2>
          <p>Os dados podem ser coletados das seguintes formas:</p>
          <ul>
            <li>Durante o cadastro do usuário ou de seu responsável legal.</li>
            <li>
              Ao utilizar recursos da plataforma (perfil, inscrição em
              campeonatos, rankings).
            </li>
            <li>Via login integrado com o Google.</li>
            <li>
              Por meio da sua navegação, com uso de cookies e ferramentas de
              análise.
            </li>
          </ul>

          <h2 className="font-heading text-2xl mt-8">
            4. Para que usamos seus dados
          </h2>
          <p>Utilizamos seus dados para as seguintes finalidades:</p>
          <ul>
            <li>Gerenciar contas e autenticação de usuários.</li>
            <li>Permitir inscrições e participação em campeonatos.</li>
            <li>Exibir rankings e histórico de desempenho.</li>
            <li>Enviar comunicações sobre eventos, atualizações e alertas.</li>
            <li>Cumprir obrigações legais e regulatórias.</li>
            <li>
              Melhorar a experiência de navegação e personalização da
              plataforma.
            </li>
          </ul>

          <h2 className="font-heading text-2xl mt-8">
            5. Compartilhamento com terceiros
          </h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul>
            <li>
              <strong>Serviços de hospedagem e infraestrutura</strong>, como
              servidores em nuvem.
            </li>
            <li>
              <strong>Plataformas de login e análise</strong>: Google (Auth,
              Analytics), Microsoft (Clarity), Meta (Pixel).
            </li>
            <li>
              <strong>Autoridades judiciais e regulatórias</strong>, quando
              exigido por lei.
            </li>
          </ul>
          <p>Não vendemos ou alugamos suas informações para terceiros.</p>

          <h2 className="font-heading text-2xl mt-8">
            6. Armazenamento e tempo de retenção
          </h2>
          <p>Mantemos seus dados:</p>
          <ul>
            <li>Enquanto sua conta estiver ativa.</li>
            <li>
              Pelo prazo necessário para cumprir obrigações legais ou
              regulatórias.
            </li>
            <li>
              Até solicitação de exclusão pelo titular ou responsável legal.
            </li>
          </ul>

          <h2 className="font-heading text-2xl mt-8">
            7. Direitos dos titulares
          </h2>
          <p>
            Você, titular dos dados, ou seu responsável legal, tem o direito de:
          </p>
          <ul>
            <li>Acessar seus dados.</li>
            <li>Corrigir dados incompletos ou desatualizados.</li>
            <li>Solicitar anonimização ou exclusão de dados desnecessários.</li>
            <li>Revogar consentimentos.</li>
            <li>Portar seus dados para outro serviço.</li>
            <li>Apresentar reclamação à ANPD.</li>
          </ul>
          <p>
            Para exercer seus direitos, entre em contato pelo e-mail:
            falecom@brasilrentalkarts.com.br
          </p>

          <h2 className="font-heading text-2xl mt-8">8. Uso de cookies</h2>
          <p>Utilizamos cookies para:</p>
          <ul>
            <li>
              <strong>Análise de navegação</strong> (Microsoft Clarity, Google
              Analytics).
            </li>
            <li>
              <strong>Melhoria de performance</strong>.
            </li>
            <li>
              <strong>Campanhas publicitárias</strong> (Meta Pixel).
            </li>
          </ul>
          <p>
            Você pode configurar seu navegador para bloquear ou alertar sobre o
            uso de cookies. Algumas funcionalidades da plataforma podem ser
            impactadas.
          </p>

          <h2 className="font-heading text-2xl mt-8">
            9. Segurança da informação
          </h2>
          <p>
            Adotamos medidas técnicas e organizacionais para proteger seus
            dados:
          </p>
          <ul>
            <li>Criptografia de senhas.</li>
            <li>Acesso controlado a bancos de dados.</li>
            <li>Monitoramento de atividades suspeitas.</li>
            <li>Backup regular de dados.</li>
          </ul>

          <h2 className="font-heading text-2xl mt-8">
            10. Transferência internacional de dados
          </h2>
          <p>
            Alguns dados podem ser armazenados ou processados fora do Brasil,
            por serviços como Google e Microsoft. Nestes casos, garantimos o
            cumprimento de medidas adequadas de segurança e conformidade legal.
          </p>

          <h2 className="font-heading text-2xl mt-8">
            11. Alterações nesta Política
          </h2>
          <p>
            Esta política poderá ser atualizada periodicamente. Notificaremos
            você sobre alterações importantes através da plataforma ou e-mail
            cadastrado.
          </p>

          <h2 className="font-heading text-2xl mt-8">12. Contato</h2>
          <p>
            Em caso de dúvidas, solicitações ou reclamações, fale com nosso
            Encarregado de Proteção de Dados (DPO):
          </p>
          <p>
            <strong>E-mail:</strong> falecom@brasilrentalkarts.com.br
          </p>
        </motion.div>
      </div>
    </div>
  );
}
