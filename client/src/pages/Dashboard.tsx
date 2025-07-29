import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Shield, RotateCcw, Package } from "lucide-react";
import type { DashboardStats, Activity, Alert } from "@/types";

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
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Dashboard</h2>
        <p className="text-gray-600">Visão geral do sistema</p>
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
