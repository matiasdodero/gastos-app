import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [gastos, setGastos] = useState([])
  const [descripcion, setDescripcion] = useState('')
  const [monto, setMonto] = useState('')
  const [categoria, setCategoria] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  const cargarGastos = () => {
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

    const nuevoGasto = {
      descripcion,
      monto: Number(monto),
      categoria
    }

    fetch('http://localhost:5000/api/gastos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoGasto)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('No se pudo guardar el gasto')
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

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Gastos App</h1>
      <p>Alta y listado de gastos</p>

      <form onSubmit={manejarSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Descripción: </label>
          <input
            type="text"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Monto: </label>
          <input
            type="number"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label>Categoría: </label>
          <input
            type="text"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          />
        </div>

        <button type="submit">Agregar gasto</button>
      </form>

      {cargando && <p>Cargando gastos...</p>}
      {error && <p>Error: {error}</p>}

      {!cargando && !error && (
        <ul>
          {gastos.map((gasto) => (
            <li key={gasto.id}>
              {gasto.descripcion} - ${gasto.monto} - {gasto.categoria}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default App