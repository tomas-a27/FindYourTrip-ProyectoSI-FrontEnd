interface BaseDTO {
  id: string;
}

interface LocalidadDTO extends BaseDTO {
  codPostal: string;
  nombre: string;
}

export type { LocalidadDTO };
