// Serviço API centralizado para fazer chamadas HTTP ao backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Interface genérica para resposta da API
interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

// Funções utilitárias para chamadas HTTP
const api = {
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`);

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      console.error(`Erro na chamada GET para ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Erro desconhecido na requisição",
      };
    }
  },

  async post<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      console.error(`Erro na chamada POST para ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Erro desconhecido na requisição",
      };
    }
  },

  async put<T>(endpoint: string, body: any): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      console.error(`Erro na chamada PUT para ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Erro desconhecido na requisição",
      };
    }
  },

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status}: ${response.statusText}`,
        };
      }

      // DELETE pode retornar sem conteúdo
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      console.error(`Erro na chamada DELETE para ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Erro desconhecido na requisição",
      };
    }
  },

  async upload<T>(
    endpoint: string,
    file: File,
    additionalData?: Record<string, any>
  ): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append("file", file);

      // Adiciona dados adicionais ao FormData se fornecidos
      if (additionalData) {
        Object.entries(additionalData).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        return {
          success: false,
          error: `Erro ${response.status}: ${response.statusText}`,
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      console.error(`Erro no upload para ${endpoint}:`, err);
      return {
        success: false,
        error: err.message || "Erro desconhecido no upload",
      };
    }
  },
};

// Serviços específicos para cada entidade
export const ArtigoService = {
  // Obter todos os artigos
  getAll: async () => {
    return api.get("/artigo");
  },

  // Obter artigo por ID
  getById: async (id: string) => {
    return api.get(`/artigo/${id}`);
  },

  // Obter artigos por autor
  getByAutor: async (idAutor: string) => {
    return api.get(`/artigo/usuario/${idAutor}`);
  },

  // Criar um novo artigo
  create: async (artigoData: any) => {
    return api.post("/artigo", artigoData);
  },

  // Fazer upload de um arquivo PDF para um artigo
  uploadPDF: async (id: string, file: File) => {
    return api.upload(`/artigo/usuario/update/${id}`, file);
  },
};

export const EventoService = {
  // Obter todos os eventos
  getAll: async () => {
    return api.get("/evento");
  },

  // Obter eventos ativos (data atual entre início e fim)
  getAtivos: async () => {
    return api.get("/evento/ativos");
  },

  // Criar um novo evento
  create: async (eventoData: any) => {
    return api.post("/evento", eventoData);
  },

  // Deletar um evento
  delete: async (id: string) => {
    return api.delete(`/evento/${id}`);
  },
};

export const ComentarioService = {
  // Criar um novo comentário
  create: async (comentarioData: any) => {
    return api.post("/comentario", comentarioData);
  },

  // Editar um comentário existente
  update: async (comentarioData: any) => {
    return api.post("/comentario/editar", comentarioData);
  },

  // Excluir um comentário
  delete: async (id: string) => {
    return api.delete(`/comentario/excluir/${id}`);
  },

  // Obter comentários de um artigo
  getByArtigoId: async (artigoId: string) => {
    return api.get(`/comentario/artigo/${artigoId}`);
  },
};

export const AvaliacaoService = {
  // Criar uma nova avaliação
  create: async (avaliacaoData: any) => {
    return api.post("/avaliacao", avaliacaoData);
  },

  // Editar uma avaliação existente
  update: async (id: string, avaliacaoData: any) => {
    return api.put(`/avaliacao/editar/${id}`, avaliacaoData);
  },

  // Excluir uma avaliação
  delete: async (id: string) => {
    return api.delete(`/avaliacao/excluir/${id}`);
  },
};

export const UsuarioService = {
  // Criar um novo usuário
  create: async (usuarioData: any) => {
    return api.post("/usuario", usuarioData);
  },

  // Login de usuário
  login: async (credenciais: { email: string; senha: string }) => {
    return api.post("/usuario/login", credenciais);
  },
};

export default api;
