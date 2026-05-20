import React, { useState, useEffect } from 'react';
import { useAppTheme } from '../../context/ThemeContext.jsx';
import { toast } from 'react-toastify';
import api from '../../api/api.js';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CloseIcon from '@mui/icons-material/Close';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { CircularProgress } from '@mui/material';
import styles from './Reports.module.css';

const Reports = () => {
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/compliance/get-reports');
        setReports(response.data?.data || []);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const totalReports = reports.length;
  const avgScore = reports.length > 0
    ? Math.round(reports.reduce((acc, r) => acc + r.complianceScore, 0) / reports.length)
    : 0;
  const compliantCount = reports.filter(r => r.complianceScore >= 90).length;

  const getScoreClass = (score) => {
    if (score >= 90) return styles.scoreHigh;
    if (score >= 75) return styles.scoreMid;
    return styles.scoreLow;
  };

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h1>Compliance Reports</h1>
        <p>Your historical AI-generated compliance analysis reports.</p>
      </div>

      {/* Stats row */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{loading ? '—' : totalReports}</span>
          <span className={styles.statLabel}>Total Scans</span>
          <div className={`${styles.statAccent} ${styles.accentBlue}`} />
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{loading ? '—' : `${avgScore}%`}</span>
          <span className={styles.statLabel}>Avg. Compliance Score</span>
          <div className={`${styles.statAccent} ${styles.accentGreen}`} />
        </div>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{loading ? '—' : compliantCount}</span>
          <span className={styles.statLabel}>Highly Compliant</span>
          <div className={`${styles.statAccent} ${styles.accentTeal}`} />
        </div>
      </div>

      {/* Reports list */}
      <p className={styles.sectionTitle}>Recent Reports</p>

      {loading ? (
        <div className={styles.loadingArea}>
          <CircularProgress size={32} thickness={3} />
        </div>
      ) : reports.length === 0 ? (
        <div className={styles.emptyArea}>
          <AssessmentIcon className={styles.emptyIcon} />
          <h3>No reports found</h3>
          <p>Run the Compliance Engine to generate your first report.</p>
        </div>
      ) : (
        <div className={styles.reportsGrid}>
          {reports.map((report) => (
            <div
              key={report._id}
              className={styles.reportCard}
              onClick={() => setSelectedReport(report)}
            >
              <div className={styles.cardTop}>
                <h3 className={styles.productName}>
                  {report.product?.productName || 'Unknown Product'}
                </h3>
                <span className={`${styles.scoreBadge} ${getScoreClass(report.complianceScore)}`}>
                  {report.complianceScore}%
                </span>
              </div>
              <p className={styles.frameworkName}>
                {report.framework?.name}
                <span className={styles.shortCode}> ({report.framework?.shortCode})</span>
              </p>
              <p className={styles.reportDate}>
                {new Date(report.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {selectedReport && (
        <div className={styles.modalOverlay} onClick={() => setSelectedReport(null)}>
          <div
            className={`${styles.modal} ${isDark ? styles.dark : styles.light}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <div>
                <p className={styles.modalTitle}>
                  {selectedReport.product?.productName} — {selectedReport.framework?.shortCode}
                </p>
                <p className={styles.modalDate}>
                  Generated on {new Date(selectedReport.createdAt).toLocaleString()}
                </p>
              </div>
              <div className={styles.modalActions}>
                <span className={`${styles.scoreBadge} ${getScoreClass(selectedReport.complianceScore)}`}>
                  {selectedReport.complianceScore}%
                </span>
              </div>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.markdownBody}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {selectedReport.reportText}
                </ReactMarkdown>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button className={styles.closeModalBtn} onClick={() => setSelectedReport(null)}>
                Close Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
