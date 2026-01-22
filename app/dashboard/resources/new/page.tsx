"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { dataStore } from "@/lib/store"
import { useAuth } from "@/lib/auth-context"

export default function NewResourcePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "document" as "document" | "video" | "image" | "link" | "other",
    url: "",
    category: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) return

    const resource = {
      title: formData.title,
      description: formData.description || undefined,
      type: formData.type,
      url: formData.url,
      category: formData.category,
      uploadedBy: user.id,
      uploadedAt: new Date(),
    }

    dataStore.addResource(resource)
    router.push("/dashboard/resources")
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/dashboard/resources">
          <Button variant="ghost" className="text-amber-900 hover:bg-amber-100 mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a Recursos
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-amber-900 mb-2">Nuevo Recurso</h1>
        <p className="text-amber-700">Agrega un nuevo recurso a la biblioteca</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Información del Recurso</CardTitle>
                <CardDescription className="text-amber-700">Detalles del material</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-amber-900">
                    Título *
                  </Label>
                  <Input
                    id="title"
                    required
                    placeholder="Ej: Guía de oraciones para niños"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-amber-900">
                    Descripción
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Breve descripción del recurso..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="border-amber-200 focus:border-amber-600 min-h-24"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="type" className="text-amber-900">
                      Tipo *
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value: "document" | "video" | "image" | "link" | "other") =>
                        setFormData({ ...formData, type: value })
                      }
                    >
                      <SelectTrigger className="border-amber-200 focus:border-amber-600">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="document">Documento</SelectItem>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="image">Imagen</SelectItem>
                        <SelectItem value="link">Enlace</SelectItem>
                        <SelectItem value="other">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-amber-900">
                      Categoría *
                    </Label>
                    <Input
                      id="category"
                      required
                      placeholder="Ej: Oraciones, Sacramentos, Actividades..."
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="border-amber-200 focus:border-amber-600"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url" className="text-amber-900">
                    URL o Enlace *
                  </Label>
                  <Input
                    id="url"
                    type="url"
                    required
                    placeholder="https://..."
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                  <p className="text-xs text-amber-600">
                    Puede ser un enlace a Google Drive, Dropbox, YouTube, o cualquier otro servicio
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <Button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white"
                    disabled={!formData.title || !formData.url || !formData.category}
                  >
                    Guardar Recurso
                  </Button>
                  <Link href="/dashboard/resources" className="block">
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

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-sm text-amber-900">Sugerencias</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-xs text-amber-700 space-y-2">
                  <li>• Usa categorías consistentes para organizar mejor</li>
                  <li>• Agrega descripciones claras para facilitar la búsqueda</li>
                  <li>• Verifica que los enlaces sean accesibles</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
