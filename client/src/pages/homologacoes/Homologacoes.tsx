import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, FileText, CheckCircle, XCircle, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Homologacao {
  id: string;
  numeroNf: string;
  status: "aprovado" | "nao-aprovado";
  observacoes: string;
  anexoPdf?: string;
  createdAt: string;
}

export default function Homologacoes() {
  const [formOpen, setFormOpen] = useState(false);
  const [numeroNf, setNumeroNf] = useState("");
  const [status, setStatus] = useState<"aprovado" | "nao-aprovado">("aprovado");
  const [observacoes, setObservacoes] = useState("");
  const [anexo, setAnexo] = useState<File[]>([]);

  const { toast } = useToast();

  // Mock data - would come from API
  const homologacoes: Homologacao[] = [];

  const handleSubmit = () => {
    if (!numeroNf.trim()) {
      toast({ title: "Número da NF é obrigatório", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Homologação registrada com sucesso!" });
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setNumeroNf("");
    setStatus("aprovado");
    setObservacoes("");
    setAnexo([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return (
          <Badge className="status-badge success">
            <CheckCircle className="h-3 w-3 mr-1" />
            Aprovado
          </Badge>
        );
      case "nao-aprovado":
        return (
          <Badge className="status-badge error">
            <XCircle className="h-3 w-3 mr-1" />
            Não Aprovado
          </Badge>
        );
      default:
        return (
          <Badge className="status-badge warning">
            <Clock className="h-3 w-3 mr-1" />
            Pendente
          </Badge>
        );
    }
  };

  const columns = [
    {
      key: "numeroNf" as keyof Homologacao,
      header: "Número da NF",
    },
    {
      key: "status" as keyof Homologacao,
      header: "Status",
      render: (status: string) => getStatusBadge(status),
    },
    {
      key: "observacoes" as keyof Homologacao,
      header: "Observações",
      render: (observacoes: string) => (
        <div className="max-w-xs">
          <p className="text-sm truncate" title={observacoes}>
            {observacoes || "Sem observações"}
          </p>
        </div>
      ),
    },
    {
      key: "anexoPdf" as keyof Homologacao,
      header: "Anexo",
      render: (anexo: string) => anexo ? (
        <FileText className="h-4 w-4 text-blue-600" />
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: "createdAt" as keyof Homologacao,
      header: "Data",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Homologações</h2>
        <p className="text-gray-600">Gerenciamento de homologações de produtos</p>
      </div>

      {/* Status Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Aprovados</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Não Aprovados</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Registro de Homologações</CardTitle>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Homologação
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={homologacoes}
            columns={columns}
            searchKey="numeroNf"
            onExport={() => toast({ title: "Exportação em desenvolvimento" })}
            emptyMessage="Nenhuma homologação registrada"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Nova Homologação</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="numeroNf">Número da NF</Label>
                <Input
                  id="numeroNf"
                  value={numeroNf}
                  onChange={(e) => setNumeroNf(e.target.value)}
                  placeholder="123456"
                />
              </div>
              <div>
                <Label htmlFor="anexo">Anexo PDF</Label>
                <FileUpload
                  accept=".pdf"
                  onFilesChange={setAnexo}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="status">Status da Homologação</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="nao-aprovado">Não Aprovado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Digite observações sobre a homologação..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar Homologação
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
