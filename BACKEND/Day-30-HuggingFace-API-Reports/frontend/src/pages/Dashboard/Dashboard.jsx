import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext.jsx";
import { useAppTheme } from "../../context/ThemeContext.jsx";
import styles from './Dashboard.module.css';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PolicyIcon from '@mui/icons-material/Policy';
import CategoryIcon from '@mui/icons-material/Category';
import AssessmentIcon from '@mui/icons-material/Assessment';
import api from '../../api/api.js';

const Dashboard = () => {
  const { user } = useAuth();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const [stats, setStats] = useState({
    complianceScore: null,
    frameworksCount: null,
    productsCount: null,
    reportsCount: null,
    loading: true,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [reportsRes, frameworksRes, productsRes] = await Promise.all([
          api.get('/compliance/get-reports'),
          api.get('/framework/get-frameworks'),
          api.get('/product/get-products'),
        ]);

        const reports = reportsRes.data?.data || [];
        const frameworks = frameworksRes.data?.data || [];
        const products = productsRes.data?.data || [];

        const avgScore = reports.length > 0
          ? Math.round(reports.reduce((acc, r) => acc + r.complianceScore, 0) / reports.length)
          : 0;

        setStats({
          complianceScore: avgScore,
          frameworksCount: frameworks.length,
          productsCount: products.length,
          reportsCount: reports.length,
          loading: false,
        });
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setStats(prev => ({ ...prev, loading: false }));
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      label: 'Compliance Score',
      value: stats.loading ? '—' : (stats.complianceScore > 0 ? `${stats.complianceScore}%` : 'N/A'),
      icon: <AssuredWorkloadIcon />,
      accent: true,
    },
    {
      label: 'Active Frameworks',
      value: stats.loading ? '—' : stats.frameworksCount,
      icon: <PolicyIcon />,
    },
    {
      label: 'Products Tracked',
      value: stats.loading ? '—' : stats.productsCount,
      icon: <CategoryIcon />,
    },
    {
      label: 'Reports Generated',
      value: stats.loading ? '—' : stats.reportsCount,
      icon: <AssessmentIcon />,
    },
  ];

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back, <span className={styles.userName}>{user?.name || user?.userName || 'User'}</span></p>
      </div>

      <div className={styles.statsGrid}>
        {cards.map((stat, i) => (
          <div key={i} className={`${styles.card} ${stat.accent ? styles.accentCard : ''}`}>
            <div className={styles.cardIcon}>{stat.icon}</div>
            <div className={styles.cardValue}>{stat.value}</div>
            <div className={styles.cardLabel}>{stat.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
