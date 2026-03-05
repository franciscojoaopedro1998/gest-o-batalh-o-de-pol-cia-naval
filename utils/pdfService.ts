
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Militar } from '../types';

export const generateMilitarDossier = (militar: Militar) => {
    const doc = new jsPDF();

    // Header
    doc.setFillColor(15, 23, 42); // slate-950
    doc.rect(0, 0, 210, 40, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('BPNav - Dossier Militar', 20, 20);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Gerado em: ${new Date().toLocaleDateString('pt-AO')}`, 20, 30);
    doc.text('CONFIDENCIAL', 170, 20);

    // Profile Info
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Dados Pessoais', 20, 55);

    autoTable(doc, {
        startY: 60,
        head: [],
        body: [
            ['Nome Completo', militar.nome, 'Patente', militar.patente],
            ['NIP', militar.nip, 'BI', militar.bi || 'N/A'],
            ['Unidade', militar.unidadeMilitar, 'Situação', militar.situacao],
            ['Data Nascimento', new Date(militar.dataNascimento).toLocaleDateString(), 'Grupo Sanguíneo', militar.grupoSanguineo],
            ['Filiação (Pai)', militar.filiacao.pai, 'Filiação (Mãe)', militar.filiacao.mae],
        ],
        theme: 'grid',
        styles: { fontSize: 9, cellPadding: 3 },
        columnStyles: { 0: { fontStyle: 'bold', fillColor: [241, 245, 249] }, 2: { fontStyle: 'bold', fillColor: [241, 245, 249] } },
    });

    // History
    doc.text('Histórico Operacional', 20, (doc as any).lastAutoTable.finalY + 15);

    const historyRows = militar.historico.map(h => [
        new Date(h.data).toLocaleDateString(),
        h.tipo,
        h.descricao,
        h.detalhes || '-'
    ]);

    autoTable(doc, {
        startY: (doc as any).lastAutoTable.finalY + 20,
        head: [['Data', 'Tipo', 'Descrição', 'Detalhes']],
        body: historyRows,
        headStyles: { fillColor: [37, 99, 235] }, // blue-600
        styles: { fontSize: 8 },
    });

    // Save
    doc.save(`dossier_${militar.nip}.pdf`);
};
