import { useEffect, useState } from 'react';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { createProduct, getCategories } from '../services/pharmacyService';

const today = new Date().toISOString().slice(0, 10);
const validationSchema = Yup.object({
  code: Yup.string()
      .trim()
      .required('Mã sản phẩm là bắt buộc.')
      .matches(/^PROD\d{4}$/, 'Mã sản phẩm có dạng PRODXXXX (X là chữ số).'),
  name: Yup.string()
      .trim()
      .required('Tên sản phẩm là bắt buộc.'),
  categoryId: Yup.string()
      .required('Vui lòng chọn thể loại.'),
  price: Yup.number()
      .typeError('Giá phải là số.')
      .required('Giá là bắt buộc.')
      .moreThan(0, 'Giá phải lớn hơn 0.'),
  quantity: Yup.number()
      .typeError('Số lượng phải là số nguyên.')
      .required('Số lượng là bắt buộc.')
      .integer('Số lượng phải là số nguyên.')
      .moreThan(0, 'Số lượng phải lớn hơn 0.'),
  importDate: Yup.date()
      .required('Ngày nhập là bắt buộc.')
      .max(today, 'Ngày nhập không được lớn hơn ngày hiện tại.'),
});

export default function ProductAdd() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const submit = async (values, { setSubmitting, setFieldError }) => {
    const result = await createProduct(values);
    setSubmitting(false);
    if (result.success) {
      toast.success('Thêm mới sản phẩm thành công!');
      navigate('/products');
    } else {
      setFieldError('code', result.message);
      toast.error(result.message);
    }
  };

  return (
      <main className="page-content form-page">
        <button
            type="button"
            className="back-link"
            onClick={() => navigate('/products')}
        >
          ← Quay về danh sách
        </button>

        <div className="form-heading">
          <p className="eyebrow">KHO SẢN PHẨM</p>
          <h1>Thêm sản phẩm mới</h1>
          <p className="subtitle">Nhập đầy đủ thông tin để lưu sản phẩm vào hệ thống.</p>
        </div>

        <section className="product-form-card">
          <Formik
              initialValues={{
                code: '',
                name: '',
                categoryId: '',
                price: '',
                quantity: '',
                importDate: today,
              }}
              validationSchema={validationSchema}
              onSubmit={submit}
          >
            {({ isSubmitting }) => (
                <Form noValidate>
                  <div className="form-grid">
                    <FormField
                        name="code"
                        label="Mã sản phẩm"
                        placeholder="Ví dụ: PROD0006"
                    />

                    <FormField
                        name="name"
                        label="Tên sản phẩm"
                        placeholder="Nhập tên sản phẩm"
                    />

                    <div>
                      <label htmlFor="categoryId" className="form-label">
                        Thể loại
                      </label>
                      <Field
                          as="select"
                          id="categoryId"
                          name="categoryId"
                          className="form-select"
                      >
                        <option value="">-- Chọn thể loại --</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.name}
                            </option>
                        ))}
                      </Field>
                      <ErrorMessage name="categoryId" component="small" className="field-error" />
                    </div>

                    <FormField
                        name="price"
                        label="Giá (VNĐ)"
                        type="number"
                        min="1"
                        placeholder="Ví dụ: 50000"
                    />

                    <FormField
                        name="quantity"
                        label="Số lượng"
                        type="number"
                        min="1"
                        step="1"
                        placeholder="Ví dụ: 10"
                    />

                    <FormField
                        name="importDate"
                        label="Ngày nhập sản phẩm"
                        type="date"
                        max={today}
                    />
                  </div>

                  <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigate('/products')}
                    >
                      Hủy
                    </button>
                    <button
                        type="submit"
                        className="btn btn-primary px-4"
                        disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
                    </button>
                  </div>
                </Form>
            )}
          </Formik>
        </section>
      </main>
  );
}
function FormField({ name, label, type = 'text', ...props }) {
  return (
      <div>
        <label htmlFor={name} className="form-label">
          {label}
        </label>
        <Field
            id={name}
            name={name}
            type={type}
            className="form-control"
            {...props}
        />
        <ErrorMessage name={name} component="small" className="field-error" />
      </div>
  );
}