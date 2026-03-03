import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Avatar,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as ViewIcon,
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { useAuth } from '../auth/AuthContext';

const DependentsList = () => {
  const { token } = useAuth();
  const [dependents, setDependents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDependent, setSelectedDependent] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDependents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') {
        params.append('active', statusFilter);
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/member/0?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al cargar dependientes');
      }

      const data = await response.json();
      setDependents(data.dependents || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDependents();
  }, [statusFilter]);

  const getRelationshipLabel = (relationship) => {
    const labels = {
      SPOUSE: 'Cónyuge',
      CHILD: 'Hijo/a',
      WIFE: 'Esposa',
      HUSBAND: 'Esposo',
      SON: 'Hijo',
      DAUGHTER: 'Hija',
    };
    return labels[relationship] || relationship;
  };

  const getStatusChip = (dependent) => {
    if (!dependent.isDependentActive) {
      return <Chip label="Inactivo" color="error" size="small" />;
    }
    if (dependent.requiresPayment) {
      return <Chip label="Requiere Pago" color="warning" size="small" />;
    }
    return <Chip label="Activo" color="success" size="small" />;
  };

  const handleActivate = async (dependentId) => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/${dependentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isDependentActive: true }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al activar dependiente');
      }

      fetchDependents();
      setDetailsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeactivate = async (dependentId) => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/${dependentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isDependentActive: false }),
        }
      );

      if (!response.ok) {
        throw new Error('Error al desactivar dependiente');
      }

      fetchDependents();
      setDetailsOpen(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRecalculateStatuses = async () => {
    try {
      setActionLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/dependents/recalculate-status`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Error al recalcular estados');
      }

      const result = await response.json();
      alert(`Recálculo completado: ${result.processed} procesados, ${result.updated} actualizados`);
      fetchDependents();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredDependents = dependents.filter((dep) => {
    if (!search) return true;
    const searchLower = search.toLowerCase();
    return (
      dep.user?.name?.toLowerCase().includes(searchLower) ||
      dep.user?.lastName?.toLowerCase().includes(searchLower) ||
      dep.user?.email?.toLowerCase().includes(searchLower)
    );
  });

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h5" component="h2">
              Gestión de Dependientes
            </Typography>
            <Button
              variant="outlined"
              startIcon={<RefreshIcon />}
              onClick={handleRecalculateStatuses}
              disabled={actionLoading}
            >
              Recalcular Estados
            </Button>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box display="flex" gap={2} mb={3}>
            <TextField
              placeholder="Buscar por nombre o email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{ flex: 1 }}
            />
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Estado</InputLabel>
              <Select
                value={statusFilter}
                label="Estado"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <MenuItem value="all">Todos</MenuItem>
                <MenuItem value="true">Activos</MenuItem>
                <MenuItem value="false">Inactivos</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Dependiente</TableCell>
                  <TableCell>Relación</TableCell>
                  <TableCell>Edad</TableCell>
                  <TableCell>Socio Titular</TableCell>
                  <TableCell>Estado</TableCell>
                  <TableCell align="right">Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDependents.map((dependent) => (
                  <TableRow key={dependent.id}>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={2}>
                        <Avatar src={dependent.user?.profilePhotoUrl}>
                          {dependent.user?.name?.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {dependent.user?.name} {dependent.user?.lastName}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {dependent.user?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>{getRelationshipLabel(dependent.relationship)}</TableCell>
                    <TableCell>{dependent.ageStatus?.age || '-'} años</TableCell>
                    <TableCell>
                      {dependent.invitedBy ? (
                        <Typography variant="body2">
                          {dependent.invitedBy.user?.name} {dependent.invitedBy.user?.lastName}
                        </Typography>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>{getStatusChip(dependent)}</TableCell>
                    <TableCell align="right">
                      <Tooltip title="Ver detalles">
                        <IconButton
                          onClick={() => {
                            setSelectedDependent(dependent);
                            setDetailsOpen(true);
                          }}
                        >
                          <ViewIcon />
                        </IconButton>
                      </Tooltip>
                      {!dependent.isDependentActive && (
                        <Tooltip title="Activar">
                          <IconButton
                            color="success"
                            onClick={() => handleActivate(dependent.id)}
                          >
                            <ApproveIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {dependent.isDependentActive && (
                        <Tooltip title="Desactivar">
                          <IconButton
                            color="error"
                            onClick={() => handleDeactivate(dependent.id)}
                          >
                            <RejectIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {filteredDependents.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      No se encontraron dependientes
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onClose={() => setDetailsOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Dependiente</DialogTitle>
        <DialogContent>
          {selectedDependent && (
            <Box>
              <Box display="flex" alignItems="center" gap={3} mb={3}>
                <Avatar
                  src={selectedDependent.user?.profilePhotoUrl}
                  sx={{ width: 80, height: 80 }}
                >
                  {selectedDependent.user?.name?.charAt(0)}
                </Avatar>
                <Box>
                  <Typography variant="h6">
                    {selectedDependent.user?.name} {selectedDependent.user?.lastName}
                  </Typography>
                  <Typography color="textSecondary">
                    {getRelationshipLabel(selectedDependent.relationship)}
                  </Typography>
                  {getStatusChip(selectedDependent)}
                </Box>
              </Box>

              <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Email
                  </Typography>
                  <Typography>{selectedDependent.user?.email || '-'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Fecha de Nacimiento
                  </Typography>
                  <Typography>
                    {selectedDependent.user?.birthDate
                      ? new Date(selectedDependent.user.birthDate).toLocaleDateString()
                      : '-'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Edad
                  </Typography>
                  <Typography>{selectedDependent.ageStatus?.age || '-'} años</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="textSecondary">
                    Requiere Pago
                  </Typography>
                  <Typography>
                    {selectedDependent.requiresPayment ? 'Sí' : 'No'}
                  </Typography>
                </Box>
              </Box>

              {selectedDependent.ageStatus && (
                <Box mt={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Estado por Edad
                  </Typography>
                  <Box display="flex" gap={1}>
                    {selectedDependent.ageStatus.isMinor && (
                      <Chip label="Menor de edad" color="info" size="small" />
                    )}
                    {selectedDependent.ageStatus.requiresPayment && (
                      <Chip label="Requiere pago (25-37)" color="warning" size="small" />
                    )}
                    {selectedDependent.ageStatus.isExpired && (
                      <Chip label="Expirado (≥38)" color="error" size="small" />
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailsOpen(false)}>Cerrar</Button>
          {selectedDependent && !selectedDependent.isDependentActive && (
            <Button
              variant="contained"
              color="success"
              onClick={() => handleActivate(selectedDependent.id)}
              disabled={actionLoading}
            >
              Activar Dependiente
            </Button>
          )}
          {selectedDependent && selectedDependent.isDependentActive && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleDeactivate(selectedDependent.id)}
              disabled={actionLoading}
            >
              Desactivar Dependiente
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default DependentsList;
