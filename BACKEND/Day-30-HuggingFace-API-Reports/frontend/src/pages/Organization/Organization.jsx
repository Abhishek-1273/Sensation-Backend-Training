import React, { useState, useEffect } from 'react';
import api from '../../api/api.js'
import { useAppTheme } from '../../context/ThemeContext.jsx'
import {
  Business as Building2,
  Language as Globe,
  Phone,
  LocationOn as MapPin,
  ChevronRight,
  ArrowBack as ArrowLeft,
} from '@mui/icons-material';
import {AddOrganizationForm} from '../../components/AddOrganizationForm.jsx'
import styles from './Organization.module.css';

const OrganizationDetails = ({ org, products, onBack, isDark }) => (
  <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
    <button onClick={onBack} className={styles.backButton}>
      <ArrowLeft sx={{ fontSize: 16 }} /> Back to Organizations
    </button>

    <div className={styles.detailsHeader}>
      <div className={styles.detailsHeaderContent}>
        <div className={styles.orgIconBox}>
          <Building2 sx={{ fontSize: 32 }} />
        </div>
        <div>
          <h1 className={styles.orgTitle}>{org.legalName}</h1>
          <p className={styles.orgDba}>{org.dbaName}</p>
        </div>
      </div>
    </div>

    <div className={styles.detailsGrid}>
      <div className={styles.detailsColumn}>
        <div className={styles.detailCard}>
          <h3 className={styles.sectionTitle}>Contact & Address</h3>
          <div className={styles.contactGrid}>
            {org.website && (
              <div className={styles.infoRow}>
                <Globe sx={{ fontSize: 16 }} />
                <a href={org.website} target="_blank" rel="noreferrer" className={styles.infoLink}>{org.website}</a>
              </div>
            )}
            {org.phoneNumber && (
              <div className={styles.infoRow}>
                <Phone sx={{ fontSize: 16 }} />
                <span>{org.phoneNumber}</span>
              </div>
            )}
            {org.address?.street && (
              <div className={styles.infoRow}>
                <MapPin sx={{ fontSize: 16 }} />
                <span>{org.address.street}, {org.address.city}</span>
              </div>
            )}
          </div>
        </div>

        <div className={styles.detailCard}>
          <h3 className={styles.sectionTitle}>Regulatory Identifiers</h3>
          <div className={styles.regulatoryGrid}>
            {[
              { label: 'FDA FEI', val: org.identifiers?.fdafei },
              { label: 'DUNS', val: org.identifiers?.dunsNumber },
              { label: 'CIN', val: org.identifiers?.cin },
              { label: 'GSTIN', val: org.identifiers?.gstin },
              { label: 'PAN', val: org.identifiers?.pan },
              { label: 'CDSCO', val: org.identifiers?.cdsco },
            ].map(({ label, val }) => (
              <div key={label}>
                <span className={styles.identifierLabel}>{label}</span>
                <p className={styles.identifierValue}>{val || 'N/A'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.detailCard}>
        <h3 className={styles.sectionTitle}>Product Portfolio</h3>
        <div className={styles.portfolioList}>
          {products.length === 0 ? (
            <p className={styles.portfolioEmpty}>No products registered yet.</p>
          ) : (
            products.map(prod => (
              <div key={prod._id} className={styles.productCard}>
                <div className={styles.productInfo}>
                  <h4>{prod.productName}</h4>
                  <p>{prod.productCode} • {prod.productType}</p>
                </div>
                <div className={`${styles.badge} ${prod.complianceStatus === 'compliant' ? styles.badgeCompliant : styles.badgePending}`}>
                  {prod.complianceStatus}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  </div>
);

const Organizations = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';
  const [activeTab, setActiveTab] = useState('my-organizations');
  const [view, setView] = useState('list');
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchOrganizations = async () => {
    setLoading(true);
    try {
      const res = await api.get('/organization/get-companies');
      setOrganizations(res.data.data || []);
    } catch (err) {
      if (err.response?.status === 400) {
        setOrganizations([]);
      } else {
        setError(err.response?.data?.message || 'Failed to fetch organizations');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async (companyId) => {
    try {
      const res = await api.get(`/product/get-by-company/${companyId}`);
      setProducts(res.data.data || []);
    } catch {
      setProducts([]);
    }
  };

  useEffect(() => { fetchOrganizations(); }, []);

  const handleAddSuccess = () => {
    setActiveTab('my-organizations');
    fetchOrganizations();
  };

  const handleOrgClick = (org) => {
    setSelectedOrg(org);
    setProducts([]);
    fetchProducts(org._id);
    setView('detail');
  };

  if (view === 'detail') {
    return (
      <OrganizationDetails
        org={selectedOrg}
        products={products}
        isDark={isDark}
        onBack={() => setView('list')}
      />
    );
  }

  return (
    <div className={`${styles.container} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h1>Organizations</h1>
        <p>Manage your global business entities.</p>
      </div>

      <div className={styles.tabs}>
        <button
          onClick={() => setActiveTab('my-organizations')}
          className={`${styles.tab} ${activeTab === 'my-organizations' ? styles.tabActive : ''}`}
        >
          My Organizations
          {activeTab === 'my-organizations' && <div className={styles.activeIndicator} />}
        </button>
        <button
          onClick={() => setActiveTab('add-organization')}
          className={`${styles.tab} ${activeTab === 'add-organization' ? styles.tabActive : ''}`}
        >
          Add Organization
          {activeTab === 'add-organization' && <div className={styles.activeIndicator} />}
        </button>
      </div>

      {activeTab === 'my-organizations' ? (
        <div>
          {loading && <p className={styles.organizationsEmpty}>Loading...</p>}
          {error && <p className={styles.organizationsEmpty}>{error}</p>}
          {!loading && organizations.length === 0 && (
            <p className={styles.organizationsEmpty}>No organizations found.</p>
          )}
          {organizations.map(org => (
            <div key={org._id} className={styles.card} onClick={() => handleOrgClick(org)}>
              <div className={styles.cardInfo}>
                <Building2 sx={{ color: '#0d9488', fontSize: 22 }} />
                <div>
                  <h3 className={styles.cardTitle}>{org.legalName}</h3>
                  <p className={styles.cardSubtitle}>{org.website || org.dbaName}</p>
                </div>
              </div>
              <ChevronRight sx={{ opacity: 0.4, fontSize: 20 }} />
            </div>
          ))}
        </div>
      ) : (
        <AddOrganizationForm onSuccess={handleAddSuccess} />
      )}
    </div>
  );
};

export default Organizations;