import './App.css';
import { Toaster } from 'sonner';
import Routers from './router';


function App() {
  return (
    <>
      <Routers />
      <Toaster position="top-right"/>
    </>
  )
}

export default App;
