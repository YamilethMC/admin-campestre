import { useState, useEffect, useContext } from 'react';
import { temporaryPassesService } from '../services';
import { AppContext } from '../../../shared/context/AppContext';

export const useTemporaryPasses = () => {
  const [passes, setPasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { addToast } = useContext(AppContext);

  const loadPasses = async () => {
    setLoading(true);
    try {
      const result = await temporaryPassesService.getPendingPasses();
      if (result.success) {
        setPasses(result.data);
        setTotal(result.total);
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

  useEffect(() => {
    loadPasses();
  }, []);

  return {
    passes,
    loading,
    total,
    loadPasses,
    approvePass,
    rejectPass,
  };
};
