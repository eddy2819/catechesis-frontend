"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { dataStore } from "@/lib/store"
import type { AltarServer } from "@/lib/types"

const daysOfWeek = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
]

export default function NewAltarServerPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentId: "",
    dateOfBirth: "",
    phone: "",
    neighborhood: "",
    parentName: "",
    parentPhone: "",
    role: "monaguillo" as AltarServer["role"],
    experience: "principiante" as AltarServer["experience"],
    availableDays: [] as string[],
    joinedDate: new Date().toISOString().split("T")[0],
    notes: "",
  })

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    dataStore.addAltarServer({
      firstName: formData.firstName,
      lastName: formData.lastName,
      documentId: formData.documentId || undefined,
      dateOfBirth: new Date(formData.dateOfBirth),
      phone: formData.phone || undefined,
      neighborhood: formData.neighborhood || undefined,
      parentName: formData.parentName || undefined,
      parentPhone: formData.parentPhone || undefined,
      role: formData.role,
      experience: formData.experience,
      availableDays: formData.availableDays,
      joinedDate: new Date(formData.joinedDate),
      status: "active",
      notes: formData.notes || undefined,
    })
    router.push("/dashboard/altar-servers")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="ghost" size="icon" className="text-amber-700 hover:bg-amber-100">
          <Link href="/dashboard/altar-servers">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Nuevo Monaguillo</h1>
          <p className="text-amber-700 mt-1">Registra un nuevo monaguillo en la parroquia</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card className="border-amber-200">
          <CardHeader className="border-b border-amber-100 bg-amber-50/50">
            <CardTitle className="text-amber-900">Información Personal</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="documentId">Numero de Cedula</Label>
                <Input
                  id="documentId"
                  placeholder="Ej: 1234567890"
                  value={formData.documentId}
                  onChange={(e) => setFormData({ ...formData, documentId: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Fecha de Nacimiento *</Label>
                <Input
                  id="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="neighborhood">Barrio</Label>
                <Input
                  id="neighborhood"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="border-b border-amber-100 bg-amber-50/50">
            <CardTitle className="text-amber-900">Padre o Tutor</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentName">Nombre del Padre/Tutor</Label>
                <Input
                  id="parentName"
                  value={formData.parentName}
                  onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parentPhone">Telefono del Padre/Tutor</Label>
                <Input
                  id="parentPhone"
                  value={formData.parentPhone}
                  onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="border-b border-amber-100 bg-amber-50/50">
            <CardTitle className="text-amber-900">Servicio Liturgico</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select value={formData.role} onValueChange={(v) => setFormData({ ...formData, role: v as AltarServer["role"] })}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monaguillo">Monaguillo</SelectItem>
                    <SelectItem value="turiferario">Turiferario</SelectItem>
                    <SelectItem value="crucifero">Crucifero</SelectItem>
                    <SelectItem value="ceroferario">Ceroferario</SelectItem>
                    <SelectItem value="acólito">Acólito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="experience">Nivel de Experiencia *</Label>
                <Select value={formData.experience} onValueChange={(v) => setFormData({ ...formData, experience: v as AltarServer["experience"] })}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="principiante">Principiante</SelectItem>
                    <SelectItem value="intermedio">Intermedio</SelectItem>
                    <SelectItem value="avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="joinedDate">Fecha de Ingreso</Label>
                <Input
                  id="joinedDate"
                  type="date"
                  value={formData.joinedDate}
                  onChange={(e) => setFormData({ ...formData, joinedDate: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Label>Dias Disponibles</Label>
              <div className="flex flex-wrap gap-3">
                {daysOfWeek.map((day) => (
                  <label
                    key={day.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <Checkbox
                      checked={formData.availableDays.includes(day.id)}
                      onCheckedChange={() => handleDayToggle(day.id)}
                      className="border-amber-300 data-[state=checked]:bg-amber-600"
                    />
                    <span className="text-sm text-amber-900">{day.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader className="border-b border-amber-100 bg-amber-50/50">
            <CardTitle className="text-amber-900">Notas Adicionales</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Observaciones, habilidades especiales, etc."
              className="border-amber-200 focus:border-amber-400 min-h-24"
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button asChild variant="outline" className="border-amber-300 text-amber-900 hover:bg-amber-50">
            <Link href="/dashboard/altar-servers">Cancelar</Link>
          </Button>
          <Button type="submit" className="bg-amber-600 hover:bg-amber-700 text-white">
            <Save className="mr-2 h-4 w-4" />
            Guardar Monaguillo
          </Button>
        </div>
      </form>
    </div>
  )
}
