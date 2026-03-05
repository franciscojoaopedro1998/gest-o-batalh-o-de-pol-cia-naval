
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

// --- CSV Export ---
export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
    if (!data || data.length === 0) {
        alert("Sem dados para exportar.");
        return;
    }

    const keys = headers || Object.keys(data[0]);

    const csvContent = [
        keys.join(','),
        ...data.map(item => keys.map(key => {
            let value = item[key];
            if (typeof value === 'string') {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `${filename}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};

// --- Excel Export ---
export const exportToExcel = (data: any[], filename: string, sheetName: string = "Relatório") => {
    if (!data || data.length === 0) {
        alert("Sem dados para exportar.");
        return;
    }

    // Clean data for excel (remove circular refs or complex objects if any)
    const cleanData = data.map(item => {
        const newItem: any = {};
        for (const key in item) {
            if (typeof item[key] !== 'object' || item[key] === null || item[key] instanceof Date) {
                newItem[key] = item[key];
            } else if (Array.isArray(item[key])) {
                newItem[key] = item[key].length + " registros";
            } else {
                newItem[key] = "[Objeto]";
            }
        }
        return newItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(cleanData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
};

// --- PDF Export ---
export const exportToPDF = (
    title: string,
    data: any[],
    columns: { header: string, dataKey: string }[],
    filename: string
) => {
    if (!data || data.length === 0) {
        alert("Sem dados para exportar.");
        return;
    }

    const doc = new jsPDF();

    // Header Stylized
    doc.setFillColor(2, 6, 23); // Slate 950
    doc.rect(0, 0, doc.internal.pageSize.width, 45, 'F');

    // Blue accent line
    doc.setFillColor(37, 99, 235); // Blue 600
    doc.rect(0, 45, doc.internal.pageSize.width, 2, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text(title.toUpperCase(), 20, 22);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184); // Slate 400
    doc.text("SISTEMA DE GESTÃO DE PESSOAL E QUADROS", 20, 32);
    doc.text("MARINHA DE GUERRA DE ANGOLA - COMANDO CENTRAL", 20, 37);

    doc.setTextColor(255, 255, 255);
    doc.text(`DATA: ${new Date().toLocaleDateString()} | REF: OFF-${Math.floor(Math.random() * 10000)}`, 20, 42);

    // Table
    autoTable(doc, {
        startY: 55,
        head: [columns.map(c => c.header.toUpperCase())],
        body: data.map(item => columns.map(c => {
            const val = item[c.dataKey];
            return val !== undefined && val !== null ? String(val) : "---";
        })),
        theme: 'striped',
        headStyles: {
            fillColor: [2, 6, 23],
            textColor: [255, 255, 255],
            fontSize: 8,
            fontStyle: 'bold',
            halign: 'left',
            cellPadding: 5
        },
        bodyStyles: {
            fontSize: 9,
            cellPadding: 4,
            textColor: [30, 41, 59]
        },
        alternateRowStyles: {
            fillColor: [248, 250, 252]
        },
        margin: { top: 55 },
        didDrawPage: (data) => {
            // Footer on each page
            doc.setFontSize(7);
            doc.setTextColor(150);
            const str = "DOCUMENTO OFICIAL PARA USO INTERNO - CLASSIFICADO";
            doc.text(str, 20, doc.internal.pageSize.height - 10);

            const pageStr = `PAGINA ${data.pageNumber}`;
            doc.text(pageStr, doc.internal.pageSize.width - 20, doc.internal.pageSize.height - 10, { align: 'right' });
        }
    });

    doc.save(`${filename}.pdf`);
};
