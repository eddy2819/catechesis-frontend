"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronLeft, ChevronRight, CalendarIcon } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { CalendarEvent } from "@/lib/types"

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view, setView] = useState<"month" | "week" | "list">("month")

  useEffect(() => {
    setEvents(dataStore.getCalendarEvents())
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event) => {
      const eventDate = new Date(event.date)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate)

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

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

  const upcomingEvents = events
    .filter((event) => new Date(event.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Calendario</h1>
          <p className="text-amber-700">Planifica y organiza las actividades de catequesis</p>
        </div>
        <Link href="/dashboard/calendar/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Evento
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="border-amber-200">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl text-amber-900">
                  {monthNames[month]} {year}
                </CardTitle>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={previousMonth}
                    className="border-amber-300 text-amber-900 bg-transparent"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={nextMonth}
                    className="border-amber-300 text-amber-900 bg-transparent"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
                  <div key={day} className="text-center text-sm font-semibold text-amber-700 py-2">
                    {day}
                  </div>
                ))}

                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1
                  const date = new Date(year, month, day)
                  const dayEvents = getEventsForDate(date)
                  const isToday =
                    date.getDate() === new Date().getDate() &&
                    date.getMonth() === new Date().getMonth() &&
                    date.getFullYear() === new Date().getFullYear()

                  return (
                    <div
                      key={day}
                      className={`aspect-square border rounded-lg p-2 ${
                        isToday ? "border-amber-600 bg-amber-50" : "border-amber-200"
                      } hover:bg-amber-50 transition-colors cursor-pointer`}
                    >
                      <div className="text-sm font-medium text-amber-900 mb-1">{day}</div>
                      <div className="space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <Link key={event.id} href={`/dashboard/calendar/${event.id}`}>
                            <div
                              className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                                eventTypeColors[event.type]
                              }`}
                            >
                              {event.title}
                            </div>
                          </Link>
                        ))}
                        {dayEvents.length > 2 && (
                          <div className="text-xs text-amber-600">+{dayEvents.length - 2} más</div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Próximos Eventos</CardTitle>
              <CardDescription className="text-amber-700">Actividades programadas</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <CalendarIcon className="h-12 w-12 text-amber-300 mb-3" />
                  <p className="text-amber-700 text-center text-sm">No hay eventos próximos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map((event) => (
                    <Link key={event.id} href={`/dashboard/calendar/${event.id}`}>
                      <div className="p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-amber-900 text-sm">{event.title}</h4>
                          <Badge className={`${eventTypeColors[event.type]} text-white text-xs`}>
                            {eventTypeLabels[event.type]}
                          </Badge>
                        </div>
                        <p className="text-xs text-amber-700">
                          {new Date(event.date).toLocaleDateString("es-ES", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </p>
                        {event.location && <p className="text-xs text-amber-600 mt-1">{event.location}</p>}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Tipos de Eventos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {Object.entries(eventTypeLabels).map(([type, label]) => (
                  <div key={type} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded ${eventTypeColors[type as keyof typeof eventTypeColors]}`} />
                    <span className="text-sm text-amber-900">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
