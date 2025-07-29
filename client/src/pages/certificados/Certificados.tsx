import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Plus, FileText, Download, Calendar, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Certificado {
  id: string;
  nome: string;
  dataCertificado: string;
  anexoPdf?: string;
  createdAt: string;
}

export default function Certificados() {
  const [formOpen, setFormOpen] = useState(false);
  const [nome, setNome] = useState("");
  const [dataCertificado, setDataCertificado] = useState("");
  const [anexo, setAnexo] = useState<File[]>([]);

  const { toast } = useToast();

  // Mock data - would come from API
  const certificados: Certificado[] = [];

  const handleSubmit = () => {
    if (!nome.trim()) {
      toast({ title: "Nome do certificado é obrigatório", variant: "destructive" });
      return;
    }

    if (!dataCertificado) {
      toast({ title: "Data do certificado é obrigatória", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Certificado registrado com sucesso!" });
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setNome("");
    setDataCertificado("");
    setAnexo([]);
  };

  const handleDownload = (certificado: Certificado) => {
    // TODO: Implement file download
    toast({ title: "Download em desenvolvimento" });
  };

  const isExpiringSoon = (dataCertificado: string) => {
    const certDate = new Date(dataCertificado);
    const today = new Date();
    const diffTime = certDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30 && diffDays > 0;
  };

  const isExpired = (dataCertificado: string) => {
    const certDate = new Date(dataCertificado);
    const today = new Date();
    return certDate < today;
  };

  const getStatusBadge = (dataCertificado: string) => {
    if (isExpired(dataCertificado)) {
      return (
        <Badge className="status-badge error">
          <AlertTriangle className="h-3 w-3 mr-1" />
          Expirado
        </Badge>
      );
    } else if (isExpiringSoon(dataCertificado)) {
      return (
        <Badge className="status-badge warning">
          <Calendar className="h-3 w-3 mr-1" />
          Expira em breve
        </Badge>
      );
    } else {
      return (
        <Badge className="status-badge success">
          Válido
        </Badge>
      );
    }
  };

  const columns = [
    {
      key: "nome" as keyof Certificado,
      header: "Nome do Certificado",
    },
    {
      key: "dataCertificado" as keyof Certificado,
      header: "Data do Certificado",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      key: "dataCertificado" as keyof Certificado,
      header: "Status",
      render: (date: string) => getStatusBadge(date),
    },
    {
      key: "anexoPdf" as keyof Certificado,
      header: "Anexo",
      render: (anexo: string, certificado: Certificado) => anexo ? (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleDownload(certificado)}
          className="text-blue-600 hover:text-blue-700"
        >
          <FileText className="h-4 w-4 mr-1" />
          PDF
        </Button>
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: "createdAt" as keyof Certificado,
      header: "Data de Registro",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Certificados</h2>
        <p className="text-gray-600">Gerenciamento de certificados da empresa</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Válidos</p>
                <p className="text-2xl font-bold text-green-600">0</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expirando</p>
                <p className="text-2xl font-bold text-yellow-600">0</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Expirados</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Certificados</CardTitle>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Novo Certificado
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={certificados}
            columns={columns}
            searchKey="nome"
            onExport={() => toast({ title: "Exportação em desenvolvimento" })}
            emptyMessage="Nenhum certificado registrado"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Certificado</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="nome">Nome do Certificado</Label>
              <Input
                id="nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex: ISO 9001:2015"
              />
            </div>

            <div>
              <Label htmlFor="dataCertificado">Data do Certificado</Label>
              <Input
                id="dataCertificado"
                type="date"
                value={dataCertificado}
                onChange={(e) => setDataCertificado(e.target.value)}
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

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar Certificado
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
