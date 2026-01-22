// Core data types for the catechism management system

export type UserRole = "catechist" | "coordinator" | "parent";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

export interface Student {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: Date;
  grade: string;
  sacrament: {
    baptism_date?: Date;
    first_communion_date?: Date;
    confirmation_date?: Date;
  };
  allergies?: string;
  medical_conditions?: string;
  photo_url?: string;
  status: "active" | "inactive";
  createdAt: Date;
}

export interface Parent {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  relationship_type: "mother" | "father" | "guardian" | "other";
  address?: string;
  occupation?: string;
  student_ids: string[];
}

export interface Attendance {
  id: string;
  date: Date;
  status: "presente" | "ausente" | "tarde" | "justificado";
  notes?: string;
}

export interface ParentAttendance {
  id: string;
  parentId: string;
  meetingDate: Date;
  status: "present" | "absent" | "excused";
  notes?: string;
}

export interface Evaluation {
  id: string;
  studentId: string;
  date: Date;
  category: string;
  score?: number;
  observations: string;
  catechistId: string;
}

export interface Note {
  id: string;
  studentId: string;
  date: Date;
  content: string;
  type: "behavior" | "academic" | "pastoral" | "general";
  catechistId: string;
  isPrivate: boolean;
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: Date;
  endDate?: Date;
  type: "class" | "meeting" | "celebration" | "retreat" | "other";
  location?: string;
  participants?: string[];
}

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: "document" | "video" | "image" | "link" | "other";
  url: string;
  category: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Communication {
  id: string;
  subject: string;
  message: string;
  recipients: string[];
  sentBy: string;
  sentAt: Date;
  type: "email" | "notification";
  status: "sent" | "pending" | "failed";
}

export interface Catechist {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "coordinador" | "catequista" | "secretario" | "auxiliar";
  specialization?: string;
  schedule?: string;
  status: "active" | "inactive";
  joinedDate: Date;
  address?: string;
  dateBri?: string;
  neighborhood?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  notes?: string;
}

export interface CatechistAttendance {
  id: string;
  catechistId: string;
  eventDate: Date;
  status: "present" | "absent" | "excused";
  notes?: string;
}

export interface Assignment {
  id: string;
  name: string;
  date: Date;
  type: "tarea" | "taller" | "examen" | "proyecto";
  maxScore: number;
  description?: string;
  createdAt: Date;
}

export interface Grade {
  id: string;
  studentId: string;
  assignmentId: string;
  score: number;
  notes?: string;
  submittedAt?: Date;
}
