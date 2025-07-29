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
import { Plus, FileText, CheckCircle, XCircle, Clock, Eye, Workflow } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Processo {
  id: string;
  titulo: string;
  versao: string;
  status: "pendente" | "aprovado" | "reprovado";
  motivo?: string;
  anexoPdf?: string;
  createdAt: string;
}

export default function Processos() {
  const [activeTab, setActiveTab] = useState("registro");
  const [formOpen, setFormOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Processo | null>(null);
  const [titulo, setTitulo] = useState("");
  const [anexo, setAnexo] = useState<File[]>([]);
  const [reviewDecision, setReviewDecision] = useState<"aprovado" | "reprovado">("aprovado");
  const [motivo, setMotivo] = useState("");

  const { toast } = useToast();

  // Mock data - would come from API
  const processosPendentes: Processo[] = [];
  const processosAprovados: Processo[] = [];

  const handleSubmit = () => {
    if (!titulo.trim()) {
      toast({ title: "Título é obrigatório", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Processo registrado com sucesso!" });
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setTitulo("");
    setAnexo([]);
  };

  const handleReview = (item: Processo) => {
    setSelectedItem(item);
    setReviewOpen(true);
  };

  const handleView = (item: Processo) => {
    setSelectedItem(item);
    setViewOpen(true);
  };

  const submitReview = () => {
    if (!selectedItem) return;

    if (reviewDecision === "reprovado" && !motivo.trim()) {
      toast({ title: "Motivo é obrigatório para reprovação", variant: "destructive" });
      return;
    }

    // TODO: Submit review to API
    toast({ 
      title: `Processo ${reviewDecision === "aprovado" ? "aprovado" : "reprovado"} com sucesso!` 
    });
    
    setReviewOpen(false);
    setSelectedItem(null);
    setReviewDecision("aprovado");
    setMotivo("");
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
      case "reprovado":
        return (
          <Badge className="status-badge error">
            <XCircle className="h-3 w-3 mr-1" />
            Reprovado
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

  const baseColumns = [
    {
      key: "titulo" as keyof Processo,
      header: "Título do Processo",
    },
    {
      key: "versao" as keyof Processo,
      header: "Versão",
    },
    {
      key: "status" as keyof Processo,
      header: "Status",
      render: (status: string) => getStatusBadge(status),
    },
    {
      key: "anexoPdf" as keyof Processo,
      header: "Anexo",
      render: (anexo: string) => anexo ? (
        <FileText className="h-4 w-4 text-blue-600" />
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: "createdAt" as keyof Processo,
      header: "Data",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Processos</h2>
        <p className="text-gray-600">Gerenciamento de processos organizacionais</p>
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
              <Workflow className="h-8 w-8 text-blue-600" />
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
                <p className="text-sm font-medium text-gray-600">Reprovados</p>
                <p className="text-2xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="registro">Registro</TabsTrigger>
              <TabsTrigger value="pendentes">Pendente Revisão</TabsTrigger>
              <TabsTrigger value="aprovados">Aprovados</TabsTrigger>
              <TabsTrigger value="visualizacao">Visualização</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="registro" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Registro de Processos</h3>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Processo
              </Button>
            </div>
            <p className="text-gray-600">
              Registre novos processos organizacionais. Após o registro, o documento ficará pendente de revisão antes da aprovação.
              Se já existir um processo com o mesmo título aprovado, o sistema criará automaticamente uma nova versão.
            </p>
          </TabsContent>

          <TabsContent value="pendentes" className="p-6">
            <DataTable
              data={processosPendentes}
              columns={[
                ...baseColumns,
                {
                  key: "id" as keyof Processo,
                  header: "Ações",
                  render: (_, item: Processo) => (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleView(item)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReview(item)}
                      >
                        Revisar
                      </Button>
                    </div>
                  ),
                },
              ]}
              searchKey="titulo"
              emptyMessage="Nenhum processo pendente de revisão"
            />
          </TabsContent>

          <TabsContent value="aprovados" className="p-6">
            <DataTable
              data={processosAprovados}
              columns={baseColumns}
              searchKey="titulo"
              emptyMessage="Nenhum processo aprovado"
            />
          </TabsContent>

          <TabsContent value="visualizacao" className="p-6">
            <div className="text-center py-8">
              <Workflow className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visualização de Processos
              </h3>
              <p className="text-gray-600">
                Selecione um processo aprovado para visualizar seu conteúdo.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo Processo</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="titulo">Título do Processo</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Processo de Controle de Qualidade"
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
              Registrar Processo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Revisar Processo</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {selectedItem && (
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold">{selectedItem.titulo}</h4>
                <p className="text-sm text-gray-600">Versão: {selectedItem.versao}</p>
              </div>
            )}

            <div>
              <Label>Decisão</Label>
              <div className="flex space-x-4 mt-2">
                <Button
                  variant={reviewDecision === "aprovado" ? "default" : "outline"}
                  onClick={() => setReviewDecision("aprovado")}
                  className="flex-1"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Aprovar
                </Button>
                <Button
                  variant={reviewDecision === "reprovado" ? "destructive" : "outline"}
                  onClick={() => setReviewDecision("reprovado")}
                  className="flex-1"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reprovar
                </Button>
              </div>
            </div>

            {reviewDecision === "reprovado" && (
              <div>
                <Label htmlFor="motivo">Motivo da Reprovação</Label>
                <Textarea
                  id="motivo"
                  value={motivo}
                  onChange={(e) => setMotivo(e.target.value)}
                  placeholder="Descreva o motivo da reprovação..."
                  rows={3}
                />
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={submitReview}>
              Confirmar Revisão
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Modal */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Visualizar Processo</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Título</Label>
                  <p className="text-sm">{selectedItem.titulo}</p>
                </div>
                <div>
                  <Label>Versão</Label>
                  <p className="text-sm">{selectedItem.versao}</p>
                </div>
              </div>
              
              <div>
                <Label>Status</Label>
                <div className="mt-1">
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>

              {selectedItem.motivo && (
                <div>
                  <Label>Motivo</Label>
                  <p className="text-sm bg-red-50 p-2 rounded">{selectedItem.motivo}</p>
                </div>
              )}

              <div className="flex justify-center pt-4">
                <Button variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  Visualizar PDF
                </Button>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setViewOpen(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
