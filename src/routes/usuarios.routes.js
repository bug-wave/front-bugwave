// Rotas para Usuários
import express from "express";
const router = express.Router();
import UsuarioService from "../services/UsuarioService";

// Obter todos os usuários
router.get("/", (req, res) => {
  try {
    const usuarios = UsuarioService.getAll();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuários" });
  }
});

// Obter um usuário pelo ID
router.get("/:id", (req, res) => {
  try {
    const usuario = UsuarioService.getById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não retorna a senha hash por segurança
    const { senhaHash, ...usuarioSemSenha } = usuario;
    res.json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Criar um novo usuário
router.post("/", (req, res) => {
  try {
    const novoUsuario = UsuarioService.create(req.body);

    if (novoUsuario.error) {
      return res.status(400).json({ error: novoUsuario.error });
    }

    // Não retorna a senha hash por segurança
    const { senhaHash, ...usuarioSemSenha } = novoUsuario;
    res.status(201).json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Atualizar um usuário
router.put("/:id", (req, res) => {
  try {
    const usuarioAtualizado = UsuarioService.update(req.params.id, req.body);

    if (!usuarioAtualizado) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (usuarioAtualizado.error) {
      return res.status(400).json({ error: usuarioAtualizado.error });
    }

    // Não retorna a senha hash por segurança
    const { senhaHash, ...usuarioSemSenha } = usuarioAtualizado;
    res.json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Excluir um usuário
router.delete("/:id", (req, res) => {
  try {
    const result = UsuarioService.delete(req.params.id);

    if (!result) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
});

// Buscar usuário por email
router.get("/email/:email", (req, res) => {
  try {
    const usuario = UsuarioService.getByEmail(req.params.email);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não retorna a senha hash por segurança
    const { senhaHash, ...usuarioSemSenha } = usuario;
    res.json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar usuário" });
  }
});

// Obter todos os revisores
router.get("/tipo/revisores", (req, res) => {
  try {
    const revisores = UsuarioService.getRevisores();

    // Remove as senhas hash por segurança
    const revisoresSemSenha = revisores.map(({ senhaHash, ...resto }) => resto);
    res.json(revisoresSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar revisores" });
  }
});

// Obter todos os coordenadores
router.get("/tipo/coordenadores", (req, res) => {
  try {
    const coordenadores = UsuarioService.getCoordenadores();

    // Remove as senhas hash por segurança
    const coordenadoresSemSenha = coordenadores.map(
      ({ senhaHash, ...resto }) => resto
    );
    res.json(coordenadoresSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar coordenadores" });
  }
});

// Definir usuário como revisor
router.put("/:id/revisor", (req, res) => {
  try {
    const { isRevisor } = req.body;

    if (isRevisor === undefined) {
      return res.status(400).json({ error: "O valor isRevisor é obrigatório" });
    }

    const usuario = UsuarioService.setRevisor(req.params.id, isRevisor);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não retorna a senha hash por segurança
    const { senhaHash, ...usuarioSemSenha } = usuario;
    res.json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Definir usuário como coordenador
router.put("/:id/coordenador", (req, res) => {
  try {
    const { isCoordenador } = req.body;

    if (isCoordenador === undefined) {
      return res
        .status(400)
        .json({ error: "O valor isCoordenador é obrigatório" });
    }

    const usuario = UsuarioService.setCoordenador(req.params.id, isCoordenador);

    if (!usuario) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    // Não retorna a senha hash por segurança
    const { senhaHash, ...usuarioSemSenha } = usuario;
    res.json(usuarioSemSenha);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
});

// Login de usuário
router.post("/login", (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    const resultado = UsuarioService.login(email, senha);

    if (!resultado.success) {
      return res.status(401).json({ error: resultado.message });
    }

    res.json({
      success: true,
      usuario: resultado.usuario,
    });
  } catch (error) {
    res.status(500).json({ error: "Erro ao realizar login" });
  }
});

export default router;
