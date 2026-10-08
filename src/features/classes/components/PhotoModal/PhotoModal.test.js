import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import PhotoModal from './index';

/**
 * El modal que se abre desde la tabla valida la foto con las mismas reglas
 * que el formulario (utils/fotoProfesional.js).
 */

const PROFESIONAL = { id: 4, displayName: 'Fermín Gzz.', photoUrl: null };

const elegir = (container, archivo) =>
  fireEvent.change(container.querySelector('input[type="file"]'), { target: { files: [archivo] } });

beforeEach(() => {
  global.URL.createObjectURL = jest.fn(() => 'blob:previa');
});

it('sin foto muestra las iniciales', () => {
  render(<PhotoModal professional={PROFESIONAL} onClose={jest.fn()} onUpload={jest.fn()} onRemove={jest.fn()} />);

  expect(screen.getByText('FG')).toBeInTheDocument();
});

it('rechaza un archivo que no es imagen y no deja guardar', () => {
  const { container } = render(
    <PhotoModal professional={PROFESIONAL} onClose={jest.fn()} onUpload={jest.fn()} onRemove={jest.fn()} />,
  );

  elegir(container, new File(['x'], 'lista.pdf', { type: 'application/pdf' }));

  expect(screen.getByText('La foto debe ser JPEG, PNG o WebP')).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Guardar' })).toBeDisabled();
});

it('rechaza una foto de más de 5 MB', () => {
  const { container } = render(
    <PhotoModal professional={PROFESIONAL} onClose={jest.fn()} onUpload={jest.fn()} onRemove={jest.fn()} />,
  );
  const grande = new File(['x'], 'grande.jpeg', { type: 'image/jpeg' });
  Object.defineProperty(grande, 'size', { value: 6 * 1024 * 1024 });

  elegir(container, grande);

  expect(screen.getByText('La foto no puede pesar más de 5 MB')).toBeInTheDocument();
});

it('con una foto válida deja guardar', () => {
  const { container } = render(
    <PhotoModal professional={PROFESIONAL} onClose={jest.fn()} onUpload={jest.fn()} onRemove={jest.fn()} />,
  );

  elegir(container, new File(['x'], 'fermin.jpeg', { type: 'image/jpeg' }));

  expect(screen.getByRole('button', { name: 'Guardar' })).toBeEnabled();
});
