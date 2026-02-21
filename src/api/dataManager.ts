import axios from 'axios';
import { useState, useEffect } from 'react';
import { BACKEND_URL } from '../../endpoints.config.ts';

function get<T>(url: string, config?: object) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchAll();
  }, []);
  const fetchAll = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/${url}`, config);
      setData(response.data.data);
    } catch (err: any) {
      setError(err.message);
      console.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error };
}

//post funtion + config
async function post<T>(url: string, data: T, config?: object) {
  try {
    return await axios.post(`${BACKEND_URL}/api/${url}`, data, config);
  } catch (err: any) {
    console.error(err);
    return err.response;
  } finally {
    console.log('Post request completed');
  }
}

export { post, get };
