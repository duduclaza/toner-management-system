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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, FileText, CheckCircle, XCircle, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PopIt {
  id: string;
  titulo: string;
  versao: string;
  status: "pendente" | "aprovado" | "reprovado";
  motivo?: string;
  anexoPdf?: string;
  createdAt: string;
}

export default function PopIt() {
  const [activeTab, setActiveTab] = useState("registro");
  const [formOpen, setFormOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PopIt | null>(null);
  const [titulo, setTitulo] = useState("");
  const [anexo, setAnexo] = useState<File[]>([]);
  const [reviewDecision, setReviewDecision] = useState<"aprovado" | "reprovado">("aprovado");
  const [motivo, setMotivo] = useState("");

  const { toast } = useToast();

  // Mock data - would come from API
  const popItPendentes: PopIt[] = [];
  const popItAprovados: PopIt[] = [];

  const handleSubmit = () => {
    if (!titulo.trim()) {
      toast({ title: "Título é obrigatório", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "POP/IT registrado com sucesso!" });
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setTitulo("");
    setAnexo([]);
  };

  const handleReview = (item: PopIt) => {
    setSelectedItem(item);
    setReviewOpen(true);
  };

  const handleView = (item: PopIt) => {
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
      title: `POP/IT ${reviewDecision === "aprovado" ? "aprovado" : "reprovado"} com sucesso!` 
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
      key: "titulo" as keyof PopIt,
      header: "Título",
    },
    {
      key: "versao" as keyof PopIt,
      header: "Versão",
    },
    {
      key: "status" as keyof PopIt,
      header: "Status",
      render: (status: string) => getStatusBadge(status),
    },
    {
      key: "anexoPdf" as keyof PopIt,
      header: "Anexo",
      render: (anexo: string) => anexo ? (
        <FileText className="h-4 w-4 text-blue-600" />
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: "createdAt" as keyof PopIt,
      header: "Data",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">POP/IT</h2>
        <p className="text-gray-600">Gerenciamento de Procedimentos Operacionais Padrão e Instruções de Trabalho</p>
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
              <h3 className="text-lg font-semibold">Registro de POP/IT</h3>
              <Button onClick={() => setFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo POP/IT
              </Button>
            </div>
            <p className="text-gray-600">
              Registre novos Procedimentos Operacionais Padrão e Instruções de Trabalho.
              Após o registro, o documento ficará pendente de revisão antes da aprovação.
            </p>
          </TabsContent>

          <TabsContent value="pendentes" className="p-6">
            <DataTable
              data={popItPendentes}
              columns={[
                ...baseColumns,
                {
                  key: "id" as keyof PopIt,
                  header: "Ações",
                  render: (_, item: PopIt) => (
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
              emptyMessage="Nenhum POP/IT pendente de revisão"
            />
          </TabsContent>

          <TabsContent value="aprovados" className="p-6">
            <DataTable
              data={popItAprovados}
              columns={baseColumns}
              searchKey="titulo"
              emptyMessage="Nenhum POP/IT aprovado"
            />
          </TabsContent>

          <TabsContent value="visualizacao" className="p-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Visualização de POP/IT
              </h3>
              <p className="text-gray-600">
                Selecione um POP/IT aprovado para visualizar seu conteúdo.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Novo POP/IT</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div>
              <Label htmlFor="titulo">Título do POP/IT</Label>
              <Input
                id="titulo"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Ex: Procedimento de Limpeza de Equipamentos"
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
              Registrar POP/IT
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Review Modal */}
      <Dialog open={reviewOpen} onOpenChange={setReviewOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Revisar POP/IT</DialogTitle>
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
            <DialogTitle>Visualizar POP/IT</DialogTitle>
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
