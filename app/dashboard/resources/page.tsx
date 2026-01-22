"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, FolderOpen, FileText, Video, ImageIcon, File, LinkIcon } from "lucide-react"
import { dataStore } from "@/lib/store"
import type { Resource } from "@/lib/types"

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")

  useEffect(() => {
    setResources(dataStore.getResources())
  }, [])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (resource.description && resource.description.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesType = filterType === "all" || resource.type === filterType
    return matchesSearch && matchesType
  })

  const typeIcons = {
    document: FileText,
    video: Video,
    image: ImageIcon,
    link: LinkIcon,
    other: File,
  }

  const typeLabels = {
    document: "Documento",
    video: "Video",
    image: "Imagen",
    link: "Enlace",
    other: "Otro",
  }

  const typeColors = {
    document: "bg-blue-500",
    video: "bg-red-500",
    image: "bg-green-500",
    link: "bg-purple-500",
    other: "bg-gray-500",
  }

  // Group resources by category
  const categories = Array.from(new Set(filteredResources.map((r) => r.category)))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-amber-900 mb-2">Recursos</h1>
          <p className="text-amber-700">Biblioteca de materiales y recursos para catequesis</p>
        </div>
        <Link href="/dashboard/resources/new">
          <Button className="bg-amber-600 hover:bg-amber-700 text-white">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Recurso
          </Button>
        </Link>
      </div>

      <Card className="border-amber-200 mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-amber-500" />
              <Input
                placeholder="Buscar recursos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 border-amber-200 focus:border-amber-600"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                onClick={() => setFilterType("all")}
                className={filterType === "all" ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"}
              >
                Todos
              </Button>
              {Object.entries(typeLabels).map(([type, label]) => (
                <Button
                  key={type}
                  variant={filterType === type ? "default" : "outline"}
                  onClick={() => setFilterType(type)}
                  className={filterType === type ? "bg-amber-600" : "border-amber-300 text-amber-900 bg-transparent"}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {filteredResources.length === 0 ? (
        <Card className="border-amber-200">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-16 w-16 text-amber-300 mb-4" />
            <p className="text-amber-700 text-center mb-4">
              {searchQuery || filterType !== "all" ? "No se encontraron recursos" : "No hay recursos disponibles"}
            </p>
            {!searchQuery && filterType === "all" && (
              <Link href="/dashboard/resources/new">
                <Button className="bg-amber-600 hover:bg-amber-700 text-white">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Primer Recurso
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-8">
          {categories.length === 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredResources.map((resource) => {
                const TypeIcon = typeIcons[resource.type]
                return (
                  <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">
                    <Card className="border-amber-200 hover:border-amber-400 transition-colors cursor-pointer h-full">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3 flex-1">
                            <TypeIcon className="h-5 w-5 text-amber-600 mt-1" />
                            <div className="flex-1">
                              <CardTitle className="text-lg text-amber-900">{resource.title}</CardTitle>
                              {resource.description && (
                                <CardDescription className="text-amber-700 mt-1">
                                  {resource.description}
                                </CardDescription>
                              )}
                            </div>
                          </div>
                          <Badge className={`${typeColors[resource.type]} text-white`}>
                            {typeLabels[resource.type]}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-xs text-amber-700">
                          Subido el {new Date(resource.uploadedAt).toLocaleDateString("es-ES")}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                )
              })}
            </div>
          ) : (
            categories.map((category) => {
              const categoryResources = filteredResources.filter((r) => r.category === category)
              return (
                <div key={category}>
                  <h2 className="text-2xl font-bold text-amber-900 mb-4">{category}</h2>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {categoryResources.map((resource) => {
                      const TypeIcon = typeIcons[resource.type]
                      return (
                        <a key={resource.id} href={resource.url} target="_blank" rel="noopener noreferrer">
                          <Card className="border-amber-200 hover:border-amber-400 transition-colors cursor-pointer h-full">
                            <CardHeader>
                              <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3 flex-1">
                                  <TypeIcon className="h-5 w-5 text-amber-600 mt-1" />
                                  <div className="flex-1">
                                    <CardTitle className="text-lg text-amber-900">{resource.title}</CardTitle>
                                    {resource.description && (
                                      <CardDescription className="text-amber-700 mt-1">
                                        {resource.description}
                                      </CardDescription>
                                    )}
                                  </div>
                                </div>
                                <Badge className={`${typeColors[resource.type]} text-white`}>
                                  {typeLabels[resource.type]}
                                </Badge>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="text-xs text-amber-700">
                                Subido el {new Date(resource.uploadedAt).toLocaleDateString("es-ES")}
                              </p>
                            </CardContent>
                          </Card>
                        </a>
                      )
                    })}
                  </div>
                </div>
              )
            })
          )}
        </div>
      )}
    </div>
  )
}
