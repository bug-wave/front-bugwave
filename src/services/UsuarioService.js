// Serviço para entidade Usuário
const usuariosMock = require("../data/usuarios.mock");

class UsuarioService {
  constructor() {
    this.usuarios = usuariosMock;
  }

  // Obtém todos os usuários
  getAll() {
    return this.usuarios;
  }

  // Obtém um usuário pelo ID
  getById(id) {
    return this.usuarios.find((usuario) => usuario.id === id);
  }

  // Adiciona um novo usuário
  create(usuarioData) {
    // Verifica se já existe um usuário com o mesmo email
    const emailExistente = this.usuarios.find(
      (usuario) => usuario.email === usuarioData.email
    );
    if (emailExistente) {
      return { error: "Email já está em uso" };
    }

    const novoUsuario = {
      ...usuarioData,
      id: (this.usuarios.length + 1).toString(),
      isCoordenador: usuarioData.isCoordenador || false,
      isRevisor: usuarioData.isRevisor || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.usuarios.push(novoUsuario);
    return novoUsuario;
  }

  // Atualiza um usuário existente
  update(id, usuarioData) {
    const index = this.usuarios.findIndex((usuario) => usuario.id === id);

    if (index === -1) {
      return null;
    }

    // Verificar se está tentando alterar o email para um que já existe
    if (
      usuarioData.email &&
      usuarioData.email !== this.usuarios[index].email &&
      this.usuarios.some((usuario) => usuario.email === usuarioData.email)
    ) {
      return { error: "Email já está em uso" };
    }

    const usuarioAtualizado = {
      ...this.usuarios[index],
      ...usuarioData,
      updatedAt: new Date(),
    };

    this.usuarios[index] = usuarioAtualizado;
    return usuarioAtualizado;
  }

  // Remove um usuário
  delete(id) {
    const index = this.usuarios.findIndex((usuario) => usuario.id === id);

    if (index === -1) {
      return false;
    }

    this.usuarios.splice(index, 1);
    return true;
  }

  // Buscar usuário por email
  getByEmail(email) {
    return this.usuarios.find((usuario) => usuario.email === email);
  }

  // Obter todos os revisores
  getRevisores() {
    return this.usuarios.filter((usuario) => usuario.isRevisor === true);
  }

  // Obter todos os coordenadores
  getCoordenadores() {
    return this.usuarios.filter((usuario) => usuario.isCoordenador === true);
  }

  // Alterar perfil de usuário para revisor
  setRevisor(id, isRevisor) {
    const usuario = this.getById(id);

    if (!usuario) {
      return null;
    }

    usuario.isRevisor = isRevisor;
    usuario.updatedAt = new Date();
    return usuario;
  }

  // Alterar perfil de usuário para coordenador
  setCoordenador(id, isCoordenador) {
    const usuario = this.getById(id);

    if (!usuario) {
      return null;
    }

    usuario.isCoordenador = isCoordenador;
    usuario.updatedAt = new Date();
    return usuario;
  }

  // Login de usuário
  login(email, senha) {
    // Em uma aplicação real, você deve comparar hashes de senha
    // Este é apenas um mock simplificado
    const usuario = this.getByEmail(email);

    if (!usuario || usuario.senhaHash !== senha) {
      return { success: false, message: "Credenciais inválidas" };
    }

    return {
      success: true,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        isCoordenador: usuario.isCoordenador,
        isRevisor: usuario.isRevisor,
      },
    };
  }

  // Buscar usuários por IDs
  getByIds(ids) {
    return this.usuarios.filter((usuario) => ids.includes(usuario.id));
  }
}

module.exports = new UsuarioService();
