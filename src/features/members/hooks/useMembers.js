import { useEffect, useState } from 'react';
import { memberService } from '../services';

export function useMembers() {
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [active, setActive] = useState(true); // 👈 Estado para activo/inactivo
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const loadMembers = async ({page = 1, limit = 10, active: activeParam = active, search: searchParam = search  } = {})=> {
    try {
      const data = await memberService.fetchMembers({ page, limit, active: activeParam, search: searchParam });
      setMembers(data.members);
      setMeta(data.meta);
    } catch (err) {
      console.error("Error loading members:", err);
    }
  };

  useEffect(() => {
    loadMembers({page, active, search}); // Se ejecuta al montar el componente
  }, [active, page, search]);

  return {
    members,
    meta,
    active,
    setActive,
    page,
    setPage,
    loadMembers,
    search,
    setSearch
    };
}