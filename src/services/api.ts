// API base URL
const API_BASE_URL = "http://localhost:5000";

// Tipos principais
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface Artigo {
  _id: string;
  titulo: string;
  autores: string[];
  resumo: string;
  caminhoPDF: string;
  status: string;
  dataCriacao: string;
  idAutor: string;
  idEvento?: string;
}

export interface Avaliacao {
  id?: string;
  artigoId: string;
  avaliadorId: string;
  nota: number;
  comentarios: string;
  dataCriacao?: string;
  isFinal?: boolean;
}

export interface Comentario {
  autor: string;
  texto: string;
  trechoComentado: string;
  x: number;
  y: number;
  criadoEm: Date;
}

export interface Evento {
  id: string;
  titulo: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  ativo: boolean;
}

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha?: string;
  papel: "ALUNO" | "AVALIADOR" | "COORDENADOR";
}

// Helper de requisições HTTP
const fetchApi = async <T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body?: any,
  headers?: HeadersInit
): Promise<ApiResponse<T>> => {
  try {
    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      credentials: "include", // Para suporte a cookies de autenticação
    };

    if (body && method !== "GET") {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message || `Erro ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro desconhecido na requisição",
    };
  }
};

// Upload de arquivos
const uploadFile = async (
  endpoint: string,
  file: File,
  additionalData?: Record<string, any>
): Promise<ApiResponse> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    // Adicionar dados extras, se houver
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(
          key,
          typeof value === "object" ? JSON.stringify(value) : String(value)
        );
      });
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: "POST",
      body: formData,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error:
          data.message || `Erro ${response.status}: ${response.statusText}`,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Erro desconhecido ao enviar arquivo",
    };
  }
};

// Serviços de API para Artigos
export const ArtigoService = {
  create: (artigo: Partial<Artigo>) =>
    fetchApi<Artigo>("/artigo", "POST", artigo),

  getById: (id: string) => fetchApi<Artigo>(`/artigo/${id}`, "GET"),

  getByAutor: (idUsuario: string) =>
    fetchApi<Artigo[]>(`/artigo/usuario/${idUsuario}`, "GET"),

  getByEventoId: (eventoId: string) =>
    fetchApi<Artigo[]>(`/artigo/evento/${eventoId}`, "GET"),

  uploadArtigo: (
    id: string,
    file: File,
    additionalData?: Record<string, any>
  ) => uploadFile(`/artigo/usuario/update/${id}`, file, additionalData),
};

// Serviços de API para Avaliações
export const AvaliacaoService = {
  create: (avaliacao: Partial<Avaliacao>) =>
    fetchApi<Avaliacao>("/avaliacao", "POST", avaliacao),

  delete: (idAvaliacao: string) =>
    fetchApi<void>(`/avaliacao/excluir/${idAvaliacao}`, "DELETE"),

  update: (idAvaliacao: string, avaliacao: Partial<Avaliacao>) =>
    fetchApi<Avaliacao>(`/avaliacao/editar/${idAvaliacao}`, "PUT", avaliacao),

  getByArtigoId: (artigoId: string) =>
    fetchApi<Avaliacao[]>(`/avaliacao/artigo/${artigoId}`, "GET"),
};

// Serviços de API para Comentários
export const ComentarioService = {
  create: (comentario: Partial<Comentario>) =>
    fetchApi<Comentario>("/comentario", "POST", comentario),

  update: (comentario: Partial<Comentario>) =>
    fetchApi<Comentario>("/comentario/editar", "POST", comentario),

  delete: (idComentario: string) =>
    fetchApi<void>(`/comentario/excluir/${idComentario}`, "DELETE"),

  getByArtigoId: (artigoId: string) =>
    fetchApi<Comentario[]>(`/comentario/artigo/${artigoId}`, "GET"),
};

// Serviços de API para Eventos
export const EventoService = {
  create: (evento: Partial<Evento>) =>
    fetchApi<Evento>("/evento", "POST", evento),

  delete: (id: string) => fetchApi<void>(`/evento/${id}`, "DELETE"),

  getById: (id: string) => fetchApi<Evento>(`/evento/${id}`, "GET"),

  getAtivos: () => fetchApi<Evento[]>("/evento/ativos", "GET"),
};

// Serviços de API para Usuários
export const UsuarioService = {
  create: (usuario: Partial<Usuario>) =>
    fetchApi<Usuario>("/usuario", "POST", usuario),

  login: (email: string, senha: string) =>
    fetchApi<{ user: Usuario; token: string }>("/usuario/login", "POST", {
      email,
      senha,
    }),
};

export default {
  ArtigoService,
  AvaliacaoService,
  ComentarioService,
  EventoService,
  UsuarioService,
};
