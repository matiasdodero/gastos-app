import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [mensaje, setMensaje] = useState('Cargando...')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://localhost:5000/api/saludo')
      .then((response) => {
        if (!response.ok) {
          throw new Error('La API respondió con error')
        }
        return response.json()
      })
      .then((data) => {
        setMensaje(data.mensaje)
      })
      .catch((err) => {
        setError(err.message)
      })
  }, [])

  return (
    <div style={{ padding: '2rem', fontFamily: 'Arial' }}>
      <h1>Gastos App</h1>
      <p>Prueba de conexión entre React y .NET</p>

      {error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Respuesta del backend: {mensaje}</p>
      )}
    </div>
  )
}

export default App