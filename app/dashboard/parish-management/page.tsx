"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { listCatechists } from "@/lib/catechists"
import { createStudentAttendance, listStudents, updateAttendance } from "@/lib/students"
import type { Attendance, Catechist, Student } from "@/lib/types"
import { Building2, Calendar, Check, Church, Filter, Users, X } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

export default function ParishManagementPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [catechists, setCatechists] = useState<Catechist[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<Map<string, Attendance>>(new Map())
 

  const [filters, setFilters] = useState({
    level: "all",
    neighborhood: "all",
    catechistId: "all",
    search: "",
  })

  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = (await listStudents()) as Student[]
        setStudents(data)
        setFilteredStudents(data)
      } catch (error) {
        console.error("Error fetching students:", error)
      }
    }
    setAttendanceRecords(new Map())
    fetchStudents()

    const allCatechists = async () =>{
      try {
        const data = await listCatechists() as Catechist[]
        setCatechists(data)
      } catch (error) {
        console.error("Error fetching catechists:", error)
      }
    }
    allCatechists()

  },[selectedDate])

   const neighborhoods = useMemo(() =>{
      return Array.from(
        new Set(students.map((s) => s.address).filter(Boolean))
      )
    } , [students])

    const levels = useMemo(() =>{
      return Array.from(
        new Set(students.map((s) => s.grade).filter(Boolean))
      )
    } , [students])

  useEffect(() => {
    let result = students

    if (filters.level !== "all") {
      result = result.filter((s) => s.grade === filters.level)
    }

    if (filters.neighborhood !== "all") {
      result = result.filter((s) => s.address === filters.neighborhood)
    }

    if (filters.catechistId !== "all") {
      result = result.filter((s) => s.assignedCatechistId === filters.catechistId)
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter(
        (s) =>
          s.first_name.toLowerCase().includes(searchLower) ||
          s.last_name.toLowerCase().includes(searchLower) ||
          `${s.first_name} ${s.last_name}`.toLowerCase().includes(searchLower),
      )
    }

    setFilteredStudents(result)
    
    
  }, [filters, students])

  const clearFilters = () => {
    setFilters({ level: "all", neighborhood: "all", catechistId: "all", search: "" })
  }
