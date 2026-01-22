"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarIcon, Plus } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Asistencias</h1>
          <p className="text-amber-700 mt-1">Registra la asistencia de estudiantes, padres y catequistas</p>
        </div>
      </div>

      <Tabs defaultValue="students" className="space-y-6">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="students" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Estudiantes a Clases
          </TabsTrigger>
          <TabsTrigger value="parents" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Padres a Reuniones
          </TabsTrigger>
          <TabsTrigger value="catechists" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Catequistas a Convivencias
          </TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Asistencia de Estudiantes</CardTitle>
              <CardDescription>Registra la asistencia de los estudiantes a las clases de catequesis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-amber-900 mb-2 block">Seleccionar Fecha</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="pt-6">
                  <Link href={`/dashboard/attendance/students/${encodeURIComponent(
                    selectedDate.toISOString().split("T")[0]
                  )}`}>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Asistencia
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Fecha seleccionada:</span>
                  <span className="capitalize">{formatDate(selectedDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Historial Reciente</h3>
                <Link href="/dashboard/attendance/students/history">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent"
                  >
                    Ver Historial Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="parents" className="space-y-4">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Asistencia de Padres</CardTitle>
              <CardDescription>Registra la asistencia de los padres a las reuniones</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-amber-900 mb-2 block">Seleccionar Fecha de Reunión</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="pt-6">
                  <Link href={`/dashboard/attendance/parents/${encodeURIComponent(
                    selectedDate.toISOString().split("T")[0]
                  )}`}>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Asistencia
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Fecha seleccionada:</span>
                  <span className="capitalize">{formatDate(selectedDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Historial Reciente</h3>
                <Link href="/dashboard/attendance/parents/history">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent"
                  >
                    Ver Historial Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catechists" className="space-y-4">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Asistencia de Catequistas</CardTitle>
              <CardDescription>Registra la asistencia de los catequistas a convivencias y retiros</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-sm font-medium text-amber-900 mb-2 block">Seleccionar Fecha del Evento</label>
                  <input
                    type="date"
                    value={selectedDate.toISOString().split("T")[0]}
                    onChange={(e) => setSelectedDate(new Date(e.target.value))}
                    className="w-full px-3 py-2 border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div className="pt-6">
                  <Link href={`/dashboard/attendance/cate/${encodeURIComponent(
                    selectedDate.toISOString().split("T")[0]
                  )}`}>
                    <Button className="bg-amber-600 hover:bg-amber-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Registrar Asistencia
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-center gap-2 text-amber-900">
                  <CalendarIcon className="w-5 h-5" />
                  <span className="font-medium">Fecha seleccionada:</span>
                  <span className="capitalize">{formatDate(selectedDate)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-amber-900">Historial Reciente</h3>
                <Link href="/dashboard/attendance/catechists/history">
                  <Button
                    variant="outline"
                    className="w-full border-amber-300 text-amber-900 hover:bg-amber-50 bg-transparent"
                  >
                    Ver Historial Completo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
