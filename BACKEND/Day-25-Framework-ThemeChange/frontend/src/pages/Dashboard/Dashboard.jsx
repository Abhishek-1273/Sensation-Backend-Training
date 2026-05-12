import React from 'react';
import { useAuth } from "../../context/AuthContext.jsx";
import { useAppTheme } from "../../context/ThemeContext.jsx";
import styles from './Dashboard.module.css';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PolicyIcon from '@mui/icons-material/Policy';
import ApartmentIcon from '@mui/icons-material/Apartment';
import CategoryIcon from '@mui/icons-material/Category';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';

const Dashboard = () => {
  const { user } = useAuth();
  const { mode } = useAppTheme();
  const isDark = mode === 'dark';

  const stats = [
    { label: 'Compliance Score', value: '85%', icon: <AssuredWorkloadIcon />, accent: true },
    { label: 'Pending Tasks', value: '12', icon: <PendingActionsIcon /> },
    { label: 'Active Policies', value: '24', icon: <PolicyIcon /> },
    { label: 'Organisations', value: '3', icon: <ApartmentIcon /> },
    { label: 'Products', value: '18', icon: <CategoryIcon /> },
    { label: 'Growth', value: '+14%', icon: <TrendingUpIcon /> },
  ];

  return (
    <div className={`${styles.page} ${isDark ? styles.dark : styles.light}`}>
      <div className={styles.header}>
        <h1>Dashboard</h1>
        <p>Welcome back, <span className={styles.userName}>{user?.name || user?.userName || 'User'}</span></p>
      </div>

      <div className={styles.statsGrid}>
        {stats.map((stat, i) => (
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