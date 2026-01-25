"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createCatechist } from "@/lib/catechists"
import type { Catechist } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function NewCatechistPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    ci: "",
    date_of_birth: "",
    email: "",
    phone_number: "",
    role: "catequista" as Catechist["role"],
    specialization: "",
    scheduled: "",
    status: "activo" as Catechist["status"],
    service_years: "",
    joined_date: new Date().toISOString().split("T")[0],
    address: "",
    notes: "",
  })

  

  const handleSubmit =async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    console.log("Submitting form data:", formData)
    try {
      await createCatechist(formData)
      router.push("/dashboard/catechists")
    } catch (error) {
      console.error("Error adding catechist:", error)
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/catechists">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Nuevo Catequista</h1>
          <p className="text-amber-700 mt-1">Registra un nuevo miembro del equipo</p>
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
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Apellido *</Label>
                <Input
                  id="lastName"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ci">Cedula </Label>
                <Input
                  id="ci"
                  type="text"
                  value={formData.ci}
                  onChange={(e) => setFormData({ ...formData, ci: e.target.value })}
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
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="date">Fecha Nacimiento</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2 ">
                <Label htmlFor="address">Dirección</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Años de servicio</Label>
                <Input
                  id="neighborhood"
                  type="text"
                  value={formData.service_years}
                  onChange={(e) => setFormData({ ...formData, service_years: e.target.value })}
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
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="inactivo">Inactivo</SelectItem>
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
                  value={formData.scheduled}
                  onChange={(e) => setFormData({ ...formData, scheduled: e.target.value })}
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
              {isSubmitting ? "Guardando..." : "Guardar Catequista"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
