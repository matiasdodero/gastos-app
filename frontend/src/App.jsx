import { useEffect, useState } from 'react'

function App() {
  const [gastos, setGastos] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargarGastos = () => {
    setCargando(true)
    setError('')

    fetch('http://localhost:5000/api/gastos')
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo obtener la lista de gastos')
        }
        return response.json()
      })
      .then((data) => {
        setGastos(data)
        setCargando(false)
      })
      .catch((err) => {
        setError(err.message)
        setCargando(false)
      })
  }

  useEffect(() => {
    cargarGastos()
  }, [])

  const manejarSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (descripcion.trim() === '') {
      setError('La descripción es obligatoria')
      return
    }

    if (monto === '' || Number(monto) <= 0) {
      setError('El monto debe ser mayor a 0')
      return
    }

    if (categoria.trim() === '') {
      setError('La categoría es obligatoria')
      return
    }

    const nuevoGasto = {
      descripcion: descripcion.trim(),
      monto: Number(monto),
      categoria: categoria.trim(),
    }

    fetch('http://localhost:5000/api/gastos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoGasto),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.mensaje || 'No se pudo guardar el gasto')
        }
        return response.json()
      })
      .then(() => {
        setDescripcion('')
        setMonto('')
        setCategoria('')
        cargarGastos()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const eliminarGasto = (id) => {
    setError('')

    fetch(`http://localhost:5000/api/gastos/${id}`, {
      method: 'DELETE',
    })
      .then(async (response) => {
        if (!response.ok) {
          let mensaje = 'No se pudo eliminar el gasto'

          try {
            const data = await response.json()
            mensaje = data.mensaje || mensaje
          } catch {
          }

          throw new Error(mensaje)
        }

        cargarGastos()
      })
      .catch((err) => {
        setError(err.message)
      })
  }

  const totalGastado = gastos.reduce((acc, gasto) => acc + gasto.monto, 0)

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 rounded-3xl bg-slate-900 p-6 text-white shadow-lg">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-300">
            React + .NET
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">Gastos App</h1>
          <p className="mt-3 max-w-2xl text-slate-300">
            Alta, listado y eliminación de gastos con una interfaz hecha con Tailwind.
          </p>
        </header>

        <section className="mb-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Cantidad de gastos</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{gastos.length}</p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Total gastado</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              ${totalGastado.toLocaleString('es-AR')}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <p className="text-sm text-slate-500">Estado</p>
            <p className="mt-2 text-lg font-semibold text-slate-900">
              {cargando ? 'Cargando...' : 'Listo'}
            </p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <h2 className="text-xl font-semibold text-slate-900">Nuevo gasto</h2>
            <p className="mt-1 text-sm text-slate-500">
              Completá los datos y guardalo en la lista.
            </p>

            <form onSubmit={manejarSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="descripcion"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Descripción
                </label>
                <input
                  id="descripcion"
                  type="text"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Ej: Farmacia"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="monto"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Monto
                </label>
                <input
                  id="monto"
                  type="number"
                  value={monto}
                  onChange={(e) => setMonto(e.target.value)}
                  placeholder="Ej: 4200"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label
                  htmlFor="categoria"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Categoría
                </label>
                <input
                  id="categoria"
                  type="text"
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  placeholder="Ej: Salud"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Agregar gasto
              </button>
            </form>

            {error && (
              <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Listado de gastos</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Estos datos vienen desde tu backend .NET.
                </p>
              </div>
            </div>

            {cargando ? (
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-600">
                Cargando gastos...
              </div>
            ) : gastos.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                No hay gastos cargados todavía.
              </div>
            ) : (
              <div className="space-y-3">
                {gastos.map((gasto) => (
                  <article
                    key={gasto.id}
                    className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">
                        {gasto.descripcion}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{gasto.categoria}</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <span className="text-lg font-bold text-slate-900">
                        ${Number(gasto.monto).toLocaleString('es-AR')}
                      </span>

                      <button
                        onClick={() => eliminarGasto(gasto.id)}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-200"
                      >
                        Eliminar
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default App