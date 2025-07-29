import { 
  type User, 
  type InsertUser, 
  type Toner, 
  type InsertToner,
  type StatusGarantia,
  type InsertStatusGarantia,
  type StatusHomologacao,
  type InsertStatusHomologacao,
  type Fornecedor,
  type InsertFornecedor,
  type Retornado,
  type InsertRetornado,
  type Garantia,
  type InsertGarantia,
  type Filial,
  type InsertFilial,
  type Setor,
  type InsertSetor
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getAllUsers(): Promise<User[]>;

  // Toners
  getAllToners(): Promise<Toner[]>;
  getTonerById(id: string): Promise<Toner | undefined>;
  createToner(toner: InsertToner): Promise<Toner>;
  updateToner(id: string, toner: Partial<InsertToner>): Promise<Toner | undefined>;
  deleteToner(id: string): Promise<boolean>;

  // Status
  getAllStatusGarantia(): Promise<StatusGarantia[]>;
  createStatusGarantia(status: InsertStatusGarantia): Promise<StatusGarantia>;
  updateStatusGarantia(id: string, status: Partial<InsertStatusGarantia>): Promise<StatusGarantia | undefined>;
  deleteStatusGarantia(id: string): Promise<boolean>;

  getAllStatusHomologacao(): Promise<StatusHomologacao[]>;
  createStatusHomologacao(status: InsertStatusHomologacao): Promise<StatusHomologacao>;
  updateStatusHomologacao(id: string, status: Partial<InsertStatusHomologacao>): Promise<StatusHomologacao | undefined>;
  deleteStatusHomologacao(id: string): Promise<boolean>;

  // Fornecedores
  getAllFornecedores(): Promise<Fornecedor[]>;
  createFornecedor(fornecedor: InsertFornecedor): Promise<Fornecedor>;
  updateFornecedor(id: string, fornecedor: Partial<InsertFornecedor>): Promise<Fornecedor | undefined>;
  deleteFornecedor(id: string): Promise<boolean>;

  // Retornados
  getAllRetornados(): Promise<Retornado[]>;
  createRetornado(retornado: InsertRetornado): Promise<Retornado>;
  updateRetornado(id: string, retornado: Partial<InsertRetornado>): Promise<Retornado | undefined>;
  deleteRetornado(id: string): Promise<boolean>;

  // Garantias
  getAllGarantias(): Promise<Garantia[]>;
  createGarantia(garantia: InsertGarantia): Promise<Garantia>;
  updateGarantia(id: string, garantia: Partial<InsertGarantia>): Promise<Garantia | undefined>;
  deleteGarantia(id: string): Promise<boolean>;

  // Filiais
  getAllFiliais(): Promise<Filial[]>;
  createFilial(filial: InsertFilial): Promise<Filial>;
  updateFilial(id: string, filial: Partial<InsertFilial>): Promise<Filial | undefined>;
  deleteFilial(id: string): Promise<boolean>;

  // Setores
  getAllSetores(): Promise<Setor[]>;
  createSetor(setor: InsertSetor): Promise<Setor>;
  updateSetor(id: string, setor: Partial<InsertSetor>): Promise<Setor | undefined>;
  deleteSetor(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private toners: Map<string, Toner> = new Map();
  private statusGarantia: Map<string, StatusGarantia> = new Map();
  private statusHomologacao: Map<string, StatusHomologacao> = new Map();
  private fornecedores: Map<string, Fornecedor> = new Map();
  private retornados: Map<string, Retornado> = new Map();
  private garantias: Map<string, Garantia> = new Map();
  private filiais: Map<string, Filial> = new Map();
  private setores: Map<string, Setor> = new Map();

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed default admin user
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      name: "Administrador",
      email: "admin@sistema.com",
      password: "123456", // In production, this would be hashed
      permissions: ["create", "read", "update", "delete", "export"],
      modules: ["dashboard", "cadastros", "retornados", "garantias", "amostragens", "homologacoes", "certificados", "pop-it", "processos", "auditorias", "dinamicas", "configuracoes"],
      active: true,
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Seed default status
    const statusIds = {
      aguardandoEnvio: randomUUID(),
      aguardandoColeta: randomUUID(),
      emProcesso: randomUUID(),
    };

    this.statusGarantia.set(statusIds.aguardandoEnvio, {
      id: statusIds.aguardandoEnvio,
      status: "Aguardando envio para fornecedor",
      createdAt: new Date(),
    });

    this.statusGarantia.set(statusIds.aguardandoColeta, {
      id: statusIds.aguardandoColeta,
      status: "Aguardando Coleta",
      createdAt: new Date(),
    });

    this.statusGarantia.set(statusIds.emProcesso, {
      id: statusIds.emProcesso,
      status: "Em processo",
      createdAt: new Date(),
    });

    // Seed homologacao status
    const homologacaoIds = {
      aprovado: randomUUID(),
      reprovado: randomUUID(),
      emAndamento: randomUUID(),
    };

    this.statusHomologacao.set(homologacaoIds.aprovado, {
      id: homologacaoIds.aprovado,
      status: "Aprovado",
      createdAt: new Date(),
    });

    this.statusHomologacao.set(homologacaoIds.reprovado, {
      id: homologacaoIds.reprovado,
      status: "Reprovado",
      createdAt: new Date(),
    });

    this.statusHomologacao.set(homologacaoIds.emAndamento, {
      id: homologacaoIds.emAndamento,
      status: "Em Andamento",
      createdAt: new Date(),
    });

    // Seed default filiais
    const filialIds = {
      matriz: randomUUID(),
      rj: randomUUID(),
      bh: randomUUID(),
    };

    this.filiais.set(filialIds.matriz, {
      id: filialIds.matriz,
      nome: "Matriz - São Paulo",
      createdAt: new Date(),
    });

    this.filiais.set(filialIds.rj, {
      id: filialIds.rj,
      nome: "Filial - Rio de Janeiro",
      createdAt: new Date(),
    });

    this.filiais.set(filialIds.bh, {
      id: filialIds.bh,
      nome: "Filial - Belo Horizonte",
      createdAt: new Date(),
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  // Toner methods
  async getAllToners(): Promise<Toner[]> {
    return Array.from(this.toners.values());
  }

  async getTonerById(id: string): Promise<Toner | undefined> {
    return this.toners.get(id);
  }

  async createToner(insertToner: InsertToner): Promise<Toner> {
    const id = randomUUID();
    const gramatura = insertToner.pesocheio - insertToner.pesovazio;
    const gramaturaFolha = gramatura / insertToner.capacidade;
    const precoFolha = insertToner.preco / insertToner.capacidade;
    
    const toner: Toner = { 
      ...insertToner, 
      id, 
      gramatura,
      gramaturaFolha,
      precoFolha,
      createdAt: new Date() 
    };
    this.toners.set(id, toner);
    return toner;
  }

  async updateToner(id: string, tonerData: Partial<InsertToner>): Promise<Toner | undefined> {
    const toner = this.toners.get(id);
    if (!toner) return undefined;
    
    const updatedData = { ...toner, ...tonerData };
    
    // Recalculate derived fields
    if (tonerData.pesocheio !== undefined || tonerData.pesovazio !== undefined) {
      updatedData.gramatura = updatedData.pesoqueio - updatedData.pesovazio;
    }
    if (tonerData.capacidade !== undefined || updatedData.gramatura !== toner.gramatura) {
      updatedData.gramaturaFolha = updatedData.gramatura / updatedData.capacidade;
    }
    if (tonerData.preco !== undefined || tonerData.capacidade !== undefined) {
      updatedData.precoFolha = updatedData.preco / updatedData.capacidade;
    }
    
    this.toners.set(id, updatedData);
    return updatedData;
  }

  async deleteToner(id: string): Promise<boolean> {
    return this.toners.delete(id);
  }

  // Status Garantia methods
  async getAllStatusGarantia(): Promise<StatusGarantia[]> {
    return Array.from(this.statusGarantia.values());
  }

  async createStatusGarantia(insertStatus: InsertStatusGarantia): Promise<StatusGarantia> {
    const id = randomUUID();
    const status: StatusGarantia = { 
      ...insertStatus, 
      id, 
      createdAt: new Date() 
    };
    this.statusGarantia.set(id, status);
    return status;
  }

  async updateStatusGarantia(id: string, statusData: Partial<InsertStatusGarantia>): Promise<StatusGarantia | undefined> {
    const status = this.statusGarantia.get(id);
    if (!status) return undefined;
    
    const updatedStatus = { ...status, ...statusData };
    this.statusGarantia.set(id, updatedStatus);
    return updatedStatus;
  }

  async deleteStatusGarantia(id: string): Promise<boolean> {
    return this.statusGarantia.delete(id);
  }

  // Status Homologacao methods
  async getAllStatusHomologacao(): Promise<StatusHomologacao[]> {
    return Array.from(this.statusHomologacao.values());
  }

  async createStatusHomologacao(insertStatus: InsertStatusHomologacao): Promise<StatusHomologacao> {
    const id = randomUUID();
    const status: StatusHomologacao = { 
      ...insertStatus, 
      id, 
      createdAt: new Date() 
    };
    this.statusHomologacao.set(id, status);
    return status;
  }

  async updateStatusHomologacao(id: string, statusData: Partial<InsertStatusHomologacao>): Promise<StatusHomologacao | undefined> {
    const status = this.statusHomologacao.get(id);
    if (!status) return undefined;
    
    const updatedStatus = { ...status, ...statusData };
    this.statusHomologacao.set(id, updatedStatus);
    return updatedStatus;
  }

  async deleteStatusHomologacao(id: string): Promise<boolean> {
    return this.statusHomologacao.delete(id);
  }

  // Fornecedor methods
  async getAllFornecedores(): Promise<Fornecedor[]> {
    return Array.from(this.fornecedores.values());
  }

  async createFornecedor(insertFornecedor: InsertFornecedor): Promise<Fornecedor> {
    const id = randomUUID();
    const fornecedor: Fornecedor = { 
      ...insertFornecedor, 
      id, 
      createdAt: new Date() 
    };
    this.fornecedores.set(id, fornecedor);
    return fornecedor;
  }

  async updateFornecedor(id: string, fornecedorData: Partial<InsertFornecedor>): Promise<Fornecedor | undefined> {
    const fornecedor = this.fornecedores.get(id);
    if (!fornecedor) return undefined;
    
    const updatedFornecedor = { ...fornecedor, ...fornecedorData };
    this.fornecedores.set(id, updatedFornecedor);
    return updatedFornecedor;
  }

  async deleteFornecedor(id: string): Promise<boolean> {
    return this.fornecedores.delete(id);
  }

  // Retornado methods
  async getAllRetornados(): Promise<Retornado[]> {
    return Array.from(this.retornados.values());
  }

  async createRetornado(insertRetornado: InsertRetornado): Promise<Retornado> {
    const id = randomUUID();
    const retornado: Retornado = { 
      ...insertRetornado, 
      id, 
      createdAt: new Date() 
    };
    this.retornados.set(id, retornado);
    return retornado;
  }

  async updateRetornado(id: string, retornadoData: Partial<InsertRetornado>): Promise<Retornado | undefined> {
    const retornado = this.retornados.get(id);
    if (!retornado) return undefined;
    
    const updatedRetornado = { ...retornado, ...retornadoData };
    this.retornados.set(id, updatedRetornado);
    return updatedRetornado;
  }

  async deleteRetornado(id: string): Promise<boolean> {
    return this.retornados.delete(id);
  }

  // Garantia methods
  async getAllGarantias(): Promise<Garantia[]> {
    return Array.from(this.garantias.values());
  }

  async createGarantia(insertGarantia: InsertGarantia): Promise<Garantia> {
    const id = randomUUID();
    const garantia: Garantia = { 
      ...insertGarantia, 
      id, 
      createdAt: new Date() 
    };
    this.garantias.set(id, garantia);
    return garantia;
  }

  async updateGarantia(id: string, garantiaData: Partial<InsertGarantia>): Promise<Garantia | undefined> {
    const garantia = this.garantias.get(id);
    if (!garantia) return undefined;
    
    const updatedGarantia = { ...garantia, ...garantiaData };
    this.garantias.set(id, updatedGarantia);
    return updatedGarantia;
  }

  async deleteGarantia(id: string): Promise<boolean> {
    return this.garantias.delete(id);
  }

  // Filial methods
  async getAllFiliais(): Promise<Filial[]> {
    return Array.from(this.filiais.values());
  }

  async createFilial(insertFilial: InsertFilial): Promise<Filial> {
    const id = randomUUID();
    const filial: Filial = { 
      ...insertFilial, 
      id, 
      createdAt: new Date() 
    };
    this.filiais.set(id, filial);
    return filial;
  }

  async updateFilial(id: string, filialData: Partial<InsertFilial>): Promise<Filial | undefined> {
    const filial = this.filiais.get(id);
    if (!filial) return undefined;
    
    const updatedFilial = { ...filial, ...filialData };
    this.filiais.set(id, updatedFilial);
    return updatedFilial;
  }

  async deleteFilial(id: string): Promise<boolean> {
    return this.filiais.delete(id);
  }

  // Setor methods
  async getAllSetores(): Promise<Setor[]> {
    return Array.from(this.setores.values());
  }

  async createSetor(insertSetor: InsertSetor): Promise<Setor> {
    const id = randomUUID();
    const setor: Setor = { 
      ...insertSetor, 
      id, 
      createdAt: new Date() 
    };
    this.setores.set(id, setor);
    return setor;
  }

  async updateSetor(id: string, setorData: Partial<InsertSetor>): Promise<Setor | undefined> {
    const setor = this.setores.get(id);
    if (!setor) return undefined;
    
    const updatedSetor = { ...setor, ...setorData };
    this.setores.set(id, updatedSetor);
    return updatedSetor;
  }

  async deleteSetor(id: string): Promise<boolean> {
    return this.setores.delete(id);
  }
}

export const storage = new MemStorage();
