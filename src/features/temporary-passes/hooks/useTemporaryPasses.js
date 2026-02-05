import { useState, useEffect, useContext } from 'react';
import { temporaryPassesService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useTemporaryPasses = () => {
  const [allPasses, setAllPasses] = useState([]); // Almacenar todos los pases
  const [currentPagePasses, setCurrentPagePasses] = useState([]); // Pases de la página actual
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 10; // 10 registros por página
  const { addToast } = useContext(AppContext);

  // Función para calcular y actualizar los pases de la página actual
  const updateCurrentPagePasses = (allPasses, currentPage) => {
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;
    const pagePasses = allPasses.slice(startIndex, endIndex);

    setCurrentPagePasses(pagePasses);

    // Actualizar metadatos de paginación
    const totalPages = Math.ceil(allPasses.length / limit);
    setMeta({
      total: allPasses.length,
      page: currentPage,
      limit: limit,
      totalPages: totalPages
    });
  };

  const loadPasses = async () => {
    setLoading(true);
    try {
      const result = await temporaryPassesService.getPendingPasses();
      if (result.success) {
        setAllPasses(result.data); // Guardar todos los pases
        setTotal(result.total);

        // Actualizar los pases de la página actual
        updateCurrentPagePasses(result.data, page);
      } else {
        // Verificar si es un error de autenticación
        if (result.status === 401) {
          // No mostramos alerta aquí porque el servicio ya la maneja
          return;
        }
        addToast(result.error || 'Error al cargar pases temporales', 'error');
      }
    } catch (error) {
      console.error('Error loading temporary passes:', error);
      addToast('Error al cargar pases temporales', 'error');
    } finally {
      setLoading(false);
    }
  };

  const approvePass = async (userId, memberId, days = 30) => {
    try {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      
      const result = await temporaryPassesService.approvePass(userId, expirationDate.toISOString());
      
      if (result.success) {
        addToast('Pase temporal aprobado exitosamente', 'success');
        await loadPasses(); // Reload the list
        return true;
      } else {
        // Verificar si es un error de autenticación
        if (result.status === 401) {
          // No mostramos alerta aquí porque el servicio ya la maneja
          return;
        }
        addToast(result.error || 'Error al aprobar el pase temporal', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error approving pass:', error);
      addToast('Error al aprobar el pase temporal', 'error');
      return false;
    }
  };

  const rejectPass = async (memberId) => {
    try {
      const result = await temporaryPassesService.rejectPass(memberId);
      
      if (result.success) {
        addToast('Pase temporal rechazado', 'success');
        await loadPasses(); // Reload the list
        return true;
      } else {
          // Verificar si es un error de autenticación
          if (result.status === 401) {
          // No mostramos alerta aquí porque el servicio ya la maneja
          return;
        }
        addToast(result.error || 'Error al rechazar el pase temporal', 'error');
        return false;
      }
    } catch (error) {
      console.error('Error rejecting pass:', error);
      addToast('Error al rechazar el pase temporal', 'error');
      return false;
    }
  };

  // Recalcular los pases de la página actual cuando cambia la página
  useEffect(() => {
    if (allPasses.length > 0) {
      updateCurrentPagePasses(allPasses, page);
    }
  }, [page, allPasses]);

  // Load data initially
  useEffect(() => {
    loadPasses();
  }, []);

  return {
    passes: currentPagePasses, // Devolver los pases de la página actual
    loading,
    total,
    meta,
    page,
    setPage,
    loadPasses, // Esta función ahora recarga todos los datos
    approvePass,
    rejectPass,
  };
};
