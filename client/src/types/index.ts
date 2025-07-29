export interface AuthUser {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  modules: string[];
  active: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface GramaturaCalculation {
  gramaturaPresente: number;
  percentual: number;
  orientacao: string;
  className: string;
}

export interface RetornadoDestination {
  id: string;
  label: string;
  icon: string;
  color: string;
}

export interface DashboardStats {
  totalToners: number;
  emGarantia: number;
  retornados: number;
  valorRecuperado: number;
}

export interface Activity {
  id: string;
  type: 'success' | 'warning' | 'info';
  message: string;
  timestamp: string;
}

export interface Alert {
  id: string;
  type: 'warning' | 'error' | 'info';
  message: string;
}
