import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import ProfessionalFormModal from './index';

/**
 * La foto del profesional se sube como archivo, igual que la de un banner, y
 * nunca viaja como URL con los datos de la ficha: el backend guarda la llave
 * del archivo y la firma al leerla.
 */

const DISCIPLINAS = [{ id: 5, name: 'Golf' }];

const foto = (nombre = 'jimmy.jpeg', tipo = 'image/jpeg', bytes = 300 * 1024) => {
  const archivo = new File(['x'], nombre, { type: tipo });
  Object.defineProperty(archivo, 'size', { value: bytes });
  return archivo;
};

const abrir = (extra = {}) => {
  const onSubmit = jest.fn();
  render(
    <ProfessionalFormModal
      open
      professional={null}
      disciplines={DISCIPLINAS}
      saving={false}
      onClose={jest.fn()}
      onSubmit={onSubmit}
      {...extra}
    />,
  );
  return onSubmit;
};

const llenarYGuardar = () => {
  fireEvent.change(screen.getByRole('combobox'), { target: { value: '5' } });
  fireEvent.change(screen.getByPlaceholderText('Ej. Fermín Gzz.'), { target: { value: 'Jimmy Díaz' } });
  fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));
};

beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:previa');
  global.URL.revokeObjectURL = jest.fn();
});

describe('ProfessionalFormModal · foto', () => {
  it('ya no pide la URL de la foto', () => {
    abrir();

    expect(screen.queryByText(/URL de la foto/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('https://...')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Foto del profesional')).toHaveAttribute('type', 'file');
  });

  it('entrega el archivo elegido aparte de los datos de la ficha', () => {
    const onSubmit = abrir();
    const archivo = foto();

    fireEvent.change(screen.getByLabelText('Foto del profesional'), { target: { files: [archivo] } });
    llenarYGuardar();

    expect(onSubmit).toHaveBeenCalledTimes(1);
    const [payload, id, enviado] = onSubmit.mock.calls[0];
    expect(payload).toEqual({ disciplineId: 5, displayName: 'Jimmy Díaz', isDemo: false });
    expect(id).toBeUndefined();
    expect(enviado).toBe(archivo);
  });

  it('acepta la foto arrastrada al recuadro', () => {
    const onSubmit = abrir();
    const archivo = foto('walter.png', 'image/png');

    fireEvent.drop(screen.getByText(/arrastra la foto/i), { dataTransfer: { files: [archivo] } });

    expect(screen.getByText('walter.png')).toBeInTheDocument();
    llenarYGuardar();
    expect(onSubmit.mock.calls[0][2]).toBe(archivo);
  });

  it('rechaza un archivo que no es imagen y no lo entrega', () => {
    const onSubmit = abrir();

    fireEvent.change(screen.getByLabelText('Foto del profesional'), {
      target: { files: [foto('lista.pdf', 'application/pdf')] },
    });
    expect(screen.getByText('La foto debe ser JPEG, PNG o WebP')).toBeInTheDocument();

    llenarYGuardar();
    expect(onSubmit.mock.calls[0][2]).toBeNull();
  });

  it('rechaza una foto de más de 5 MB', () => {
    abrir();

    fireEvent.change(screen.getByLabelText('Foto del profesional'), {
      target: { files: [foto('grande.jpeg', 'image/jpeg', 6 * 1024 * 1024)] },
    });

    expect(screen.getByText('La foto no puede pesar más de 5 MB')).toBeInTheDocument();
  });

  it('al editar, no devuelve la foto que ya tiene aunque la muestre', () => {
    const onSubmit = abrir({
      professional: {
        id: 5,
        displayName: 'Jimmy Díaz',
        disciplineId: 5,
        phone: '5564552849',
        photoUrl: 'https://firmada.example/class-professionals/5_foto.jpeg?X-Goog-Signature=abc',
      },
    });

    expect(screen.getByAltText('Foto del profesional')).toHaveAttribute(
      'src',
      'https://firmada.example/class-professionals/5_foto.jpeg?X-Goog-Signature=abc',
    );

    fireEvent.click(screen.getByRole('button', { name: 'Guardar' }));

    const [payload, id, enviado] = onSubmit.mock.calls[0];
    expect(payload).not.toHaveProperty('photoUrl');
    expect(payload.phone).toBe('5564552849');
    expect(id).toBe(5);
    expect(enviado).toBeNull();
  });
});
