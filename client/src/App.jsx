import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

const GmApp = lazy(() => import('./routes/GmApp'));
const PlayerApp = lazy(() => import('./routes/PlayerApp'));
const TableScreenView = lazy(() => import('./components/table/TableScreenView'));
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div className="loading-screen">Loading GM Helper...</div>}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/table/:token" element={<TableScreenView />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="/gm/*" element={<GmApp />} />
            <Route path="/player/*" element={<PlayerApp />} />
            <Route path="/" element={<Navigate to="/gm" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
