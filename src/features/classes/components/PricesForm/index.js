import React, { useEffect, useState } from 'react';

/** El Club cobra por 1, 2 o 3 personas; el máximo es 3 (§2). */
const PARTY_SIZES = [1, 2, 3];

/**
 * Tarifas de las clases.
 *
 * Cambiarlas NO altera las clases ya reservadas: cada reserva guardó su precio
 * al momento de crearse (§9). Si no fuera así, subir la tarifa le cambiaría el
 * precio a un socio que ya había reservado.
 */
const PricesForm = ({ prices, loading, saving, onSave }) => {
  const [values, setValues] = useState({});

  useEffect(() => {
    const next = {};
    PARTY_SIZES.forEach((size) => {
      const rule = prices.find((price) => price.partySize === size && !price.disciplineId);
      next[size] = rule ? String(rule.price) : '';
    });
    setValues(next);
  }, [prices]);

  const handleChange = (size, value) => {
    setValues((previous) => ({ ...previous, [size]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const payload = PARTY_SIZES.filter((size) => values[size] !== '').map((size) => ({
      partySize: size,
      price: Number(values[size]),
    }));

    onSave(payload);
  };

  if (loading) {
    return <div className="py-10 text-center text-gray-500">Cargando precios...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">Precio por clase</h3>
        <p className="text-sm text-gray-500">
          Aplica a todas las disciplinas. Las clases ya reservadas conservan el precio con el que se
          reservaron.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        {PARTY_SIZES.map((size) => (
          <div key={size} className="flex items-center gap-3">
            <label className="w-32 text-sm text-gray-700">
              {size} {size === 1 ? 'persona' : 'personas'}
            </label>
            <div className="relative flex-1">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                min="0"
                step="1"
                value={values[size] ?? ''}
                onChange={(event) => handleChange(size, event.target.value)}
                className="w-full border border-gray-300 rounded-md pl-7 pr-3 py-2"
              />
            </div>
          </div>
        ))}
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700 disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Guardar precios'}
      </button>
    </form>
  );
};

export default PricesForm;
