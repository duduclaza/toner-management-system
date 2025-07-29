import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { User } from "@shared/schema";

const formSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  permissions: z.array(z.string()).min(1, "Selecione pelo menos uma permissão"),
  modules: z.array(z.string()).min(1, "Selecione pelo menos um módulo"),
  active: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

interface UserFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  user?: User | null;
  isLoading?: boolean;
}

const permissions = [
  { id: "create", label: "Criar" },
  { id: "read", label: "Visualizar" },
  { id: "update", label: "Editar" },
  { id: "delete", label: "Excluir" },
  { id: "export", label: "Exportar" },
];

const modules = [
  { id: "dashboard", label: "Dashboard" },
  { id: "cadastros", label: "Cadastros Gerais" },
  { id: "retornados", label: "Retornados" },
  { id: "garantias", label: "Garantias" },
  { id: "amostragens", label: "Amostragens" },
  { id: "homologacoes", label: "Homologações" },
  { id: "certificados", label: "Certificados" },
  { id: "pop-it", label: "POP/IT" },
  { id: "processos", label: "Processos" },
  { id: "auditorias", label: "Auditorias" },
  { id: "dinamicas", label: "Dinâmicas" },
  { id: "configuracoes", label: "Configurações" },
];

export function UserForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  user,
  isLoading = false 
}: UserFormProps) {
  const isEdit = !!user;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: user ? {
      name: user.name,
      email: user.email,
      password: "",
      permissions: user.permissions || [],
      modules: user.modules || [],
      active: user.active,
    } : {
      name: "",
      email: "",
      password: "",
      permissions: [],
      modules: [],
      active: true,
    },
  });

  const handleSubmit = (data: FormData) => {
    // If editing and password is empty, don't include it in the update
    const submitData = isEdit && !data.password 
      ? { ...data, password: undefined }
      : data;
    
    onSubmit(submitData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Editar Usuário" : "Novo Usuário"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input placeholder="João Silva" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        type="email" 
                        placeholder="joao@empresa.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Senha {isEdit && "(deixe vazio para manter atual)"}
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissões</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {permissions.map((permission) => (
                      <FormField
                        key={permission.id}
                        control={form.control}
                        name="permissions"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={permission.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(permission.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, permission.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== permission.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {permission.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="modules"
              render={() => (
                <FormItem>
                  <FormLabel>Acesso aos Módulos</FormLabel>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {modules.map((module) => (
                      <FormField
                        key={module.id}
                        control={form.control}
                        name="modules"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={module.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(module.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, module.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== module.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-sm font-normal">
                                {module.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="active"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Usuário Ativo</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading 
                  ? (isEdit ? "Atualizando..." : "Criando...") 
                  : (isEdit ? "Atualizar" : "Criar Usuário")
                }
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
