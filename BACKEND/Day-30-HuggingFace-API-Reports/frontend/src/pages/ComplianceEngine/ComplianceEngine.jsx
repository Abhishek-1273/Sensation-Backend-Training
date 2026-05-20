import React, { useState, useEffect } from 'react';
import { useAppTheme } from '../../context/ThemeContext.jsx';
import { toast } from 'react-toastify';
import api from '../../api/api.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CircularProgress } from '@mui/material';
import styles from './ComplianceEngine.module.css';

const ComplianceEngine = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [products, setProducts] = useState([]);
  const [frameworks, setFrameworks] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedFramework, setSelectedFramework] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, frameworkRes] = await Promise.all([
          api.get('/product/get-products'),
          api.get('/framework/get-frameworks'),
        ]);
        setProducts(productRes.data?.data || []);
        setFrameworks(frameworkRes.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load products and frameworks');
      }
    };
    fetchData();
  }, []);

  const handleAnalyze = async () => {
    if (!selectedProduct || !selectedFramework) {
      toast.warning('Please select both a Product and a Framework');
      return;
    }

    setLoading(true);
    setReport('');
    try {
      const response = await api.post('/compliance/analyze', {
        productId: selectedProduct,
        frameworkId: selectedFramework,
      });
      setReport(response.data?.data?.report);
      toast.success('Compliance report generated successfully!');
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h1><AutoAwesomeIcon className={styles.titleIcon} /> Compliance Engine</h1>
        <p>Select a product and regulatory framework to run an AI-powered RAG analysis.</p>
      </div>

      <div className={styles.layout}>
        {/* Controls Panel */}
        <div className={styles.controlPanel}>
          <p className={styles.panelLabel}>Analysis Parameters</p>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Product</label>
            <select
              className={styles.select}
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
            >
              <option value="">— Choose a product —</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.productName}</option>
              ))}
            </select>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select Framework</label>
            <select
              className={styles.select}
              value={selectedFramework}
              onChange={(e) => setSelectedFramework(e.target.value)}
            >
              <option value="">— Choose a framework —</option>
              {frameworks.map((f) => (
                <option key={f._id} value={f._id}>{f.name} ({f.shortCode})</option>
              ))}
            </select>
          </div>

          <button
            className={styles.analyzeBtn}
            onClick={handleAnalyze}
            disabled={loading || !selectedProduct || !selectedFramework}
          >
            {loading
              ? <><CircularProgress size={14} color="inherit" style={{ marginRight: 8 }} /> Generating...</>
              : <><AutoAwesomeIcon style={{ fontSize: 16, marginRight: 6 }} /> Analyze Compliance</>
            }
          </button>
        </div>

        {/* Report Panel */}
        <div className={styles.reportPanel}>
          {!report && !loading && (
            <div className={styles.emptyState}>
              <AutoAwesomeIcon className={styles.emptyIcon} />
              <h3>Ready for Analysis</h3>
              <p>Configure your parameters on the left and run the AI engine.</p>
            </div>
          )}

          {loading && (
            <div className={styles.loadingState}>
              <CircularProgress size={44} thickness={3} />
              <p>Querying Vector Database &amp; Analysing...</p>
            </div>
          )}

          {report && !loading && (
            <div className={styles.reportContent}>
              <div className={styles.reportHeader}>
                <p className={styles.reportLabel}>AI Compliance Analysis Report</p>
              </div>
              <div className={styles.markdownBody}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{report}</ReactMarkdown>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplianceEngine;
