"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MessageSquare, Mail, Bell } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Communication, Parent } from "@/lib/types"

export default function CommunicationsPage() {
  const [communications, setCommunications] = useState<Communication[]>([])
  const [parents, setParents] = useState<Parent[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    setCommunications(dataStore.getCommunications())
    setParents(dataStore.getParents())
  }, [])

  const getRecipientNames = (recipientIds: string[]) => {
    return recipientIds
      .map((id) => {
        const parent = parents.find((p) => p.id === id)
        return parent ? `${parent.firstName} ${parent.lastName}` : null
      })
      .filter(Boolean)
  }

  const filteredCommunications = communications.filter((comm) => {
    const matchesSearch =
      comm.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comm.message.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || comm.type === filterType
    return matchesSearch && matchesType
  })

  const statusColors = {
    sent: "bg-green-500",
    pending: "bg-orange-500",
    failed: "bg-red-500",
  }

  const statusLabels = {
    sent: "Enviado",
    pending: "Pendiente",
    failed: "Fallido",
  }

  const typeIcons = {
    email: Mail,
    notification: Bell,
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Comunicaciones</h1>
          <p className="text-amber-700">Envía mensajes y notificaciones a las familias</p>
        </div>
        <Link href="/dashboard/communications/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Comunicación
          </Button>
        </Link>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
              <Input
                placeholder="Buscar comunicaciones..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-600"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"}
              >
                Todas
              </Button>
              <Button
                variant={filterType === "email" ? "default" : "outline"}
                onClick={() => setFilterType("email")}
                className={filterType === "email" ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"}
              >
                Emails
              </Button>
              <Button
                variant={filterType === "notification" ? "default" : "outline"}
                onClick={() => setFilterType("notification")}
                className={
                  filterType === "notification" ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"
                }
              >
                Notificaciones
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredCommunications.length === 0 ? (
        <Card className="border-amber-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-16 w-16 text-amber-300 mb-4" />
            <p className="text-amber-700 text-center mb-4">
              {searchQuery || filterType !== "all" ? "No se encontraron comunicaciones" : "No hay comunicaciones"}
            </p>
            {!searchQuery && filterType === "all" && (
              <Link href="/dashboard/communications/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Enviar Primera Comunicación
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCommunications.map((comm) => {
            const TypeIcon = typeIcons[comm.type]
            const recipientNames = getRecipientNames(comm.recipients)
            return (
              <Card key={comm.id} className="border-amber-200 hover:border-amber-400 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <TypeIcon className="h-5 w-5 text-amber-600 mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-lg text-amber-900">{comm.subject}</CardTitle>
                          <Badge className={`${statusColors[comm.status]} text-white`}>
                            {statusLabels[comm.status]}
                          </Badge>
                        </div>
                        <CardDescription className="text-amber-700">
                          {new Date(comm.sentAt).toLocaleDateString("es-ES", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-amber-900 mb-3 line-clamp-2">{comm.message}</p>
                  <div className="flex items-center gap-2 text-sm text-amber-700">
                    <span className="font-medium">Destinatarios:</span>
                    <span>
                      {recipientNames.length > 0
                        ? recipientNames.length === 1
                          ? recipientNames[0]
                          : `${recipientNames.length} personas`
                        : "Sin destinatarios"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
