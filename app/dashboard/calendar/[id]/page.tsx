"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Calendar, Clock, MapPin, Users } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { CalendarEvent } from "@/lib/types"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function EventDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<CalendarEvent | null>(null)

  useEffect(() => {
    const id = params.id as string
    const foundEvent = dataStore.getCalendarEventById(id)
    if (foundEvent) {
      setEvent(foundEvent)
    }
  }, [params.id])

  const handleDelete = () => {
    if (event) {
      dataStore.deleteCalendarEvent(event.id)
      router.push("/dashboard/calendar")
    }
  }

  if (!event) {
    return (
      <div className="p-8">
        <p className="text-amber-700">Evento no encontrado</p>
      </div>
    )
  }

  const eventTypeColors = {
    class: "bg-blue-500",
    meeting: "bg-green-500",
    celebration: "bg-purple-500",
    retreat: "bg-amber-500",
    other: "bg-gray-500",
  }

  const eventTypeLabels = {
    class: "Clase",
    meeting: "Reunión",
    celebration: "Celebración",
    retreat: "Retiro",
    other: "Otro",
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
      </div>

      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-amber-900">{event.title}</h1>
            <Badge className={`${eventTypeColors[event.type]} text-white`}>{eventTypeLabels[event.type]}</Badge>
          </div>
          {event.description && <p className="text-amber-700">{event.description}</p>}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-amber-300 text-amber-900 bg-transparent">
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50 bg-transparent">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminará permanentemente el evento del calendario.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Eliminar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Detalles del Evento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700">Fecha</p>
                <p className="text-amber-900">
                  {new Date(event.date).toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-700">Hora</p>
                <p className="text-amber-900">
                  {new Date(event.date).toLocaleTimeString("es-ES", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                  {event.endDate &&
                    ` - ${new Date(event.endDate).toLocaleTimeString("es-ES", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`}
                </p>
              </div>
            </div>
            {event.location && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Ubicación</p>
                  <p className="text-amber-900">{event.location}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Participantes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8">
              <Users className="h-12 w-12 text-amber-300 mb-3" />
              <p className="text-amber-700 text-center text-sm">No hay participantes registrados</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
