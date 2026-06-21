import React, { useState, useEffect } from 'react';

const INITIAL_STATE = {
  customerName: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  requirement: '',
  estimatedValue: '',
  stage: 'New',
  priority: 'Medium',
  nextFollowUpDate: '',
  notes: '',
};

export default function OpportunityForm({ opportunity, onSubmit, onClose }) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (opportunity) {
      // Format nextFollowUpDate to YYYY-MM-DD for date input
      let formattedDate = '';
      if (opportunity.nextFollowUpDate) {
        formattedDate = new Date(opportunity.nextFollowUpDate).toISOString().split('T')[0];
      }

      setFormData({
        customerName: opportunity.customerName || '',
        contactName: opportunity.contactName || '',
        contactEmail: opportunity.contactEmail || '',
        contactPhone: opportunity.contactPhone || '',
        requirement: opportunity.requirement || '',
        estimatedValue: opportunity.estimatedValue !== undefined && opportunity.estimatedValue !== null ? opportunity.estimatedValue : '',
        stage: opportunity.stage || 'New',
        priority: opportunity.priority || 'Medium',
        nextFollowUpDate: formattedDate,
        notes: opportunity.notes || '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [opportunity]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.customerName.trim()) {
      newErrors.customerName = 'Customer/Company name is required';
    }
    if (!formData.requirement.trim()) {
      newErrors.requirement = 'Requirement description is required';
    }
    if (formData.estimatedValue !== '' && Number(formData.estimatedValue) < 0) {
      newErrors.estimatedValue = 'Value cannot be negative';
    }
    if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
      newErrors.contactEmail = 'Invalid email format';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const submitData = { ...formData };
      // Parse numerical value
      if (submitData.estimatedValue === '') {
        submitData.estimatedValue = null;
      } else {
        submitData.estimatedValue = Number(submitData.estimatedValue);
      }
      // If date is empty, send null
      if (!submitData.nextFollowUpDate) {
        submitData.nextFollowUpDate = null;
      }

      await onSubmit(submitData);
    } catch (err) {
      console.error('Submission failed', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">
            {opportunity ? 'Edit Opportunity' : 'New Opportunity'}
          </h2>
          <button onClick={onClose} className="modal-close" aria-label="Close">
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Customer / Company Name *</label>
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Acme Corp"
            />
            {errors.customerName && <div className="form-error">{errors.customerName}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Requirement Short Summary *</label>
            <input
              type="text"
              name="requirement"
              value={formData.requirement}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. Cloud migration, 20 licenses"
            />
            {errors.requirement && <div className="form-error">{errors.requirement}</div>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. John Doe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Estimated Deal Value ($)</label>
              <input
                type="number"
                name="estimatedValue"
                value={formData.estimatedValue}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. 5000"
                min="0"
              />
              {errors.estimatedValue && <div className="form-error">{errors.estimatedValue}</div>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Contact Email</label>
              <input
                type="email"
                name="contactEmail"
                value={formData.contactEmail}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. john@acme.com"
              />
              {errors.contactEmail && <div className="form-error">{errors.contactEmail}</div>}
            </div>
            <div className="form-group">
              <label className="form-label">Contact Phone</label>
              <input
                type="text"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g. +1 555 1234"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Stage</label>
              <select
                name="stage"
                value={formData.stage}
                onChange={handleChange}
                className="form-select"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal Sent">Proposal Sent</option>
                <option value="Won">Won</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="form-select"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Next Follow-up Date</label>
            <input
              type="date"
              name="nextFollowUpDate"
              value={formData.nextFollowUpDate}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              placeholder="Add follow-up notes, next actions..."
              rows="3"
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Opportunity'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
