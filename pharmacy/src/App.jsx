import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import ProductList from './components/ProductList';
import ProductAdd from './components/ProductAdd';

export default function App() {
  return (
    <>
      <header className="app-header">
        <div className="brand-mark">+</div>
        <div><strong>TIT Pharmacy</strong><span>Hệ thống quản lý nhà thuốc</span></div>
      </header>
      <Routes>
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/add" element={<ProductAdd />} />
        <Route path="*" element={<Navigate to="/products" replace />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={2500} />
    </>
  );
}
