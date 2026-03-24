import type { PropsWithChildren } from 'react'
import { useAuth } from "./AuthContext";

type PtotectedRouteProps = PropsWithChildren & {
  allowedRoles?: string[] // Roles permitidos para acceder a la ruta
}

export default function ProtectedRoute({ children, allowedRoles }: PtotectedRouteProps) {
  const { userTipo } = useAuth();

  if (userTipo === null || !allowedRoles?.includes(userTipo)) {
    return <div>No tenés permisos</div>;
  }

  return children;
}