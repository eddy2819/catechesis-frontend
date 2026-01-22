"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Edit, Trash2, Mail, Phone, MapPin, Briefcase, Users } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Parent, Student } from "@/lib/types"
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

export default function ParentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [parent, setParent] = useState<Parent | null>(null)
  const [students, setStudents] = useState<Student[]>([])

  useEffect(() => {
    const id = params.id as string
    const foundParent = dataStore.getParents().find((p) => p.id === id)
    if (foundParent) {
      setParent(foundParent)
      const allStudents = dataStore.getStudents()
      const relatedStudents = allStudents.filter((s) => foundParent.studentIds.includes(s.id))
      setStudents(relatedStudents)
    }
  }, [params.id])

  const handleDelete = () => {
    if (parent) {
      dataStore.deleteParent(parent.id)
      router.push("/dashboard/families")
    }
  }

  if (!parent) {
    return (
      <div className="p-8">
        <p className="text-amber-700">Padre/Tutor no encontrado</p>
      </div>
    )
  }

  const relationshipLabels = {
    mother: "Madre",
    father: "Padre",
    guardian: "Tutor/a",
    other: "Otro",
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
      </div>

      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center">
            <Users className="w-12 h-12 text-amber-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900 mb-2">
              {parent.firstName} {parent.lastName}
            </h1>
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="border-amber-300 text-amber-700 capitalize">
                {relationshipLabels[parent.relationship]}
              </Badge>
              <span className="text-amber-700">
                {parent.studentIds.length} {parent.studentIds.length === 1 ? "hijo" : "hijos"}
              </span>
            </div>
          </div>
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
                  Esta acción no se puede deshacer. Se eliminará permanentemente el registro del padre/tutor.
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
            <CardTitle className="text-amber-900">Información de Contacto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-700">Email</p>
                <p className="text-amber-900">{parent.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-amber-600" />
              <div>
                <p className="text-sm font-medium text-amber-700">Teléfono</p>
                <p className="text-amber-900">{parent.phone}</p>
              </div>
            </div>
            {parent.address && (
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-amber-600 mt-1" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Dirección</p>
                  <p className="text-amber-900">{parent.address}</p>
                </div>
              </div>
            )}
            {parent.occupation && (
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-amber-600" />
                <div>
                  <p className="text-sm font-medium text-amber-700">Ocupación</p>
                  <p className="text-amber-900">{parent.occupation}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-900">Hijos/Estudiantes</CardTitle>
            <CardDescription className="text-amber-700">Estudiantes relacionados</CardDescription>
          </CardHeader>
          <CardContent>
            {students.length === 0 ? (
              <p className="text-amber-700 text-center py-4">No hay estudiantes relacionados</p>
            ) : (
              <div className="space-y-3">
                {students.map((student) => (
                  <Link key={student.id} href={`/dashboard/students/${student.id}`}>
                    <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors cursor-pointer">
                      <div>
                        <p className="font-medium text-amber-900">
                          {student.firstName} {student.lastName}
                        </p>
                        <p className="text-sm text-amber-700">{student.grade}</p>
                      </div>
                      <Badge
                        variant={student.status === "active" ? "default" : "secondary"}
                        className={student.status === "active" ? "bg-green-500" : ""}
                      >
                        {student.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="border-amber-200 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-amber-900">Comunicaciones Recientes</CardTitle>
            <CardDescription className="text-amber-700">Historial de mensajes y notificaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-amber-700 text-center py-8">No hay comunicaciones registradas</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
