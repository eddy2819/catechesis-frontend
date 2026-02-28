"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  Building2,
  Calendar,
  CheckSquare,
  ClipboardCheck,
  FileText,
  FolderOpen,
  GraduationCap,
  LogOut,
  MessageSquare,
  UserCog,
  Users,
  UsersRound,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigationByRole = {
  admin: [
    { name: "Panel Principal", href: "/dashboard", icon: BookOpen },
    { name: "Grupos", href: "/dashboard/grupos", icon: Building2 },
    { name: "Estudiantes", href: "/dashboard/students", icon: Users },
    { name: "Gestión Parroquial", href: "/dashboard/parish-management", icon: Building2 },
    { name: "Familias", href: "/dashboard/families", icon: UsersRound },
    { name: "Catequistas", href: "/dashboard/catechists", icon: UserCog },
    { name: "Asistencias", href: "/dashboard/attendance", icon: CheckSquare },
    { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
    { name: "Notas", href: "/dashboard/notes", icon: FileText },
    { name: "Calificaciones", href: "/dashboard/grades", icon: GraduationCap },
    { name: "Evaluaciones", href: "/dashboard/evaluations", icon: ClipboardCheck },
    { name: "Comunicaciones", href: "/dashboard/communications", icon: MessageSquare },
    { name: "Recursos", href: "/dashboard/resources", icon: FolderOpen },
  ],

  catequista: [
    { name: "Panel Principal", href: "/dashboard", icon: BookOpen },
    { name: "Mis Grupos", href: "/dashboard/my-groups", icon: Building2 },
    { name: "Mis Estudiantes", href: "/dashboard/my-students", icon: Users },
    { name: "Asistencias", href: "/dashboard/attendance", icon: CheckSquare },
    { name: "Notas", href: "/dashboard/notes", icon: FileText },
    { name: "Calificaciones", href: "/dashboard/grades", icon: GraduationCap },
    { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
  ],

  auxiliar: [
    { name: "Panel Principal", href: "/dashboard", icon: BookOpen },
    { name: "Mis Grupos", href: "/dashboard/my-groups", icon: Building2 },
    { name: "Asistencias", href: "/dashboard/attendance", icon: CheckSquare },
    { name: "Calendario", href: "/dashboard/calendar", icon: Calendar },
  ],

  secretario: [
    { name: "Panel Principal", href: "/dashboard", icon: BookOpen },
    { name: "Estudiantes", href: "/dashboard/students", icon: Users },
    { name: "Familias", href: "/dashboard/families", icon: UsersRound },
  ],
}

export function AppSidebar() {
  const pathname = usePathname()
  const { user, logout, isLoading } = useAuth()

if (isLoading) return null
if (!user?.role) return null

const navigation =
  navigationByRole[user.role as keyof typeof navigationByRole] || []

console.log("User role:", user.role)
console.log("Navigation items:", navigation)  

  return (
    <div className="flex h-screen w-64 flex-col bg-amber-50 border-r border-amber-200">
      <div className="flex h-16 items-center gap-3 border-b border-amber-200 px-6">
        <div className="  rounded-lg flex items-center justify-center overflow-hidden">
          <Image src="/logo-cate.jpg" alt="Logo" width={40} height={40} className="object-contain" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-amber-900">Catequesis Digital</span>
          <span className="text-xs text-amber-700">San Francisco de Asís- Taquil</span>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-amber-600 text-white" : "text-amber-900 hover:bg-amber-100",
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-amber-200 p-4 space-y-2">
        <div className="px-3 py-2">
          <p className="text-sm font-medium text-amber-900">{user?.username}</p>
          <p className="text-xs text-amber-700">{user?.email}</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-amber-900 hover:bg-amber-100" onClick={logout}>
          <LogOut className="mr-3 h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  )
}
