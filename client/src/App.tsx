import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AppLayout } from "@/components/layout/AppLayout";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import CadastrosGerais from "@/pages/cadastros/CadastrosGerais";
import Retornados from "@/pages/retornados/Retornados";
import Garantias from "@/pages/garantias/Garantias";
import Amostragens from "@/pages/amostragens/Amostragens";
import Homologacoes from "@/pages/homologacoes/Homologacoes";
import Certificados from "@/pages/certificados/Certificados";
import PopIt from "@/pages/pop-it/PopIt";
import Processos from "@/pages/processos/Processos";
import Auditorias from "@/pages/auditorias/Auditorias";
import Dinamicas from "@/pages/dinamicas/Dinamicas";
import Configuracoes from "@/pages/configuracoes/Configuracoes";

function AuthenticatedApp() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/cadastros" component={CadastrosGerais} />
        <Route path="/retornados" component={Retornados} />
        <Route path="/garantias" component={Garantias} />
        <Route path="/amostragens" component={Amostragens} />
        <Route path="/homologacoes" component={Homologacoes} />
        <Route path="/certificados" component={Certificados} />
        <Route path="/pop-it" component={PopIt} />
        <Route path="/processos" component={Processos} />
        <Route path="/auditorias" component={Auditorias} />
        <Route path="/dinamicas" component={Dinamicas} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route component={NotFound} />
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <AuthenticatedApp />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
