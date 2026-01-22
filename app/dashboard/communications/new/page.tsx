"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/store"
import type { Parent } from "@/lib/types"
import { useAuth } from "@/lib/auth-context"

export default function NewCommunicationPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [parents, setParents] = useState<Parent[]>([])
  const [formData, setFormData] = useState({
    subject: "",
    message: "",
    type: "email" as "email" | "notification",
    recipients: [] as string[],
  })

  useEffect(() => {
    setParents(dataStore.getParents())
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const communication = {
      subject: formData.subject,
      message: formData.message,
      recipients: formData.recipients,
      sentBy: user.id,
      sentAt: new Date(),
      type: formData.type,
      status: "sent" as const,
    }

    dataStore.addCommunication(communication)
    router.push("/dashboard/communications")
  }

  const toggleRecipient = (parentId: string) => {
    setFormData((prev) => ({
      ...prev,
      recipients: prev.recipients.includes(parentId)
        ? prev.recipients.filter((id) => id !== parentId)
        : [...prev.recipients, parentId],
    }))
  }

  const selectAll = () => {
    setFormData((prev) => ({
      ...prev,
      recipients: parents.map((p) => p.id),
    }))
  }

  const deselectAll = () => {
    setFormData((prev) => ({
      ...prev,
      recipients: [],
    }))
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/communications">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Comunicaciones
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nueva Comunicación</h1>
        <p className="text-amber-700">Envía un mensaje a las familias</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información del Mensaje</CardTitle>
                <CardDescription className="text-amber-700">Contenido de la comunicación</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-amber-900">
                    Tipo *
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: "email" | "notification") => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="notification">Notificación</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-amber-900">
                    Asunto *
                  </Label>
                  <Input
                    id="subject"
                    required
                    placeholder="Ej: Recordatorio de clase este sábado"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-amber-900">
                    Mensaje *
                  </Label>
                  <Textarea
                    id="message"
                    required
                    placeholder="Escribe tu mensaje aquí..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="border-amber-200 focus:border-amber-600 min-h-32"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-amber-900">Destinatarios</CardTitle>
                    <CardDescription className="text-amber-700">
                      Selecciona los padres que recibirán el mensaje
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={selectAll}
                      className="border-amber-300 text-amber-900 bg-transparent"
                    >
                      Todos
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={deselectAll}
                      className="border-amber-300 text-amber-900 bg-transparent"
                    >
                      Ninguno
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {parents.length === 0 ? (
                  <p className="text-amber-700 text-center py-4">
                    No hay padres registrados. Primero debes agregar familias.
                  </p>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {parents.map((parent) => (
                      <div key={parent.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                        <Checkbox
                          id={`parent-${parent.id}`}
                          checked={formData.recipients.includes(parent.id)}
                          onCheckedChange={() => toggleRecipient(parent.id)}
                        />
                        <Label
                          htmlFor={`parent-${parent.id}`}
                          className="flex-1 cursor-pointer text-amber-900 font-normal"
                        >
                          <div>
                            <p className="font-medium">
                              {parent.firstName} {parent.lastName}
                            </p>
                            <p className="text-sm text-amber-700">{parent.email}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-sm text-amber-900">
                    <p className="font-medium mb-1">Resumen:</p>
                    <p>
                      {formData.recipients.length} {formData.recipients.length === 1 ? "destinatario" : "destinatarios"}
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={!formData.subject || !formData.message || formData.recipients.length === 0}
                  >
                    Enviar Comunicación
                  </Button>
                  <Link href="/dashboard/communications" className="block">
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
