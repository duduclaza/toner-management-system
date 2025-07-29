import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUpload } from "@/components/ui/file-upload";
import { Plus, Trash2, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Fornecedor, StatusGarantia } from "@shared/schema";

const itemSchema = z.object({
  quantidade: z.number().min(1, "Quantidade deve ser maior que 0"),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  valorUnitario: z.number().min(0.01, "Valor unitário deve ser maior que 0"),
  valorTotal: z.number(),
});

const formSchema = z.object({
  itens: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
  nfCompras: z.string().min(1, "NF de compras é obrigatória"),
  anexoNfCompras: z.array(z.instanceof(File)).optional(),
  fornecedorId: z.string().min(1, "Fornecedor é obrigatório"),
  statusId: z.string().min(1, "Status é obrigatório"),
  nfSimplesRemessa: z.string().optional(),
  anexoNfSimplesRemessa: z.array(z.instanceof(File)).optional(),
  nfDevolucao: z.string().optional(),
  anexoNfDevolucao: z.array(z.instanceof(File)).optional(),
  ns: z.string().optional(),
  lote: z.string().optional(),
  ticketFornecedor: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface GarantiaFormNewProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  isLoading?: boolean;
}

export function GarantiaFormNew({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}: GarantiaFormNewProps) {
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itens: [{ quantidade: 1, descricao: "", valorUnitario: 0, valorTotal: 0 }],
      nfCompras: "",
      anexoNfCompras: [],
      fornecedorId: "",
      statusId: "",
      nfSimplesRemessa: "",
      anexoNfSimplesRemessa: [],
      nfDevolucao: "",
      anexoNfDevolucao: [],
      ns: "",
      lote: "",
      ticketFornecedor: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  // Queries
  const { data: fornecedores = [] } = useQuery<Fornecedor[]>({
    queryKey: ["/api/fornecedores"],
  });

  const { data: statusGarantia = [] } = useQuery<StatusGarantia[]>({
    queryKey: ["/api/status-garantia"],
  });

  const calculateTotal = (quantidade: number, valorUnitario: number) => {
    return quantidade * valorUnitario;
  };

  const handleSubmit = (data: FormData) => {
    // Calculate totals for all items
    const processedData = {
      ...data,
      itens: data.itens.map(item => ({
        ...item,
        valorTotal: calculateTotal(item.quantidade, item.valorUnitario)
      }))
    };
    
    onSubmit(processedData);
    form.reset();
  };

  const addItem = () => {
    append({ quantidade: 1, descricao: "", valorUnitario: 0, valorTotal: 0 });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Registro de Garantia</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* Items Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Itens da Garantia
                  <Button type="button" onClick={addItem} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Item
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {fields.map((field, index) => (
                  <Card key={field.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => remove(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <FormField
                          control={form.control}
                          name={`itens.${index}.quantidade`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Quantidade</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min="1"
                                  {...field}
                                  onChange={(e) => {
                                    const quantidade = parseInt(e.target.value) || 0;
                                    field.onChange(quantidade);
                                    const valorUnitario = form.getValues(`itens.${index}.valorUnitario`);
                                    form.setValue(`itens.${index}.valorTotal`, calculateTotal(quantidade, valorUnitario));
                                  }}
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
                            <FormItem className="md:col-span-2">
                              <FormLabel>Descrição do Defeito</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Descreva o defeito do produto" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`itens.${index}.valorUnitario`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Valor Unitário (R$)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  onChange={(e) => {
                                    const valorUnitario = parseFloat(e.target.value) || 0;
                                    field.onChange(valorUnitario);
                                    const quantidade = form.getValues(`itens.${index}.quantidade`);
                                    form.setValue(`itens.${index}.valorTotal`, calculateTotal(quantidade, valorUnitario));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-gray-600">Valor Total:</span>
                          <span className="text-lg font-bold text-gray-900">
                            R$ {calculateTotal(
                              form.watch(`itens.${index}.quantidade`) || 0,
                              form.watch(`itens.${index}.valorUnitario`) || 0
                            ).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>

            {/* Documents and Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Purchase Invoice */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">NF de Compras</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nfCompras"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da NF</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 12345" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Anexo da NF (PDF)</Label>
                    <FileUpload
                      accept=".pdf"
                      onFilesChange={(files) => form.setValue("anexoNfCompras", files)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Informações Básicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                            {statusGarantia.map((status) => (
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
                </CardContent>
              </Card>
            </div>

            {/* Additional Documents */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Simple Remittance */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">NF de Simples Remessa</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nfSimplesRemessa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da NF (Opcional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 67890" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Anexo da NF (PDF)</Label>
                    <FileUpload
                      accept=".pdf"
                      onFilesChange={(files) => form.setValue("anexoNfSimplesRemessa", files)}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Return Invoice */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">NF de Devolução</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nfDevolucao"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número da NF (Opcional)</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Ex: 54321" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div>
                    <Label>Anexo da NF (PDF)</Label>
                    <FileUpload
                      accept=".pdf"
                      onFilesChange={(files) => form.setValue("anexoNfDevolucao", files)}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Optional Fields */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informações Adicionais (Opcional)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="ns"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>N/S</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Número de série" />
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
                        <FormLabel>Lote</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Número do lote" />
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
                        <FormLabel>Ticket/OS do Fornecedor</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Número do ticket" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Registrar Garantia"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}