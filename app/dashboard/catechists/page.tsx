"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, Mail, Phone, UserCog } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { dataStore } from "@/lib/store"
import type { Catechist } from "@/lib/types"

const roleLabels: Record<Catechist["role"], string> = {
  coordinador: "Coordinador",
  catequista: "Catequista",
  secretario: "Secretario",
  auxiliar: "Auxiliar",
}

const roleColors: Record<Catechist["role"], string> = {
  coordinador: "bg-purple-100 text-purple-800 border-purple-200",
  catequista: "bg-blue-100 text-blue-800 border-blue-200",
  secretario: "bg-green-100 text-green-800 border-green-200",
  auxiliar: "bg-orange-100 text-orange-800 border-orange-200",
}

export default function CatechistsPage() {
  const [catechists, setCatechists] = useState<Catechist[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    loadCatechists()
  }, [])

  const loadCatechists = () => {
    const data = dataStore.getCatechists()
    setCatechists(data)
  }

  const handleDelete = (id: string) => {
    dataStore.deleteCatechist(id)
    loadCatechists()
    setDeleteId(null)
  }

  const filteredCatechists = catechists.filter((catechist) => {
    const searchLower = searchQuery.toLowerCase()
    return (
      catechist.firstName.toLowerCase().includes(searchLower) ||
      catechist.lastName.toLowerCase().includes(searchLower) ||
      catechist.email.toLowerCase().includes(searchLower) ||
      roleLabels[catechist.role].toLowerCase().includes(searchLower)
    )
  })

  const activeCatechists = filteredCatechists.filter((c) => c.status === "active")
  const inactiveCatechists = filteredCatechists.filter((c) => c.status === "inactive")

  // Count by role
  const roleCount = {
    coordinador: activeCatechists.filter((c) => c.role === "coordinador").length,
    catequista: activeCatechists.filter((c) => c.role === "catequista").length,
    secretario: activeCatechists.filter((c) => c.role === "secretario").length,
    auxiliar: activeCatechists.filter((c) => c.role === "auxiliar").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Catequistas</h1>
          <p className="text-amber-700 mt-1">Gestiona el equipo de catequistas y coordinadores</p>
        </div>
        <Button asChild className="bg-amber-600 hover:bg-amber-700">
          <Link href="/dashboard/catechists/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Catequista
          </Link>
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="p-4 border-purple-200 bg-purple-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-700">Coordinadores</p>
              <p className="text-2xl font-bold text-purple-900">{roleCount.coordinador}</p>
            </div>
            <UserCog className="h-8 w-8 text-purple-600" />
          </div>
        </Card>

        <Card className="p-4 border-blue-200 bg-blue-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-700">Catequistas</p>
              <p className="text-2xl font-bold text-blue-900">{roleCount.catequista}</p>
            </div>
            <UserCog className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-4 border-green-200 bg-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-green-700">Secretarios</p>
              <p className="text-2xl font-bold text-green-900">{roleCount.secretario}</p>
            </div>
            <UserCog className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4 border-orange-200 bg-orange-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-orange-700">Auxiliares</p>
              <p className="text-2xl font-bold text-orange-900">{roleCount.auxiliar}</p>
            </div>
            <UserCog className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-amber-500" />
          <Input
            placeholder="Buscar por nombre, email o rol..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-amber-200 focus:border-amber-400"
          />
        </div>
      </Card>

      {/* Catechists Table */}
      <Card>
        <div className="p-4 border-b border-amber-200">
          <h2 className="text-lg font-semibold text-amber-900">Equipo Activo</h2>
          <p className="text-sm text-amber-700">{activeCatechists.length} catequistas activos</p>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Especialización</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activeCatechists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-amber-600 py-8">
                  No hay catequistas registrados. Agrega el primer catequista para comenzar.
                </TableCell>
              </TableRow>
            ) : (
              activeCatechists.map((catechist) => (
                <TableRow key={catechist.id}>
                  <TableCell className="font-medium">
                    {catechist.firstName} {catechist.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[catechist.role]}>
                      {roleLabels[catechist.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Mail className="h-3 w-3" />
                      {catechist.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-amber-700">
                      <Phone className="h-3 w-3" />
                      {catechist.phone}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-amber-700">{catechist.specialization || "—"}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/catechists/${catechist.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(catechist.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Inactive Catechists */}
      {inactiveCatechists.length > 0 && (
        <Card>
          <div className="p-4 border-b border-amber-200">
            <h2 className="text-lg font-semibold text-amber-900">Catequistas Inactivos</h2>
            <p className="text-sm text-amber-700">{inactiveCatechists.length} catequistas inactivos</p>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inactiveCatechists.map((catechist) => (
                <TableRow key={catechist.id} className="opacity-60">
                  <TableCell className="font-medium">
                    {catechist.firstName} {catechist.lastName}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={roleColors[catechist.role]}>
                      {roleLabels[catechist.role]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-amber-700">{catechist.email}</TableCell>
                  <TableCell className="text-sm text-amber-700">{catechist.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/dashboard/catechists/${catechist.id}/edit`}>
                          <Edit className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteId(catechist.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. El catequista será eliminado permanentemente del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
