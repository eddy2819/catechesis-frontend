"use client"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { deleteStudent, getStudent, StudentPayload } from "@/lib/students"
import type { Parent } from "@/lib/types"
import { ArrowLeft, Calendar, ClipboardCheck, Edit, FileText, Trash2, UserCircle } from "lucide-react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function StudentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [student, setStudent] = useState<StudentPayload | null>(null)
  const [parents, setParents] = useState<Parent[]>([])
  const [previewUrl,setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string
    async function fetchStudent() {
      try {
        const data = (await getStudent(id)) as StudentPayload
        
        setStudent(data)
        if (data.parents && Array.isArray(data.parents))
          setParents(data.parents)

      } catch (error) {
        console.error("Error fetching student:", error)
      }
    }
    fetchStudent()
  }, [params.id])

  const handleDelete = async() => {
    if (student && student.id) {
      try {
        await deleteStudent(student.id)
        router.push("/dashboard/students")
      } catch (error) {
        console.error("Error deleting student:", error)
      }
    } else {
      console.error("Student ID is missing.")
    }
  }

  if (!student) {
    return (
      <div className="p-8">
        <p className="text-amber-700">Estudiante no encontrado</p>
      </div>
    )
  }

  const calculateAge = (dateOfBirth: string | null | undefined): number | string => {
    // 1. Maneja el caso de que la fecha no exista
    if (!dateOfBirth) {
      return "N/A" // O puedes devolver 0 o "Desconocida"
    }
    
    // 2. Crea el objeto Date dentro de la función
    const birthDate = new Date(dateOfBirth)
    
    // 3. Maneja el caso de que la fecha sea inválida
    if (isNaN(birthDate.getTime())) {
      return "Inválida"
    }

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
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
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center overflow-hidden border border-amber-200">
            {previewUrl ? (
              <img src={previewUrl} alt="Foto del Estudiante" className="w-full h-full object-cover" />
            ) : student.photo_url ? (
              <img src={student.photo_url} alt="Foto del Estudiante" className="w-full h-full object-cover" />
            ) : (
              <UserCircle className="w-12 h-12 text-amber-300" />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              {student.first_name} {student.last_name}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant={student.status === "active" ? "default" : "secondary"} className="bg-green-500">
                {student.status === "active" ? "Activo" : "Inactivo"}
              </Badge>
              <span className="text-amber-700">
                {calculateAge(student.birth_date)} años • {student.grade}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/dashboard/students/${student.id}/edit`}>
            <Button variant="outline" className="border-amber-300 text-amber-900 bg-transparent">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </Link>
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
                  Esta acción no se puede deshacer. Se eliminará permanentemente el registro del estudiante.
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

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="info" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Información
          </TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Asistencia
          </TabsTrigger>
          <TabsTrigger value="notes" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Notas
          </TabsTrigger>
          <TabsTrigger value="evaluations" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Evaluaciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información Personal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-amber-700">Fecha de Nacimiento</p>
                  <p className="text-amber-900">
    {student.birth_date
      ? new Date(student.birth_date).toLocaleDateString()
      : "No registrada"}
  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Edad</p>
                  <p className="text-amber-900">{calculateAge(student.birth_date)} años</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Grado/Nivel</p>
                  <p className="text-amber-900">{student.grade}</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Sacramentos</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-amber-700">Bautismo</p>
                  <p className="text-amber-900">
                    {student.sacrament?.baptism_date
                      ? new Date(student.sacrament.baptism_date).toLocaleDateString()
                      : "No registrado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Primera Comunión</p>
                  <p className="text-amber-900">
                    {student.sacrament?.first_communion_date
                      ? new Date(student.sacrament.first_communion_date).toLocaleDateString()
                      : "No registrado"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-amber-700">Confirmación</p>
                  <p className="text-amber-900">
                    {student.sacrament?.confirmation_date
                      ? new Date(student.sacrament.confirmation_date).toLocaleDateString()
                      : "No registrado"}
                  </p>
                </div>
              </CardContent>
            </Card>

            {(student.allergies || student.medical_conditions) && (
              <Card className="border-amber-200 md:col-span-2">
                <CardHeader>
                  <CardTitle className="text-amber-900">Información Médica</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {student.allergies && (
                    <div>
                      <p className="text-sm font-medium text-amber-700">Alergias</p>
                      <p className="text-amber-900">{student.allergies}</p>
                    </div>
                  )}
                  {student.medical_conditions && (
                    <div>
                      <p className="text-sm font-medium text-amber-700">Notas Médicas</p>
                      <p className="text-amber-900">{student.medical_conditions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <Card className="border-amber-200 md:col-span-2">
              <CardHeader>
                <CardTitle className="text-amber-900">Familia</CardTitle>
                <CardDescription className="text-amber-700">Padres y tutores registrados</CardDescription>
              </CardHeader>
              <CardContent>
                {parents.length === 0 ? (
                  <p className="text-amber-700 text-center py-4">No hay padres registrados</p>
                ) : (
                  <div className="space-y-3">
                    {parents.map((parent) => (
                      <div key={parent.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                        <div>
                          <p className="font-medium text-amber-900">
                            {parent.first_name} {parent.last_name}
                          </p>
                          <p className="text-sm text-amber-700">{parent.relationship_type}</p>
                        </div>
                        <div className="text-right text-sm text-amber-700">
                          <p>{parent.email}</p>
                          <p>{parent.phone}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Registro de Asistencia</CardTitle>
              <CardDescription className="text-amber-700">Historial de asistencia del estudiante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <Calendar className="h-16 w-16 text-amber-300 mb-4" />
                <p className="text-amber-700 text-center">No hay registros de asistencia</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notes">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Notas y Observaciones</CardTitle>
              <CardDescription className="text-amber-700">Notas sobre el estudiante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <FileText className="h-16 w-16 text-amber-300 mb-4" />
                <p className="text-amber-700 text-center">No hay notas registradas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="evaluations">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Evaluaciones</CardTitle>
              <CardDescription className="text-amber-700">Evaluaciones y progreso del estudiante</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-12">
                <ClipboardCheck className="h-16 w-16 text-amber-300 mb-4" />
                <p className="text-amber-700 text-center">No hay evaluaciones registradas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
