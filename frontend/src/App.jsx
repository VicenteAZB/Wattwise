import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './pages/login/Login';
import Oficinas from './pages/oficinas/Oficinas';
import OficinaDetail from './pages/oficinadetail/OficinaDetail';
import SeleccionarGrafico from './pages/seleccionargrafico/SeleccionarGrafico';
import DatosHistoricos from './pages/datoshistoricos/DatosHistoricos';
import DispositivosSensor from './pages/dispositivossensor/DispositivosSensor';
import AlertasProgramadas from './pages/alertasprogramadas/AlertasProgramadas';
import Perfil from './pages/perfil/Perfil';
import ProtectedRoute from './components/ProtectedRoute'; 

function App() {
  const location = useLocation();
  const hideNavbarOnRoutes = ['/']; 

  const shouldShowNavbar = !hideNavbarOnRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route
          path="/oficinas"
          element={
            <ProtectedRoute>
              <Oficinas />
            </ProtectedRoute>
          }
        />
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />
        
        <Route
          path="/oficina/:id"
          element={
            <ProtectedRoute>
              <OficinaDetail />
            </ProtectedRoute>
          }
        />

        <Route 
          path="/oficina/:oficinaId/sensor/:tipo/graficos/:categoria" 
          element={
            <ProtectedRoute>
              <SeleccionarGrafico /> 
            </ProtectedRoute>
          }
        />

        <Route path="/oficina/:oficinaId/sensor/:tipo/historico" 
          element={
            <ProtectedRoute>
              <DatosHistoricos />
            </ProtectedRoute>
          } 
        />


        <Route path="/oficina/:oficinaId/sensor/:tipo/dispositivos" 
          element={
            <ProtectedRoute>
              <DispositivosSensor />
            </ProtectedRoute>
          } 
        />

        <Route path="/oficina/:oficinaId/sensor/:tipo/alertas" 
          element={
            <ProtectedRoute>
              <AlertasProgramadas />
            </ProtectedRoute>
          } 
        />

      </Routes>
    </>
  );
}

export default App;
