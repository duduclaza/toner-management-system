import { useForm, useFieldArray } from "react-hook-form";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus, Minus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Fornecedor, StatusGarantia } from "@shared/schema";

const itemSchema = z.object({
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valorUnitario: z.number().min(0.01, "Valor unitário deve ser maior que 0"),
});

const formSchema = z.object({
  itens: z.array(itemSchema).min(1, "Pelo menos um item é obrigatório"),
  nfCompras: z.string().min(1, "NF de compras é obrigatória"),
  fornecedorId: z.string().min(1, "Fornecedor é obrigatório"),
  statusId: z.string().min(1, "Status é obrigatório"),
  nfSimplesRemessa: z.string().optional(),
  nfDevolucao: z.string().optional(),
  ns: z.string().optional(),
  lote: z.string().optional(),
  ticketFornecedor: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface GarantiaFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function GarantiaForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading = false 
}: GarantiaFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itens: [{ quantidade: 1, descricao: "", valorUnitario: 0 }],
      nfCompras: "",
      fornecedorId: "",
      statusId: "",
      nfSimplesRemessa: "",
      nfDevolucao: "",
      ns: "",
      lote: "",
      ticketFornecedor: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const { data: fornecedores = [] } = useQuery<Fornecedor[]>({
    queryKey: ['/api/fornecedores'],
  });

  const { data: statusList = [] } = useQuery<StatusGarantia[]>({
    queryKey: ['/api/status-garantia'],
  });

  const handleSubmit = (data: FormData) => {
    // Calculate valor total for each item
    const processedData = {
      ...data,
      itens: data.itens.map(item => ({
        ...item,
        valorTotal: item.quantidade * item.valorUnitario
      }))
    };
    
    onSubmit(processedData);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro de Garantia</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Itens */}
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Itens</h4>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex gap-4 items-end">
                    <FormField
                      control={form.control}
                      name={`itens.${index}.quantidade`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Quantidade</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="1"
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`itens.${index}.descricao`}
                      render={({ field }) => (
                        <FormItem className="flex-2">
                          <FormLabel>Descrição do Defeito</FormLabel>
                          <FormControl>
                            <Input placeholder="Descrição do problema" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name={`itens.${index}.valorUnitario`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>Valor Unitário</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              placeholder="89.90"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex space-x-2">
                      {index === fields.length - 1 && (
                        <Button
                          type="button"
                          size="sm"
                          onClick={() => append({ quantidade: 1, descricao: "", valorUnitario: 0 })}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={() => remove(index)}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Informações da NF */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nfCompras"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nº da NF de Compras</FormLabel>
                    <FormControl>
                      <Input placeholder="123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div>
                <FormLabel>Anexo da NF (PDF)</FormLabel>
                <FileUpload accept=".pdf" />
              </div>
            </div>
            
            {/* Fornecedor e Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fornecedorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fornecedor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fornecedores.map((fornecedor) => (
                          <SelectItem key={fornecedor.id} value={fornecedor.id}>
                            {fornecedor.nome}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="statusId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status da Garantia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusList.map((status) => (
                          <SelectItem key={status.id} value={status.id}>
                            {status.status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Campos Opcionais */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="ns"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>N/S (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Número de série" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="lote"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lote (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Número do lote" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="ticketFornecedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket/OS Fornecedor (Opcional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Ticket #123" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Registrando..." : "Registrar Garantia"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
