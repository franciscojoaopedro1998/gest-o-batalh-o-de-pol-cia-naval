
import { Militar } from "@/types";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateMilitarDossier = (militar: Militar) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42); // slate-950
    doc.rect(0, 0, 210, 40, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("BPNav HQ - Dossier Militar", 14, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 35);

    // Militar Info
    let yPos = 55;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`${militar.patente} ${militar.nome}`, 14, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`NIP: ${militar.nip} | Unidade: ${militar.unidadeMilitar} | Status: ${militar.situacao}`, 14, yPos);

    yPos += 15;
    doc.setDrawColor(200, 200, 200);
    doc.line(14, yPos, 196, yPos);

    // Technical Details
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Dados Técnicos", 14, yPos);

    yPos += 10;
    const technicalData = [
        ["Grupo Sanguíneo", militar.grupoSanguineo],
        ["Altura/Peso", `${militar.altura}cm / ${militar.peso}kg`],
        ["Especialidade", militar.especialidade],
        ["Função", militar.funcao],
        ["Contato Emergência", `${militar.contatoAcidente.nome} (${militar.contatoAcidente.telefone})`]
    ];

    autoTable(doc, {
        startY: yPos,
        head: [['Campo', 'Valor']],
        body: technicalData,
        theme: 'striped',
        headStyles: { fillColor: [15, 23, 42] },
        margin: { left: 14 }
    });

    // History
    yPos = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Histórico Operacional", 14, yPos);

    yPos += 5;
    const historyData = militar.historico.map(h => [
        new Date(h.data).toLocaleDateString(),
        h.tipo,
        h.descricao,
        h.detalhes || '-'
    ]);

    autoTable(doc, {
        startY: yPos,
        head: [['Data', 'Tipo', 'Descrição', 'Detalhes']],
        body: historyData,
        theme: 'grid',
        headStyles: { fillColor: [37, 99, 235] } // blue-600
    });

    doc.save(`dossier_${militar.nip}_${militar.nome.replace(/\s+/g, '_').toLowerCase()}.pdf`);
};
