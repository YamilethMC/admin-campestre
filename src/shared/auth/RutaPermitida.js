// src/shared/auth/RutaPermitida.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { AppContext } from '../context/AppContext';
import { puedeVer, rutaInicial } from './acceso';

/**
 * Envuelve las rutas del panel y manda a su propia pantalla a quien se meta
 * donde no le toca.
 *
 * Hace falta porque las rutas de App.js cuelgan directo de MainLayout, sin
 * ninguna comprobación: filtrar el menú lateral no basta, un profesor podía
 * teclear /socios en la barra del navegador y la pantalla se pintaba igual.
 *
 * Se redirige en vez de mostrar un "no tienes permiso": la pantalla nunca
 * estuvo pensada para él, así que enseñarle un error no le aporta nada.
 */
const RutaPermitida = ({ children }) => {
  const { currentUser } = useContext(AppContext);
  const location = useLocation();

  if (!currentUser) {
    return children;
  }

  if (!puedeVer(currentUser.type, location.pathname)) {
    return <Navigate to={rutaInicial(currentUser.type)} replace />;
  }

  return children;
};

export default RutaPermitida;
