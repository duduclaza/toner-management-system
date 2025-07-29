import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { hasModuleAccess } from "@/lib/auth";
import {
  LayoutDashboard,
  Database,
  RotateCcw,
  Shield,
  TestTube,
  CheckCircle,
  Award,
  FileText,
  Workflow,
  ClipboardCheck,
  Users,
  Settings
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

const menuItems = [
  {
    group: "Principal",
    items: [
      { 
        id: "dashboard", 
        label: "Dashboard", 
        icon: LayoutDashboard, 
        path: "/", 
        module: "dashboard" 
      }
    ]
  },
  {
    group: "Cadastros",
    items: [
      { 
        id: "cadastros", 
        label: "Cadastros Gerais", 
        icon: Database, 
        path: "/cadastros", 
        module: "cadastros" 
      }
    ]
  },
  {
    group: "Operações",
    items: [
      { 
        id: "retornados", 
        label: "Retornados", 
        icon: RotateCcw, 
        path: "/retornados", 
        module: "retornados" 
      },
      { 
        id: "garantias", 
        label: "Garantias", 
        icon: Shield, 
        path: "/garantias", 
        module: "garantias" 
      },
      { 
        id: "amostragens", 
        label: "Amostragens", 
        icon: TestTube, 
        path: "/amostragens", 
        module: "amostragens" 
      },
      { 
        id: "homologacoes", 
        label: "Homologações", 
        icon: CheckCircle, 
        path: "/homologacoes", 
        module: "homologacoes" 
      }
    ]
  },
  {
    group: "Documentos",
    items: [
      { 
        id: "certificados", 
        label: "Certificados", 
        icon: Award, 
        path: "/certificados", 
        module: "certificados" 
      },
      { 
        id: "pop-it", 
        label: "POP/IT", 
        icon: FileText, 
        path: "/pop-it", 
        module: "pop-it" 
      },
      { 
        id: "processos", 
        label: "Processos", 
        icon: Workflow, 
        path: "/processos", 
        module: "processos" 
      }
    ]
  },
  {
    group: "Qualidade",
    items: [
      { 
        id: "auditorias", 
        label: "Auditorias", 
        icon: ClipboardCheck, 
        path: "/auditorias", 
        module: "auditorias" 
      },
      { 
        id: "dinamicas", 
        label: "Dinâmicas", 
        icon: Users, 
        path: "/dinamicas", 
        module: "dinamicas" 
      }
    ]
  },
  {
    group: "Sistema",
    items: [
      { 
        id: "configuracoes", 
        label: "Configurações", 
        icon: Settings, 
        path: "/configuracoes", 
        module: "configuracoes" 
      }
    ]
  }
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.map(group => ({
    ...group,
    items: group.items.filter(item => hasModuleAccess(user, item.module))
  })).filter(group => group.items.length > 0);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white shadow-sm border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="p-6 space-y-2 h-full overflow-y-auto">
          {filteredMenuItems.map((group) => (
            <div key={group.group} className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-6 mb-3 first:mt-0">
                {group.group}
              </h3>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.path;
                
                return (
                  <Link key={item.id} href={item.path}>
                    <a
                      className={cn(
                        "sidebar-link",
                        isActive && "active"
                      )}
                      onClick={onClose}
                    >
                      <Icon className="w-5 h-5 mr-3" />
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
