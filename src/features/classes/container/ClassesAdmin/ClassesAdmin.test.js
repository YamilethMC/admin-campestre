import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import ClassesAdmin from './index';
import { classesService } from '../../services';

jest.mock('../../services', () => ({
  classesService: {
    getDisciplines: jest.fn(),
    getProfessionals: jest.fn(),
    createProfessional: jest.fn(),
    updateProfessional: jest.fn(),
    uploadPhoto: jest.fn(),
  },
}));

/**
 * Guardar la ficha y subir la foto son dos peticiones: al dar de alta, el
 * profesional no tiene id hasta que se guarda, y la foto se sube con ese id.
 */

const NUEVO = { id: 9, displayName: 'Walter Diaz', disciplineId: 5, photoUrl: null, active: true };

const foto = () => new File(['x'], 'walter.jpeg', { type: 'image/jpeg' });

const SIN_PROFESIONALES = 'Aún no hay profesionales dados de alta';

/** Después de guardar, el panel recarga la tabla: se espera a que termine. */
const esperarRecarga = async () => {
  await waitFor(() => expect(classesService.getProfessionals).toHaveBeenCalledTimes(2));
  await screen.findByText(SIN_PROFESIONALES);
};

const darDeAlta = async (archivo) => {
  render(<ClassesAdmin />);
  await screen.findByText(SIN_PROFESIONALES);

  fireEvent.click(screen.getByRole('button', { name: '+ Nuevo profesional' }));
  await screen.findByRole('option', { name: 'Golf' });
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '5' } });
  fireEvent.change(screen.getByPlaceholderText('Ej. Fermín Gzz.'), { target: { value: 'Walter Diaz' } });
  if (archivo) {
    fireEvent.change(screen.getByLabelText('Foto del profesional'), { target: { files: [archivo] } });
  }
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
};

beforeEach(() => {
  jest.clearAllMocks();
  global.URL.createObjectURL = jest.fn(() => 'blob:previa');
  global.URL.revokeObjectURL = jest.fn();
  classesService.getDisciplines.mockResolvedValue({ success: true, data: [{ id: 5, name: 'Golf' }] });
  classesService.getProfessionals.mockResolvedValue({ success: true, data: [] });
  classesService.createProfessional.mockResolvedValue({ success: true, data: NUEVO });
});

describe('ClassesAdmin · alta con foto', () => {
  it('guarda la ficha y luego sube la foto con el id nuevo', async () => {
    classesService.uploadPhoto.mockResolvedValue({ success: true, data: NUEVO });
    const archivo = foto();

    await darDeAlta(archivo);

    await waitFor(() => expect(classesService.uploadPhoto).toHaveBeenCalledWith(9, archivo));
    expect(classesService.createProfessional).toHaveBeenCalledWith({
      disciplineId: 5,
      displayName: 'Walter Diaz',
      isDemo: false,
    });
    await esperarRecarga();
    expect(screen.queryByText('Nuevo profesional')).not.toBeInTheDocument();
  });

  it('sin foto no intenta subir nada', async () => {
    await darDeAlta(null);

    await esperarRecarga();
    expect(classesService.createProfessional).toHaveBeenCalledTimes(1);
    expect(classesService.uploadPhoto).not.toHaveBeenCalled();
  });

  it('si la foto falla, avisa y cierra el formulario para no crear al profesional dos veces', async () => {
    classesService.uploadPhoto.mockResolvedValue({ success: false, error: 'La foto no puede pesar más de 5 MB' });

    await darDeAlta(foto());

    await esperarRecarga();
    expect(screen.getByText(/Se guardaron los datos de Walter Diaz, pero la foto no se subió/)).toBeInTheDocument();
    expect(screen.queryByText('Nuevo profesional')).not.toBeInTheDocument();
    expect(classesService.createProfessional).toHaveBeenCalledTimes(1);
  });

  it('si la ficha no se guardó, no sube la foto', async () => {
    classesService.createProfessional.mockResolvedValue({ success: false, error: 'Los datos enviados no son válidos' });

    await darDeAlta(foto());

    await screen.findByText('Los datos enviados no son válidos');
    expect(classesService.uploadPhoto).not.toHaveBeenCalled();
    expect(screen.getByText('Nuevo profesional')).toBeInTheDocument();
  });
});
