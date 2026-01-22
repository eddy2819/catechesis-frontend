"use client";

import type {
  Assignment,
  Attendance,
  CalendarEvent,
  Catechist,
  CatechistAttendance,
  Communication,
  Evaluation,
  Grade,
  Note,
  Parent,
  ParentAttendance,
  Resource,
  Student,
} from "./types";

// Simple in-memory store with localStorage persistence
// This can be easily replaced with real database calls later

class DataStore {
  private storageKey = "catechesis_data";

  private getData() {
    if (typeof window === "undefined") return null;
    const data = localStorage.getItem(this.storageKey);
    return data ? JSON.parse(data) : null;
  }

  private saveData(data: any) {
    if (typeof window === "undefined") return;
    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  // Students
  getStudents(): Student[] {
    const data = this.getData();
    return data?.students || [];
  }

  addStudent(student: Omit<Student, "id" | "createdAt">): Student {
    const data = this.getData() || {};
    const newStudent: Student = {
      ...student,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    data.students = [...(data.students || []), newStudent];
    this.saveData(data);
    return newStudent;
  }

  updateStudent(id: string, updates: Partial<Student>): Student | null {
    const data = this.getData() || {};
    const students = data.students || [];
    const index = students.findIndex((s: Student) => s.id === id);
    if (index === -1) return null;

    students[index] = { ...students[index], ...updates };
    data.students = students;
    this.saveData(data);
    return students[index];
  }

  deleteStudent(id: string): boolean {
    const data = this.getData() || {};
    const students = data.students || [];
    const filtered = students.filter((s: Student) => s.id !== id);
    if (filtered.length === students.length) return false;

    data.students = filtered;
    this.saveData(data);
    return true;
  }

  getStudentById(id: string): Student | null {
    const students = this.getStudents();
    return students.find((s) => s.id === id) || null;
  }

  // Parents
  getParents(): Parent[] {
    const data = this.getData();
    return data?.parents || [];
  }

  addParent(parent: Omit<Parent, "id">): Parent {
    const data = this.getData() || {};
    const newParent: Parent = {
      ...parent,
      id: crypto.randomUUID(),
    };
    data.parents = [...(data.parents || []), newParent];
    this.saveData(data);
    return newParent;
  }

  updateParent(id: string, updates: Partial<Parent>): Parent | null {
    const data = this.getData() || {};
    const parents = data.parents || [];
    const index = parents.findIndex((p: Parent) => p.id === id);
    if (index === -1) return null;

    parents[index] = { ...parents[index], ...updates };
    data.parents = parents;
    this.saveData(data);
    return parents[index];
  }

  deleteParent(id: string): boolean {
    const data = this.getData() || {};
    const parents = data.parents || [];
    const filtered = parents.filter((p: Parent) => p.id !== id);
    if (filtered.length === parents.length) return false;

    data.parents = filtered;
    this.saveData(data);
    return true;
  }

  getParentsByStudentId(studentId: string): Parent[] {
    const parents = this.getParents();
    return parents.filter((p) => p.studentIds.includes(studentId));
  }

  // Calendar Events
  getCalendarEvents(): CalendarEvent[] {
    const data = this.getData();
    return data?.events || [];
  }

  addCalendarEvent(event: Omit<CalendarEvent, "id">): CalendarEvent {
    const data = this.getData() || {};
    const newEvent: CalendarEvent = {
      ...event,
      id: crypto.randomUUID(),
    };
    data.events = [...(data.events || []), newEvent];
    this.saveData(data);
    return newEvent;
  }

  updateCalendarEvent(
    id: string,
    updates: Partial<CalendarEvent>
  ): CalendarEvent | null {
    const data = this.getData() || {};
    const events = data.events || [];
    const index = events.findIndex((e: CalendarEvent) => e.id === id);
    if (index === -1) return null;

    events[index] = { ...events[index], ...updates };
    data.events = events;
    this.saveData(data);
    return events[index];
  }

  deleteCalendarEvent(id: string): boolean {
    const data = this.getData() || {};
    const events = data.events || [];
    const filtered = events.filter((e: CalendarEvent) => e.id !== id);
    if (filtered.length === events.length) return false;

    data.events = filtered;
    this.saveData(data);
    return true;
  }

  getCalendarEventById(id: string): CalendarEvent | null {
    const events = this.getCalendarEvents();
    return events.find((e) => e.id === id) || null;
  }

  getEventsByDateRange(startDate: Date, endDate: Date): CalendarEvent[] {
    const events = this.getCalendarEvents();
    return events.filter((event) => {
      const eventDate = new Date(event.date);
      return eventDate >= startDate && eventDate <= endDate;
    });
  }

  // Notes
  getNotes(): Note[] {
    const data = this.getData();
    return data?.notes || [];
  }

  addNote(note: Omit<Note, "id">): Note {
    const data = this.getData() || {};
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
    };
    data.notes = [...(data.notes || []), newNote];
    this.saveData(data);
    return newNote;
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const data = this.getData() || {};
    const notes = data.notes || [];
    const index = notes.findIndex((n: Note) => n.id === id);
    if (index === -1) return null;

    notes[index] = { ...notes[index], ...updates };
    data.notes = notes;
    this.saveData(data);
    return notes[index];
  }

  deleteNote(id: string): boolean {
    const data = this.getData() || {};
    const notes = data.notes || [];
    const filtered = notes.filter((n: Note) => n.id !== id);
    if (filtered.length === notes.length) return false;

    data.notes = filtered;
    this.saveData(data);
    return true;
  }

  getNotesByStudentId(studentId: string): Note[] {
    const notes = this.getNotes();
    return notes
      .filter((n) => n.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Evaluations
  getEvaluations(): Evaluation[] {
    const data = this.getData();
    return data?.evaluations || [];
  }

  addEvaluation(evaluation: Omit<Evaluation, "id">): Evaluation {
    const data = this.getData() || {};
    const newEvaluation: Evaluation = {
      ...evaluation,
      id: crypto.randomUUID(),
    };
    data.evaluations = [...(data.evaluations || []), newEvaluation];
    this.saveData(data);
    return newEvaluation;
  }

  updateEvaluation(
    id: string,
    updates: Partial<Evaluation>
  ): Evaluation | null {
    const data = this.getData() || {};
    const evaluations = data.evaluations || [];
    const index = evaluations.findIndex((e: Evaluation) => e.id === id);
    if (index === -1) return null;

    evaluations[index] = { ...evaluations[index], ...updates };
    data.evaluations = evaluations;
    this.saveData(data);
    return evaluations[index];
  }

  deleteEvaluation(id: string): boolean {
    const data = this.getData() || {};
    const evaluations = data.evaluations || [];
    const filtered = evaluations.filter((e: Evaluation) => e.id !== id);
    if (filtered.length === evaluations.length) return false;

    data.evaluations = filtered;
    this.saveData(data);
    return true;
  }

  getEvaluationsByStudentId(studentId: string): Evaluation[] {
    const evaluations = this.getEvaluations();
    return evaluations
      .filter((e) => e.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Communications
  getCommunications(): Communication[] {
    const data = this.getData();
    return data?.communications || [];
  }

  addCommunication(communication: Omit<Communication, "id">): Communication {
    const data = this.getData() || {};
    const newCommunication: Communication = {
      ...communication,
      id: crypto.randomUUID(),
    };
    data.communications = [...(data.communications || []), newCommunication];
    this.saveData(data);
    return newCommunication;
  }

  updateCommunication(
    id: string,
    updates: Partial<Communication>
  ): Communication | null {
    const data = this.getData() || {};
    const communications = data.communications || [];
    const index = communications.findIndex((c: Communication) => c.id === id);
    if (index === -1) return null;

    communications[index] = { ...communications[index], ...updates };
    data.communications = communications;
    this.saveData(data);
    return communications[index];
  }

  deleteCommunication(id: string): boolean {
    const data = this.getData() || {};
    const communications = data.communications || [];
    const filtered = communications.filter((c: Communication) => c.id !== id);
    if (filtered.length === communications.length) return false;

    data.communications = filtered;
    this.saveData(data);
    return true;
  }

  // Resources
  getResources(): Resource[] {
    const data = this.getData();
    return data?.resources || [];
  }

  addResource(resource: Omit<Resource, "id">): Resource {
    const data = this.getData() || {};
    const newResource: Resource = {
      ...resource,
      id: crypto.randomUUID(),
    };
    data.resources = [...(data.resources || []), newResource];
    this.saveData(data);
    return newResource;
  }

  updateResource(id: string, updates: Partial<Resource>): Resource | null {
    const data = this.getData() || {};
    const resources = data.resources || [];
    const index = resources.findIndex((r: Resource) => r.id === id);
    if (index === -1) return null;

    resources[index] = { ...resources[index], ...updates };
    data.resources = resources;
    this.saveData(data);
    return resources[index];
  }

  deleteResource(id: string): boolean {
    const data = this.getData() || {};
    const resources = data.resources || [];
    const filtered = resources.filter((r: Resource) => r.id !== id);
    if (filtered.length === resources.length) return false;

    data.resources = filtered;
    this.saveData(data);
    return true;
  }

  getResourcesByCategory(category: string): Resource[] {
    const resources = this.getResources();
    return resources.filter((r) => r.category === category);
  }

  // Attendance methods for students
  getAttendances(): Attendance[] {
    const data = this.getData();
    return data?.attendances || [];
  }

  addAttendance(attendance: Omit<Attendance, "id">): Attendance {
    const data = this.getData() || {};
    const newAttendance: Attendance = {
      ...attendance,
      id: crypto.randomUUID(),
    };
    data.attendances = [...(data.attendances || []), newAttendance];
    this.saveData(data);
    return newAttendance;
  }

  updateAttendance(
    id: string,
    updates: Partial<Attendance>
  ): Attendance | null {
    const data = this.getData() || {};
    const attendances = data.attendances || [];
    const index = attendances.findIndex((a: Attendance) => a.id === id);
    if (index === -1) return null;

    attendances[index] = { ...attendances[index], ...updates };
    data.attendances = attendances;
    this.saveData(data);
    return attendances[index];
  }

  deleteAttendance(id: string): boolean {
    const data = this.getData() || {};
    const attendances = data.attendances || [];
    const filtered = attendances.filter((a: Attendance) => a.id !== id);
    if (filtered.length === attendances.length) return false;

    data.attendances = filtered;
    this.saveData(data);
    return true;
  }

  getAttendancesByDate(date: Date): Attendance[] {
    const attendances = this.getAttendances();
    const dateStr = new Date(date).toDateString();
    return attendances.filter(
      (a) => new Date(a.date).toDateString() === dateStr
    );
  }

  getAttendancesByStudentId(studentId: string): Attendance[] {
    const attendances = this.getAttendances();
    return attendances
      .filter((a) => a.studentId === studentId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  getAttendanceByStudentAndDate(
    studentId: string,
    date: Date
  ): Attendance | null {
    const attendances = this.getAttendances();
    const dateStr = new Date(date).toDateString();
    return (
      attendances.find(
        (a) =>
          a.studentId === studentId &&
          new Date(a.date).toDateString() === dateStr
      ) || null
    );
  }

  // Parent attendance methods for meetings
  getParentAttendances(): ParentAttendance[] {
    const data = this.getData();
    return data?.parentAttendances || [];
  }

  addParentAttendance(
    attendance: Omit<ParentAttendance, "id">
  ): ParentAttendance {
    const data = this.getData() || {};
    const newAttendance: ParentAttendance = {
      ...attendance,
      id: crypto.randomUUID(),
    };
    data.parentAttendances = [...(data.parentAttendances || []), newAttendance];
    this.saveData(data);
    return newAttendance;
  }

  updateParentAttendance(
    id: string,
    updates: Partial<ParentAttendance>
  ): ParentAttendance | null {
    const data = this.getData() || {};
    const attendances = data.parentAttendances || [];
    const index = attendances.findIndex((a: ParentAttendance) => a.id === id);
    if (index === -1) return null;

    attendances[index] = { ...attendances[index], ...updates };
    data.parentAttendances = attendances;
    this.saveData(data);
    return attendances[index];
  }

  deleteParentAttendance(id: string): boolean {
    const data = this.getData() || {};
    const attendances = data.parentAttendances || [];
    const filtered = attendances.filter((a: ParentAttendance) => a.id !== id);
    if (filtered.length === attendances.length) return false;

    data.parentAttendances = filtered;
    this.saveData(data);
    return true;
  }

  getParentAttendancesByDate(date: Date): ParentAttendance[] {
    const attendances = this.getParentAttendances();
    const dateStr = new Date(date).toDateString();
    return attendances.filter(
      (a) => new Date(a.meetingDate).toDateString() === dateStr
    );
  }

  getParentAttendanceByParentAndDate(
    parentId: string,
    date: Date
  ): ParentAttendance | null {
    const attendances = this.getParentAttendances();
    const dateStr = new Date(date).toDateString();
    return (
      attendances.find(
        (a) =>
          a.parentId === parentId &&
          new Date(a.meetingDate).toDateString() === dateStr
      ) || null
    );
  }

  // Catechist management methods
  getCatechists(): Catechist[] {
    const data = this.getData();
    return data?.catechists || [];
  }

  addCatechist(catechist: Omit<Catechist, "id">): Catechist {
    const data = this.getData() || {};
    const newCatechist: Catechist = {
      ...catechist,
      id: crypto.randomUUID(),
    };
    data.catechists = [...(data.catechists || []), newCatechist];
    this.saveData(data);
    return newCatechist;
  }

  updateCatechist(id: string, updates: Partial<Catechist>): Catechist | null {
    const data = this.getData() || {};
    const catechists = data.catechists || [];
    const index = catechists.findIndex((c: Catechist) => c.id === id);
    if (index === -1) return null;

    catechists[index] = { ...catechists[index], ...updates };
    data.catechists = catechists;
    this.saveData(data);
    return catechists[index];
  }

  deleteCatechist(id: string): boolean {
    const data = this.getData() || {};
    const catechists = data.catechists || [];
    const filtered = catechists.filter((c: Catechist) => c.id !== id);
    if (filtered.length === catechists.length) return false;

    data.catechists = filtered;
    this.saveData(data);
    return true;
  }

  getCatechistById(id: string): Catechist | null {
    const catechists = this.getCatechists();
    return catechists.find((c) => c.id === id) || null;
  }

  getCatechistsByRole(role: Catechist["role"]): Catechist[] {
    const catechists = this.getCatechists();
    return catechists.filter((c) => c.role === role);
  }

  // Catechist attendance methods for retreats/convivencias
  getCatechistAttendances(): CatechistAttendance[] {
    const data = this.getData();
    return data?.catechistAttendances || [];
  }

  addCatechistAttendance(
    attendance: Omit<CatechistAttendance, "id">
  ): CatechistAttendance {
    const data = this.getData() || {};
    const newAttendance: CatechistAttendance = {
      ...attendance,
      id: crypto.randomUUID(),
    };
    data.catechistAttendances = [
      ...(data.catechistAttendances || []),
      newAttendance,
    ];
    this.saveData(data);
    return newAttendance;
  }

  updateCatechistAttendance(
    id: string,
    updates: Partial<CatechistAttendance>
  ): CatechistAttendance | null {
    const data = this.getData() || {};
    const attendances = data.catechistAttendances || [];
    const index = attendances.findIndex(
      (a: CatechistAttendance) => a.id === id
    );
    if (index === -1) return null;

    attendances[index] = { ...attendances[index], ...updates };
    data.catechistAttendances = attendances;
    this.saveData(data);
    return attendances[index];
  }

  deleteCatechistAttendance(id: string): boolean {
    const data = this.getData() || {};
    const attendances = data.catechistAttendances || [];
    const filtered = attendances.filter(
      (a: CatechistAttendance) => a.id !== id
    );
    if (filtered.length === attendances.length) return false;

    data.catechistAttendances = filtered;
    this.saveData(data);
    return true;
  }

  getCatechistAttendancesByDate(date: Date): CatechistAttendance[] {
    const attendances = this.getCatechistAttendances();
    const dateStr = new Date(date).toDateString();
    return attendances.filter(
      (a) => new Date(a.eventDate).toDateString() === dateStr
    );
  }

  getCatechistAttendanceByCatechistAndDate(
    catechistId: string,
    date: Date
  ): CatechistAttendance | null {
    const attendances = this.getCatechistAttendances();
    const dateStr = new Date(date).toDateString();
    return (
      attendances.find(
        (a) =>
          a.catechistId === catechistId &&
          new Date(a.eventDate).toDateString() === dateStr
      ) || null
    );
  }

  getAssignments(): Assignment[] {
    const data = this.getData();
    return data?.assignments || [];
  }

  addAssignment(assignment: Omit<Assignment, "id" | "createdAt">): Assignment {
    const data = this.getData() || {};
    const newAssignment: Assignment = {
      ...assignment,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };
    data.assignments = [...(data.assignments || []), newAssignment];
    this.saveData(data);
    return newAssignment;
  }

  updateAssignment(
    id: string,
    updates: Partial<Assignment>
  ): Assignment | null {
    const data = this.getData() || {};
    const assignments = data.assignments || [];
    const index = assignments.findIndex((a: Assignment) => a.id === id);
    if (index === -1) return null;

    assignments[index] = { ...assignments[index], ...updates };
    data.assignments = assignments;
    this.saveData(data);
    return assignments[index];
  }

  deleteAssignment(id: string): boolean {
    const data = this.getData() || {};
    const assignments = data.assignments || [];
    const filtered = assignments.filter((a: Assignment) => a.id !== id);
    if (filtered.length === assignments.length) return false;

    data.assignments = filtered;
    // Also delete all grades for this assignment
    const grades = data.grades || [];
    data.grades = grades.filter((g: Grade) => g.assignmentId !== id);
    this.saveData(data);
    return true;
  }

  // Grade methods for grading system
  getGrades(): Grade[] {
    const data = this.getData();
    return data?.grades || [];
  }

  addGrade(grade: Omit<Grade, "id">): Grade {
    const data = this.getData() || {};
    const newGrade: Grade = {
      ...grade,
      id: crypto.randomUUID(),
    };
    data.grades = [...(data.grades || []), newGrade];
    this.saveData(data);
    return newGrade;
  }

  updateGrade(id: string, updates: Partial<Grade>): Grade | null {
    const data = this.getData() || {};
    const grades = data.grades || [];
    const index = grades.findIndex((g: Grade) => g.id === id);
    if (index === -1) return null;

    grades[index] = { ...grades[index], ...updates };
    data.grades = grades;
    this.saveData(data);
    return grades[index];
  }

  deleteGrade(id: string): boolean {
    const data = this.getData() || {};
    const grades = data.grades || [];
    const filtered = grades.filter((g: Grade) => g.id !== id);
    if (filtered.length === grades.length) return false;

    data.grades = filtered;
    this.saveData(data);
    return true;
  }

  getGradeByStudentAndAssignment(
    studentId: string,
    assignmentId: string
  ): Grade | null {
    const grades = this.getGrades();
    return (
      grades.find(
        (g) => g.studentId === studentId && g.assignmentId === assignmentId
      ) || null
    );
  }

  getGradesByStudentId(studentId: string): Grade[] {
    const grades = this.getGrades();
    return grades.filter((g) => g.studentId === studentId);
  }

  getGradesByAssignmentId(assignmentId: string): Grade[] {
    const grades = this.getGrades();
    return grades.filter((g) => g.assignmentId === assignmentId);
  }
}

export const dataStore = new DataStore();
