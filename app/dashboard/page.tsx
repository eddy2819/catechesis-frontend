"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Calendar, Users, UsersRound } from "lucide-react"

export default function DashboardPage() {
  const stats = [
    {
      title: "Estudiantes Activos",
      value: "0",
      description: "Total de estudiantes registrados",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      title: "Familias",
      value: "0",
      description: "Familias registradas",
      icon: UsersRound,
      color: "bg-green-500",
    },
    {
      title: "Eventos este mes",
      value: "0",
      description: "Clases y actividades",
      icon: Calendar,
      color: "bg-amber-500",
    },
    {
      title: "Recursos",
      value: "0",
      description: "Materiales disponibles",
      icon: BookOpen,
      color: "bg-purple-500",
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Panel Principal</h1>
        <p className="text-amber-700">Bienvenido a tu cuaderno de catequesis digital</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-amber-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-amber-900">{stat.title}</CardTitle>
              <div className={`${stat.color} p-2 rounded-lg`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{stat.value}</div>
              <p className="text-xs text-amber-700 mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Próximas Actividades</CardTitle>
            <CardDescription className="text-amber-700">Eventos y clases programadas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 text-center py-8">No hay actividades programadas</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Notas Recientes</CardTitle>
            <CardDescription className="text-amber-700">Últimas observaciones registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-amber-700 text-center py-8">No hay notas registradas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
