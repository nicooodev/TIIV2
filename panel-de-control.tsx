"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, LogOut, Power, UserPlus, AlertTriangle, Twitter, Github, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

type DeviceType = 'leica' | 'laboratory' | 'network'
type UserRole = 'admin' | 'standard'

interface User {
  name: string
  role: UserRole
  avatar: string
}

export default function PanelDeControl() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [devices, setDevices] = useState({
    leica: Array(12).fill(false),
    laboratory: Array(21).fill(false),
    network: {
      Servidores: false,
      Router: false,
      "Punto de acceso": false,
      Switches: false
    }
  })
  const [currentUser, setCurrentUser] = useState<User>({
    name: "Nicolas",
    role: "admin",
    avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a3f35daca93a0c9ed972271c486d6c45-dpBU7n1s6oymu1w9yc1PXfN9zfq3hg.jpg"
  })
  const [users, setUsers] = useState<User[]>([])
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [deviceActionType, setDeviceActionType] = useState<'turnOn' | 'turnOff'>('turnOff')

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === "nicolas" && password === "1234") {
      setIsLoggedIn(true)
    } else {
      alert("Credenciales inválidas")
    }
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername("")
    setPassword("")
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleDevice = (type: DeviceType, index: number | string) => {
    if (type === 'network') {
      setDevices(prev => ({
        ...prev,
        network: {
          ...prev.network,
          [index as string]: !prev.network[index as keyof typeof prev.network]
        }
      }))
    } else {
      setDevices(prev => ({
        ...prev,
        [type]: prev[type].map((state, i) => i === index ? !state : state)
      }))
    }
  }

  const handleDevicesAction = (action: 'turnOn' | 'turnOff') => {
    setDeviceActionType(action)
    setShowConfirmDialog(true)
  }

  const confirmDevicesAction = () => {
    const newState = deviceActionType === 'turnOn'
    setDevices(prev => ({
      ...prev,
      leica: Array(12).fill(newState),
      laboratory: Array(21).fill(newState),
    }))
    setShowConfirmDialog(false)
  }

  const handleNetworkDevicesAction = (action: 'turnOn' | 'turnOff') => {
    const newState = action === 'turnOn'
    setDevices(prev => ({
      ...prev,
      network: Object.fromEntries(Object.keys(prev.network).map(key => [key, newState]))
    }))
  }

  const addUser = (name: string, role: UserRole) => {
    const newUser: User = {
      name,
      role,
      avatar: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f1-zHwIHNE3xzCFlut07YVEw0q0osPiit.png"
    }
    setUsers([...users, newUser])
  }

  const totalDevices = devices.leica.length + devices.laboratory.length
  const activeDevices = 
    devices.leica.filter(Boolean).length + 
    devices.laboratory.filter(Boolean).length

  const Footer = () => (
    <footer className="mt-8 py-4 border-t text-center">
      <p className="mb-2">Hecho con 💜 por NicoooDev usando Vercel</p>
      <div className="flex justify-center space-x-4">
        <a href="https://x.com/holasoyelnico_" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-600">
          <Twitter className="h-6 w-6" />
        </a>
        <a href="https://github.com/NicolasEtcheversss" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100">
          <Github className="h-6 w-6" />
        </a>
        <a href="https://discord.gg/x2Du8FD3hN" target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:text-indigo-600">
          <MessageCircle className="h-6 w-6" />
        </a>
      </div>
    </footer>
  )

  if (!isLoggedIn) {
    return (
      <div className={`min-h-screen flex flex-col justify-center items-center ${isDarkMode ? "dark" : ""}`}>
        <Card className="w-[350px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Usuario
                </label>
                <input
                  id="username"
                  type="text"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Contraseña
                </label>
                <input
                  id="password"
                  type="password"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">Iniciar Sesión</Button>
            </form>
          </CardContent>
        </Card>
        <Footer />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-background text-foreground ${isDarkMode ? "dark" : ""}`}>
      <header className="flex justify-between items-center p-4 border-b">
        <h1 className="text-2xl font-bold">Panel de Control de Dispositivos</h1>
        <div className="flex items-center space-x-4">
          <div className="flex flex-col items-end">
            <span className="text-sm font-medium">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground">{currentUser.role === 'admin' ? 'Administrador' : 'Usuario Estándar'}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={currentUser.avatar} alt="Usuario" />
                  <AvatarFallback>NC</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleDarkMode}>
                <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span>Cambiar tema</span>
              </DropdownMenuItem>
              {currentUser.role === 'admin' && (
                <DropdownMenuItem onClick={() => document.getElementById('add-user-dialog')?.click()}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Agregar usuario</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="p-4">
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Resumen de Dispositivos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <p className="text-lg font-semibold">Total de dispositivos: {totalDevices}</p>
                <p className="text-lg font-semibold">Dispositivos activos: {activeDevices}</p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleDevicesAction('turnOn')} variant="outline">
                  <Power className="mr-2 h-4 w-4" />
                  Encender todos los dispositivos
                </Button>
                <Button onClick={() => handleDevicesAction('turnOff')} variant="destructive">
                  <Power className="mr-2 h-4 w-4" />
                  Apagar todos los dispositivos
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        <Tabs defaultValue="leica">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="leica">LEICA</TabsTrigger>
            <TabsTrigger value="laboratory">Laboratorios</TabsTrigger>
            <TabsTrigger value="network">Dispositivos de Red</TabsTrigger>
          </TabsList>
          <TabsContent value="leica">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Dispositivos LEICA</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {devices.leica.map((isOn, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <svg
                        className="h-8 w-8 text-gray-500 dark:text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M20.9 18.55c.06-.43.1-.86.1-1.3a8.25 8.25 0 1 0-16.5 0c0 .44.04.87.1 1.3A4 4 0 0 1 4 22h16a4 4 0 0 1-.1-3.45Z" />
                        <path d="m12 10-3 5h6l-3-5Z" />
                        <path d="m12 2-2 3h4l-2-3Z" />
                      </svg>
                      <Switch checked={isOn} onCheckedChange={() => toggleDevice('leica', i)} />
                      <span className="mt-1 text-sm">LEICA {i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="laboratory">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Dispositivos de Laboratorio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {devices.laboratory.map((isOn, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <svg
                        className="h-8 w-8 text-gray-500 dark:text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect height="14" rx="2" ry="2" width="20" x="2" y="3" />
                        <path d="M8 21h8" />
                        <path d="M12 17v4" />
                      </svg>
                      <Switch checked={isOn} onCheckedChange={() => toggleDevice('laboratory', i)} />
                      <span className="mt-1 text-sm">Lab {i + 1}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="network">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold">Dispositivos de Red</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex justify-end space-x-2">
                  <Button onClick={() => handleNetworkDevicesAction('turnOn')} variant="outline">
                    <Power className="mr-2 h-4 w-4" />
                    Encender todos
                  </Button>
                  <Button onClick={() => handleNetworkDevicesAction('turnOff')} variant="destructive">
                    <Power className="mr-2 h-4 w-4" />
                    Apagar todos
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Object.entries(devices.network).map(([device, isOn]) => (
                    <div key={device} className="flex flex-col items-center">
                      <svg
                        className="h-8 w-8 text-gray-500 dark:text-gray-400"
                        fill="none"
                        height="24"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="2" y="2" width="20" height="8" rx="2" ry="2" />
                        <rect x="2" y="14" width="20" height="8" rx="2" ry="2" />
                        <line x1="6" y1="6" x2="6.01" y2="6" />
                        <line x1="6" y1="18" x2="6.01" y2="18" />
                      </svg>
                      <Switch checked={isOn} onCheckedChange={() => toggleDevice('network', device)} />
                      <span className="mt-1 text-sm">{device}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar acción</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres {deviceActionType === 'turnOn' ? 'encender' : 'apagar'} todos los dispositivos (excepto los de red)?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>Cancelar</Button>
            <Button onClick={confirmDevicesAction}>Confirmar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button id="add-user-dialog" className="hidden">Agregar Usuario</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Usuario</DialogTitle>
            <DialogDescription>
              Ingrese los detalles del nuevo usuario.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            const name = formData.get('name') as string
            const role = formData.get('role') as UserRole
            if (name && role) {
              addUser(name, role)
              setShowConfirmDialog(false)
            }
          }}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Nombre
                </Label>
                <Input id="name" name="name" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Rol
                </Label>
                <RadioGroup defaultValue="standard" name="role" className="col-span-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="admin" id="admin" />
                    <Label htmlFor="admin">Administrador</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="standard" id="standard" />
                    <Label htmlFor="standard">Usuario Estándar</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Agregar Usuario</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}