import { useEffect, useState, useContext } from 'react';
import { memberService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export function useMembers() {
  const { addToast } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMembers = async ({page = 1, limit = 10, active: activeParam = active, search: searchParam = search  } = {})=> {
    setLoading(true);
    const data = await memberService.fetchMembers({ page, limit, active: activeParam, search: searchParam });
    if (data.success) {
      setMembers(data.members || []);
      setMeta(data.meta || null);
    } else {
      // Verificar si es un error de autenticación
      if (data.status === 401) {
        // No mostramos alerta aquí porque el servicio ya la maneja
        setLoading(false);
        return;
      }
      addToast(data.error || 'Error al cargar miembros', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMembers({page, active, search});
  }, [active, page, search, addToast]);

  return {
    members,
    meta,
    active,
    setActive,
    page,
    setPage,
    loadMembers,
    search,
    setSearch,
    loading
    };
}