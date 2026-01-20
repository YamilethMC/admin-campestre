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

  const loadMembers = async ({
    page = 1,
    limit = 10,
    active: activeParam = active,
    search: searchParam = search,
  } = {}) => {
    const data = await memberService.fetchMembers({
      page,
      limit,
      active: activeParam,
      search: searchParam,
    });
    if (data.success) {
      setMembers(data.data.members);
      setMeta(data.data.meta);
    } else {
      addToast(data.error || 'Error al cargar miembros', 'error');
    }
  };

  useEffect(() => {
    loadMembers({ page, active, search });
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
  };
}
