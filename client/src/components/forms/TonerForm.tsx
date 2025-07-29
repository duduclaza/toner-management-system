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
import { Card, CardContent } from "@/components/ui/card";
import type { Toner } from "@shared/schema";

const formSchema = z.object({
  modelo: z.string().min(1, "Modelo é obrigatório"),
  pesocheio: z.number().min(0.1, "Peso cheio deve ser maior que 0"),
  pesovazio: z.number().min(0.1, "Peso vazio deve ser maior que 0"),
  capacidade: z.number().min(1, "Capacidade deve ser maior que 0"),
  preco: z.number().min(0.01, "Preço deve ser maior que 0"),
  cor: z.enum(["Black", "Cyan", "Magenta", "Yellow"]),
  tipo: z.enum(["Original", "Compatível", "Remanufaturado"]),
});

type FormData = z.infer<typeof formSchema>;

interface TonerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
  toner?: Toner | null;
  isLoading?: boolean;
}

export function TonerForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  toner,
  isLoading = false 
}: TonerFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: toner ? {
      modelo: toner.modelo,
      pesocheio: toner.pesocheio,
      pesovazio: toner.pesovazio,
      capacidade: toner.capacidade,
      preco: toner.preco,
      cor: toner.cor as "Black" | "Cyan" | "Magenta" | "Yellow",
      tipo: toner.tipo as "Original" | "Compatível" | "Remanufaturado",
    } : {
      modelo: "",
      pesocheio: 0,
      pesovazio: 0,
      capacidade: 0,
      preco: 0,
      cor: "Black",
      tipo: "Original",
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {toner ? "Editar Toner" : "Cadastro de Toner"}
          </DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="modelo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Modelo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: HP 85A" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pesocheio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Cheio (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="900"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="pesovazio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Peso Vazio (g)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="850"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="capacidade"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacidade (folhas)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="1600"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="preco"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço (R$)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="89.90"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="cor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione a cor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Black">Black</SelectItem>
                        <SelectItem value="Cyan">Cyan</SelectItem>
                        <SelectItem value="Magenta">Magenta</SelectItem>
                        <SelectItem value="Yellow">Yellow</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Original">Original</SelectItem>
                        <SelectItem value="Compatível">Compatível</SelectItem>
                        <SelectItem value="Remanufaturado">Remanufaturado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* Calculated Fields Display */}
            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Cálculos Automáticos</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Gramatura:</span>
                    <p className="font-medium">
                      {(form.watch("pesocheio") - form.watch("pesovazio")).toFixed(1)}g
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Gramatura por folha:</span>
                    <p className="font-medium">
                      {form.watch("capacidade") > 0 
                        ? ((form.watch("pesocheio") - form.watch("pesovazio")) / form.watch("capacidade")).toFixed(4)
                        : "0.0000"
                      }g
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-600">Preço por folha:</span>
                    <p className="font-medium">
                      R$ {form.watch("capacidade") > 0 
                        ? (form.watch("preco") / form.watch("capacidade")).toFixed(4)
                        : "0.0000"
                      }
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Salvando..." : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
