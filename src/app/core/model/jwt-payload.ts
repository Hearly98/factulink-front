export interface JwtPayload {
  sub: string;
  jti: string;
  iat: string; // fecha como string en formato "dd/MM/yyyy HH:mm:ss"
  email: string;
  UserId: string;
  DisplayName: string;
  UserName: string;
  Email: string;
  ApplicationCode: string;
  Sucursales: string; // se parsea por separado (es un JSON string)
  role: string;
  nbf: number;
  exp: number;
  iss: string;
  aud: string;
}
export interface Sucursal {
  codigo: string;
  nombre: string;
}