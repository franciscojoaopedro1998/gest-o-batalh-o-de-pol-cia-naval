
import { pgTable, text, timestamp, date, uuid, integer, real } from 'drizzle-orm/pg-core';

export const militares = pgTable('militares', {
    id: uuid('id').defaultRandom().primaryKey(),
    nip: text('nip').notNull().unique(),
    patente: text('patente').notNull(),
    nome: text('nome').notNull(),
    bi: text('bi').unique(),
    dataNascimento: date('data_nascimento'),
    sexo: text('sexo'),
    grupoSanguineo: text('grupo_sanguineo'),
    altura: real('altura'),
    peso: real('peso'),
    unidadeMilitar: text('unidade_militar').default('Batalhão de Polícia Naval'),
    situacao: text('situacao').default('Ativo'),
    funcao: text('funcao'),
    foto: text('foto'), // Base64 or URL
    dataIncorporacao: date('data_incorporacao'),
    dataUltimaPromocao: date('data_ultima_promocao'),
    createdAt: timestamp('created_at').defaultNow(),
});

export const missoes = pgTable('missoes', {
    id: uuid('id').defaultRandom().primaryKey(),
    nome: text('nome').notNull(),
    descricao: text('descricao'),
    local: text('local'),
    dataInicio: date('data_inicio'),
    dataFimPrevista: date('data_fim_prevista'),
    status: text('status').default('Planejada'), // Planejada, Em Curso, Concluída
});

// Join table for Military <-> Mission
export const missoesMilitares = pgTable('missoes_militares', {
    id: uuid('id').defaultRandom().primaryKey(),
    missaoId: uuid('missao_id').references(() => missoes.id),
    militarId: uuid('militar_id').references(() => militares.id),
    dataAtribuicao: timestamp('data_atribuicao').defaultNow(),
});

export const historico = pgTable('historico', {
    id: uuid('id').defaultRandom().primaryKey(),
    militarId: uuid('militar_id').references(() => militares.id),
    tipo: text('tipo').notNull(), // PROMOÇÃO, MISSÃO, FÉRIAS, etc.
    data: date('data').notNull(),
    descricao: text('descricao').notNull(),
    detalhes: text('detalhes'),
});
