interface BaseDTO {
  id: string;
}

interface LocalidadDTO extends BaseDTO {
  codPostal: string;
  nombre: string;
}

interface UsuarioDTO {
  idUsuario: number;
  tipoUsuario: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  tipoDocumento: string;
  nroDocumento: string;
  email: string;
  telefono: string;
  contrasenaUsuario: string;
  generoUsuario: string;
  calificacionPas?: number;
  estadoUsuario: string;
  nroLicenciaConductorUsuario?: string;
  vigenciaLicenciaConductorUsuario?: Date;
  fotoLicenciaConductorUsuario?: string;
  calificacionConductor?: number;
  estadoConductor?: string;
  fotoPerfil?: string;
}

interface ViajeDTO {
  viajeId: number;
  viajeOrigen: LocalidadDTO;
  viajeDestino: LocalidadDTO;
  viajeFecha: Date;
  viajeHorario: string;
  viajeCantLugares: number;
  viajeEstado: string;
  viajeComentario?: string;
  viajeAceptaMascotas: boolean;
  viajePrecio: number;
}

interface VehiculoDTO {
  patente: string;
  modelo: string;
  cantLugares: number;
  color: string;
  marca: string;
}

export type { LocalidadDTO, UsuarioDTO, ViajeDTO, VehiculoDTO };
