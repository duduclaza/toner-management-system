import type { AuthUser } from "@/types";

export function hasPermission(user: AuthUser | null, permission: string): boolean {
  if (!user) return false;
  return user.permissions.includes(permission);
}

export function hasModuleAccess(user: AuthUser | null, module: string): boolean {
  if (!user) return false;
  return user.modules.includes(module);
}

export function canPerformAction(user: AuthUser | null, action: string): boolean {
  return hasPermission(user, action);
}
