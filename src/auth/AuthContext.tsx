import { createContext, useState, useContext, useLayoutEffect } from 'react'
import axios from 'axios'

interface AuthContextType {
  token: string | null
  userTipo: string | null
  userId: number | null
  login: (token: string, tipo: string, id: number) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Estado para el token y el usuario actual
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [userTipo, setUserTipo] = useState<string | null>(localStorage.getItem('tipoUsuario'))

  const [userId, setUserId] = useState<number | null>(
    localStorage.getItem('idUsuario') ? Number(localStorage.getItem('idUsuario')) : null
  )

  // Función login: guarda token y usuario en localStorage
  const login = (newToken: string, tipo: string, id: number) => {
    setToken(newToken)
    setUserTipo(tipo)
    setUserId(id)

    localStorage.setItem('token', newToken)
    localStorage.setItem('tipoUsuario', tipo)
    localStorage.setItem('idUsuario', id.toString())
  }

  // Función logout para limpiar el token y el usuario
  const logout = () => {
    setToken(null)
    setUserTipo(null)
    setUserId(null)

    localStorage.removeItem('token')
    localStorage.removeItem('tipoUsuario')
    localStorage.removeItem('idUsuario')
  }

  // Interceptor para agregar el token a las solicitudes
  useLayoutEffect(() => {
    const interceptor = axios.interceptors.request.use((config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })
    return () => axios.interceptors.request.eject(interceptor)
  }, [token])

  // Interceptor para manejar respuestas y error 401 (token inválido/expirado)
  useLayoutEffect(() => {
    const interceptor = axios.interceptors.response.use(
      res => res,
      err => {
        if (err.response?.status === 401) {
          logout()
        }
        return Promise.reject(err)
      }
    )
    return () => axios.interceptors.response.eject(interceptor)
  }, [])

  return (
    <AuthContext.Provider value={{ token, userTipo, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}