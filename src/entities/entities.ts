interface BaseDTO {
  id: number;
}

interface LocalidadDTO extends BaseDTO {
  codPostal: string;
  nombre: string;
}


interface VehiculoDTO {
  patente: string;
  modelo: string;
  cantLugares: number;
  color: string;
  marca: string;
  usuario: UsuarioDTO;
}

interface UsuarioDTO {
  idUsuario: number;
  tipoUsuario?: string;
  nombreUsuario: string;
  apellidoUsuario: string;
  tipoDocumento?: string;
  nroDocumento?: string;
  email: string;
  telefono: string;
  contrasenaUsuario?: string;
  generoUsuario: string;
  calificacionPas?: number;
  estadoUsuario?: string;
  nroLicenciaConductorUsuario?: string;
  vigenciaLicenciaConductorUsuario?: Date;
  fotoLicenciaConductorUsuario?: string;
  calificacionConductor?: number;
  estadoConductor?: string;
  fotoPerfil?: string;
  vehiculos?: VehiculoDTO[];
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
  usuarioConductor: UsuarioDTO;
  vehiculo: VehiculoDTO;
}

interface SolicitudViajeDTO {
  solViajeId: number;
  solViajeFecha: Date;
  estadoSolicitud: string;
  usuario: UsuarioDTO;
  viaje: ViajeDTO;
}

interface CalificacionDTO {
  idCalificacion: number;
  calificacionTipo: string;
  calificacionValoracionLikert: number;
  usuario: UsuarioDTO;
  viaje: ViajeDTO;
}

interface InfraccionDTO {
  idInfraccion: number;
  comentarioInfraccion: string;
  descripcionInfraccion: string;
  insfraccionFecha: Date;
  calificacionTipo: string;
  calificacion: CalificacionDTO;
}

interface SancionDTO {
  idSancion: number;
  sancionFechaIni: Date;
  sancionFechaFin: Date;
  sancionDescripcion: string;
  usuario: UsuarioDTO;
}

interface SancionInfraccionDTO {
  idSancionInfraccion: number;
  sancion: SancionDTO;
  infracciones: InfraccionDTO[];
}

interface PoliticaSancionDTO {
  descripcion: string;
  cantCriticaInfracciones: number;
}

export type { LocalidadDTO, UsuarioDTO, ViajeDTO, VehiculoDTO, SolicitudViajeDTO, CalificacionDTO, InfraccionDTO, SancionDTO, SancionInfraccionDTO, PoliticaSancionDTO };
