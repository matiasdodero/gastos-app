import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [gastos, setGastos] = useState([])
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
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
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Gastos App</h1>
      <p>Lista de gastos traída desde .NET</p>

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