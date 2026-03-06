import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import { memberService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';
import { useDebounce } from '../../../shared/hooks/useDebounce';

export function useMembers() {
  const { addToast } = useContext(AppContext);
  const [members, setMembers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [active, setActive] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const abortControllerRef = useRef(null);

  const debouncedSearch = useDebounce(search, 2000);

  const loadMembers = useCallback(async ({ page: pageParam, limit = 50, active: activeParam, search: searchParam } = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    const resolvedPage = pageParam ?? page;
    const resolvedActive = activeParam ?? active;
    const resolvedSearch = searchParam ?? debouncedSearch;

    setLoading(true);
    try {
      const data = await memberService.fetchMembers({
        page: resolvedPage,
        limit,
        active: resolvedActive,
        search: resolvedSearch,
        signal: controller.signal,
      });

      if (controller.signal.aborted) return;

      if (data.success) {
        setMembers(data.members || []);
        setMeta(data.meta || null);
      } else {
        if (data.status === 401) {
          setLoading(false);
          return;
        }
        addToast(data.error || 'Error al cargar miembros', 'error');
      }
    } catch (err) {
      if (err.name === 'AbortError') return;
      addToast('Error al cargar miembros', 'error');
    } finally {
      if (!controller.signal.aborted) setLoading(false);
    }
  }, [page, active, debouncedSearch, addToast]);

  useEffect(() => {
    loadMembers();
  }, [active, page, debouncedSearch]);

  return {
    members,
    setMembers,
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