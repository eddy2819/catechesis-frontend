"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { createParent } from "@/lib/parents"
import { listStudents } from "@/lib/students"
import type { Student } from "@/lib/types"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function NewParentPage() {
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    relationship_type: "mother" as "mother" | "father" | "guardian" | "other",
    address: "",
    occupation: "",
    student_ids: [] as string[],
  })

  useEffect(() => {
    async function fetchStudents() {
      try {
        const data = await listStudents()
        setStudents(data as Student[])
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }
    fetchStudents()
  }, [])

  const handleSubmit =  async (e: React.FormEvent) => {
    e.preventDefault()

    const parent = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      phone: formData.phone,
      relationship_type: formData.relationship_type,
      address: formData.address || undefined,
      occupation: formData.occupation || undefined,
      student_ids: formData.student_ids,
    }

    try{
      await createParent(parent)
      router.push("/dashboard/families")
    } catch (error) {
      console.error("Error creating parent:", error)
      alert("Error al crear el padre/tutor. Por favor, intenta de nuevo.")
    }
  }

  const toggleStudent = (studentId: string) => {
    setFormData((prev) => ({
      ...prev,
      student_ids: prev.student_ids.includes(studentId)
        ? prev.student_ids.filter((id) => id !== studentId)
        : [...prev.student_ids, studentId],
    }))
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/families">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Familias
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nuevo Padre/Tutor</h1>
        <p className="text-amber-700">Registra un nuevo padre o tutor en el sistema</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información Personal</CardTitle>
                <CardDescription className="text-amber-700">Datos básicos del padre/tutor</CardDescription>
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
                <div className="space-y-2">
                  <Label htmlFor="relationship" className="text-amber-900">
                    Relación *
                  </Label>
                  <Select
                    value={formData.relationship_type}
                    onValueChange={(value: "mother" | "father" | "guardian" | "other") =>
                      setFormData({ ...formData, relationship_type: value })
                    }
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mother">Madre</SelectItem>
                      <SelectItem value="father">Padre</SelectItem>
                      <SelectItem value="guardian">Tutor/a</SelectItem>
                      <SelectItem value="other">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información de Contacto</CardTitle>
                <CardDescription className="text-amber-700">Email, teléfono y dirección</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-amber-900">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-amber-900">
                      Teléfono *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-amber-900">
                    Dirección
                  </Label>
                  <Textarea
                    id="address"
                    placeholder="Calle, número, ciudad..."
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="occupation" className="text-amber-900">
                    Ocupación
                  </Label>
                  <Input
                    id="occupation"
                    placeholder="Profesión u ocupación"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Hijos/Estudiantes</CardTitle>
                <CardDescription className="text-amber-700">
                  Selecciona los estudiantes relacionados con este padre/tutor
                </CardDescription>
              </CardHeader>
              <CardContent>
                {students.length === 0 ? (
                  <p className="text-amber-700 text-center py-4">
                    No hay estudiantes registrados. Primero debes agregar estudiantes.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg">
                        <Checkbox
                          id={`student-${student.id}`}
                          checked={formData.student_ids.includes(student.id)}
                          onCheckedChange={() => toggleStudent(student.id)}
                        />
                        <Label
                          htmlFor={`student-${student.id}`}
                          className="flex-1 cursor-pointer text-amber-900 font-normal"
                        >
                          {student.first_name} {student.last_name} - {student.grade}
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
                  <Button type="submit" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                    Guardar Padre/Tutor
                  </Button>
                  <Link href="/dashboard/families" className="block">
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
