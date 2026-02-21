import { get } from '../../api/dataManager.ts';
import { LocalidadDTO } from '../../entities/entities.ts';

export function ShowLocalidad() {
  const { data, loading, error } = get<LocalidadDTO>('localidad');

  return;
}
