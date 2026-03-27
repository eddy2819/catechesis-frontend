"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus, Search, Edit, Trash2, FileDown, Check, X, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { dataStore } from "@/lib/store"
import type { AltarServer, AltarServerAttendance } from "@/lib/types"

const roleLabels: Record<AltarServer["role"], string> = {
  monaguillo: "Monaguillo",
  turiferario: "Turiferario",
  crucifero: "Crucifero",
  ceroferario: "Ceroferario",
  "acólito": "Acólito",
}

const experienceLabels: Record<AltarServer["experience"], string> = {
  principiante: "Principiante",
  intermedio: "Intermedio",
  avanzado: "Avanzado",
}

const eventTypeLabels: Record<string, string> = {
  misa_dominical: "Misa Dominical",
  misa_diaria: "Misa Diaria",
  celebracion: "Celebración",
  procesion: "Procesión",
  ensayo: "Ensayo",
  otro: "Otro",
}

const roleBadgeColor: Record<AltarServer["role"], string> = {
  monaguillo: "bg-blue-100 text-blue-800",
  turiferario: "bg-purple-100 text-purple-800",
  crucifero: "bg-emerald-100 text-emerald-800",
  ceroferario: "bg-amber-100 text-amber-800",
  "acólito": "bg-rose-100 text-rose-800",
}

const experienceBadgeColor: Record<AltarServer["experience"], string> = {
  principiante: "bg-sky-100 text-sky-800",
  intermedio: "bg-amber-100 text-amber-800",
  avanzado: "bg-emerald-100 text-emerald-800",
}

