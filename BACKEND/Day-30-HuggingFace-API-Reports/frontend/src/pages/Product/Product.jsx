import React, { useState, useEffect, useRef } from 'react';
import api from '../../api/api.js';
import { useAppTheme } from '../../context/ThemeContext.jsx';
import AddProductForm from '../../components/AddProductForm.jsx';
import styles from './Product.module.css';

const getStatusClass = (status) => {
  switch (status) {
    case 'compliant': return styles.statusCompliant;
    case 'non_compliant': return styles.statusNonCompliant;
    case 'under_review': return styles.statusReview;
    default: return styles.statusDraft;
  }
};

// ─── EDIT MODAL ────────────────────────────────────────────────────────────────
const EditProductModal = ({ product, organizations, onClose, onSave }) => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    productName: product.productName || '',
    productCode: product.productCode || '',
    description: product.description || '',
    productType: product.productType || 'other',
    company: product.company?._id || product.company || '',
    complianceStatus: product.complianceStatus || 'draft',
    complianceScore: product.complianceScore || 0,
    deviceClass: product.regulatory?.deviceClass || '',
    riskCategory: product.regulatory?.riskCategory || 'low',
    intendedUse: product.regulatory?.intendedUse || '',
    market: product.regulatory?.market?.join(', ') || '',
  });

  const [existingImages, setExistingImages] = useState(product.images || []);
  const [newFiles, setNewFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewFiles(prev => [...prev, ...files]);
    const previews = files.map(f => URL.createObjectURL(f));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const removeExistingImage = (idx) => {
    setExistingImages(prev => prev.filter((_, i) => i !== idx));
  };

  const removeNewImage = (idx) => {
    setNewFiles(prev => prev.filter((_, i) => i !== idx));
    setNewPreviews(prev => {
      URL.revokeObjectURL(prev[idx]);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async () => {
    if (!form.productName.trim()) { setError('Product name is required'); return; }
    setSaving(true);
    setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      fd.append('existingImages', JSON.stringify(existingImages));
      newFiles.forEach(f => fd.append('images', f));

      const res = await api.put(`/product/update/${product._id}`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      onSave(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '1rem',
    }}>
      <div style={{
        background: isDark ? '#1e293b' : '#ffffff',
        border: `1px solid ${isDark ? '#334155' : '#d1d7e1'}`,
        borderRadius: '12px',
        padding: '2rem',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        fontFamily: 'Outfit, sans-serif',
        color: isDark ? '#f8fafc' : '#1e293b',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '.55rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#0d9488', marginBottom: '.25rem' }}>Edit Product</p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 900, margin: 0 }}>{product.productName}</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.4rem', cursor: 'pointer', color: isDark ? '#94a3b8' : '#64748b' }}>✕</button>
        </div>

        {error && (
          <div style={{ background: 'rgba(192,57,43,.12)', borderLeft: '3px solid #c0392b', color: '#c0392b', padding: '.6rem 1rem', fontSize: '.8rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {/* Form Fields */}
        {[
          { label: 'Product Name *', name: 'productName', type: 'text' },
          { label: 'Product Code / SKU', name: 'productCode', type: 'text' },
        ].map(f => (
          <div key={f.name} style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '.54rem', letterSpacing: '.16em', textTransform: 'uppercase', color: isDark ? '#94a3b8' : '#1e293b', marginBottom: '.35rem' }}>{f.label}</label>
            <input name={f.name} value={form[f.name]} onChange={handleChange} style={inputStyle(isDark)} />
          </div>
        ))}

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle(isDark)}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={{ ...inputStyle(isDark), resize: 'vertical', minHeight: '80px' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle(isDark)}>Organization</label>
            <select name="company" value={form.company} onChange={handleChange} style={selectStyle(isDark)}>
              {organizations.map(o => <option key={o._id} value={o._id}>{o.legalName}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle(isDark)}>Product Type</label>
            <select name="productType" value={form.productType} onChange={handleChange} style={selectStyle(isDark)}>
              {['drug', 'medical_device', 'software', 'ai_system', 'diagonistic', 'other'].map(t => <option key={t} value={t}>{t.replace('_', ' ')}</option>)}
            </select>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle(isDark)}>Compliance Status</label>
            <select name="complianceStatus" value={form.complianceStatus} onChange={handleChange} style={selectStyle(isDark)}>
              {['draft', 'under_review', 'compliant', 'non_compliant'].map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle(isDark)}>Compliance Score (%)</label>
            <input name="complianceScore" type="number" min={0} max={100} value={form.complianceScore} onChange={handleChange} style={inputStyle(isDark)} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <label style={labelStyle(isDark)}>Device Class</label>
            <input name="deviceClass" value={form.deviceClass} onChange={handleChange} placeholder="e.g. Class IIb" style={inputStyle(isDark)} />
          </div>
          <div>
            <label style={labelStyle(isDark)}>Risk Category</label>
            <select name="riskCategory" value={form.riskCategory} onChange={handleChange} style={selectStyle(isDark)}>
              {['low', 'medium', 'high', 'critical'].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label style={labelStyle(isDark)}>Intended Use</label>
          <input name="intendedUse" value={form.intendedUse} onChange={handleChange} style={inputStyle(isDark)} />
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle(isDark)}>Target Markets (comma separated)</label>
          <input name="market" value={form.market} onChange={handleChange} placeholder="India, USA, EU" style={inputStyle(isDark)} />
        </div>

        {/* Image Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={labelStyle(isDark)}>Product Images</label>

          {/* Existing images */}
          {existingImages.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.75rem' }}>
              {existingImages.map((img, i) => (
                <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                  <img src={img.url} alt="product" style={{ width: '100%', height: '100%', objectFit: 'cover', border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}` }} />
                  <button onClick={() => removeExistingImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: '#c0392b', color: '#fff', border: 'none', width: 18, height: 18, cursor: 'pointer', fontSize: 11, display: 'grid', placeItems: 'center' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* New image previews */}
          {newPreviews.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.5rem', marginBottom: '.75rem' }}>
              {newPreviews.map((src, i) => (
                <div key={i} style={{ position: 'relative', width: 72, height: 72 }}>
                  <img src={src} alt="new" style={{ width: '100%', height: '100%', objectFit: 'cover', border: '1px solid #0d9488' }} />
                  <button onClick={() => removeNewImage(i)} style={{ position: 'absolute', top: 0, right: 0, background: '#c0392b', color: '#fff', border: 'none', width: 18, height: 18, cursor: 'pointer', fontSize: 11, display: 'grid', placeItems: 'center' }}>✕</button>
                </div>
              ))}
            </div>
          )}

          {/* Upload button */}
          <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleFileChange} style={{ display: 'none' }} />
          <button onClick={() => fileInputRef.current?.click()} style={{
            background: 'none', border: `1px dashed ${isDark ? 'rgba(45,212,191,.4)' : 'rgba(13,148,136,.4)'}`,
            color: isDark ? '#2dd4bf' : '#0d9488', padding: '.6rem 1.2rem',
            fontFamily: 'DM Mono, monospace', fontSize: '.58rem', letterSpacing: '.16em',
            textTransform: 'uppercase', cursor: 'pointer', width: '100%',
          }}>
            + Add Images
          </button>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button onClick={onClose} style={{
            flex: 1, padding: '.8rem', background: 'none',
            border: `1px solid ${isDark ? '#334155' : '#d1d7e1'}`,
            color: isDark ? '#94a3b8' : '#64748b',
            fontFamily: 'DM Mono, monospace', fontSize: '.6rem', letterSpacing: '.18em',
            textTransform: 'uppercase', cursor: 'pointer',
          }}>Cancel</button>
          <button onClick={handleSubmit} disabled={saving} style={{
            flex: 2, padding: '.8rem', background: saving ? '#64748b' : '#0d9488',
            border: 'none', color: '#fff',
            fontFamily: 'DM Mono, monospace', fontSize: '.6rem', letterSpacing: '.18em',
            textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer',
            opacity: saving ? .7 : 1,
          }}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// helper styles
const inputStyle = (isDark) => ({
  width: '100%', padding: '.65rem .9rem',
  background: isDark ? '#0f172a' : '#f8fafc',
  border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
  color: isDark ? '#f8fafc' : '#1e293b',
  fontFamily: 'Outfit, sans-serif', fontSize: '.84rem', fontWeight: 300,
  outline: 'none', boxSizing: 'border-box', borderRadius: 0,
});

const selectStyle = (isDark) => ({
  ...inputStyle(isDark),
  appearance: 'none', WebkitAppearance: 'none', cursor: 'pointer',
  backgroundImage: isDark
    ? `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%2394a3b8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`
    : `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='11' height='7'%3E%3Cpath d='M1 1l4.5 4.5L10 1' stroke='%231e293b' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right .9rem center',
  paddingRight: '2.2rem',
});

const labelStyle = (isDark) => ({
  display: 'block', fontFamily: 'DM Mono, monospace',
  fontSize: '.54rem', letterSpacing: '.16em', textTransform: 'uppercase',
  color: isDark ? '#94a3b8' : '#1e293b', marginBottom: '.35rem',
});

// ─── PRODUCT DETAIL VIEW ────────────────────────────────────────────────────
const ProductDetails = ({ product, onBack, onEdit }) => (
  <div className={styles.detailsView}>
    <button onClick={onBack} className={styles.backBtn}>← Back to Inventory</button>

    <div className={styles.detailsHeader}>
      <div className={styles.detailsMain}>
        <div>
        <div className={styles.productAvatar}>{product.productName?.charAt(0)}</div>
          <div className={styles.titleRow}>
            <h1>{product.productName}</h1>
          </div>
          <p className={styles.metaText}>{product.productCode} • {product.productType} • {product.orgName || product.company?.legalName}</p>
        </div>
        <div className={styles.update}>
          <span className={`${styles.statusBadge} ${getStatusClass(product.complianceStatus)}`}>
            {product.complianceStatus?.replace('_', ' ')}
          </span>
          {/* Edit Button */}
          <button className={styles.updateButton} onClick={onEdit}>
            ✎ Edit Product
          </button>
        </div>
      </div>
    </div>

    <div className={styles.detailsGrid}>
      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Description</h3>
          <p>{product.description || 'No description available.'}</p>
        </div>
        <div className={styles.infoCard}>
          <h3>Regulatory Profile</h3>
          <div className={styles.dataGrid}>
            <div className={styles.dataRow}>
              <span className={styles.label}>Device Class</span>
              <span>{product.regulatory?.deviceClass || 'N/A'}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.label}>Risk Category</span>
              <span>{product.regulatory?.riskCategory || 'N/A'}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.label}>Intended Use</span>
              <span>{product.regulatory?.intendedUse || 'N/A'}</span>
            </div>
            <div className={styles.dataRow}>
              <span className={styles.label}>Target Markets</span>
              <div className={styles.tagGroup}>
                {product.regulatory?.market?.length > 0
                  ? product.regulatory.market.map((m, i) => <span key={i} className={styles.marketTag}>{m}</span>)
                  : 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sideSection}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreCircle}>
            <span className={styles.scoreValue}>{product.complianceScore}%</span>
            <span className={styles.scoreLabel}>Compliance</span>
          </div>
        </div>
        {product.images?.length > 0 && (
          <div className={styles.imageGallery}>
            <h3>Product Assets</h3>
            <div className={styles.assetGrid}>
              {product.images.map((img, i) => <img key={i} src={img.url} alt="asset" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────
const Product = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [activeTab, setActiveTab] = useState('my-products');
  const [view, setView] = useState('list');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState('all');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchOrganizations = async () => {
    try {
      const res = await api.get('/organization/get-companies');
      setOrganizations(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch organizations', err);
    }
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const orgsRes = await api.get('/organization/get-companies');
      const orgs = orgsRes.data.data || [];
      const allProducts = [];
      for (const org of orgs) {
        try {
          const prodRes = await api.get(`/product/get-by-company/${org._id}`);
          if (prodRes.data.data) {
            allProducts.push(...prodRes.data.data.map(p => ({ ...p, orgName: org.legalName })));
          }
        } catch { /* no products */ }
      }
      setProducts(allProducts);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
    fetchAllProducts();
  }, []);

  const handleAddSuccess = () => {
    setActiveTab('my-products');
    fetchAllProducts();
  };

  const handleEditSave = (updatedProduct) => {
    // Update in list
    setProducts(prev => prev.map(p => p._id === updatedProduct._id ? { ...updatedProduct, orgName: p.orgName } : p));
    setSelectedProduct(prev => ({ ...prev, ...updatedProduct }));
    setShowEditModal(false);
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch =
      (p.productName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.productCode || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesOrg = selectedOrgId === 'all' || p.company === selectedOrgId || p.company?._id === selectedOrgId;
    return matchesSearch && matchesOrg;
  });

  if (view === 'detail' && selectedProduct) {
    return (
      <div className={`${styles.pageWrapper} ${isDark ? styles.dark : styles.light}`}>
        <ProductDetails
          product={selectedProduct}
          onBack={() => setView('list')}
          onEdit={() => setShowEditModal(true)}
        />
        {showEditModal && (
          <EditProductModal
            product={selectedProduct}
            organizations={organizations}
            onClose={() => setShowEditModal(false)}
            onSave={handleEditSave}
          />
        )}
      </div>
    );
  }

  return (
    <div className={`${styles.pageWrapper} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.topHeader}>
        <div>
          <h1>Product Portfolio</h1>
          <p>Global inventory and compliance management</p>
        </div>
        <button className={styles.primaryBtn} onClick={() => setActiveTab('add-product')}>
          + New Product
        </button>
      </div>

      <div className={styles.tabNav}>
        <button onClick={() => setActiveTab('my-products')} className={`${styles.tabBtn} ${activeTab === 'my-products' ? styles.tabActive : ''}`}>
          My Products
        </button>
        <button onClick={() => setActiveTab('add-product')} className={`${styles.tabBtn} ${activeTab === 'add-product' ? styles.tabActive : ''}`}>
          Add Product
        </button>
      </div>

      {activeTab === 'my-products' ? (
        <div className={styles.inventoryArea}>
          <div className={styles.filterBar}>
            <div className={styles.searchBox}>
              <input type="text" placeholder="Search by name or code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <div className={styles.filterBox}>
              <select value={selectedOrgId} onChange={(e) => setSelectedOrgId(e.target.value)}>
                <option value="all">All Organizations</option>
                {organizations.map(org => <option key={org._id} value={org._id}>{org.legalName}</option>)}
              </select>
            </div>
          </div>

          {loading ? (
            <div className={styles.loaderArea}>Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyArea}>
              <div className={styles.emptyIcon}>📦</div>
              <h3>No products found</h3>
              <p>Try adjusting your filters or add a new product.</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map(product => (
                <div key={product._id} className={styles.productCard} onClick={() => { setSelectedProduct(product); setView('detail'); }}>
                  <div className={styles.cardTop}>
                    <div className={styles.miniAvatar}>{product.productName?.charAt(0)}</div>
                    <span className={`${styles.dotBadge} ${getStatusClass(product.complianceStatus)}`}>
                      {product.complianceStatus?.replace('_', ' ')}
                    </span>
                  </div>
                  <div className={styles.cardMain}>
                    <h3>{product.productName}</h3>
                    <p className={styles.cardOrgName}>{product.orgName}</p>
                  </div>
                  <div className={styles.cardBottom}>
                    <span className={styles.cardCode}>{product.productCode || 'N/A'}</span>
                    <span className={styles.cardScore}>{product.complianceScore}% Score</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <AddProductForm onSuccess={handleAddSuccess} />
      )}
    </div>
  );
};

export default Product;