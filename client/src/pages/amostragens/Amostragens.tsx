import { useState } from "react";
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
import { Plus, Minus, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AmostragemItem {
  id: string;
  nome: string;
  quantidadeAprovada: number;
}

interface Amostragem {
  id: string;
  numeroNf: string;
  status: "aprovado" | "nao-aprovado" | "aprovado-parcialmente";
  itens: AmostragemItem[];
  anexoPdf?: string;
  createdAt: string;
}

export default function Amostragens() {
  const [formOpen, setFormOpen] = useState(false);
  const [numeroNf, setNumeroNf] = useState("");
  const [status, setStatus] = useState<"aprovado" | "nao-aprovado" | "aprovado-parcialmente">("aprovado");
  const [itens, setItens] = useState<Omit<AmostragemItem, "id">[]>([
    { nome: "", quantidadeAprovada: 0 }
  ]);
  const [anexo, setAnexo] = useState<File[]>([]);

  const { toast } = useToast();

  // Mock data - would come from API
  const amostragens: Amostragem[] = [];

  const handleAddItem = () => {
    setItens([...itens, { nome: "", quantidadeAprovada: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (itens.length > 1) {
      setItens(itens.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (index: number, field: keyof Omit<AmostragemItem, "id">, value: any) => {
    const newItens = [...itens];
    newItens[index] = { ...newItens[index], [field]: value };
    setItens(newItens);
  };

  const handleSubmit = () => {
    if (!numeroNf.trim()) {
      toast({ title: "Número da NF é obrigatório", variant: "destructive" });
      return;
    }

    if (itens.some(item => !item.nome.trim())) {
      toast({ title: "Todos os itens devem ter nome", variant: "destructive" });
      return;
    }

    // TODO: Submit to API
    toast({ title: "Amostragem registrada com sucesso!" });
    resetForm();
  };

  const resetForm = () => {
    setFormOpen(false);
    setNumeroNf("");
    setStatus("aprovado");
    setItens([{ nome: "", quantidadeAprovada: 0 }]);
    setAnexo([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="status-badge success">Aprovado</Badge>;
      case "nao-aprovado":
        return <Badge className="status-badge error">Não Aprovado</Badge>;
      case "aprovado-parcialmente":
        return <Badge className="status-badge warning">Aprovado Parcialmente</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const columns = [
    {
      key: "numeroNf" as keyof Amostragem,
      header: "Número da NF",
    },
    {
      key: "status" as keyof Amostragem,
      header: "Status",
      render: (status: string) => getStatusBadge(status),
    },
    {
      key: "itens" as keyof Amostragem,
      header: "Itens",
      render: (itens: AmostragemItem[]) => (
        <div>
          <p className="text-sm font-medium">{itens.length} item(s)</p>
          <p className="text-xs text-gray-500">
            Total aprovado: {itens.reduce((sum, item) => sum + item.quantidadeAprovada, 0)}
          </p>
        </div>
      ),
    },
    {
      key: "anexoPdf" as keyof Amostragem,
      header: "Anexo",
      render: (anexo: string) => annexo ? (
        <FileText className="h-4 w-4 text-blue-600" />
      ) : (
        <span className="text-gray-400">-</span>
      ),
    },
    {
      key: "createdAt" as keyof Amostragem,
      header: "Data",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Amostragens</h2>
        <p className="text-gray-600">Gerenciamento de amostragens de produtos</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Registro de Amostragens</CardTitle>
            <Button onClick={() => setFormOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Amostragem
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={amostragens}
            columns={columns}
            searchKey="numeroNf"
            onExport={() => toast({ title: "Exportação em desenvolvimento" })}
            emptyMessage="Nenhuma amostragem registrada"
          />
        </CardContent>
      </Card>

      {/* Form Modal */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Amostragem</DialogTitle>
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
              <Label htmlFor="status">Status da Amostragem</Label>
              <Select value={status} onValueChange={(value: any) => setStatus(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="aprovado">Aprovado</SelectItem>
                  <SelectItem value="nao-aprovado">Não Aprovado</SelectItem>
                  <SelectItem value="aprovado-parcialmente">Aprovado Parcialmente</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-4">
                <Label>Itens da Amostragem</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Item
                </Button>
              </div>

              <div className="space-y-4">
                {itens.map((item, index) => (
                  <div key={index} className="flex gap-4 items-end">
                    <div className="flex-2">
                      <Label htmlFor={`item-${index}`}>Item {index + 1}</Label>
                      <Input
                        id={`item-${index}`}
                        value={item.nome}
                        onChange={(e) => handleItemChange(index, "nome", e.target.value)}
                        placeholder="Nome do item"
                      />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={`quantidade-${index}`}>Quantidade Aprovada</Label>
                      <Input
                        id={`quantidade-${index}`}
                        type="number"
                        value={item.quantidadeAprovada}
                        onChange={(e) => handleItemChange(index, "quantidadeAprovada", parseInt(e.target.value) || 0)}
                        placeholder="0"
                      />
                    </div>
                    {itens.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={resetForm}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Registrar Amostragem
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
