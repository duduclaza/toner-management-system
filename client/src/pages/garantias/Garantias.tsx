import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { GarantiaForm } from "@/components/forms/GarantiaForm";
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
import { Plus, Eye, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Garantia, Fornecedor, StatusGarantia } from "@shared/schema";

export default function Garantias() {
  const [garantiaFormOpen, setGarantiaFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<Garantia | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: garantias = [], isLoading } = useQuery<Garantia[]>({
    queryKey: ["/api/garantias"],
  });

  const { data: fornecedores = [] } = useQuery<Fornecedor[]>({
    queryKey: ["/api/fornecedores"],
  });

  const { data: statusList = [] } = useQuery<StatusGarantia[]>({
    queryKey: ["/api/status-garantia"],
  });

  // Mutations
  const createGarantiaMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/garantias", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/garantias"] });
      toast({ title: "Garantia registrada com sucesso!" });
      setGarantiaFormOpen(false);
    },
    onError: () => {
      toast({ title: "Erro ao registrar garantia", variant: "destructive" });
    },
  });

  const deleteGarantiaMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/garantias/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/garantias"] });
      toast({ title: "Garantia excluída com sucesso!" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir garantia", variant: "destructive" });
    },
  });

  // Handlers
  const handleGarantiaSubmit = (data: any) => {
    createGarantiaMutation.mutate(data);
  };

  const handleDelete = (garantia: Garantia) => {
    setItemToDelete(garantia);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteGarantiaMutation.mutate(itemToDelete.id);
    }
  };

  const handleView = (garantia: Garantia) => {
    // TODO: Implement view modal
    toast({ title: "Visualização em desenvolvimento" });
  };

  const handleEdit = (garantia: Garantia) => {
    // TODO: Implement edit functionality
    toast({ title: "Edição em desenvolvimento" });
  };

  const handleExport = () => {
    // TODO: Implement export functionality
    toast({ title: "Exportação em desenvolvimento" });
  };

  // Get fornecedor name by ID
  const getFornecedorName = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    return fornecedor?.nome || "N/A";
  };

  // Get status name by ID
  const getStatusName = (statusId: string) => {
    const status = statusList.find(s => s.id === statusId);
    return status?.status || "N/A";
  };

  // Get status badge class
  const getStatusBadgeClass = (statusId: string) => {
    const status = statusList.find(s => s.id === statusId);
    if (!status) return "status-badge";
    
    const statusName = status.status.toLowerCase();
    if (statusName.includes("concluído") || statusName.includes("finalizado")) {
      return "status-badge success";
    } else if (statusName.includes("processo") || statusName.includes("andamento")) {
      return "status-badge warning";
    } else {
      return "status-badge info";
    }
  };

  // Calculate total value for items
  const calculateTotalValue = (itens: any[]) => {
    return itens.reduce((total, item) => total + item.valorTotal, 0);
  };

  // Table columns
  const columns = [
    {
      key: "itens" as keyof Garantia,
      header: "Itens",
      render: (itens: any[]) => (
        <div>
          <p className="text-sm font-medium text-gray-900">
            {itens.reduce((total, item) => total + item.quantidade, 0)} item(s)
          </p>
          <p className="text-sm text-gray-500">
            {itens[0]?.descricao || "Sem descrição"}
          </p>
        </div>
      ),
    },
    {
      key: "fornecedorId" as keyof Garantia,
      header: "Fornecedor",
      render: (fornecedorId: string) => getFornecedorName(fornecedorId),
    },
    {
      key: "statusId" as keyof Garantia,
      header: "Status",
      render: (statusId: string) => (
        <Badge className={getStatusBadgeClass(statusId)}>
          {getStatusName(statusId)}
        </Badge>
      ),
    },
    {
      key: "itens" as keyof Garantia,
      header: "Valor Total",
      render: (itens: any[]) => (
        `R$ ${calculateTotalValue(itens).toFixed(2)}`
      ),
    },
    {
      key: "createdAt" as keyof Garantia,
      header: "Data",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  // Filter garantias
  const filteredGarantias = garantias.filter(garantia => {
    const matchesSearch = searchTerm === "" || 
      getFornecedorName(garantia.fornecedorId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      garantia.nfCompras.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (garantia.ticketFornecedor && garantia.ticketFornecedor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === "" || garantia.statusId === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Garantias</h2>
        <p className="text-gray-600">Gerenciamento de garantias de toners</p>
      </div>

      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Registro de Garantia</h3>
            <Button onClick={() => setGarantiaFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Garantia
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por fornecedor, NF ou ticket..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos os status</SelectItem>
                {statusList.map((status) => (
                  <SelectItem key={status.id} value={status.id}>
                    {status.status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable
              data={filteredGarantias}
              columns={columns}
              onExport={handleExport}
              emptyMessage="Nenhuma garantia encontrada"
            />
          )}
        </div>
      </Card>

      {/* Garantia Form */}
      <GarantiaForm
        isOpen={garantiaFormOpen}
        onClose={() => setGarantiaFormOpen(false)}
        onSubmit={handleGarantiaSubmit}
        isLoading={createGarantiaMutation.isPending}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta garantia? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
              disabled={deleteGarantiaMutation.isPending}
            >
              {deleteGarantiaMutation.isPending ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
