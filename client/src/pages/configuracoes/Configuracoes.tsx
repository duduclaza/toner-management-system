import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/ui/data-table";
import { UserForm } from "@/components/forms/UserForm";
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
import { 
  Plus, 
  Edit, 
  Trash2, 
  Settings, 
  Users, 
  Building, 
  Mail, 
  Server,
  Shield
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { hasPermission } from "@/lib/auth";
import type { User, Filial, Setor } from "@shared/schema";

interface SMTPConfig {
  provider: "microsoft" | "gmail" | "custom";
  host: string;
  port: number;
  username: string;
  password: string;
  useTLS: boolean;
}

export default function Configuracoes() {
  const [activeTab, setActiveTab] = useState("usuarios");
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [filialFormOpen, setFilialFormOpen] = useState(false);
  const [setorFormOpen, setSetorFormOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<any>(null);
  const [newFilial, setNewFilial] = useState("");
  const [newSetor, setNewSetor] = useState("");
  
  // SMTP Configuration State
  const [smtpProvider, setSMTPProvider] = useState<"microsoft" | "gmail" | "custom">("gmail");
  const [smtpHost, setSMTPHost] = useState("");
  const [smtpPort, setSMTPPort] = useState(587);
  const [smtpUsername, setSMTPUsername] = useState("");
  const [smtpPassword, setSMTPPassword] = useState("");
  const [smtpUseTLS, setSMTPUseTLS] = useState(true);

  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Check permissions
  const canManageUsers = hasPermission(user, "create") && hasPermission(user, "update");
  const canDeleteUsers = hasPermission(user, "delete");

  // Queries
  const { data: users = [], isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const { data: filiais = [], isLoading: filiaisLoading } = useQuery<Filial[]>({
    queryKey: ["/api/filiais"],
  });

  const { data: setores = [], isLoading: setoresLoading } = useQuery<Setor[]>({
    queryKey: ["/api/setores"],
  });

  // User Mutations
  const createUserMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/users", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Usuário criado com sucesso!" });
      setUserFormOpen(false);
    },
    onError: () => {
      toast({ title: "Erro ao criar usuário", variant: "destructive" });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      apiRequest("PUT", `/api/users/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Usuário atualizado com sucesso!" });
      setUserFormOpen(false);
      setEditingUser(null);
    },
    onError: () => {
      toast({ title: "Erro ao atualizar usuário", variant: "destructive" });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/users/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      toast({ title: "Usuário excluído com sucesso!" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
    onError: () => {
      toast({ title: "Erro ao excluir usuário", variant: "destructive" });
    },
  });

  // Filial Mutations
  const createFilialMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/filiais", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/filiais"] });
      toast({ title: "Filial criada com sucesso!" });
      setFilialFormOpen(false);
      setNewFilial("");
    },
  });

  const deleteFilialMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/filiais/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/filiais"] });
      toast({ title: "Filial excluída com sucesso!" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
  });

  // Setor Mutations
  const createSetorMutation = useMutation({
    mutationFn: (data: any) => apiRequest("POST", "/api/setores", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/setores"] });
      toast({ title: "Setor criado com sucesso!" });
      setSetorFormOpen(false);
      setNewSetor("");
    },
  });

  const deleteSetorMutation = useMutation({
    mutationFn: (id: string) => apiRequest("DELETE", `/api/setores/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/setores"] });
      toast({ title: "Setor excluído com sucesso!" });
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    },
  });

  // Handlers
  const handleUserSubmit = (data: any) => {
    if (editingUser) {
      updateUserMutation.mutate({ id: editingUser.id, data });
    } else {
      createUserMutation.mutate(data);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setUserFormOpen(true);
  };

  const handleDeleteUser = (user: User) => {
    setItemToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleFilialSubmit = () => {
    if (newFilial.trim()) {
      createFilialMutation.mutate({ nome: newFilial });
    }
  };

  const handleSetorSubmit = () => {
    if (newSetor.trim()) {
      createSetorMutation.mutate({ nome: newSetor });
    }
  };

  const confirmDelete = () => {
    if (!itemToDelete) return;

    if (itemToDelete.email) {
      // It's a user
      deleteUserMutation.mutate(itemToDelete.id);
    } else if (itemToDelete.nome && filiais.some(f => f.id === itemToDelete.id)) {
      // It's a filial
      deleteFilialMutation.mutate(itemToDelete.id);
    } else {
      // It's a setor
      deleteSetorMutation.mutate(itemToDelete.id);
    }
  };

  const handleSMTPProviderChange = (provider: "microsoft" | "gmail" | "custom") => {
    setSMTPProvider(provider);
    
    // Pre-fill common configurations
    switch (provider) {
      case "microsoft":
        setSMTPHost("smtp.office365.com");
        setSMTPPort(587);
        setSMTPUseTLS(true);
        break;
      case "gmail":
        setSMTPHost("smtp.gmail.com");
        setSMTPPort(587);
        setSMTPUseTLS(true);
        break;
      case "custom":
        setSMTPHost("");
        setSMTPPort(587);
        setSMTPUseTLS(true);
        break;
    }
  };

  const handleSMTPSubmit = () => {
    if (!smtpHost || !smtpUsername || !smtpPassword) {
      toast({ title: "Preencha todos os campos obrigatórios", variant: "destructive" });
      return;
    }

    // TODO: Submit SMTP configuration to API
    toast({ title: "Configuração SMTP salva com sucesso!" });
  };

  const testSMTPConnection = () => {
    // TODO: Test SMTP connection
    toast({ title: "Testando conexão SMTP...", description: "Funcionalidade em desenvolvimento" });
  };

  // Table columns
  const userColumns = [
    {
      key: "name" as keyof User,
      header: "Nome",
    },
    {
      key: "email" as keyof User,
      header: "Email",
    },
    {
      key: "permissions" as keyof User,
      header: "Perfil",
      render: (permissions: string[]) => (
        <div className="flex flex-wrap gap-1">
          {permissions.slice(0, 2).map((permission) => (
            <Badge key={permission} variant="outline" className="text-xs">
              {permission}
            </Badge>
          ))}
          {permissions.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{permissions.length - 2}
            </Badge>
          )}
        </div>
      ),
    },
    {
      key: "active" as keyof User,
      header: "Status",
      render: (active: boolean) => (
        <Badge className={active ? "status-badge success" : "status-badge error"}>
          {active ? "Ativo" : "Inativo"}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configurações</h2>
        <p className="text-gray-600">Configurações do sistema e administração</p>
      </div>

      <Card>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="border-b border-gray-200">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="usuarios">Usuários</TabsTrigger>
              <TabsTrigger value="administrativos">Administrativos</TabsTrigger>
              <TabsTrigger value="smtp">SMTP</TabsTrigger>
            </TabsList>
          </div>

          {/* Users Tab */}
          <TabsContent value="usuarios" className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Gestão de Usuários</h3>
              {canManageUsers && (
                <Button onClick={() => setUserFormOpen(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Usuário
                </Button>
              )}
            </div>

            {usersLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <DataTable
                data={users}
                columns={userColumns}
                searchKey="name"
                onEdit={canManageUsers ? handleEditUser : undefined}
                onDelete={canDeleteUsers ? handleDeleteUser : undefined}
                emptyMessage="Nenhum usuário cadastrado"
              />
            )}
          </TabsContent>

          {/* Administrativos Tab */}
          <TabsContent value="administrativos" className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Filiais */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    Filiais
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setFilialFormOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nova
                  </Button>
                </div>
                <div className="space-y-3">
                  {filiaisLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : filiais.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhuma filial cadastrada</p>
                  ) : (
                    filiais.map((filial) => (
                      <Card key={filial.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{filial.nome}</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => {
                                setItemToDelete(filial);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>

              {/* Setores */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-lg font-semibold flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Setores
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSetorFormOpen(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Novo
                  </Button>
                </div>
                <div className="space-y-3">
                  {setoresLoading ? (
                    <div className="flex justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                  ) : setores.length === 0 ? (
                    <p className="text-center text-gray-500 py-4">Nenhum setor cadastrado</p>
                  ) : (
                    setores.map((setor) => (
                      <Card key={setor.id} className="p-3">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{setor.nome}</span>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="text-destructive"
                              onClick={() => {
                                setItemToDelete(setor);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* SMTP Tab */}
          <TabsContent value="smtp" className="p-6">
            <div className="max-w-2xl">
              <div className="flex items-center mb-6">
                <Mail className="h-6 w-6 mr-3 text-primary" />
                <div>
                  <h3 className="text-lg font-semibold">Configuração de Email</h3>
                  <p className="text-sm text-gray-600">
                    Configure o servidor SMTP para envio de emails do sistema
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Provider Selection */}
                <div>
                  <Label className="text-sm font-medium text-gray-700 mb-3 block">
                    Selecione o provedor:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { id: "microsoft", name: "Microsoft", icon: "🏢" },
                      { id: "gmail", name: "Gmail", icon: "📧" },
                      { id: "custom", name: "Personalizado", icon: "⚙️" },
                    ].map((provider) => (
                      <Button
                        key={provider.id}
                        type="button"
                        variant="outline"
                        onClick={() => handleSMTPProviderChange(provider.id as any)}
                        className={`p-4 h-auto flex flex-col items-center space-y-2 transition-colors ${
                          smtpProvider === provider.id
                            ? "border-primary bg-primary/10"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                      >
                        <span className="text-2xl">{provider.icon}</span>
                        <span className="font-medium">{provider.name}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* SMTP Configuration Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="smtpHost">Servidor SMTP</Label>
                    <Input
                      id="smtpHost"
                      value={smtpHost}
                      onChange={(e) => setSMTPHost(e.target.value)}
                      placeholder="smtp.gmail.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPort">Porta</Label>
                    <Input
                      id="smtpPort"
                      type="number"
                      value={smtpPort}
                      onChange={(e) => setSMTPPort(parseInt(e.target.value) || 587)}
                      placeholder="587"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpUsername">Usuário</Label>
                    <Input
                      id="smtpUsername"
                      type="email"
                      value={smtpUsername}
                      onChange={(e) => setSMTPUsername(e.target.value)}
                      placeholder="sistema@empresa.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="smtpPassword">Senha</Label>
                    <Input
                      id="smtpPassword"
                      type="password"
                      value={smtpPassword}
                      onChange={(e) => setSMTPPassword(e.target.value)}
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smtpTLS"
                      checked={smtpUseTLS}
                      onCheckedChange={(checked) => setSMTPUseTLS(!!checked)}
                    />
                    <Label htmlFor="smtpTLS" className="text-sm font-normal">
                      Usar TLS/SSL
                    </Label>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button onClick={handleSMTPSubmit} className="flex-1">
                    <Settings className="h-4 w-4 mr-2" />
                    Salvar Configuração
                  </Button>
                  <Button variant="outline" onClick={testSMTPConnection}>
                    <Server className="h-4 w-4 mr-2" />
                    Testar Conexão
                  </Button>
                </div>

                {/* Azure AD Configuration */}
                <div className="border-t pt-6">
                  <div className="flex items-center mb-4">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    <h4 className="font-semibold">Configuração Azure AD</h4>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure a autenticação com Microsoft Office 365 para permitir login SSO.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="azureClientId">Client ID</Label>
                      <Input
                        id="azureClientId"
                        placeholder="00000000-0000-0000-0000-000000000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="azureClientSecret">Client Secret</Label>
                      <Input
                        id="azureClientSecret"
                        type="password"
                        placeholder="••••••••••••••••••••••••••••••••"
                      />
                    </div>
                    <div>
                      <Label htmlFor="azureTenantId">Tenant ID</Label>
                      <Input
                        id="azureTenantId"
                        placeholder="00000000-0000-0000-0000-000000000000"
                      />
                    </div>
                    <Button variant="outline" className="w-full">
                      Salvar Configuração Azure AD
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* User Form */}
      <UserForm
        isOpen={userFormOpen}
        onClose={() => {
          setUserFormOpen(false);
          setEditingUser(null);
        }}
        onSubmit={handleUserSubmit}
        user={editingUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />

      {/* Filial Form */}
      <Dialog open={filialFormOpen} onOpenChange={setFilialFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Filial</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="filialNome">Nome da Filial</Label>
              <Input
                id="filialNome"
                value={newFilial}
                onChange={(e) => setNewFilial(e.target.value)}
                placeholder="Ex: Filial - Rio de Janeiro"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFilialFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleFilialSubmit} disabled={createFilialMutation.isPending}>
              {createFilialMutation.isPending ? "Criando..." : "Criar Filial"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Setor Form */}
      <Dialog open={setorFormOpen} onOpenChange={setSetorFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Setor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="setorNome">Nome do Setor</Label>
              <Input
                id="setorNome"
                value={newSetor}
                onChange={(e) => setNewSetor(e.target.value)}
                placeholder="Ex: Técnico"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSetorFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSetorSubmit} disabled={createSetorMutation.isPending}>
              {createSetorMutation.isPending ? "Criando..." : "Criar Setor"}
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
            <AlertDialogAction 
              onClick={confirmDelete} 
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
