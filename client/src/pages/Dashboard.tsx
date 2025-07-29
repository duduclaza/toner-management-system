import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart } from "@/components/charts/BarChart";
import { TrendingUp, TrendingDown, DollarSign, Shield, RotateCcw, Package } from "lucide-react";
import type { DashboardStats, Activity, Alert } from "@/types";
import type { Filial } from "@shared/schema";

// Mock data - would come from API in real app
const stats: DashboardStats = {
  totalToners: 2847,
  emGarantia: 156,
  retornados: 89,
  valorRecuperado: 48500,
};

const recentActivities: Activity[] = [
  {
    id: "1",
    type: "success",
    message: "Toner HP 85A enviado para garantia",
    timestamp: "há 2 horas",
  },
  {
    id: "2",
    type: "warning",
    message: "Certificado ISO atualizado",
    timestamp: "há 4 horas",
  },
  {
    id: "3",
    type: "info",
    message: "Novo POP/IT aprovado",
    timestamp: "há 6 horas",
  },
];

const pendingAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    message: "5 toners aguardando homologação",
  },
  {
    id: "2",
    type: "error",
    message: "3 garantias vencendo em 7 dias",
  },
  {
    id: "3",
    type: "info",
    message: "2 certificados para renovar",
  },
];

export default function Dashboard() {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedFilial, setSelectedFilial] = useState("all");

  // Query for filiais
  const { data: filiais = [] } = useQuery<Filial[]>({
    queryKey: ["/api/filiais"],
  });

  // Mock data for charts - would come from API with filters
  const retornadosPorMes = [
    { name: "Jan", retornados: 12, garantias: 8 },
    { name: "Fev", retornados: 19, garantias: 15 },
    { name: "Mar", retornados: 25, garantias: 12 },
    { name: "Abr", retornados: 18, garantias: 20 },
    { name: "Mai", retornados: 32, garantias: 25 },
    { name: "Jun", retornados: 28, garantias: 18 },
  ];

  const garantiasPorFornecedor = [
    { name: "HP", garantias: 45, valor: 12500 },
    { name: "Canon", garantias: 32, valor: 8900 },
    { name: "Epson", garantias: 28, valor: 7200 },
    { name: "Brother", garantias: 15, valor: 4100 },
    { name: "Samsung", garantias: 12, valor: 3200 },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do sistema</p>
      </div>

      {/* Filters */}
      <div className="flex space-x-4">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Ano</label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2025">2025</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1 block">Filial</label>
          <Select value={selectedFilial} onValueChange={setSelectedFilial}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as Filiais</SelectItem>
              {filiais.map((filial) => (
                <SelectItem key={filial.id} value={filial.id}>
                  {filial.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Toners</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalToners.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 text-sm font-medium">+12%</span>
              <span className="text-gray-500 text-sm ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Em Garantia</p>
                <p className="text-3xl font-bold text-gray-900">{stats.emGarantia}</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Shield className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
              <span className="text-red-600 text-sm font-medium">-5%</span>
              <span className="text-gray-500 text-sm ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Retornados</p>
                <p className="text-3xl font-bold text-gray-900">{stats.retornados}</p>
              </div>
              <div className="p-3 bg-cyan-100 rounded-full">
                <RotateCcw className="h-6 w-6 text-cyan-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 text-sm font-medium">+8%</span>
              <span className="text-gray-500 text-sm ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Valor Recuperado</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {(stats.valorRecuperado / 1000).toFixed(1)}k
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="flex items-center mt-4">
              <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
              <span className="text-green-600 text-sm font-medium">+15%</span>
              <span className="text-gray-500 text-sm ml-2">vs mês anterior</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Returns and Warranties by Month */}
        <Card>
          <CardHeader>
            <CardTitle>Retornados e Garantias por Mês ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={retornadosPorMes}
              dataKeys={[
                { key: "retornados", name: "Retornados", color: "#06b6d4" },
                { key: "garantias", name: "Garantias", color: "#f59e0b" }
              ]}
              height={300}
            />
          </CardContent>
        </Card>

        {/* Warranties by Supplier */}
        <Card>
          <CardHeader>
            <CardTitle>Garantias por Fornecedor ({selectedYear})</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart
              data={garantiasPorFornecedor}
              dataKeys={[
                { key: "garantias", name: "Quantidade", color: "#10b981" },
                { key: "valor", name: "Valor (R$)", color: "#3b82f6" }
              ]}
              height={300}
            />
          </CardContent>
        </Card>
      </div>

      {/* Activity and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.message}
                    </p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Alertas Pendentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {pendingAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border-l-4 ${
                    alert.type === "warning"
                      ? "bg-yellow-50 border-yellow-400"
                      : alert.type === "error"
                      ? "bg-red-50 border-red-400"
                      : "bg-blue-50 border-blue-400"
                  }`}
                >
                  <p
                    className={`text-sm font-medium ${
                      alert.type === "warning"
                        ? "text-yellow-800"
                        : alert.type === "error"
                        ? "text-red-800"
                        : "text-blue-800"
                    }`}
                  >
                    {alert.message}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
