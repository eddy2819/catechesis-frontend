"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { listParents } from "@/lib/parents"
import { createStudent, StudentPayload } from "@/lib/students"
import { ArrowLeft, Users } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect, useState } from "react"

export default function NewStudentPage() {
  const router = useRouter()
  const [parents, setParents] = useState<any[]>([])
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)


  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    grade: "",
    baptism_date: "",
    first_communion_date: "",
    confirmation_date: "",
    allergies: "",
    address: "",
    medical_conditions: "",
    status: "active" as "active" | "inactive",
  })

  
  const [allParents, setAllParents] = useState<any[]>([])

  useEffect(() => {
    async function fetchParents() {
      try {
        const data = await listParents()
        setParents(data)
      } catch (error){
        console.error("Error fetching parents:", error)
      }
    }
    fetchParents()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleParentChange = (parentId: string) => {
    setSelectedParentIds((prev) =>
      prev.includes(parentId) ? prev.filter((id) => id !== parentId) : [...prev, parentId]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => { 
    e.preventDefault()
    setIsSubmitting(true)

    const payload: StudentPayload = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      birth_date: formData.birth_date || undefined,
      address: formData.address || undefined,
      grade: formData.grade,
      sacrament: {
        baptism_date: formData.baptism_date || null,
        first_communion_date: formData.first_communion_date || null,
        confirmation_date: formData.confirmation_date || null,
      },
      allergies: formData.allergies || undefined,
      medical_conditions: formData.medical_conditions || undefined,
      status: formData.status,
    }

    //const newStudent = dataStore.addStudent(student)

    // Update parent records to include this student
    //selectedParentIds.forEach((parentId) => {
    //  const parent = dataStore.getParents().find((p) => p.id === parentId)
    //  if (parent) {
    //    dataStore.updateParent(parentId, {
    //      studentIds: [...parent.studentIds, newStudent.id],
    //    })
    //  }
    //})

    try {
      await createStudent(payload)
      router.push("/dashboard/students")
    } catch (error) {
      console.error("Error creating student:", error)
      alert("Error al crear el estudiante. Por favor, intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const toggleParent = (parentId: string) => {
    setSelectedParentIds((prev) =>
      prev.includes(parentId) ? prev.filter((id) => id !== parentId) : [...prev, parentId],
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/students">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Estudiantes
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nuevo Estudiante</h1>
        <p className="text-amber-700">Registra un nuevo estudiante en el sistema</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información Personal</CardTitle>
                <CardDescription className="text-amber-700">Datos básicos del estudiante</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-amber-900">
                      Nombre *
                    </Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.first_name}
                      onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-amber-900">
                      Apellido *
                    </Label>
                    <Input
                      id="lastName"
                      required
                      value={formData.last_name}
                      onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="birth_date" className="text-amber-900">
                      Fecha de Nacimiento *
                    </Label>
                    <Input
                      id="birth_date"
                      type="date"
                      required
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-amber-900">
                      Grado/Nivel *
                    </Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) => setFormData({ ...formData, grade: value })}
                    >
                      <SelectTrigger className="border-amber-200 focus:border-amber-600">
                        <SelectValue placeholder="Seleccionar grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preparación">Preparación</SelectItem>
                        <SelectItem value="1° Comunión">1° Comunión</SelectItem>
                        <SelectItem value="2° Comunión">2° Comunión</SelectItem>
                        <SelectItem value="Año Biblico">Año Biblico</SelectItem>
                        <SelectItem value="Confirmación 1">Confirmación 1</SelectItem>
                        <SelectItem value="Confirmación 2">Confirmación 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-amber-900">
                      Dirección *
                    </Label>
                    <Input
                      id="address"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Sacramentos</CardTitle>
                <CardDescription className="text-amber-700">Registro de sacramentos recibidos</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="baptismDate" className="text-amber-900">
                      Bautismo
                    </Label>
                    <Input
                      id="baptism_date"
                      type="date"
                      value={formData.baptism_date}
                      onChange={(e) => setFormData({ ...formData, baptism_date: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="firstCommunionDate" className="text-amber-900">
                      Primera Comunión
                    </Label>
                    <Input
                      id="firstCommunionDate"
                      type="date"
                      value={formData.first_communion_date}
                      onChange={(e) => setFormData({ ...formData, first_communion_date: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmationDate" className="text-amber-900">
                      Confirmación
                    </Label>
                    <Input
                      id="confirmationDate"
                      type="date"
                      value={formData.confirmation_date}
                      onChange={(e) => setFormData({ ...formData, confirmation_date: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información Médica</CardTitle>
                <CardDescription className="text-amber-700">Alergias y notas médicas importantes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="allergies" className="text-amber-900">
                    Alergias
                  </Label>
                  <Input
                    id="allergies"
                    placeholder="Ej: Polen, maní, lactosa..."
                    value={formData.allergies}
                    onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="medicalNotes" className="text-amber-900">
                    Notas Médicas
                  </Label>
                  <Textarea
                    id="medicalNotes"
                    placeholder="Condiciones médicas, medicamentos, contactos de emergencia..."
                    value={formData.medical_conditions}
                    onChange={(e) => setFormData({ ...formData, medical_conditions: e.target.value })}
                    className="border-amber-200 focus:border-amber-600 min-h-24"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Padres y Tutores
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Selecciona los padres o tutores del estudiante
                </CardDescription>
              </CardHeader>
              <CardContent>
                {allParents.length === 0 ? (
                  <div className="text-center py-6">
                    <p className="text-amber-700 mb-4">No hay padres registrados</p>
                    <Link href="/dashboard/families/new">
                      <Button
                        type="button"
                        variant="outline"
                        className="border-amber-300 text-amber-900 bg-transparent"
                      >
                        Registrar Padre/Tutor
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {allParents.map((parent) => (
                      <div
                        key={parent.id}
                        className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 cursor-pointer"
                        onClick={() => toggleParent(parent.id)}
                      >
                        <Checkbox
                          checked={selectedParentIds.includes(parent.id)}
                          onCheckedChange={() => toggleParent(parent.id)}
                        />
                        <div className="flex-1">
                          <p className="font-medium text-amber-900">
                            {parent.firstName} {parent.lastName}
                          </p>
                          <p className="text-sm text-amber-700">
                            {parent.relationship} • {parent.phone}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Estado</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={formData.status}
                  onValueChange={(value: "active" | "inactive") => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger className="border-amber-200 focus:border-amber-600">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Guardar Estudiante
                  </Button>
                  <Link href="/dashboard/students" className="block">
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
