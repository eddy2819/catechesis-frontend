"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/store"

export default function NewEventPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    endDate: "",
    endTime: "",
    type: "class" as "class" | "meeting" | "celebration" | "retreat" | "other",
    location: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const dateTime = new Date(`${formData.date}T${formData.time || "00:00"}`)
    const endDateTime = formData.endDate ? new Date(`${formData.endDate}T${formData.endTime || "23:59"}`) : undefined

    const event = {
      title: formData.title,
      description: formData.description || undefined,
      date: dateTime,
      endDate: endDateTime,
      type: formData.type,
      location: formData.location || undefined,
      participants: [],
    }

    dataStore.addCalendarEvent(event)
    router.push("/dashboard/calendar")
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/calendar">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Calendario
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nuevo Evento</h1>
        <p className="text-amber-700">Crea un nuevo evento en el calendario</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información del Evento</CardTitle>
                <CardDescription className="text-amber-700">Detalles básicos del evento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-amber-900">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    required
                    placeholder="Ej: Clase de Primera Comunión"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-amber-900">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Detalles adicionales sobre el evento..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-amber-200 focus:border-amber-600 min-h-24"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-amber-900">
                    Tipo de Evento *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "class" | "meeting" | "celebration" | "retreat" | "other") =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="class">Clase</SelectItem>
                      <SelectItem value="meeting">Reunión</SelectItem>
                      <SelectItem value="celebration">Celebración</SelectItem>
                      <SelectItem value="retreat">Retiro</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-amber-900">
                    Ubicación
                  </Label>
                  <Input
                    id="location"
                    placeholder="Ej: Salón parroquial, Iglesia..."
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Fecha y Hora</CardTitle>
                <CardDescription className="text-amber-700">Cuándo se realizará el evento</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="date" className="text-amber-900">
                      Fecha de Inicio *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time" className="text-amber-900">
                      Hora de Inicio
                    </Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="endDate" className="text-amber-900">
                      Fecha de Fin
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-amber-900">
                      Hora de Fin
                    </Label>
                    <Input
                      id="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Crear Evento
                  </Button>
                  <Link href="/dashboard/calendar" className="block">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-amber-300 text-amber-900 bg-transparent"
                    >
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
