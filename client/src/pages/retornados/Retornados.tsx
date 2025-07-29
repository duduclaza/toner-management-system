import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Trash2, Package, Shield, Building, Download } from "lucide-react";
import { calculateGramatura, calculateValorRecuperado } from "@/lib/calculations";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Toner, Filial, GramaturaCalculation, RetornadoDestination } from "@/types";

export default function Retornados() {
  const [selectedToner, setSelectedToner] = useState<Toner | null>(null);
  const [codigoCliente, setCodigoCliente] = useState("");
  const [filialSelecionada, setFilialSelecionada] = useState("");
  const [pesoRetornado, setPesoRetornado] = useState("");
  const [calculation, setCalculation] = useState<GramaturaCalculation | null>(null);
  const [selectedDestino, setSelectedDestino] = useState<string>("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Queries
  const { data: toners = [] } = useQuery<Toner[]>({
    queryKey: ["/api/toners"],
  });

  const { data: filiais = [] } = useQuery<Filial[]>({
    queryKey: ["/api/filiais"],
  });

  const { data: retornados = [] } = useQuery({
    queryKey: ["/api/retornados"],
  });

  // Mutation
  const createRetornadoMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/retornados", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/retornados"] });
      toast({ title: "Toner registrado com sucesso!" });
      resetForm();
    },
    onError: () => {
      toast({ title: "Erro ao registrar toner", variant: "destructive" });
    },
  });

  const destinations: RetornadoDestination[] = [
    { id: "descarte", label: "Descarte", icon: "trash-2", color: "text-red-600" },
    { id: "estoque", label: "Estoque", icon: "package", color: "text-green-600" },
    { id: "garantia", label: "Garantia", icon: "shield", color: "text-yellow-600" },
    { id: "uso-interno", label: "Uso Interno", icon: "building", color: "text-blue-600" },
  ];

  const handleTonerChange = (tonerId: string) => {
    const toner = toners.find(t => t.id === tonerId);
    setSelectedToner(toner || null);
    setCalculation(null);
    setSelectedDestino("");
  };

  const handlePesoChange = (peso: string) => {
    setPesoRetornado(peso);
    
    if (selectedToner && peso) {
      const pesoNum = parseFloat(peso);
      if (!isNaN(pesoNum)) {
        const calc = calculateGramatura(
          pesoNum,
          selectedToner.pesovazio,
          selectedToner.gramatura
        );
        setCalculation(calc);
        setSelectedDestino("");
      }
    } else {
      setCalculation(null);
      setSelectedDestino("");
    }
  };

  const handleDestinoSelect = (destino: string) => {
    setSelectedDestino(destino);
  };

  const handleRegistrar = () => {
    if (!selectedToner || !calculation || !selectedDestino || !codigoCliente || !filialSelecionada) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    let valorRecuperado = 0;
    if (selectedDestino === "estoque") {
      valorRecuperado = calculateValorRecuperado(
        calculation.percentual,
        selectedToner.capacidade,
        selectedToner.precoFolha
      );
    }

    const data = {
      modeloId: selectedToner.id,
      codigoCliente,
      filial: filialSelecionada,
      pesoRetornado: parseFloat(pesoRetornado),
      gramaturaPresente: calculation.gramaturaPresente,
      percentualGramatura: calculation.percentual,
      destino: selectedDestino,
      valorRecuperado,
    };

    createRetornadoMutation.mutate(data);
  };

  const resetForm = () => {
    setSelectedToner(null);
    setCodigoCliente("");
    setFilialSelecionada("");
    setPesoRetornado("");
    setCalculation(null);
    setSelectedDestino("");
  };

  const getDestinationIcon = (iconName: string) => {
    switch (iconName) {
      case "trash-2": return <Trash2 className="h-6 w-6" />;
      case "package": return <Package className="h-6 w-6" />;
      case "shield": return <Shield className="h-6 w-6" />;
      case "building": return <Building className="h-6 w-6" />;
      default: return null;
    }
  };

  const getStatusBadgeClass = (destino: string) => {
    switch (destino) {
      case "descarte": return "status-badge error";
      case "estoque": return "status-badge success";
      case "garantia": return "status-badge warning";
      case "uso-interno": return "status-badge info";
      default: return "status-badge";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Retornados</h2>
        <p className="text-gray-600">Análise e processamento de toners retornados</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Formulário de Análise */}
        <Card>
          <CardHeader>
            <CardTitle>Análise de Retornado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="toner">Modelo do Toner</Label>
              <Select onValueChange={handleTonerChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um modelo..." />
                </SelectTrigger>
                <SelectContent>
                  {toners.map((toner) => (
                    <SelectItem key={toner.id} value={toner.id}>
                      {toner.modelo} (Peso Vazio: {toner.pesovazio}g, Gramatura: {toner.gramatura}g)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cliente">Código do Cliente</Label>
                <Input
                  id="cliente"
                  value={codigoCliente}
                  onChange={(e) => setCodigoCliente(e.target.value)}
                  placeholder="Ex: CLI001"
                />
              </div>
              <div>
                <Label htmlFor="filial">Filial</Label>
                <Select onValueChange={setFilialSelecionada}>
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
            </div>

            <div>
              <Label htmlFor="peso">Peso do Retornado (gramas)</Label>
              <Input
                id="peso"
                type="number"
                value={pesoRetornado}
                onChange={(e) => handlePesoChange(e.target.value)}
                placeholder="Ex: 890"
              />
            </div>

            {/* Resultado do Cálculo */}
            {calculation && (
              <Card className="bg-blue-50 border border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900 text-lg">Resultado da Análise</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><span className="font-medium">Gramatura Presente:</span> {calculation.gramaturaPresente}g</p>
                  <p><span className="font-medium">Percentual:</span> <span className="font-bold">{calculation.percentual}%</span></p>
                  <div className={`mt-3 p-3 rounded-md font-medium border ${calculation.className}`}>
                    {calculation.orientacao}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Botões de Destino */}
            {calculation && (
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-3 block">
                  Selecione o Destino:
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {destinations.map((destination) => (
                    <Button
                      key={destination.id}
                      type="button"
                      variant="outline"
                      onClick={() => handleDestinoSelect(destination.id)}
                      className={`p-4 h-auto flex flex-col items-center space-y-2 transition-colors ${
                        selectedDestino === destination.id
                          ? "border-primary bg-primary/10"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <span className={destination.color}>
                        {getDestinationIcon(destination.icon)}
                      </span>
                      <span className="text-sm font-medium">{destination.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {selectedDestino && (
              <Button 
                onClick={handleRegistrar}
                className="w-full"
                disabled={createRetornadoMutation.isPending}
              >
                {createRetornadoMutation.isPending ? "Registrando..." : "Registrar Toner"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Histórico Recente */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Histórico Recente</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {retornados.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  Nenhum retornado processado ainda
                </p>
              ) : (
                retornados.slice(0, 5).map((retornado: any) => (
                  <div key={retornado.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {selectedToner?.modelo || "Modelo"}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cliente: {retornado.codigoCliente} - {retornado.filial}
                        </p>
                      </div>
                      <Badge className={getStatusBadgeClass(retornado.destino)}>
                        {retornado.destino}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>
                        Gramatura: {retornado.percentualGramatura}%
                        {retornado.valorRecuperado && (
                          <span> | Valor Recuperado: R$ {retornado.valorRecuperado.toFixed(2)}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Processado em: {new Date(retornado.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
