"use client";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Catechist, Student } from "./types";

export function exportStudentsToPDF(students: Student[], gradeFilter?: string | null) {
  const doc = new jsPDF();

  // Ordenar por barrio (address) A-Z

  const sortedStudents = [...students].sort((a, b) => {
    const addressA = (a.address || "").toLowerCase();
    const addressB = (b.address || "").toLowerCase();
    return addressA.localeCompare(addressB, "es");
  });

  const title = gradeFilter
    ? `Lista de Estudiantes - ${gradeFilter}`
    : "Lista General de Estudiantes";


  const fileName = gradeFilter 
    ? `lista-estudiantes-${gradeFilter.toLowerCase().replace(/\s+/g, "-")}.pdf`
    : "lista-general-estudiantes.pdf";



  // Title
  doc.setFontSize(18);
  doc.setTextColor(146, 64, 14);
  doc.text(title, 14, 22);
  doc.text("Parroquia San Francisco de Taquil", 14, 28);

  // Subtitle with date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    14,
    45,
  );


  // Table
  const tableData = sortedStudents.map((student, index) => [
    index + 1,
    student.first_name + " " + student.last_name,
    student.address || "No especificado",
    student.grade || "No especificado",
  ]);

  autoTable(doc, {
    startY: 38,
    head: [["#", "Nombre y Apellido", "Barrio", "Nivel"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [217, 119, 6], // amber-600
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [254, 243, 199], // amber-100
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 80 },
      2: { cellWidth: 30 },
      3: { cellWidth: 35 },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
  }

  doc.save(fileName);
}

export function exportCatechistsToPDF(catechists: Catechist[]) {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setTextColor(146, 64, 14);
  doc.text("Lista de Catequistas", 14, 22);
  doc.text("Parroquia Eclesiástica San Francisco de Taquil", 14, 28);

  // Subtitle with date
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Generado el: ${new Date().toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    14,
    45,
  );

  // Table data
  const tableData = catechists.map((catechist, index) => [
    index + 1,
    catechist.first_name,
    catechist.last_name,
    catechist.ci || "No especificado",
    catechist.service_years || "No especificado",
  ]);

  autoTable(doc, {
    startY: 38,
    head: [["#", "Nombre", "Apellido", "Cédula", "Años de Servicio"]],
    body: tableData,
    theme: "grid",
    headStyles: {
      fillColor: [217, 119, 6], // amber-600
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [254, 243, 199], // amber-100
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: 15, halign: "center" },
      1: { cellWidth: 40 },
      2: { cellWidth: 40 },
      3: { cellWidth: 45 },
      4: { cellWidth: 40, halign: "center" },
    },
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" },
    );
  }

  doc.save("lista-catequistas.pdf");
}
