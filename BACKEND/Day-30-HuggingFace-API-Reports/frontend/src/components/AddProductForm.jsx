import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../api/api.js';
import { useAppTheme } from '../context/ThemeContext.jsx'
import styles from './AddProductForm.module.css';

const AddProductForm = ({ onSuccess }) => {
    const { mode } = useAppTheme();
    const isDark = mode === 'dark';
    const [loading, setLoading] = useState(false);
    const [organizations, setOrganizations] = useState([]);
    const [fetchingOrgs, setFetchingOrgs] = useState(false);

    const [formData, setFormData] = useState({
        productName: '',
        productCode: '',
        description: '',
        productType: 'other',
        company: '',
        deviceClass: '',
        riskCategory: 'low',
        intendedUse: '',
        market: '',
    });

    const [approvals, setApprovals] = useState([
        { authority: '', approvalNumber: '', approvalDate: '' }
    ]);

    const [selectedImages, setSelectedImages] = useState([]);

    useEffect(() => {
        const fetchOrgs = async () => {
            setFetchingOrgs(true);
            try {
                const res = await api.get('/organization/get-companies');
                setOrganizations(res.data.data || []);
            } catch (err) {
                console.error('Failed to fetch organizations', err);
            } finally {
                setFetchingOrgs(false);
            }
        };
        fetchOrgs();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleApprovalChange = (index, e) => {
        const { name, value } = e.target;
        const newApprovals = [...approvals];
        newApprovals[index][name] = value;
        setApprovals(newApprovals);
    };

    const addApproval = () => setApprovals([...approvals, { authority: '', approvalNumber: '', approvalDate: '' }]);
    const removeApproval = (index) => setApprovals(approvals.filter((_, i) => i !== index));

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSelectedImages(prev => [...prev, ...files].slice(0, 5));
    };

    const removeImage = (index) => setSelectedImages(prev => prev.filter((_, i) => i !== index));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.company) return toast.error('Please select an organization');
        setLoading(true);

        const data = new FormData();
        Object.entries(formData).forEach(([key, val]) => {
            if (key === 'market') {
                const arr = val.split(',').map(m => m.trim()).filter(Boolean);
                data.append('market', JSON.stringify(arr));
            } else {
                data.append(key, val);
            }
        });

        const validApprovals = approvals.filter(a => a.authority || a.approvalNumber);
        data.append('approvals', JSON.stringify(validApprovals));
        selectedImages.forEach(img => data.append('images', img));

        try {
            await api.post('/product/create', data, { headers: { 'Content-Type': 'multipart/form-data' } });
            toast.success('Product registered successfully!');
            if (onSuccess) onSuccess();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`${styles.formWrapper} ${isDark ? styles.dark : styles.light}`}>
            <form onSubmit={handleSubmit} className={styles.modernForm}>
                <div className={styles.formHeader}>
                    <h2>Product Registration</h2>
                    <p>Define product details and regulatory parameters.</p>
                </div>

                {/* Basic Info */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Basic Information</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Product Name *</label>
                            <input type="text" name="productName" value={formData.productName} onChange={handleChange} required placeholder="Product Name" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Organization *</label>
                            <select name="company" value={formData.company} onChange={handleChange} required disabled={fetchingOrgs}>
                                <option value="">Select Organization</option>
                                {organizations.map(org => <option key={org._id} value={org._id}>{org.legalName}</option>)}
                            </select>
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Product Code / SKU</label>
                            <input type="text" name="productCode" value={formData.productCode} onChange={handleChange} />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Product Type</label>
                            <select name="productType" value={formData.productType} onChange={handleChange}>
                                <option value="drug">Drug</option>
                                <option value="medical_device">Medical Device</option>
                                <option value="software">Software / SaMD</option>
                                <option value="ai_system">AI System</option>
                                <option value="diagonistic">Diagnostic</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Product Description</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
                    </div>
                </div>

                {/* Regulatory */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Regulatory & Risk</h3>
                    <div className={styles.formGrid}>
                        <div className={styles.inputGroup}>
                            <label>Device Class</label>
                            <input type="text" name="deviceClass" value={formData.deviceClass} onChange={handleChange} placeholder="e.g. Class IIb" />
                        </div>
                        <div className={styles.inputGroup}>
                            <label>Risk Category</label>
                            <select name="riskCategory" value={formData.riskCategory} onChange={handleChange}>
                                <option value="low">Low Risk</option>
                                <option value="medium">Medium Risk</option>
                                <option value="high">High Risk</option>
                                <option value="critical">Critical</option>
                            </select>
                        </div>
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Intended Use</label>
                        <input type="text" name="intendedUse" value={formData.intendedUse} onChange={handleChange} />
                    </div>
                    <div className={styles.inputGroup}>
                        <label>Target Markets (comma separated)</label>
                        <input type="text" name="market" value={formData.market} onChange={handleChange} placeholder="USA, EU, India" />
                    </div>
                </div>

                {/* Approvals */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Regulatory Approvals</h3>
                    <div className={styles.approvalsContainer}>
                        {approvals.map((approval, index) => (
                            <div key={index} className={styles.approvalRow}>
                                <div className={styles.inputGroup}>
                                    <label>Authority</label>
                                    <input type="text" name="authority" value={approval.authority} onChange={(e) => handleApprovalChange(index, e)} placeholder="e.g. FDA" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Number</label>
                                    <input type="text" name="approvalNumber" value={approval.approvalNumber} onChange={(e) => handleApprovalChange(index, e)} placeholder="Approval #" />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Date</label>
                                    <input type="date" name="approvalDate" value={approval.approvalDate} onChange={(e) => handleApprovalChange(index, e)} />
                                </div>
                                {approvals.length > 1 && (
                                    <button type="button" onClick={() => removeApproval(index)} className={styles.removeBtn}>×</button>
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={addApproval} className={styles.addMoreBtn}>+ Add Approval</button>
                    </div>
                </div>

                {/* Images */}
                <div className={styles.formSection}>
                    <h3 className={styles.sectionTitle}>Product Images</h3>
                    <div className={styles.uploadBox}>
                        <input type="file" id="prod-images" multiple accept="image/*" onChange={handleImageChange} className={styles.fileInput} />
                        <label htmlFor="prod-images" className={styles.uploadLabel}>Upload Images (Max 5)</label>
                    </div>
                    <div className={styles.imagePreview}>
                        {selectedImages.map((file, i) => (
                            <div key={i} className={styles.previewThumb}>
                                <img src={URL.createObjectURL(file)} alt="preview" />
                                <button type="button" onClick={() => removeImage(i)}>×</button>
                            </div>
                        ))}
                    </div>
                </div>

                <button type="submit" disabled={loading} className={styles.submitBtn}>
                    {loading ? 'Registering...' : 'Register Product'}
                </button>
            </form>
        </div>
    );
};

export default AddProductForm;
