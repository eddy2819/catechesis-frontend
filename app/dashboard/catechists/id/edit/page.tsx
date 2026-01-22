"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { dataStore } from "@/lib/store"
import type { Catechist } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function EditCatechistPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [catechist, setCatechist] = useState<Catechist | null>(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "catequista" as Catechist["role"],
    specialization: "",
    schedule: "",
    address: "",
    neighborhood: "",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
    status: "active" as Catechist["status"],
  })

  useEffect(() => {
    const data = dataStore.getCatechistById(params.id)
    if (data) {
      setCatechist(data)
      setFormData({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        role: data.role,
        specialization: data.specialization || "",
        schedule: data.schedule || "",
        address: data.address || "",
        neighborhood: data.neighborhood || "",
        emergencyContact: data.emergencyContact || "",
        emergencyPhone: data.emergencyPhone || "",
        notes: data.notes || "",
        status: data.status,
      })
    }
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      dataStore.updateCatechist(params.id, formData)
      router.push("/dashboard/catechists")
    } catch (error) {
      console.error("Error updating catechist:", error)
      setIsSubmitting(false)
    }
  }

  if (!catechist) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-amber-700">Cargando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/catechists">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Editar Catequista</h1>
          <p className="text-amber-700 mt-1">
            Actualiza la información de {catechist.firstName} {catechist.lastName}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Información Personal</h2>
            <div className="grid gap-4 md:grid-cols-2">
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
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input
                  id="phone"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="neighborhood">Barrio</Label>
                <Input
                  id="neighborhood"
                  placeholder="Ej: Centro, La Floresta, San Blas"
                  value={formData.neighborhood}
                  onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
            </div>
          </Card>

          {/* Role & Responsibilities */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Rol y Responsabilidades</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role">Rol *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value as Catechist["role"] })}
                >
                  <SelectTrigger className="border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="coordinador">Coordinador</SelectItem>
                    <SelectItem value="catequista">Catequista</SelectItem>
                    <SelectItem value="secretario">Secretario</SelectItem>
                    <SelectItem value="auxiliar">Auxiliar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Estado *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value as Catechist["status"] })}
                >
                  <SelectTrigger className="border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialization">Especialización</Label>
                <Input
                  id="specialization"
                  placeholder="Ej: Primera Comunión, Confirmación"
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="schedule">Horario</Label>
                <Input
                  id="schedule"
                  placeholder="Ej: Sábados 10:00-12:00"
                  value={formData.schedule}
                  onChange={(e) => setFormData({ ...formData, schedule: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
            </div>
          </Card>

          {/* Emergency Contact */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Contacto de Emergencia</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="emergencyContact">Nombre del Contacto</Label>
                <Input
                  id="emergencyContact"
                  value={formData.emergencyContact}
                  onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
                <Input
                  id="emergencyPhone"
                  value={formData.emergencyPhone}
                  onChange={(e) => setFormData({ ...formData, emergencyPhone: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
            </div>
          </Card>

          {/* Additional Notes */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-amber-900 mb-4">Notas Adicionales</h2>
            <div className="space-y-2">
              <Label htmlFor="notes">Observaciones</Label>
              <Textarea
                id="notes"
                rows={4}
                placeholder="Cualquier información adicional relevante..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="border-amber-200 focus:border-amber-400 resize-none"
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/catechists">Cancelar</Link>
            </Button>
            <Button type="submit" disabled={isSubmitting} className="bg-amber-600 hover:bg-amber-700">
              {isSubmitting ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