export default function AltarServersPage() {
  const [altarServers, setAltarServers] = useState<AltarServer[]>([])
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [deleteId, setDeleteId] = useState<string | null>(null)

  // Attendance state
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0])
  const [eventType, setEventType] = useState<string>("misa_dominical")
  const [attendanceRecords, setAttendanceRecords] = useState<Record<string, AltarServerAttendance["status"]>>({})

  useEffect(() => {
    setAltarServers(dataStore.getAltarServers())
  }, [])

  useEffect(() => {
    const existing = dataStore.getAltarServerAttendancesByDate(new Date(attendanceDate))
    const records: Record<string, AltarServerAttendance["status"]> = {}
    for (const att of existing) {
      records[att.altarServerId] = att.status
    }
    setAttendanceRecords(records)
  }, [attendanceDate])

  const filteredServers = altarServers.filter((server) => {
    const matchesSearch =
      server.firstName.toLowerCase().includes(search.toLowerCase()) ||
      server.lastName.toLowerCase().includes(search.toLowerCase())
    const matchesRole = roleFilter === "all" || server.role === roleFilter
    const matchesExperience = experienceFilter === "all" || server.experience === experienceFilter
    const matchesStatus = statusFilter === "all" || server.status === statusFilter
    return matchesSearch && matchesRole && matchesExperience && matchesStatus
  })

  const handleDelete = (id: string) => {
    dataStore.deleteAltarServer(id)
    setAltarServers(dataStore.getAltarServers())
    setDeleteId(null)
  }

  const markAttendance = (serverId: string, status: AltarServerAttendance["status"]) => {
    const existing = dataStore.getAltarServerAttendanceByServerAndDate(serverId, new Date(attendanceDate))
    if (existing) {
      if (existing.status === status) {
        return
      }
      dataStore.updateAltarServerAttendance(existing.id, { status })
    } else {
      dataStore.addAltarServerAttendance({
        altarServerId: serverId,
        date: new Date(attendanceDate),
        eventType: eventType as AltarServerAttendance["eventType"],
        status,
        notes: "",
      })
    }
    setAttendanceRecords((prev) => ({ ...prev, [serverId]: status }))
  }

  const activeServers = altarServers.filter((s) => s.status === "active")
  const roleStats = {
    monaguillo: altarServers.filter((s) => s.role === "monaguillo").length,
    turiferario: altarServers.filter((s) => s.role === "turiferario").length,
    crucifero: altarServers.filter((s) => s.role === "crucifero").length,
    ceroferario: altarServers.filter((s) => s.role === "ceroferario").length,
    "acólito": altarServers.filter((s) => s.role === "acólito").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-amber-900">Monaguillos</h1>
          <p className="text-amber-700 mt-1">Gestiona el grupo de monaguillos de la parroquia</p>
        </div>
        <div className="flex gap-2">
          <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white">
            <Link href="/dashboard/altar-servers/new">
              <Plus className="mr-2 h-4 w-4" />
              Nuevo Monaguillo
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <Card className="p-4 border-amber-200">
          <p className="text-xs text-amber-600 font-medium">Total</p>
          <p className="text-2xl font-bold text-amber-900">{altarServers.length}</p>
        </Card>
        <Card className="p-4 border-amber-200">
          <p className="text-xs text-amber-600 font-medium">Activos</p>
          <p className="text-2xl font-bold text-emerald-700">{activeServers.length}</p>
        </Card>
        <Card className="p-4 border-amber-200">
          <p className="text-xs text-blue-600 font-medium">Monaguillos</p>
          <p className="text-2xl font-bold text-blue-800">{roleStats.monaguillo}</p>
        </Card>
        <Card className="p-4 border-amber-200">
          <p className="text-xs text-purple-600 font-medium">Turiferarios</p>
          <p className="text-2xl font-bold text-purple-800">{roleStats.turiferario}</p>
        </Card>
        <Card className="p-4 border-amber-200">
          <p className="text-xs text-emerald-600 font-medium">Cruciferos</p>
          <p className="text-2xl font-bold text-emerald-800">{roleStats.crucifero}</p>
        </Card>
        <Card className="p-4 border-amber-200">
          <p className="text-xs text-rose-600 font-medium">Acólitos</p>
          <p className="text-2xl font-bold text-rose-800">{roleStats["acólito"]}</p>
        </Card>
      </div>

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="list" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Lista
          </TabsTrigger>
          <TabsTrigger value="attendance" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            Asistencia
          </TabsTrigger>
        </TabsList>

        {/* List Tab */}
        <TabsContent value="list" className="space-y-4">
          <Card className="p-4 border-amber-200">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber-500" />
                <Input
                  placeholder="Buscar por nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 border-amber-200 focus:border-amber-400"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-full md:w-40 border-amber-200">
                  <SelectValue placeholder="Rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los roles</SelectItem>
                  <SelectItem value="monaguillo">Monaguillo</SelectItem>
                  <SelectItem value="turiferario">Turiferario</SelectItem>
                  <SelectItem value="crucifero">Crucifero</SelectItem>
                  <SelectItem value="ceroferario">Ceroferario</SelectItem>
                  <SelectItem value="acólito">Acólito</SelectItem>
                </SelectContent>
              </Select>
              <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                <SelectTrigger className="w-full md:w-40 border-amber-200">
                  <SelectValue placeholder="Experiencia" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toda experiencia</SelectItem>
                  <SelectItem value="principiante">Principiante</SelectItem>
                  <SelectItem value="intermedio">Intermedio</SelectItem>
                  <SelectItem value="avanzado">Avanzado</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-36 border-amber-200">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </Card>

          <Card className="border-amber-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50 border-b border-amber-200">
                    <TableHead className="text-amber-900 font-semibold">Nombre</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Rol</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Experiencia</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Barrio</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Contacto Padre</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Estado</TableHead>
                    <TableHead className="text-amber-900 font-semibold text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-amber-600 py-8">
                        No se encontraron monaguillos
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredServers.map((server) => (
                      <TableRow key={server.id} className="border-b border-amber-100 hover:bg-amber-50/50">
                        <TableCell className="font-medium text-amber-900">
                          {server.firstName} {server.lastName}
                        </TableCell>
                        <TableCell>
                          <Badge className={`${roleBadgeColor[server.role]} border-0`}>
                            {roleLabels[server.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className={`${experienceBadgeColor[server.experience]} border-0`}>
                            {experienceLabels[server.experience]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-amber-700">{server.neighborhood || "---"}</TableCell>
                        <TableCell className="text-amber-700">
                          {server.parentName ? (
                            <div>
                              <p className="text-sm">{server.parentName}</p>
                              {server.parentPhone && (
                                <p className="text-xs text-amber-500">{server.parentPhone}</p>
                              )}
                            </div>
                          ) : (
                            "---"
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              server.status === "active"
                                ? "bg-emerald-100 text-emerald-800 border-0"
                                : "bg-gray-100 text-gray-600 border-0"
                            }
                          >
                            {server.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    asChild
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-100"
                                  >
                                    <Link href={`/dashboard/altar-servers/${server.id}/edit`}>
                                      <Edit className="h-4 w-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-amber-900 text-white">Editar</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                                    onClick={() => setDeleteId(server.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="bg-red-700 text-white">Eliminar</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card className="p-4 border-amber-200">
            <div className="flex flex-col md:flex-row gap-4 items-end">
              <div className="space-y-2 flex-1">
                <Label className="text-amber-900 font-medium">Fecha</Label>
                <Input
                  type="date"
                  value={attendanceDate}
                  onChange={(e) => setAttendanceDate(e.target.value)}
                  className="border-amber-200 focus:border-amber-400"
                />
              </div>
              <div className="space-y-2 flex-1">
                <Label className="text-amber-900 font-medium">Tipo de Evento</Label>
                <Select value={eventType} onValueChange={setEventType}>
                  <SelectTrigger className="border-amber-200">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="misa_dominical">Misa Dominical</SelectItem>
                    <SelectItem value="misa_diaria">Misa Diaria</SelectItem>
                    <SelectItem value="celebracion">Celebración</SelectItem>
                    <SelectItem value="procesion">Procesión</SelectItem>
                    <SelectItem value="ensayo">Ensayo</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-3 text-sm text-amber-700">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Presentes: {Object.values(attendanceRecords).filter((s) => s === "present").length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-red-500" /> Ausentes: {Object.values(attendanceRecords).filter((s) => s === "absent").length}
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-3 rounded-full bg-yellow-500" /> Tarde: {Object.values(attendanceRecords).filter((s) => s === "late").length}
                </span>
              </div>
            </div>
          </Card>

          <Card className="border-amber-200 overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-amber-50 border-b border-amber-200">
                    <TableHead className="text-amber-900 font-semibold">Monaguillo</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Rol</TableHead>
                    <TableHead className="text-amber-900 font-semibold">Barrio</TableHead>
                    <TableHead className="text-amber-900 font-semibold text-center">Asistencia</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeServers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center text-amber-600 py-8">
                        No hay monaguillos activos registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    activeServers.map((server) => {
                      const status = attendanceRecords[server.id]
                      return (
                        <TableRow key={server.id} className="border-b border-amber-100 hover:bg-amber-50/50">
                          <TableCell className="font-medium text-amber-900">
                            {server.firstName} {server.lastName}
                          </TableCell>
                          <TableCell>
                            <Badge className={`${roleBadgeColor[server.role]} border-0`}>
                              {roleLabels[server.role]}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-amber-700">{server.neighborhood || "---"}</TableCell>
                          <TableCell>
                            <div className="flex items-center justify-center gap-1">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAttendance(server.id, "present")}
                                      className={`h-8 w-8 transition-all ${
                                        status === "present"
                                          ? "bg-emerald-500 text-white hover:bg-emerald-600"
                                          : "text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100"
                                      }`}
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-emerald-700 text-white">Presente</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAttendance(server.id, "late")}
                                      className={`h-8 w-8 transition-all ${
                                        status === "late"
                                          ? "bg-yellow-500 text-white hover:bg-yellow-600"
                                          : "text-yellow-600 hover:text-yellow-700 hover:bg-yellow-100"
                                      }`}
                                    >
                                      <Clock className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-yellow-600 text-white">Tarde</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAttendance(server.id, "absent")}
                                      className={`h-8 w-8 transition-all ${
                                        status === "absent"
                                          ? "bg-red-500 text-white hover:bg-red-600"
                                          : "text-red-500 hover:text-red-600 hover:bg-red-100"
                                      }`}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-red-700 text-white">Ausente</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => markAttendance(server.id, "excused")}
                                      className={`h-8 w-8 transition-all ${
                                        status === "excused"
                                          ? "bg-sky-500 text-white hover:bg-sky-600"
                                          : "text-sky-500 hover:text-sky-600 hover:bg-sky-100"
                                      }`}
                                    >
                                      <span className="text-xs font-bold">J</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="bg-sky-700 text-white">Justificado</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Monaguillo</AlertDialogTitle>
            <AlertDialogDescription>
              Esta accion no se puede deshacer. Se eliminara permanentemente este monaguillo del sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteId && handleDelete(deleteId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
