import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

export default function OpportunityCard({ opportunity, onEdit, onDelete }) {
  const isOwner = opportunity.isOwner;

  const formatCurrency = (val) => {
    if (val === undefined || val === null || val === '') return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Convert Stage to badge className
  const getStageBadgeClass = (stage) => {
    const s = (stage || '').toLowerCase().replace(' ', '-');
    return `badge badge-stage-${s}`;
  };

  // Convert Priority to badge className
  const getPriorityBadgeClass = (priority) => {
    const p = (priority || '').toLowerCase();
    return `badge badge-priority-${p}`;
  };

  return (
    <div className="opp-card">
      <div>
        <div className="opp-card-header">
          <span className="opp-customer">{opportunity.customerName}</span>
          {isOwner && <span className="opp-owner-badge">My Deal</span>}
        </div>

        <p className="opp-requirement" title={opportunity.requirement}>
          {opportunity.requirement}
        </p>

        <div className="opp-meta-row">
          <span className="opp-value">{formatCurrency(opportunity.estimatedValue)}</span>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span className={getStageBadgeClass(opportunity.stage)}>{opportunity.stage}</span>
            <span className={getPriorityBadgeClass(opportunity.priority)}>{opportunity.priority}</span>
          </div>
        </div>

        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
          <div>
            <strong>Next Follow-up: </strong> 
            {opportunity.nextFollowUpDate ? formatDate(opportunity.nextFollowUpDate) : 'Not Scheduled'}
          </div>
          {opportunity.notes && (
            <div style={{ marginTop: '8px', color: 'var(--text-muted)', fontSize: '12px', fontStyle: 'italic' }}>
              "{opportunity.notes}"
            </div>
          )}
        </div>
      </div>

      <div className="opp-footer">
        <div className="opp-details">
          <div>By: {opportunity.owner?.name || 'Unknown'}</div>
          <div>Created: {formatDate(opportunity.createdAt)}</div>
        </div>

        {isOwner && (
          <div className="opp-actions">
            <button
              onClick={() => onEdit(opportunity)}
              className="opp-action-btn edit-btn"
              title="Edit Opportunity"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete(opportunity._id)}
              className="opp-action-btn delete-btn"
              title="Delete Opportunity"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
