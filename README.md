# Catequesis Frontend 📘✨

Frontend del **Sistema de Gestión de Catequesis**, desarrollado para facilitar la administración de estudiantes, catequistas, asistencia y procesos pastorales de forma moderna, rápida y accesible.

Este proyecto consume una API REST desarrollada en FastAPI y está diseñado para funcionar tanto en entornos locales como productivos.

---

## 🖥️ Tecnologías utilizadas

- **Next.js 14** (App Router)
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN/UI**
- **Fetch API**
- **JWT Authentication**
- **Git & GitHub**

---

## 📂 Estructura del proyecto

```txt
catechesis-frontend/
├── app/
│   ├── auth/                # Login y autenticación
│   ├── dashboard/           # Panel principal
│   │   ├── students/        # Gestión de estudiantes
│   │   ├── catechists/      # Gestión de catequistas
│   │   ├── attendance/      # Asistencia (estudiantes y catequistas)
│   │   └── users/           # Gestión de usuarios
│   └── layout.tsx
│
├── components/
│   ├── ui/                  # Componentes reutilizables (ShadCN)
│   └── shared/              # Componentes comunes
│
├── lib/
│   ├── api.ts               # Cliente base para llamadas HTTP
│   ├── students.ts          # Funciones API de estudiantes
│   ├── catechists.ts        # Funciones API de catequistas
│   └── attendance.ts        # Funciones API de asistencia
│
├── types/                   # Tipos TypeScript
├── public/                  # Recursos estáticos
├── styles/                  # Estilos globales
└── README.md

```
