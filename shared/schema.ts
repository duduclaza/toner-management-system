import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, real, timestamp, boolean, uuid, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  permissions: json("permissions").$type<string[]>().default([]),
  modules: json("modules").$type<string[]>().default([]),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Toners table
export const toners = pgTable("toners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modelo: text("modelo").notNull(),
  pesocheio: real("peso_cheio").notNull(),
  pesovazio: real("peso_vazio").notNull(),
  gramatura: real("gramatura").notNull(),
  capacidade: integer("capacidade").notNull(),
  gramaturaFolha: real("gramatura_folha").notNull(),
  preco: real("preco").notNull(),
  precoFolha: real("preco_folha").notNull(),
  cor: text("cor").notNull(),
  tipo: text("tipo").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Status tables
export const statusGarantia = pgTable("status_garantia", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const statusHomologacao = pgTable("status_homologacao", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Fornecedores table
export const fornecedores = pgTable("fornecedores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  telefone: text("telefone"),
  linkRma: text("link_rma"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Retornados table
export const retornados = pgTable("retornados", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  modeloId: varchar("modelo_id").references(() => toners.id),
  codigoCliente: text("codigo_cliente").notNull(),
  filial: text("filial").notNull(),
  pesoRetornado: real("peso_retornado").notNull(),
  gramaturaPresente: real("gramatura_presente").notNull(),
  percentualGramatura: real("percentual_gramatura").notNull(),
  destino: text("destino").notNull(),
  valorRecuperado: real("valor_recuperado"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Garantias table
export const garantias = pgTable("garantias", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itens: json("itens").$type<Array<{quantidade: number, descricao: string, valorUnitario: number, valorTotal: number}>>().notNull(),
  nfCompras: text("nf_compras").notNull(),
  anexoNfCompras: text("anexo_nf_compras"),
  fornecedorId: varchar("fornecedor_id").references(() => fornecedores.id),
  statusId: varchar("status_id").references(() => statusGarantia.id),
  nfSimplesRemessa: text("nf_simples_remessa"),
  anexoNfSimplesRemessa: text("anexo_nf_simples_remessa"),
  nfDevolucao: text("nf_devolucao"),
  anexoNfDevolucao: text("anexo_nf_devolucao"),
  ns: text("ns"),
  lote: text("lote"),
  ticketFornecedor: text("ticket_fornecedor"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Filiais table
export const filiais = pgTable("filiais", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Setores table
export const setores = pgTable("setores", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  nome: text("nome").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertTonerSchema = createInsertSchema(toners).omit({
  id: true,
  createdAt: true,
  gramatura: true,
  gramaturaFolha: true,
  precoFolha: true,
});

export const insertStatusGarantiaSchema = createInsertSchema(statusGarantia).omit({
  id: true,
  createdAt: true,
});

export const insertStatusHomologacaoSchema = createInsertSchema(statusHomologacao).omit({
  id: true,
  createdAt: true,
});

export const insertFornecedorSchema = createInsertSchema(fornecedores).omit({
  id: true,
  createdAt: true,
});

export const insertRetornadoSchema = createInsertSchema(retornados).omit({
  id: true,
  createdAt: true,
});

export const insertGarantiaSchema = createInsertSchema(garantias).omit({
  id: true,
  createdAt: true,
});

export const insertFilialSchema = createInsertSchema(filiais).omit({
  id: true,
  createdAt: true,
});

export const insertSetorSchema = createInsertSchema(setores).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Toner = typeof toners.$inferSelect;
export type InsertToner = z.infer<typeof insertTonerSchema>;
export type StatusGarantia = typeof statusGarantia.$inferSelect;
export type InsertStatusGarantia = z.infer<typeof insertStatusGarantiaSchema>;
export type StatusHomologacao = typeof statusHomologacao.$inferSelect;
export type InsertStatusHomologacao = z.infer<typeof insertStatusHomologacaoSchema>;
export type Fornecedor = typeof fornecedores.$inferSelect;
export type InsertFornecedor = z.infer<typeof insertFornecedorSchema>;
export type Retornado = typeof retornados.$inferSelect;
export type InsertRetornado = z.infer<typeof insertRetornadoSchema>;
export type Garantia = typeof garantias.$inferSelect;
export type InsertGarantia = z.infer<typeof insertGarantiaSchema>;
export type Filial = typeof filiais.$inferSelect;
export type InsertFilial = z.infer<typeof insertFilialSchema>;
export type Setor = typeof setores.$inferSelect;
export type InsertSetor = z.infer<typeof insertSetorSchema>;
