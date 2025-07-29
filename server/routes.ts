import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertTonerSchema, insertStatusGarantiaSchema, insertStatusHomologacaoSchema, insertFornecedorSchema, insertRetornadoSchema, insertGarantiaSchema, insertFilialSchema, insertSetorSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await storage.getUserByEmail(email);
      
      if (!user || user.password !== password) {
        return res.status(401).json({ message: "Credenciais inválidas" });
      }

      if (!user.active) {
        return res.status(401).json({ message: "Usuário inativo" });
      }

      // In production, you'd set up proper session management
      res.json({ user: { ...user, password: undefined } });
    } catch (error) {
      res.status(500).json({ message: "Erro interno do servidor" });
    }
  });

  // Users
  app.get("/api/users", async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users.map(user => ({ ...user, password: undefined })));
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar usuários" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      const user = await storage.createUser(userData);
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const userData = insertUserSchema.partial().parse(req.body);
      const user = await storage.updateUser(id, userData);
      
      if (!user) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      res.json({ ...user, password: undefined });
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/users/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteUser(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Usuário não encontrado" });
      }
      
      res.json({ message: "Usuário deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar usuário" });
    }
  });

  // Toners
  app.get("/api/toners", async (req, res) => {
    try {
      const toners = await storage.getAllToners();
      res.json(toners);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar toners" });
    }
  });

  app.post("/api/toners", async (req, res) => {
    try {
      const tonerData = insertTonerSchema.parse(req.body);
      const toner = await storage.createToner(tonerData);
      res.json(toner);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/toners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const tonerData = insertTonerSchema.partial().parse(req.body);
      const toner = await storage.updateToner(id, tonerData);
      
      if (!toner) {
        return res.status(404).json({ message: "Toner não encontrado" });
      }
      
      res.json(toner);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/toners/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteToner(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Toner não encontrado" });
      }
      
      res.json({ message: "Toner deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar toner" });
    }
  });

  // Status Garantia
  app.get("/api/status-garantia", async (req, res) => {
    try {
      const status = await storage.getAllStatusGarantia();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar status de garantia" });
    }
  });

  app.post("/api/status-garantia", async (req, res) => {
    try {
      const statusData = insertStatusGarantiaSchema.parse(req.body);
      const status = await storage.createStatusGarantia(statusData);
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/status-garantia/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const statusData = insertStatusGarantiaSchema.partial().parse(req.body);
      const status = await storage.updateStatusGarantia(id, statusData);
      
      if (!status) {
        return res.status(404).json({ message: "Status não encontrado" });
      }
      
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/status-garantia/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStatusGarantia(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Status não encontrado" });
      }
      
      res.json({ message: "Status deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar status" });
    }
  });

  // Status Homologacao
  app.get("/api/status-homologacao", async (req, res) => {
    try {
      const status = await storage.getAllStatusHomologacao();
      res.json(status);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar status de homologação" });
    }
  });

  app.post("/api/status-homologacao", async (req, res) => {
    try {
      const statusData = insertStatusHomologacaoSchema.parse(req.body);
      const status = await storage.createStatusHomologacao(statusData);
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/status-homologacao/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const statusData = insertStatusHomologacaoSchema.partial().parse(req.body);
      const status = await storage.updateStatusHomologacao(id, statusData);
      
      if (!status) {
        return res.status(404).json({ message: "Status não encontrado" });
      }
      
      res.json(status);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/status-homologacao/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteStatusHomologacao(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Status não encontrado" });
      }
      
      res.json({ message: "Status deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar status" });
    }
  });

  // Fornecedores
  app.get("/api/fornecedores", async (req, res) => {
    try {
      const fornecedores = await storage.getAllFornecedores();
      res.json(fornecedores);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar fornecedores" });
    }
  });

  app.post("/api/fornecedores", async (req, res) => {
    try {
      const fornecedorData = insertFornecedorSchema.parse(req.body);
      const fornecedor = await storage.createFornecedor(fornecedorData);
      res.json(fornecedor);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/fornecedores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const fornecedorData = insertFornecedorSchema.partial().parse(req.body);
      const fornecedor = await storage.updateFornecedor(id, fornecedorData);
      
      if (!fornecedor) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      res.json(fornecedor);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/fornecedores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFornecedor(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Fornecedor não encontrado" });
      }
      
      res.json({ message: "Fornecedor deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar fornecedor" });
    }
  });

  // Retornados
  app.get("/api/retornados", async (req, res) => {
    try {
      const retornados = await storage.getAllRetornados();
      res.json(retornados);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar retornados" });
    }
  });

  app.post("/api/retornados", async (req, res) => {
    try {
      const retornadoData = insertRetornadoSchema.parse(req.body);
      const retornado = await storage.createRetornado(retornadoData);
      res.json(retornado);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  // Garantias
  app.get("/api/garantias", async (req, res) => {
    try {
      const garantias = await storage.getAllGarantias();
      res.json(garantias);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar garantias" });
    }
  });

  app.post("/api/garantias", async (req, res) => {
    try {
      const garantiaData = insertGarantiaSchema.parse(req.body);
      const garantia = await storage.createGarantia(garantiaData);
      res.json(garantia);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  // Filiais
  app.get("/api/filiais", async (req, res) => {
    try {
      const filiais = await storage.getAllFiliais();
      res.json(filiais);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar filiais" });
    }
  });

  app.post("/api/filiais", async (req, res) => {
    try {
      const filialData = insertFilialSchema.parse(req.body);
      const filial = await storage.createFilial(filialData);
      res.json(filial);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/filiais/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const filialData = insertFilialSchema.partial().parse(req.body);
      const filial = await storage.updateFilial(id, filialData);
      
      if (!filial) {
        return res.status(404).json({ message: "Filial não encontrada" });
      }
      
      res.json(filial);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/filiais/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteFilial(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Filial não encontrada" });
      }
      
      res.json({ message: "Filial deletada com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar filial" });
    }
  });

  // Setores
  app.get("/api/setores", async (req, res) => {
    try {
      const setores = await storage.getAllSetores();
      res.json(setores);
    } catch (error) {
      res.status(500).json({ message: "Erro ao buscar setores" });
    }
  });

  app.post("/api/setores", async (req, res) => {
    try {
      const setorData = insertSetorSchema.parse(req.body);
      const setor = await storage.createSetor(setorData);
      res.json(setor);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.put("/api/setores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const setorData = insertSetorSchema.partial().parse(req.body);
      const setor = await storage.updateSetor(id, setorData);
      
      if (!setor) {
        return res.status(404).json({ message: "Setor não encontrado" });
      }
      
      res.json(setor);
    } catch (error) {
      res.status(400).json({ message: "Dados inválidos" });
    }
  });

  app.delete("/api/setores/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSetor(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Setor não encontrado" });
      }
      
      res.json({ message: "Setor deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ message: "Erro ao deletar setor" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
