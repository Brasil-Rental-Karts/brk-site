import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Users, Calendar, Timer, CheckCircle, AlertCircle } from "lucide-react";
import { apiService } from "@/lib/api";
import { validateVipPreregister } from "@/lib/validation";
import { clarityEvents, setClarityTag } from "@/utils/clarity";

export function PreLaunch() {
  // Estado do primeiro formulário
  const [email1, setEmail1] = useState("");
  const [name1, setName1] = useState("");
  const [isLoading1, setIsLoading1] = useState(false);
  const [isSuccess1, setIsSuccess1] = useState(false);
  const [error1, setError1] = useState<string | null>(null);
  const [validationErrors1, setValidationErrors1] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Tracking do page view quando o componente carrega
  useEffect(() => {
    clarityEvents.pageView('pre_launch');
    setClarityTag('page_type', 'pre_launch');
  }, []);

  // Estado do segundo formulário
  const [email2, setEmail2] = useState("");
  const [name2, setName2] = useState("");
  const [isLoading2, setIsLoading2] = useState(false);
  const [isSuccess2, setIsSuccess2] = useState(false);
  const [error2, setError2] = useState<string | null>(null);
  const [validationErrors2, setValidationErrors2] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Função de submit do primeiro formulário
  const handleSubmit1 = async (e: React.FormEvent) => {
    e.preventDefault();
    clarityEvents.heroFormStart();
    setIsLoading1(true);
    setError1(null);
    setValidationErrors1({});

    // Validação com Zod
    const validation = validateVipPreregister({ name: name1, email: email1 });
    
    if (!validation.success) {
      const errors: { name?: string; email?: string } = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (field === 'name') {
          errors.name = err.message;
          clarityEvents.heroFormValidationError('name', err.message);
        } else if (field === 'email') {
          errors.email = err.message;
          clarityEvents.heroFormValidationError('email', err.message);
        }
      });
      setValidationErrors1(errors);
      setIsLoading1(false);
      return;
    }

    try {
      await apiService.registerVip(validation.data);
      clarityEvents.heroFormSuccess();
      setIsSuccess1(true);
      setName1("");
      setEmail1("");
      setValidationErrors1({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao registrar. Tente novamente.";
      clarityEvents.heroFormError(errorMessage);
      setError1(errorMessage);
    } finally {
      setIsLoading1(false);
    }
  };

  // Função de submit do segundo formulário
  const handleSubmit2 = async (e: React.FormEvent) => {
    e.preventDefault();
    clarityEvents.finalFormStart();
    setIsLoading2(true);
    setError2(null);
    setValidationErrors2({});

    // Validação com Zod
    const validation = validateVipPreregister({ name: name2, email: email2 });
    
    if (!validation.success) {
      const errors: { name?: string; email?: string } = {};
      validation.error.errors.forEach((err) => {
        const field = err.path[0] as string;
        if (field === 'name') {
          errors.name = err.message;
          clarityEvents.finalFormValidationError('name', err.message);
        } else if (field === 'email') {
          errors.email = err.message;
          clarityEvents.finalFormValidationError('email', err.message);
        }
      });
      setValidationErrors2(errors);
      setIsLoading2(false);
      return;
    }

    try {
      await apiService.registerVip(validation.data);
      clarityEvents.finalFormSuccess();
      setIsSuccess2(true);
      setName2("");
      setEmail2("");
      setValidationErrors2({});
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao registrar. Tente novamente.";
      clarityEvents.finalFormError(errorMessage);
      setError2(errorMessage);
    } finally {
      setIsLoading2(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-lvh overflow-hidden bg-primary text-primary-foreground content-center">
        <div className="absolute inset-0" />
        <div className="relative container max-w-5xl mx-auto text-center px-4">
          <div className="flex justify-center mb-12">
            <img
              src="/logo-brk-marca-horizontal-black.svg"
              alt="BRK Logo"
              className="h-8 w-auto"
            />
          </div>

          <div className="max-w-4xl mx-auto">
            <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl font-bold mb-6">
              A plataforma feita pra quem vive o kart além da pista
            </h1>
            <p className="text-lg sm:text-xl mb-8 sm:mb-12 max-w-2xl mx-auto">
           Acompanhe campeonatos, inscreva-se em corridas, acesse telemetria, rankings e muito mais. Tudo em um só lugar, para acelerar sua paixão pelas pistas.
            </p>
          </div>

          {/* Form de Captura */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
                         {isSuccess1 ? (
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center space-y-4"
               >
                 <CheckCircle className="w-16 h-16 text-black mx-auto" />
                 <h3 className="text-xl font-semibold">Bem vindo à Lista VIP!</h3>
                 <p className="text-primary-foreground/80">
                   Você receberá em primeira mão todas as novidades sobre o lançamento da plataforma BRK.
                 </p>
                 <Button
                   onClick={() => {
                     clarityEvents.backToFormClick('hero');
                     setIsSuccess1(false);
                     setValidationErrors1({});
                     setError1(null);
                   }}
                   variant="outline"
                   className="bg-transparent border-white/20 text-primary-foreground hover:bg-white/10"
                 >
                   Voltar
                 </Button>
               </motion.div>
             ) : (
               <form onSubmit={handleSubmit1} className="space-y-4">
                <div className="space-y-1">
                                     <Input
                     type="text"
                     placeholder="Seu nome"
                     value={name1}
                     onChange={(e) => {
                       setName1(e.target.value);
                       // Limpar erro de validação quando o usuário começar a digitar
                       if (validationErrors1.name) {
                         setValidationErrors1(prev => ({ ...prev, name: undefined }));
                       }
                     }}
                     className={`bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg ${
                       validationErrors1.name ? 'border-black/50' : ''
                     }`}
                     disabled={isLoading1}
                   />
                   {validationErrors1.name && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex items-center space-x-2 text-black text-sm"
                     >
                       <AlertCircle className="w-4 h-4" />
                       <span>{validationErrors1.name}</span>
                     </motion.div>
                   )}
                </div>

                <div className="space-y-1">
                                     <Input
                     type="email"
                     placeholder="Seu melhor e-mail"
                     value={email1}
                     onChange={(e) => {
                       setEmail1(e.target.value);
                       // Limpar erro de validação quando o usuário começar a digitar
                       if (validationErrors1.email) {
                         setValidationErrors1(prev => ({ ...prev, email: undefined }));
                       }
                     }}
                     className={`bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg ${
                       validationErrors1.email ? 'border-black/50' : ''
                     }`}
                     disabled={isLoading1}
                   />
                   {validationErrors1.email && (
                     <motion.div
                       initial={{ opacity: 0, y: -10 }}
                       animate={{ opacity: 1, y: 0 }}
                       className="flex items-center space-x-2 text-black text-sm"
                     >
                       <AlertCircle className="w-4 h-4" />
                       <span>{validationErrors1.email}</span>
                     </motion.div>
                   )}
                 </div>
                 
                 {error1 && (
                   <motion.div
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="flex items-center space-x-2 text-black text-sm"
                   >
                     <AlertCircle className="w-4 h-4" />
                     <span>{error1}</span>
                   </motion.div>
                 )}

                 <Button
                   type="submit"
                   className="w-full bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 rounded-2xl"
                   size="lg"
                   disabled={isLoading1}
                 >
                   {isLoading1 ? "Cadastrando..." : "Entrar para a Lista VIP"}
                 </Button>
              </form>
            )}
                         
             {!isSuccess1 && (
               <p className="text-xs text-white/70 mt-3">
                 Não enviamos spam. Seus dados estão seguros conosco.
               </p>
             )}
          </motion.div>
        </div>
        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          initial={{ y: 0, opacity: 0.5 }}
          animate={{
            y: [0, 10, 0],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          onClick={() => {
            clarityEvents.scrollToSection('about_section');
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-white"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
        </motion.div>
      </section>

      {/* Sobre o BRK */}
      <section className="py-12 sm:py-16 lg:py-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-heading text-2xl sm:text-3xl text-center mb-8 sm:mb-12"
          >
            De Piloto.<br />Para Piloto.
          </motion.h2>

          {/* Desktop Layout with absolute positioned cards */}
          <div className="hidden lg:block">
            <div className="relative flex justify-center items-center min-h-[600px]">
              {/* Center mockup image */}
              <div className="w-full md:w-[750px]">
                <motion.img 
                  src="/brk-mockup.png" 
                  alt="Hero Image" 
                  className="w-full"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              </div>

              {/* Left side cards */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 space-y-8">
                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="p-6 w-[250px] text-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{ transform: 'rotate(-5deg)' }}>
                    <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      Gestão Profissional
                    </h3>
                    <p className="text-muted-foreground">
                      Sistema completo para gerenciar campeonatos, pontuações e
                      rankings.
                    </p>
                  </Card>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="p-6 w-[250px] text-center shadow-lg hover:shadow-xl transition-shadow"
                        style={{ transform: 'rotate(3deg)' }}>
                    <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Comunidade Unida</h3>
                    <p className="text-muted-foreground">
                      Conecte-se com pilotos e organizadores de todo o Brasil.
                    </p>
                  </Card>
                </motion.div>
              </div>

              {/* Right side card */}
              <motion.div
                className="absolute right-0 top-1/2 -translate-y-1/2"
                initial={{ opacity: 0, x: 100 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card className="p-6 w-[250px] text-center shadow-lg hover:shadow-xl transition-shadow"
                      style={{ transform: 'rotate(5deg)' }}>
                  <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Calendário Integrado
                  </h3>
                  <p className="text-muted-foreground">
                    Acompanhe eventos e não perca nenhuma corrida importante.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Mobile Layout with stacked cards */}
          <div className="lg:hidden">
            {/* Mobile mockup image */}
            <div className="mb-8 sm:mb-12 flex justify-center">
              <motion.img 
                src="/brk-mockup.png" 
                alt="Hero Image" 
                className="w-full max-w-sm sm:max-w-md"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            </div>

            {/* Mobile cards grid */}
            <div className="grid gap-6 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Card 
                  className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                  onMouseEnter={() => clarityEvents.cardHover('gestao_profissional')}
                >
                  <Trophy className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Gestão Profissional
                  </h3>
                  <p className="text-muted-foreground">
                    Sistema completo para gerenciar campeonatos, pontuações e
                    rankings.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card 
                  className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                  onMouseEnter={() => clarityEvents.cardHover('comunidade_unida')}
                >
                  <Users className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Comunidade Unida</h3>
                  <p className="text-muted-foreground">
                    Conecte-se com pilotos e organizadores de todo o Brasil.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Card 
                  className="p-6 text-center shadow-lg hover:shadow-xl transition-shadow"
                  onMouseEnter={() => clarityEvents.cardHover('calendario_integrado')}
                >
                  <Calendar className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">
                    Calendário Integrado
                  </h3>
                  <p className="text-muted-foreground">
                    Acompanhe eventos e não perca nenhuma corrida importante.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="pb-20 bg-background">
        <div className="container max-w-6xl mx-auto px-4">
          <h2
            className="font-heading text-3xl text-center mb-12"
          >
            O Que Dizem os Pilotos
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <p className="text-lg mb-4">
                "A plataforma revolucionou a forma como organizamos nossos
                campeonatos. Tudo ficou mais profissional e organizado."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100" />
                <div>
                  <p className="font-semibold">Ronan</p>
                  <p className="text-sm text-muted-foreground">
                    Organizador de Campeonato
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <p className="text-lg mb-4">
                "Agora posso acompanhar minha evolução e comparar meu desempenho
                com outros pilotos. Isso me motiva a melhorar cada vez mais."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-100" />
                <div>
                  <p className="font-semibold">Eduardo</p>
                  <p className="text-sm text-muted-foreground">Piloto Amador</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contagem Regressiva e CTA Final */}
      <section className="pb-20 pt-14 bg-primary text-primary-foreground">
        <div className="container max-w-5xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Timer className="w-16 h-16 mx-auto mb-4" />
            <h2 className="font-heading text-3xl mb-2">
              O Lançamento Está Próximo
            </h2>
          </motion.div>

          {/* Form de Captura */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-md mx-auto"
          >
                         {isSuccess2 ? (
               <motion.div
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 className="text-center space-y-4"
               >
                 <CheckCircle className="w-16 h-16 text-black mx-auto" />
                 <h3 className="text-xl font-semibold">Bem vindo à Lista VIP!</h3>
                 <p className="text-primary-foreground/80">
                  Você receberá em primeira mão todas as novidades sobre o lançamento da plataforma BRK.
                 </p>
                 <Button
                   onClick={() => {
                     clarityEvents.backToFormClick('final');
                     setIsSuccess2(false);
                     setValidationErrors2({});
                     setError2(null);
                   }}
                   variant="outline"
                   className="bg-transparent border-white/20 text-primary-foreground hover:bg-white/10"
                 >
                   Voltar
                 </Button>
               </motion.div>
             ) : (
               <form onSubmit={handleSubmit2} className="space-y-4">
                <div className="space-y-1">
                  <Input
                    type="text"
                    placeholder="Seu nome"
                    value={name2}
                    onChange={(e) => {
                      setName2(e.target.value);
                      // Limpar erro de validação quando o usuário começar a digitar
                      if (validationErrors2.name) {
                        setValidationErrors2(prev => ({ ...prev, name: undefined }));
                      }
                    }}
                    className={`bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg ${
                      validationErrors2.name ? 'border-black/50' : ''
                    }`}
                    disabled={isLoading2}
                  />
                  {validationErrors2.name && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-black text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors2.name}</span>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-1">
                  <Input
                    type="email"
                    placeholder="Seu melhor e-mail"
                    value={email2}
                    onChange={(e) => {
                      setEmail2(e.target.value);
                      // Limpar erro de validação quando o usuário começar a digitar
                      if (validationErrors2.email) {
                        setValidationErrors2(prev => ({ ...prev, email: undefined }));
                      }
                    }}
                    className={`bg-white/10 text-primary-foreground placeholder:text-primary-foreground/70 border-white/20 rounded-lg ${
                      validationErrors2.email ? 'border-black/50' : ''
                    }`}
                    disabled={isLoading2}
                  />
                  {validationErrors2.email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center space-x-2 text-black text-sm"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{validationErrors2.email}</span>
                    </motion.div>
                  )}
                </div>
                
                {error2 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center space-x-2 text-black text-sm"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{error2}</span>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-primary-foreground text-primary font-bold hover:bg-primary-foreground/90 rounded-2xl"
                  size="lg"
                  disabled={isLoading2}
                >
                  {isLoading2 ? "Cadastrando..." : "Entrar para a Lista VIP"}
                </Button>
              </form>
                          )}
             {!isSuccess2 && (
               <p className="text-xs text-white/70 mt-3">
                 Não enviamos spam. Seus dados estão seguros conosco.
               </p>
             )}
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-background border-t">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/logo-brk.svg" alt="BRK Logo" className="h-6" />
              <span className="text-sm text-muted-foreground">
                Brasil Rental Karts
              </span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <a href="/privacidade" className="hover:text-primary">
                Política de Privacidade
              </a>
              <a
                href="https://www.instagram.com/brasilrentalkarts/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-primary"
                onClick={() => clarityEvents.socialMediaClick('instagram')}
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
