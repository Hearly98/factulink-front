export interface AppHttpError {
    status: number;
    url: string | null;
    isNetworkError: boolean; // status === 0
    isServerError: boolean;  // 5xx
    isClientError: boolean;  // 4xx
    message: string;         // mensaje legible
    serverBody?: any;        // body devuelto por el backend si existe
    raw: any;                // error original por si lo necesitas
  }
  