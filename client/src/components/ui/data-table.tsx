import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Download } from "lucide-react";

interface Column<T> {
  key: keyof T;
  header: string;
  render?: (value: any, item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  searchKey?: keyof T;
  onAdd?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onExport?: () => void;
  addLabel?: string;
  emptyMessage?: string;
}

export function DataTable<T extends { id: string }>({
  data,
  columns,
  searchKey,
  onAdd,
  onEdit,
  onDelete,
  onExport,
  addLabel = "Novo Item",
  emptyMessage = "Nenhum item encontrado"
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = searchTerm && searchKey
    ? data.filter(item => 
        String(item[searchKey]).toLowerCase().includes(searchTerm.toLowerCase())
      )
    : data;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          {searchKey && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
        </div>
        <div className="flex space-x-2">
          {onExport && (
            <Button
              variant="outline"
              onClick={onExport}
              className="bg-gray-600 text-white hover:bg-gray-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          )}
          {onAdd && (
            <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
              {addLabel}
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={String(column.key)}>{column.header}</th>
                ))}
                {(onEdit || onDelete) && (
                  <th>Ações</th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + (onEdit || onDelete ? 1 : 0)} className="text-center py-8 text-gray-500">
                    {emptyMessage}
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td key={String(column.key)}>
                        {column.render 
                          ? column.render(item[column.key], item)
                          : String(item[column.key] || '')
                        }
                      </td>
                    ))}
                    {(onEdit || onDelete) && (
                      <td>
                        <div className="flex space-x-2">
                          {onEdit && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onEdit(item)}
                              className="text-primary hover:text-primary/90"
                            >
                              Editar
                            </Button>
                          )}
                          {onDelete && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onDelete(item)}
                              className="text-destructive hover:text-destructive/90"
                            >
                              Excluir
                            </Button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
