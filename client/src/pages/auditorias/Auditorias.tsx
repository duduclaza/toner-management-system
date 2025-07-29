import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileUpload } from "@/components/ui/file-upload";
import { DataTable } from "@/components/ui/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus, FileText, ClipboardCheck, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Filial } from "@shared/schema";

interface Auditoria {
  id: string;
  filialAuditada: string;
  periodoInicio: string;
  periodoFim: string;
  anexoPdf?: string;
  createdAt: string;
}

export default function Auditorias() {
  const [formOpen, setFormOpen] = useState(false);
  const [filialSelecionada, setFilialSelecionada] = useState("");
  const [periodoInicio, setPeriodoInicio] = useState("");
  const [periodoFim, setPeriodoFim] = useState("");
  const [anexo, setAnexo] = useState<File[]>([]);

  const { toast } = useToast();

  // Query for filiais
  const { data: filiais = [] } = useQuery<Filial[]>({
    queryKey: ["/api/filiais"],
  });

  // Mock data - would come from API
  const auditorias: Auditoria[] = [];

  const handleSubmit = () => {
    if (!filialSelecionada) {
      toast({ title: "Filial é obrigatória", variant: "destructive" });
      return;
    }

    if (!periodoInicio || !periodoFim) {
      toast({ title: "Período da auditoria é obrigatório", variant: "destructive" });
      return;
    }

    if (new Date(periodoInicio) > new Date(periodoFim)) {
      toast({ title: "Data de início deve ser anterior à data de fim", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Auditoria registrada com sucesso!" });
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setFilialSelecionada("");
    setPeriodoInicio("");
    setPeriodoFim("");
    setAnexo([]);
  };

  const formatPeriod = (inicio: string, fim: string) => {
    return `${new Date(inicio).toLocaleDateString()} - ${new Date(fim).toLocaleDateString()}`;
  };

  const getStatusByDate = (periodoFim: string) => {
    const today = new Date();
    const endDate = new Date(periodoFim);
    const diffTime = today.getTime() - endDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) {
      return <Badge className="status-badge success">Recente</Badge>;
    } else if (diffDays <= 30) {
      return <Badge className="status-badge warning">Válida</Badge>;
    } else {
      return <Badge className="status-badge error">Expirada</Badge>;
    }
  };

  const columns = [
    {
      key: "filialAuditada" as keyof Auditoria,
      header: "Filial Auditada",
    },
    {
      key: "periodoInicio" as keyof Auditoria,
      header: "Período",
      render: (_, auditoria: Auditoria) => (
        <span className="text-sm">
          {formatPeriod(auditoria.periodoInicio, auditoria.periodoFim)}
        </span>
      ),
    },
    {
      key: "periodoFim" as keyof Auditoria,
      header: "Status",
      render: (periodoFim: string) => getStatusByDate(periodoFim),
    },
    {
      key: "anexoPdf" as keyof Auditoria,
      header: "Relatório",
      render: (anexo: string) => anexo ? (
        <Button variant="ghost" size="sm" className="text-blue-600">
          <FileText className="h-4 w-4 mr-1" />
          PDF
        </Button>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: "createdAt" as keyof Auditoria,
      header: "Data de Registro",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  const getAuditoriasSummary = () => {
    const total = auditorias.length;
    const recentes = auditorias.filter(a => {
      const diffDays = Math.ceil((new Date().getTime() - new Date(a.periodoFim).getTime()) / (1000 * 60 * 60 * 24));
      return diffDays <= 7;
    }).length;
    const validas = auditorias.filter(a => {
      const diffDays = Math.ceil((new Date().getTime() - new Date(a.periodoFim).getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 7 && diffDays <= 30;
    }).length;
    const expiradas = auditorias.filter(a => {
      const diffDays = Math.ceil((new Date().getTime() - new Date(a.periodoFim).getTime()) / (1000 * 60 * 60 * 24));
      return diffDays > 30;
    }).length;

    return { total, recentes, validas, expiradas };
  };

  const summary = getAuditoriasSummary();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Auditorias</h2>
        <p className="text-gray-600">Gerenciamento de auditorias por filial</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{summary.total}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recentes</p>
                <p className="text-2xl font-bold text-green-600">{summary.recentes}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Válidas</p>
                <p className="text-2xl font-bold text-yellow-600">{summary.validas}</p>
              </div>
              <ClipboardCheck className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expiradas</p>
                <p className="text-2xl font-bold text-red-600">{summary.expiradas}</p>
              </div>
              <Calendar className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Registro de Auditorias</CardTitle>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Auditoria
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={auditorias}
            columns={columns}
            searchKey="filialAuditada"
            onExport={() => toast({ title: "Exportação em desenvolvimento" })}
            emptyMessage="Nenhuma auditoria registrada"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Auditoria</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="filial">Filial Auditada</Label>
              <Select value={filialSelecionada} onValueChange={setFilialSelecionada}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a filial..." />
                </SelectTrigger>
                <SelectContent>
                  {filiais.map((filial) => (
                    <SelectItem key={filial.id} value={filial.nome}>
                      {filial.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="inicio">Data de Início</Label>
                <Input
                  id="inicio"
                  type="date"
                  value={periodoInicio}
                  onChange={(e) => setPeriodoInicio(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="fim">Data de Fim</Label>
                <Input
                  id="fim"
                  type="date"
                  value={periodoFim}
                  onChange={(e) => setPeriodoFim(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="anexo">Relatório de Auditoria (PDF)</Label>
              <FileUpload
                accept=".pdf"
                onFilesChange={setAnexo}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar Auditoria
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