const attendanceStatus = (student: Student) => {
  return attendanceRecords.get(student.id)?.status
}

  
  const markQuickAttendance = async (
  studentId: string,
  status: Attendance["status"]
) => {
  const existing = attendanceRecords.get(studentId)

  if (existing) {
    // 👉 Ya existe asistencia para ESTE día
    const updated = await updateAttendance(existing.id, { status })
    const newMap = new Map(attendanceRecords)
    newMap.set(studentId, updated as Attendance)
    setAttendanceRecords(newMap)
  } else {
    // 👉 No existe → crear NUEVA asistencia para ESTE día
    const payload = {
      date: selectedDate.toISOString().split("T")[0],
      status,
      notes: "",
    }

    const created = await createStudentAttendance(studentId, payload)
    const newMap = new Map(attendanceRecords)
    newMap.set(studentId, created as Attendance)
    setAttendanceRecords(newMap)
  }
}




  const getCatechistName = (catechistId?: string) => {
    if (!catechistId) return "Sin asignar"
    const catechist = catechists.find((c) => c.id === catechistId)
    return catechist ? `${catechist.first_name} ${catechist.last_name}` : "Sin asignar"
  }

  const getStatsByLevel = () => {
    const stats: { [key: string]: number } = {}
    filteredStudents.forEach((student) => {
      stats[student.grade] = (stats[student.grade] || 0) + 1
    })
    return stats
  }

  const getStatsByNeighborhood = () => {
    const stats: { [key: string]: number } = {}
    filteredStudents.forEach((student) => {
      const address = student.address || "Sin barrio"
      stats[address] = (stats[address] || 0) + 1
    })
    return stats
  }

  const levelStats = getStatsByLevel()
  const neighborhoodStats = getStatsByNeighborhood()

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <Building2 className="h-8 w-8 text-amber-600" />
          <h1 className="text-3xl font-bold text-amber-900">Gestión Parroquial</h1>
        </div>
        <p className="text-amber-700">Gestiona todos los estudiantes de la parroquia por nivel y barrio</p>
      </div>

      <Tabs defaultValue="management" className="space-y-6">
        <TabsList className="bg-amber-100">
          <TabsTrigger value="management" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            <Users className="mr-2 h-4 w-4" />
            Gestión de Estudiantes
          </TabsTrigger>
          <TabsTrigger value="meetings" className="data-[state=active]:bg-amber-600 data-[state=active]:text-white">
            <Church className="mr-2 h-4 w-4" />
            Reuniones Generales
          </TabsTrigger>
        </TabsList>

        <TabsContent value="management" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700">Total Estudiantes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{filteredStudents.length}</div>
                <p className="text-xs text-amber-600 mt-1">de {students.length} totales</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700">Niveles</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{Object.keys(levelStats).length}</div>
                <p className="text-xs text-amber-600 mt-1">niveles activos</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700">Barrios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{neighborhoods.length}</div>
                <p className="text-xs text-amber-600 mt-1">barrios registrados</p>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-amber-700">Catequistas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-900">{catechists.length}</div>
                <p className="text-xs text-amber-600 mt-1">catequistas activos</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filtros
              </CardTitle>
              <CardDescription className="text-amber-700">
                Filtra estudiantes por nivel, barrio o catequista
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                <div className="space-y-2">
                  <Label htmlFor="search" className="text-amber-900">
                    Buscar
                  </Label>
                  <Input
                    id="search"
                    placeholder="Nombre del estudiante..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                    className="border-amber-200 focus:border-amber-600"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="level" className="text-amber-900">
                    Nivel
                  </Label>
                  <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue placeholder="Todos los niveles" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los niveles</SelectItem>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood" className="text-amber-900">
                    Barrio
                  </Label>
                  <Select
                    value={filters.neighborhood}
                    onValueChange={(value) => setFilters({ ...filters, neighborhood: value })}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue placeholder="Todos los barrios" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los barrios</SelectItem>
                      {neighborhoods.map((address) => (
                        <SelectItem key={address} value={address}>
                          {address}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="catechist" className="text-amber-900">
                    Catequista
                  </Label>
                  <Select
                    value={filters.catechistId}
                    onValueChange={(value) => setFilters({ ...filters, catechistId: value })}
                  >
                    <SelectTrigger className="border-amber-200 focus:border-amber-600">
                      <SelectValue placeholder="Todos los catequistas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos los catequistas</SelectItem>
                      {catechists.map((catechist) => (
                        <SelectItem key={catechist.id} value={catechist.id}>
                          {catechist.first_name} {catechist.last_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 flex items-end">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="w-full border-amber-300 text-amber-900 hover:bg-amber-100 bg-transparent"
                  >
                    Limpiar Filtros
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {(filters.level !== "all" || filters.neighborhood !== "all") && (
            <div className="flex gap-4">
              <Link
                href={`/dashboard/parish-management/attendance?level=${filters.level}&neighborhood=${filters.neighborhood}`}
                className="flex-1"
              >
                <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                  <Calendar className="mr-2 h-4 w-4" />
                  Tomar Asistencia
                </Button>
              </Link>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Estudiantes por Nivel</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(levelStats).map(([level, count]) => (
                    <div key={level} className="flex justify-between items-center p-2 bg-amber-50 rounded">
                      <span className="text-amber-900 font-medium">{level}</span>
                      <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                        {count}
                      </Badge>
                    </div>
                  ))}
                  {Object.keys(levelStats).length === 0 && (
                    <p className="text-amber-700 text-center py-4">No hay datos para mostrar</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200">
              <CardHeader>
                <CardTitle className="text-amber-900">Estudiantes por Barrio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(neighborhoodStats).map(([neighborhood, count]) => (
                    <div key={neighborhood} className="flex justify-between items-center p-2 bg-amber-50 rounded">
                      <span className="text-amber-900 font-medium">{neighborhood}</span>
                      <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                        {count}
                      </Badge>
                    </div>
                  ))}
                  {Object.keys(neighborhoodStats).length === 0 && (
                    <p className="text-amber-700 text-center py-4">No hay datos para mostrar</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Lista de Estudiantes
              </CardTitle>
              <CardDescription className="text-amber-700">
                {filteredStudents.length} estudiante(s) encontrado(s)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border border-amber-200 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-amber-50 hover:bg-amber-50">
                      <TableHead className="text-amber-900">Nombre</TableHead>
                      <TableHead className="text-amber-900">Nivel</TableHead>
                      <TableHead className="text-amber-900">Barrio</TableHead>
                      <TableHead className="text-amber-900">Catequista</TableHead>
                      <TableHead className="text-amber-900">Estado</TableHead>
                      <TableHead className="text-amber-900">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id} className="hover:bg-amber-50/50">
                        <TableCell className="font-medium text-amber-900">
                          {student.first_name} {student.last_name}
                        </TableCell>
                        <TableCell className="text-amber-800">{student.grade}</TableCell>
                        <TableCell className="text-amber-800">{student.address || "Sin barrio"}</TableCell>
                        <TableCell className="text-amber-800">
                          {getCatechistName(student.id)}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={student.status === "active" ? "default" : "secondary"}
                            className={
                              student.status === "active"
                                ? "bg-green-600 hover:bg-green-700"
                                : "bg-gray-400 hover:bg-gray-500"
                            }
                          >
                            {student.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
  <Button
    variant="ghost"
    size="icon"
    onClick={() => markQuickAttendance(student.id, "presente")}
    className={`h-7 w-7 transition-all ${
      attendanceStatus(student) === "presente"
        ? "bg-green-500 text-white hover:bg-green-600"
        : "text-green-600 hover:text-green-700 hover:bg-green-100"
    }`}
  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-green-700 text-white">
                                  <p>Presente</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => markQuickAttendance(student.id, "ausente")}
                                  className={`h-7 w-7 transition-all ${
            attendanceStatus(student) === "ausente"
              ? "bg-red-500 text-white hover:bg-red-600"
              : "text-red-500 hover:text-red-600 hover:bg-red-100"
          }`}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="bg-red-700 text-white">
                                  <p>Ausente</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <Link href={`/dashboard/students/${student.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-amber-300 text-amber-900 hover:bg-amber-100 bg-transparent ml-1"
                              >
                                Ver
                              </Button>
                            </Link>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-amber-700">
                          No se encontraron estudiantes con los filtros aplicados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meetings" className="space-y-6">
          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Church className="h-5 w-5" />
                Reuniones Generales con el Sacerdote
              </CardTitle>
              <CardDescription className="text-amber-700">
                Registra la asistencia de estudiantes a reuniones generales parroquiales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-neighborhood" className="text-amber-900">
                      Filtrar por Barrio
                    </Label>
                    <Select
                      value={filters.neighborhood}
                      onValueChange={(value) => setFilters({ ...filters, neighborhood: value })}
                    >
                      <SelectTrigger className="border-amber-200 focus:border-amber-600">
                        <SelectValue placeholder="Todos los barrios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los barrios</SelectItem>
                        {neighborhoods.map((address) => (
                          <SelectItem key={address} value={address}>
                            {address}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="meeting-level" className="text-amber-900">
                      Filtrar por Nivel
                    </Label>
                    <Select value={filters.level} onValueChange={(value) => setFilters({ ...filters, level: value })}>
                      <SelectTrigger className="border-amber-200 focus:border-amber-600">
                        <SelectValue placeholder="Todos los niveles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos los niveles</SelectItem>
                        {levels.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2 flex items-end">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="w-full border-amber-300 text-amber-900 hover:bg-amber-100 bg-transparent"
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                </div>

                {filteredStudents.length > 0 && (
                  <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                    <p className="text-amber-900 font-medium mb-2">
                      Estudiantes seleccionados: {filteredStudents.length}
                    </p>
                    <p className="text-sm text-amber-700 mb-4">Estos estudiantes participarán en la reunión general</p>
                    <Link
                      href={`/dashboard/parish-management/general-meeting?level=${filters.level}&neighborhood=${filters.neighborhood}`}
                    >
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                        <Calendar className="mr-2 h-4 w-4" />
                        Registrar Asistencia a Reunión General
                      </Button>
                    </Link>
                  </div>
                )}

                {filteredStudents.length === 0 && (
                  <div className="text-center py-8 text-amber-700">
                    Selecciona un barrio o nivel para comenzar a registrar asistencia
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900">Distribución por Barrio</CardTitle>
              <CardDescription className="text-amber-700">
                Estudiantes disponibles para reuniones generales
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {Object.entries(neighborhoodStats).map(([neighborhood, count]) => (
                  <div key={neighborhood} className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                    <span className="text-amber-900 font-medium">{neighborhood}</span>
                    <Badge variant="secondary" className="bg-amber-200 text-amber-900">
                      {count} estudiante{count !== 1 ? "s" : ""}
                    </Badge>
                  </div>
                ))}
                {Object.keys(neighborhoodStats).length === 0 && (
                  <p className="text-amber-700 text-center py-4">No hay datos para mostrar</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
