import React, { useState } from 'react';
import { Business, ContactPage, LocationOn, Security } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api/api.js';
import { useAppTheme } from '../context/ThemeContext.jsx'
import styles from './AddOrganizationForm.module.css';

const AddOrganizationForm = ({ onSuccess }) => {
    const { mode } = useAppTheme();
    const isDark = mode === 'dark';
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        legalName: '',
        dbaName: '',
        website: '',
        phoneNumber: '',
        address: { street: '', city: '', state: '', zip: '', country: '' },
        primaryContact: { name: '', email: '' },
        identifiers: { fdafei: '', labellerCode: '', dunsNumber: '', cin: '', gstin: '', pan: '', cdsco: '', others: '' }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleNestedChange = (e, section) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [section]: { ...prev[section], [name]: value } }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await api.post('/organization/create', formData);
            toast.success('Organization registered successfully!');
            setFormData({
                legalName: '', dbaName: '', website: '', phoneNumber: '',
                address: { street: '', city: '', state: '', zip: '', country: '' },
                primaryContact: { name: '', email: '' },
                identifiers: { fdafei: '', labellerCode: '', dunsNumber: '', cin: '', gstin: '', pan: '', cdsco: '', others: '' }
            });
            if (onSuccess) onSuccess(response.data.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to register organization');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.formWrapper} ${isDark ? styles.dark : styles.light}`}>
            <form onSubmit={handleSubmit} className={styles.modernForm}>
                <div className={styles.formHeader}>
                    <h2>Register Organization</h2>
                    <p>Establish your business entity within the compliance framework.</p>
                </div>

                {/* Basic Info */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><Business fontSize="small" /> Basic Information</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Legal Name *</label>
                            <input type="text" name="legalName" value={formData.legalName} onChange={handleChange} required placeholder="Acme Corporation Inc." />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>DBA Name *</label>
                            <input type="text" name="dbaName" value={formData.dbaName} onChange={handleChange} required placeholder="Doing Business As..." />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Website URL</label>
                            <input type="url" name="website" value={formData.website} onChange={handleChange} placeholder="https://www.example.com" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Phone Number</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><LocationOn fontSize="small" /> Registered Address</h3>
                    <div className={styles.inputGroup}>
                        <label>Street Address</label>
                        <input type="text" name="street" value={formData.address.street} onChange={(e) => handleNestedChange(e, 'address')} placeholder="123 Compliance St." />
                    </div>
                    <div className={styles.tripleGrid}>
                        <div className={styles.inputGroup}>
                            <label>City</label>
                            <input type="text" name="city" value={formData.address.city} onChange={(e) => handleNestedChange(e, 'address')} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>State / Province</label>
                            <input type="text" name="state" value={formData.address.state} onChange={(e) => handleNestedChange(e, 'address')} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>ZIP / Postal Code</label>
                            <input type="text" name="zip" value={formData.address.zip} onChange={(e) => handleNestedChange(e, 'address')} />
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Country</label>
                        <input type="text" name="country" value={formData.address.country} onChange={(e) => handleNestedChange(e, 'address')} />
                    </div>
                </div>

                {/* Contact */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><ContactPage fontSize="small" /> Primary Contact</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Contact Name</label>
                            <input type="text" name="name" value={formData.primaryContact.name} onChange={(e) => handleNestedChange(e, 'primaryContact')} placeholder="John Doe" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Contact Email</label>
                            <input type="email" name="email" value={formData.primaryContact.email} onChange={(e) => handleNestedChange(e, 'primaryContact')} placeholder="john@example.com" />
                        </div>
                    </div>
                </div>

                {/* Identifiers */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}><Security fontSize="small" /> Regulatory & Corporate Identifiers</h3>
                    <div className={styles.tripleGrid}>
                        {[
                            { label: 'FDA FEI', name: 'fdafei' },
                            { label: 'Labeller Code', name: 'labellerCode' },
                            { label: 'DUNS Number', name: 'dunsNumber' },
                            { label: 'CIN', name: 'cin' },
                            { label: 'GSTIN', name: 'gstin' },
                            { label: 'PAN', name: 'pan' },
                            { label: 'CDSCO', name: 'cdsco' },
                            { label: 'Others', name: 'others' },
                        ].map(({ label, name }) => (
                            <div key={name} className={styles.inputGroup}>
                                <label>{label}</label>
                                <input type="text" name={name} value={formData.identifiers[name]} onChange={(e) => handleNestedChange(e, 'identifiers')} />
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Registering...' : 'Register Organization'}
                </button>
            </form>
        </div>
    );
};

export { AddOrganizationForm };