import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { DataTable } from "@/components/ui/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Users, Target, FileText, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DISCQuestionnaire } from "./DISCQuestionnaire";
import { CincoSDynamics } from "./CincoSDynamics";

interface Dinamica5S {
  id: string;
  area: string;
  responsavel: string;
  dataAvaliacao: string;
  pontuacao: number;
  observacoes: string;
  anexos?: string[];
  createdAt: string;
}

interface DinamicaDISC {
  id: string;
  funcionario: string;
  cargo: string;
  perfilPrimario: "D" | "I" | "S" | "C";
  perfilSecundario?: "D" | "I" | "S" | "C";
  pontuacaoD: number;
  pontuacaoI: number;
  pontuacaoS: number;
  pontuacaoC: number;
  dataAvaliacao: string;
  observacoes: string;
  createdAt: string;
}

export default function Dinamicas() {
  const [activeTab, setActiveTab] = useState("5s");
  const [form5SOpen, setForm5SOpen] = useState(false);
  const [formDISCOpen, setFormDISCOpen] = useState(false);
  const [discQuestionnaireOpen, setDiscQuestionnaireOpen] = useState(false);
  const [cincoSDynamicsOpen, setCincoSDynamicsOpen] = useState(false);

  // 5S Form State
  const [area5S, setArea5S] = useState("");
  const [responsavel5S, setResponsavel5S] = useState("");
  const [dataAvaliacao5S, setDataAvaliacao5S] = useState("");
  const [pontuacao5S, setPontuacao5S] = useState(0);
  const [observacoes5S, setObservacoes5S] = useState("");
  const [anexos5S, setAnexos5S] = useState<File[]>([]);

  // DISC Form State
  const [funcionarioDISC, setFuncionarioDISC] = useState("");
  const [cargoDISC, setCargoDISC] = useState("");
  const [dataAvaliacaoDISC, setDataAvaliacaoDISC] = useState("");
  const [pontuacaoD, setPontuacaoD] = useState(0);
  const [pontuacaoI, setPontuacaoI] = useState(0);
  const [pontuacaoS, setPontuacaoS] = useState(0);
  const [pontuacaoC, setPontuacaoC] = useState(0);
  const [observacoesDISC, setObservacoesDISC] = useState("");

  const { toast } = useToast();

  // Mock data - would come from API
  const dinamicas5S: Dinamica5S[] = [];
  const dinamicasDISC: DinamicaDISC[] = [];

  const handle5SSubmit = () => {
    if (!area5S.trim() || !responsavel5S.trim() || !dataAvaliacao5S) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Avaliação 5S registrada com sucesso!" });
    reset5SForm();
  };

  const handleDISCSubmit = () => {
    if (!funcionarioDISC.trim() || !cargoDISC.trim() || !dataAvaliacaoDISC) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    const total = pontuacaoD + pontuacaoI + pontuacaoS + pontuacaoC;
    if (total !== 100) {
      toast({ title: "A soma das pontuações deve ser igual a 100%", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Avaliação DISC registrada com sucesso!" });
    resetDISCForm();
  };

  const reset5SForm = () => {
    setForm5SOpen(false);
    setArea5S("");
    setResponsavel5S("");
    setDataAvaliacao5S("");
    setPontuacao5S(0);
    setObservacoes5S("");
    setAnexos5S([]);
  };

  const resetDISCForm = () => {
    setFormDISCOpen(false);
    setFuncionarioDISC("");
    setCargoDISC("");
    setDataAvaliacaoDISC("");
    setPontuacaoD(0);
    setPontuacaoI(0);
    setPontuacaoS(0);
    setPontuacaoC(0);
    setObservacoesDISC("");
  };

  const handleDISCQuestionnaireComplete = (results: any) => {
    // TODO: Submit to API
    toast({ 
      title: "Avaliação DISC concluída!", 
      description: `Perfil identificado: ${results.perfilPrimario}` 
    });
    setDiscQuestionnaireOpen(false);
  };

  const handleCincoSComplete = (results: any) => {
    // TODO: Submit to API
    toast({ 
      title: "Avaliação 5S concluída!", 
      description: `Pontuação: ${results.pontuacao}%` 
    });
    setCincoSDynamicsOpen(false);
  };

  const getPontuacaoBadge = (pontuacao: number) => {
    if (pontuacao >= 80) {
      return <Badge className="status-badge success">Excelente</Badge>;
    } else if (pontuacao >= 60) {
      return <Badge className="status-badge warning">Bom</Badge>;
    } else {
      return <Badge className="status-badge error">Precisa Melhorar</Badge>;
    }
  };

  const getPerfilDISC = (d: number, i: number, s: number, c: number) => {
    const max = Math.max(d, i, s, c);
    if (max === d) return { perfil: "D", cor: "bg-red-100 text-red-800", label: "Dominância" };
    if (max === i) return { perfil: "I", cor: "bg-yellow-100 text-yellow-800", label: "Influência" };
    if (max === s) return { perfil: "S", cor: "bg-green-100 text-green-800", label: "Estabilidade" };
    return { perfil: "C", cor: "bg-blue-100 text-blue-800", label: "Conformidade" };
  };

  const columns5S = [
    {
      key: "area" as keyof Dinamica5S,
      header: "Área",
    },
    {
      key: "responsavel" as keyof Dinamica5S,
      header: "Responsável",
    },
    {
      key: "dataAvaliacao" as keyof Dinamica5S,
      header: "Data da Avaliação",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "pontuacao" as keyof Dinamica5S,
      header: "Pontuação",
      render: (pontuacao: number) => (
        <div className="flex items-center space-x-2">
          <span className="font-medium">{pontuacao}%</span>
          {getPontuacaoBadge(pontuacao)}
        </div>
      ),
    },
    {
      key: "createdAt" as keyof Dinamica5S,
      header: "Registrado em",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const columnsDISC = [
    {
      key: "funcionario" as keyof DinamicaDISC,
      header: "Funcionário",
    },
    {
      key: "cargo" as keyof DinamicaDISC,
      header: "Cargo",
    },
    {
      key: "pontuacaoD" as keyof DinamicaDISC,
      header: "Perfil Principal",
      render: (_, dinamica: DinamicaDISC) => {
        const perfil = getPerfilDISC(
          dinamica.pontuacaoD,
          dinamica.pontuacaoI,
          dinamica.pontuacaoS,
          dinamica.pontuacaoC
        );
        return (
          <Badge className={perfil.cor}>
            {perfil.perfil} - {perfil.label}
          </Badge>
        );
      },
    },
    {
      key: "dataAvaliacao" as keyof DinamicaDISC,
      header: "Data da Avaliação",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "createdAt" as keyof DinamicaDISC,
      header: "Registrado em",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dinâmicas</h2>
        <p className="text-gray-600">Gerenciamento de metodologias de qualidade e comportamento</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avaliações 5S</p>
                <p className="text-2xl font-bold text-gray-900">{dinamicas5S.length}</p>
              </div>
              <Target className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Perfis DISC</p>
                <p className="text-2xl font-bold text-gray-900">{dinamicasDISC.length}</p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Este Mês</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Melhoria</p>
                <p className="text-2xl font-bold text-green-600">+0%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="5s">5S</TabsTrigger>
              <TabsTrigger value="disc">DISC</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="5s" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Metodologia 5S</h3>
                <p className="text-sm text-gray-600">
                  Avaliação da metodologia 5S (Seiri, Seiton, Seiso, Seiketsu, Shitsuke)
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => setCincoSDynamicsOpen(true)}>
                  <Target className="h-4 w-4 mr-2" />
                  Questionário 5S
                </Button>
                <Button variant="outline" onClick={() => setForm5SOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registro Manual
                </Button>
              </div>
            </div>

            <DataTable
              data={dinamicas5S}
              columns={columns5S}
              searchKey="area"
              onExport={() => toast({ title: "Exportação em desenvolvimento" })}
              emptyMessage="Nenhuma avaliação 5S registrada"
            />
          </TabsContent>

          <TabsContent value="disc" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-semibold">Perfil DISC</h3>
                <p className="text-sm text-gray-600">
                  Avaliação de perfil comportamental DISC (Dominância, Influência, Estabilidade, Conformidade)
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => setDiscQuestionnaireOpen(true)}>
                  <Users className="h-4 w-4 mr-2" />
                  Questionário DISC
                </Button>
                <Button variant="outline" onClick={() => setFormDISCOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Registro Manual
                </Button>
              </div>
            </div>

            <DataTable
              data={dinamicasDISC}
              columns={columnsDISC}
              searchKey="funcionario"
              onExport={() => toast({ title: "Exportação em desenvolvimento" })}
              emptyMessage="Nenhuma avaliação DISC registrada"
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* 5S Form Modal */}
      <Dialog open={form5SOpen} onOpenChange={setForm5SOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Avaliação 5S</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="area5s">Área</Label>
                <Input
                  id="area5s"
                  value={area5S}
                  onChange={(e) => setArea5S(e.target.value)}
                  placeholder="Ex: Produção"
                />
              </div>
              <div>
                <Label htmlFor="responsavel5s">Responsável</Label>
                <Input
                  id="responsavel5s"
                  value={responsavel5S}
                  onChange={(e) => setResponsavel5S(e.target.value)}
                  placeholder="Nome do responsável"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="data5s">Data da Avaliação</Label>
                <Input
                  id="data5s"
                  type="date"
                  value={dataAvaliacao5S}
                  onChange={(e) => setDataAvaliacao5S(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="pontuacao5s">Pontuação (%)</Label>
                <Input
                  id="pontuacao5s"
                  type="number"
                  min="0"
                  max="100"
                  value={pontuacao5S}
                  onChange={(e) => setPontuacao5S(parseInt(e.target.value) || 0)}
                  placeholder="0-100"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observacoes5s">Observações</Label>
              <Textarea
                id="observacoes5s"
                value={observacoes5S}
                onChange={(e) => setObservacoes5S(e.target.value)}
                placeholder="Observações sobre a avaliação..."
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="anexos5s">Anexos (opcional)</Label>
              <FileUpload
                accept=".pdf,.jpg,.jpeg,.png"
                multiple
                onFilesChange={setAnexos5S}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={reset5SForm}>
              Cancelar
            </Button>
            <Button onClick={handle5SSubmit}>
              Registrar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DISC Form Modal */}
      <Dialog open={formDISCOpen} onOpenChange={setFormDISCOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nova Avaliação DISC</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="funcionariodisc">Funcionário</Label>
                <Input
                  id="funcionariodisc"
                  value={funcionarioDISC}
                  onChange={(e) => setFuncionarioDISC(e.target.value)}
                  placeholder="Nome do funcionário"
                />
              </div>
              <div>
                <Label htmlFor="cargodisc">Cargo</Label>
                <Input
                  id="cargodisc"
                  value={cargoDISC}
                  onChange={(e) => setCargoDISC(e.target.value)}
                  placeholder="Cargo/Função"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="datadisc">Data da Avaliação</Label>
              <Input
                id="datadisc"
                type="date"
                value={dataAvaliacaoDISC}
                onChange={(e) => setDataAvaliacaoDISC(e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <Label>Pontuações DISC (total deve ser 100%)</Label>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <Label htmlFor="pontuacaod" className="text-sm">D - Dominância (%)</Label>
                  <Input
                    id="pontuacaod"
                    type="number"
                    min="0"
                    max="100"
                    value={pontuacaoD}
                    onChange={(e) => setPontuacaoD(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="pontuacaoi" className="text-sm">I - Influência (%)</Label>
                  <Input
                    id="pontuacaoi"
                    type="number"
                    min="0"
                    max="100"
                    value={pontuacaoI}
                    onChange={(e) => setPontuacaoI(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="pontuacaos" className="text-sm">S - Estabilidade (%)</Label>
                  <Input
                    id="pontuacaos"
                    type="number"
                    min="0"
                    max="100"
                    value={pontuacaoS}
                    onChange={(e) => setPontuacaoS(parseInt(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <Label htmlFor="pontuacaoc" className="text-sm">C - Conformidade (%)</Label>
                  <Input
                    id="pontuacaoc"
                    type="number"
                    min="0"
                    max="100"
                    value={pontuacaoC}
                    onChange={(e) => setPontuacaoC(parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Total atual: {pontuacaoD + pontuacaoI + pontuacaoS + pontuacaoC}%
              </p>
            </div>

            <div>
              <Label htmlFor="observacoesdisc">Observações</Label>
              <Textarea
                id="observacoesdisc"
                value={observacoesDISC}
                onChange={(e) => setObservacoesDISC(e.target.value)}
                placeholder="Observações sobre o perfil comportamental..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetDISCForm}>
              Cancelar
            </Button>
            <Button onClick={handleDISCSubmit}>
              Registrar Avaliação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DISC Questionnaire */}
      <DISCQuestionnaire
        isOpen={discQuestionnaireOpen}
        onClose={() => setDiscQuestionnaireOpen(false)}
        onComplete={handleDISCQuestionnaireComplete}
      />

      {/* 5S Dynamics */}
      <CincoSDynamics
        isOpen={cincoSDynamicsOpen}
        onClose={() => setCincoSDynamicsOpen(false)}
        onComplete={handleCincoSComplete}
      />
    </div>
  );
}
