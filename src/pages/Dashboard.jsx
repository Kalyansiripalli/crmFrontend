import React, { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import Navbar from '../components/Navbar';
import OpportunityCard from '../components/OpportunityCard';
import OpportunityForm from '../components/OpportunityForm';

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search and Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modal form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);

  // Fetch opportunities
  const fetchOpportunities = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/api/opportunities');
      setOpportunities(data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not retrieve opportunities. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // CRUD handlers
  const handleFormSubmit = async (formData) => {
    try {
      if (editingOpportunity) {
        // Update opportunity
        await api.put(`/api/opportunities/${editingOpportunity._id}`, formData);
      } else {
        // Create opportunity
        await api.post('/api/opportunities', formData);
      }
      setIsModalOpen(false);
      setEditingOpportunity(null);
      fetchOpportunities();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save opportunity.';
      alert(msg); // Fallback error alert for forms
      throw new Error(msg);
    }
  };

  const handleEditClick = (opportunity) => {
    setEditingOpportunity(opportunity);
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id) => {
    if (!window.confirm('Are you sure you want to delete this opportunity?')) return;
    
    try {
      await api.delete(`/api/opportunities/${id}`);
      fetchOpportunities();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete opportunity.');
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingOpportunity(null);
  };

  // Metrics Calculations
  const metrics = opportunities.reduce(
    (acc, opp) => {
      const val = opp.estimatedValue || 0;
      acc.totalValue += val;
      acc.totalCount += 1;
      
      if (opp.stage === 'Won') {
        acc.wonValue += val;
      }
      if (opp.priority === 'High') {
        acc.highPriorityCount += 1;
      }
      return acc;
    },
    { totalValue: 0, totalCount: 0, wonValue: 0, highPriorityCount: 0 }
  );

  // Filtered Opportunities List
  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      opp.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.requirement?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStage = stageFilter === '' || opp.stage === stageFilter;
    const matchesPriority = priorityFilter === '' || opp.priority === priorityFilter;

    return matchesSearch && matchesStage && matchesPriority;
  });

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div>
      <Navbar />
      
      <div className="dashboard-container">
        {/* Error Notification */}
        {error && (
          <div className="alert-banner">
            <span>{error}</span>
            <button className="alert-close" onClick={() => setError('')}>
              &times;
            </button>
          </div>
        )}

        {/* Metrics Bar */}
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Pipeline Value</div>
            <div className="metric-value">{formatCurrency(metrics.totalValue)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Active Deals</div>
            <div className="metric-value">{metrics.totalCount}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Won Revenue</div>
            <div className="metric-value">{formatCurrency(metrics.wonValue)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">High Priority</div>
            <div className="metric-value">{metrics.highPriorityCount}</div>
          </div>
        </div>

        {/* Search and Filters Toolbar */}
        <div className="toolbar">
          <div className="search-filter-group">
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search by customer or requirement..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
              />
            </div>
            
            <select
              value={stageFilter}
              onChange={(e) => setStageFilter(e.target.value)}
              className="form-select filter-select"
            >
              <option value="">All Stages</option>
              <option value="New">New</option>
              <option value="Contacted">Contacted</option>
              <option value="Qualified">Qualified</option>
              <option value="Proposal Sent">Proposal Sent</option>
              <option value="Won">Won</option>
              <option value="Lost">Lost</option>
            </select>

            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="form-select filter-select"
            >
              <option value="">All Priorities</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-primary"
          >
            + New Opportunity
          </button>
        </div>

        {/* Pipeline display */}
        {loading ? (
          <div className="loading-wrapper">
            <div className="spinner"></div>
          </div>
        ) : filteredOpportunities.length > 0 ? (
          <div className="opportunities-grid">
            {filteredOpportunities.map((opp) => (
              <OpportunityCard
                key={opp._id}
                opportunity={opp}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-state-title">No opportunities found</div>
            <p className="empty-state-subtitle">
              {opportunities.length === 0
                ? "Get started by adding your first customer opportunity deal."
                : "Try adjusting your search criteria or select different filter combinations."}
            </p>
            {opportunities.length === 0 && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="btn btn-primary btn-sm"
              >
                Create Opportunity
              </button>
            )}
          </div>
        )}
      </div>

      {/* Opportunity Form Modal */}
      {isModalOpen && (
        <OpportunityForm
          opportunity={editingOpportunity}
          onSubmit={handleFormSubmit}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
