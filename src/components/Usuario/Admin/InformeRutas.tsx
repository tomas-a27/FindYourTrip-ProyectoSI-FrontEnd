import { useNavigate } from 'react-router-dom';
import { get } from '../../../api/dataManager.ts';
import { InformeRutasDTO } from '../../../entities/entities.ts';

export const InformeRutas = () => {
  const navigate = useNavigate();

  const { data, loading, error } = get<InformeRutasDTO>('ruta/informe-rutas');

  return <div></div>;
};
