import './App.css'
import Routers from './router'
import { Toaster } from 'sonner'

function App() {
  return (
    <>
      <Routers />
      <Toaster position="top-right" />
    </>
  )
}

export default App
