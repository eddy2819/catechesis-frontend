"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { listParents } from "@/lib/parents";
import {
  getStudent,
  StudentPayload,
  updateStudent,
  uploadStudentPhoto,
} from "@/lib/students";
import { ArrowLeft, UserCircle, Users } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type React from "react";
import { useEffect, useState } from "react";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();
  const [student, setStudent] = useState<StudentPayload | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setIsUploading] = useState(false);

  interface UploadResponse {
    photo_url: string;
  }

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    grade: "",
    baptism_date: "",
    first_communion_date: "",
    confirmation_date: "",
    allergies: "",
    medical_conditions: "",
    status: "active" as "active" | "inactive",
    photo_url: "",
    parent_ids: [] as string[],
  });
  const [selectedParentIds, setSelectedParentIds] = useState<string[]>([]);
  const [allParents, setAllParents] = useState<any[]>([]);

  useEffect(() => {
    const id = params.id as string;
    const fetchData = async () => {
      try {
        const [studentData, allParentsData] = await Promise.all([
          getStudent(id) as Promise<StudentPayload>,
          listParents() as Promise<any[]>,
        ]);
        setAllParents(allParentsData);
        setStudent(studentData);

        if (studentData.parent_ids && Array.isArray(studentData.parent_ids)) {
          setSelectedParentIds(studentData.parent_ids);
        }

        setFormData({
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          birth_date: studentData.birth_date
            ? new Date(studentData.birth_date).toISOString().split("T")[0]
            : "",
          grade: studentData.grade || "",
          baptism_date: studentData.sacrament?.baptism_date
            ? new Date(studentData.sacrament.baptism_date)
                .toISOString()
                .split("T")[0]
            : "",
          first_communion_date: studentData.sacrament?.first_communion_date
            ? new Date(studentData.sacrament.first_communion_date)
                .toISOString()
                .split("T")[0]
            : "",
          confirmation_date: studentData.sacrament?.confirmation_date
            ? new Date(studentData.sacrament.confirmation_date)
                .toISOString()
                .split("T")[0]
            : "",
          allergies: studentData.allergies || "",
          medical_conditions: studentData.medical_conditions || "",
          status: studentData.status,
          photo_url: studentData.photo_url || "",
          parent_ids: studentData.parent_ids || [],
        });
        if (studentData.photo_url) {
          setPreviewUrl(studentData.photo_url);
        }
      } catch (error) {
        console.error("Error fetching student:", error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!student || !student.id) return;

    const updates = {
      first_name: formData.first_name,
      last_name: formData.last_name,
      birth_date: formData.birth_date,
      grade: formData.grade,
      sacrament: {
        baptism_date: formData.baptism_date ? formData.baptism_date : undefined,
        first_communion_date: formData.first_communion_date
          ? formData.first_communion_date
          : undefined,
        confirmation_date: formData.confirmation_date
          ? formData.confirmation_date
          : undefined,
      },
      allergies: formData.allergies || undefined,
      medical_conditions: formData.medical_conditions || undefined,
      status: formData.status,
      photo_url: formData.photo_url || undefined,
      parent_ids: selectedParentIds,
    };

    try {
      await updateStudent(student.id, updates);
      router.push(`/dashboard/students/${student.id}`);
    } catch (error) {
      console.error("Error updating student:", error);
    }
  };

  const toggleParent = (parentId: string) => {
    setSelectedParentIds((prev) =>
      prev.includes(parentId)
        ? prev.filter((id) => id !== parentId)
        : [...prev, parentId],
    );
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);

      // (Lógica de la vista previa)
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);

      console.log("Paso 1: Iniciando subida de foto...");

      try {
        const response = (await uploadStudentPhoto(file)) as UploadResponse;

        // ¡MIRA ESTE LOG!
        console.log("Paso 2: Respuesta recibida del backend:", response);

        if (response.photo_url) {
          // ¡Y MIRA ESTE LOG!
          console.log(
            "Paso 3: Guardando URL en el estado:",
            response.photo_url,
          );
          setFormData({ ...formData, photo_url: response.photo_url });
        } else {
          console.warn("Paso 3 (FALLIDO): La respuesta no tiene 'photo_url'.");
        }
      } catch (error) {
        // ¡MIRA SI HAY UN ERROR!
        console.error("Paso 1 (FALLIDO): Error en uploadStudentPhoto:", error);
      }
    }
  };

  if (!student) {
    return (
      <div className="p-8">
        <p className="text-amber-700">Estudiante no encontrado</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href={`/dashboard/students/${student.id}`}>
          <Button
            variant="ghost"
            className="text-amber-900 hover:bg-amber-100 mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Estudiante
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">
          Editar Estudiante
        </h1>
        <p className="text-amber-700">
          Actualiza la información del estudiante
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">
                  Información Personal
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Datos básicos del estudiante
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-amber-900">Foto de Perfil</Label>
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center overflow-hidden border border-amber-200">
                      {previewUrl ? (
                        <img
                          src={previewUrl}
                          alt="vista previa"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <UserCircle className="w-12 h-12 text-amber-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Input
                        id="file-upload"
                        type="file"
                        accept="image/png, image/jpeg, image/webp" // Define tipos de archivo
                        onChange={handleImageChange}
                        className="hidden" // Ocultamos el input feo
                      />
                      <Label
                        htmlFor="file-upload" // Esto activa el input
                        className="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300"
                      >
                        {selectedFile ? "Cambiar foto" : "Seleccionar foto"}
                      </Label>
                      <p className="text-xs text-amber-700 mt-2">
                        PNG, JPG o WEBP.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-amber-900">
                      Nombre *
                    </Label>
                    <Input
                      id="firstName"
                      required
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({ ...formData, first_name: e.target.value })
                      }
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
                      onChange={(e) =>
                        setFormData({ ...formData, last_name: e.target.value })
                      }
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth" className="text-amber-900">
                      Fecha de Nacimiento *
                    </Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      required
                      value={formData.birth_date}
                      onChange={(e) =>
                        setFormData({ ...formData, birth_date: e.target.value })
                      }
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grade" className="text-amber-900">
                      Grado/Nivel *
                    </Label>
                    <Select
                      value={formData.grade}
                      onValueChange={(value) =>
                        setFormData({ ...formData, grade: value })
                      }
                    >
                      <SelectTrigger className="border-amber-200 focus:border-amber-600">
                        <SelectValue placeholder="Seleccionar grado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Preparación">Preparación</SelectItem>
                        <SelectItem value="1° Comunión">1° Comunión</SelectItem>
                        <SelectItem value="2° Comunión">2° Comunión</SelectItem>
                        <SelectItem value="Confirmación 1">
                          Confirmación 1
                        </SelectItem>
                        <SelectItem value="Confirmación 2">
                          Confirmación 2
                        </SelectItem>
                        <SelectItem value="Confirmación 3">
                          Confirmación 3
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Sacramentos</CardTitle>
                <CardDescription className="text-amber-700">
                  Registro de sacramentos recibidos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="baptismDate" className="text-amber-900">
                      Bautismo
                    </Label>
                    <Input
                      id="baptismDate"
                      type="date"
                      value={formData.baptism_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          baptism_date: e.target.value,
                        })
                      }
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="firstCommunionDate"
                      className="text-amber-900"
                    >
                      Primera Comunión
                    </Label>
                    <Input
                      id="firstCommunionDate"
                      type="date"
                      value={formData.first_communion_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          first_communion_date: e.target.value,
                        })
                      }
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmationDate"
                      className="text-amber-900"
                    >
                      Confirmación
                    </Label>
                    <Input
                      id="confirmationDate"
                      type="date"
                      value={formData.confirmation_date}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          confirmation_date: e.target.value,
                        })
                      }
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">
                  Información Médica
                </CardTitle>
                <CardDescription className="text-amber-700">
                  Alergias y notas médicas importantes
                </CardDescription>
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
                    onChange={(e) =>
                      setFormData({ ...formData, allergies: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        medical_conditions: e.target.value,
                      })
                    }
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
                    <p className="text-amber-700 mb-4">
                      No hay padres registrados
                    </p>
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
                        className="flex items-center space-x-3 p-3 bg-amber-50 rounded-lg hover:bg-amber-100 "
                      >
                        <Checkbox
                          id={`parent-${parent.id}`}
                          checked={selectedParentIds.includes(parent.id)}
                          onCheckedChange={() => toggleParent(parent.id)}
                        />
                        <Label
                          htmlFor={`parent-${parent.id}`}
                          className="flex-1 cursor-pointer"
                        >
                          <p className="font-medium text-amber-900">
                            {parent.first_name} {parent.last_name}
                          </p>
                          <p className="text-sm text-amber-700">
                            {parent.relationship} • {parent.phone}
                          </p>
                        </Label>
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
                  onValueChange={(value: "active" | "inactive") =>
                    setFormData({ ...formData, status: value })
                  }
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
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                  >
                    Guardar Cambios
                  </Button>
                  <Link
                    href={`/dashboard/students/${student.id}`}
                    className="block"
                  >
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
  );
}
