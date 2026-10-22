import axios from 'axios';
import fallbackDatabase from '../data/db.json';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

const getCollection = async (collection) => {
  const response = await axios.get(`${API_URL}/${collection}`);
  return Array.isArray(response.data) ? response.data : [];
};

export const getProducts = async () => {
  try {
    return await getCollection('products');
  } catch (error) {
    console.warn('Không thể tải API sản phẩm, dùng dữ liệu trong db.json:', error);
    return fallbackDatabase.products;
  }
};

export const getCategories = async () => {
  try {
    return await getCollection('categories');
  } catch (error) {
    console.warn('Không thể tải API thể loại, dùng dữ liệu trong db.json:', error);
    return fallbackDatabase.categories;
  }
};

export const createProduct = async (values) => {
  try {
    const products = await getProducts();
    const duplicate = products.some(
      (product) => product.code.toUpperCase() === values.code.trim().toUpperCase(),
    );
    if (duplicate) return { success: false, message: 'Mã sản phẩm đã tồn tại.' };

    const nextId = products.reduce((max, product) => Math.max(max, Number(product.id) || 0), 0) + 1;
    const product = {
      id: String(nextId),
      code: values.code.trim().toUpperCase(),
      name: values.name.trim(),
      categoryId: String(values.categoryId),
      price: Number(values.price),
      quantity: Number(values.quantity),
      importDate: values.importDate,
      description: values.description?.trim() || '',
    };
    await axios.post(`${API_URL}/products`, product);
    return { success: true };
  } catch (error) {
    console.error('Không thể thêm sản phẩm:', error);
    return { success: false, message: 'Lưu sản phẩm thất bại. Hãy kiểm tra json-server.' };
  }
};
