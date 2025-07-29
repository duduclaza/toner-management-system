import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { TonerForm } from "@/components/forms/TonerForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, Trash2 } from "lucide-react";
import type { Toner, StatusGarantia, StatusHomologacao, Fornecedor } from "@shared/schema";

export default function CadastrosGerais() {
  const [activeTab, setActiveTab] = useState("toners");
  const [tonerFormOpen, setTonerFormOpen] = useState(false);
  const [editingToner, setEditingToner] = useState<Toner | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [statusFormOpen, setStatusFormOpen] = useState(false);
  const [fornecedorFormOpen, setFornecedorFormOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [newFornecedor, setNewFornecedor] = useState({ nome: "", telefone: "", linkRma: "" });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: toners = [], isLoading: tonersLoading } = useQuery<Toner[]>({
    queryKey: ["/api/toners"],
  });

  const { data: statusGarantia = [], isLoading: statusGarantiaLoading } = useQuery<StatusGarantia[]>({
    queryKey: ["/api/status-garantia"],
  });

  const { data: statusHomologacao = [], isLoading: statusHomologacaoLoading } = useQuery<StatusHomologacao[]>({
    queryKey: ["/api/status-homologacao"],
  });

  const { data: fornecedores = [], isLoading: fornecedoresLoading } = useQuery<Fornecedor[]>({
    queryKey: ["/api/fornecedores"],
  });

  // Mutations
  const createTonerMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/toners", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toners"] });
      toast({ title: "Toner criado com sucesso!" });
      setTonerFormOpen(false);
    },
    onError: () => {
      toast({ title: "Erro ao criar toner", variant: "destructive" });
    },
  });

  const updateTonerMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest("PUT", `/api/toners/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toners"] });
      toast({ title: "Toner atualizado com sucesso!" });
      setTonerFormOpen(false);
      setEditingToner(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar toner", variant: "destructive" });
    },
  });

  const deleteTonerMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/toners/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/toners"] });
      toast({ title: "Toner excluído com sucesso!" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir toner", variant: "destructive" });
    },
  });

  const createStatusGarantiaMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/status-garantia", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/status-garantia"] });
      toast({ title: "Status criado com sucesso!" });
      setStatusFormOpen(false);
      setNewStatus("");
    },
  });

  const createFornecedorMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/fornecedores", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/fornecedores"] });
      toast({ title: "Fornecedor criado com sucesso!" });
      setFornecedorFormOpen(false);
      setNewFornecedor({ nome: "", telefone: "", linkRma: "" });
    },
  });

  // Handlers
  const handleTonerSubmit = (data: any) => {
    if (editingToner) {
      updateTonerMutation.mutate({ id: editingToner.id, data });
    } else {
      createTonerMutation.mutate(data);
    }
  };

  const handleDeleteToner = (toner: Toner) => {
    setItemToDelete(toner);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteTonerMutation.mutate(itemToDelete.id);
    }
  };

  const handleEditToner = (toner: Toner) => {
    setEditingToner(toner);
    setTonerFormOpen(true);
  };

  const handleAddToner = () => {
    setEditingToner(null);
    setTonerFormOpen(true);
  };

  const handleStatusSubmit = () => {
    if (newStatus.trim()) {
      createStatusGarantiaMutation.mutate({ status: newStatus });
    }
  };

  const handleFornecedorSubmit = () => {
    if (newFornecedor.nome.trim()) {
      createFornecedorMutation.mutate(newFornecedor);
    }
  };

  // Table columns
  const tonerColumns = [
    {
      key: "modelo" as keyof Toner,
      header: "Modelo",
    },
    {
      key: "cor" as keyof Toner,
      header: "Cor",
      render: (value: string) => (
        <Badge variant="outline" className="capitalize">
          {value}
        </Badge>
      ),
    },
    {
      key: "tipo" as keyof Toner,
      header: "Tipo",
    },
    {
      key: "capacidade" as keyof Toner,
      header: "Capacidade",
      render: (value: number) => `${value} folhas`,
    },
    {
      key: "preco" as keyof Toner,
      header: "Preço",
      render: (value: number) => `R$ ${value.toFixed(2)}`,
    },
  ];

  const fornecedorColumns = [
    {
      key: "nome" as keyof Fornecedor,
      header: "Nome",
    },
    {
      key: "telefone" as keyof Fornecedor,
      header: "Telefone",
    },
    {
      key: "linkRma" as keyof Fornecedor,
      header: "Link RMA",
      render: (value: string) => value ? (
        <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {value}
        </a>
      ) : "-",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Cadastros Gerais</h2>
        <p className="text-gray-600">Gerenciamento de toners, status e fornecedores</p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="toners">Toners</TabsTrigger>
              <TabsTrigger value="status-garantia">Status de Garantia</TabsTrigger>
              <TabsTrigger value="status-homologacao">Status de Homologação</TabsTrigger>
              <TabsTrigger value="fornecedores">Fornecedores</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="toners" className="p-6">
            <DataTable
              data={toners}
              columns={tonerColumns}
              searchKey="modelo"
              onAdd={handleAddToner}
              onEdit={handleEditToner}
              onDelete={handleDeleteToner}
              addLabel="Novo Toner"
              emptyMessage="Nenhum toner cadastrado"
            />
          </TabsContent>

          <TabsContent value="status-garantia" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Status de Garantia</h3>
              <Button onClick={() => setStatusFormOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Status
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {statusGarantia.map((status) => (
                <Card key={status.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{status.status}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="status-homologacao" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Status de Homologação</h3>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Status
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {statusHomologacao.map((status) => (
                <Card key={status.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{status.status}</span>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="fornecedores" className="p-6">
            <DataTable
              data={fornecedores}
              columns={fornecedorColumns}
              searchKey="nome"
              onAdd={() => setFornecedorFormOpen(true)}
              addLabel="Novo Fornecedor"
              emptyMessage="Nenhum fornecedor cadastrado"
            />
          </TabsContent>
        </Tabs>
      </Card>

      {/* Toner Form */}
      <TonerForm
        isOpen={tonerFormOpen}
        onClose={() => {
          setTonerFormOpen(false);
          setEditingToner(null);
        }}
        onSubmit={handleTonerSubmit}
        toner={editingToner}
        isLoading={createTonerMutation.isPending || updateTonerMutation.isPending}
      />

      {/* Status Form */}
      <Dialog open={statusFormOpen} onOpenChange={setStatusFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Status de Garantia</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Input
                id="status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                placeholder="Digite o status..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStatusFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleStatusSubmit} disabled={createStatusGarantiaMutation.isPending}>
              Criar Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Fornecedor Form */}
      <Dialog open={fornecedorFormOpen} onOpenChange={setFornecedorFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Fornecedor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={newFornecedor.nome}
                onChange={(e) => setNewFornecedor(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Nome do fornecedor"
              />
            </div>
            <div>
              <Label htmlFor="telefone">Telefone</Label>
              <Input
                id="telefone"
                value={newFornecedor.telefone}
                onChange={(e) => setNewFornecedor(prev => ({ ...prev, telefone: e.target.value }))}
                placeholder="(11) 1234-5678"
              />
            </div>
            <div>
              <Label htmlFor="linkRma">Link RMA</Label>
              <Input
                id="linkRma"
                value={newFornecedor.linkRma}
                onChange={(e) => setNewFornecedor(prev => ({ ...prev, linkRma: e.target.value }))}
                placeholder="https://..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFornecedorFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFornecedorSubmit} disabled={createFornecedorMutation.isPending}>
              Criar Fornecedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
