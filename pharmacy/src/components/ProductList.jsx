import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, getProducts } from '../services/pharmacyService';

const formatDate = (date) => {
  if (!date) return '';
  const [year, month, day] = date.split('-');
  return year && month && day ? `${day}/${month}/${year}` : date;
};

const formatPrice = (price) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(price);

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [nameQuery, setNameQuery] = useState('');
  const [categoryQuery, setCategoryQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProducts(), getCategories()]).then(([productData, categoryData]) => {
      setProducts(productData);
      setCategories(categoryData);
      setLoading(false);
    });
  }, []);

  const categoryName = (id) =>
      categories.find((category) => String(category.id) === String(id))?.name || 'Chưa phân loại';

  const displayedProducts = useMemo(
      () =>
          products
              .filter((product) =>
                  product.name
                      .toLocaleLowerCase('vi-VN')
                      .includes(nameQuery.trim().toLocaleLowerCase('vi-VN'))
              )
              .filter((product) => !categoryQuery || String(product.categoryId) === categoryQuery)
              .sort((a, b) => a.name.localeCompare(b.name, 'vi')),
      [products, nameQuery, categoryQuery]
  );

  return (
      <main className="page-content">
        <div className="page-heading">
          <div>
            <p className="eyebrow">QUẢN LÝ KHO</p>
            <h1>Danh sách sản phẩm</h1>
            <p className="subtitle">
              Theo dõi thuốc và sản phẩm đang có tại nhà thuốc.
            </p>
          </div>
          <Link to="/products/add" className="btn btn-primary add-button">
            + Thêm sản phẩm
          </Link>
        </div>

        <section className="filter-card" aria-label="Tìm kiếm sản phẩm">
          <div className="filter-field grow">
            <label htmlFor="product-name">Tên sản phẩm</label>
            <input
                id="product-name"
                className="form-control"
                value={nameQuery}
                onChange={(event) => setNameQuery(event.target.value)}
                placeholder="Nhập tên sản phẩm cần tìm"
            />
          </div>
          <div className="filter-field">
            <label htmlFor="product-category">Thể loại</label>
            <select
                id="product-category"
                className="form-select"
                value={categoryQuery}
                onChange={(event) => setCategoryQuery(event.target.value)}
            >
              <option value="">Tất cả thể loại</option>
              {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
          </div>
          <button
              type="button"
              className="btn btn-outline-secondary clear-button"
              onClick={() => {
                setNameQuery('');
                setCategoryQuery('');
              }}
          >
            Xóa bộ lọc
          </button>
        </section>

        {loading ? (
            <p className="status-message">Đang tải dữ liệu...</p>
        ) : displayedProducts.length === 0 ? (
            <p className="status-message empty-message">Không có kết quả</p>
        ) : (
            <div className="table-responsive table-card">
              <table className="table align-middle mb-0">
                <thead>
                <tr>
                  <th>STT</th>
                  <th>Mã sản phẩm</th>
                  <th>Tên sản phẩm</th>
                  <th>Thể loại</th>
                  <th className="text-end">Số lượng</th>
                  <th className="text-end">Giá</th>
                  <th>Ngày nhập sản phẩm</th>
                </tr>
                </thead>
                <tbody>
                {displayedProducts.map((product, index) => (
                    <tr key={product.id}>
                      <td>{index + 1}</td>
                      <td>
                        <span className="product-code">{product.code}</span>
                      </td>
                      <td className="product-name">{product.name}</td>
                      <td>
                    <span className="category-badge">
                      {categoryName(product.categoryId)}
                    </span>
                      </td>
                      <td className="text-end">{product.quantity}</td>
                      <td className="text-end price">
                        {formatPrice(product.price)}
                      </td>
                      <td>{formatDate(product.importDate)}</td>
                    </tr>
                ))}
                </tbody>
              </table>
            </div>
        )}
      </main>
  );
}
