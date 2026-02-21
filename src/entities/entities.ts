interface BaseDTO {
  id: number;
}

interface LocalidadDTO extends BaseDTO {
  codPostal: string;
  nombre: string;
}

export type { LocalidadDTO };
