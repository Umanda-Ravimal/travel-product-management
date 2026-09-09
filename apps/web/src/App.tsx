import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import DashboardPage from './pages/DashboardPage';
import ProductsPage from './pages/ProductsPage';
import AiSearchPage from './pages/AiSearchPage';
import ProductFormPage from './pages/ProductFormPage';
import ProductDetailsPage from './pages/ProductDetailsPage';

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/new" element={<ProductFormPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/products/:id/edit" element={<ProductFormPage />} />
        <Route path="/ai-search" element={<AiSearchPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppLayout>
  );
}

export default App;
