import { useState, useEffect } from 'react'

export default function HospitalPortal() {
  const [requestText, setRequestText] = useState('')
  const [loading, setLoading] = useState(false)
  const [activeRequests, setActiveRequests] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const res = await fetch('http://localhost:8000/requests/active')
      const data = await res.json()
      if (res.ok) setActiveRequests(data)
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!requestText.trim()) return

    setLoading(true)
    setError(null)
    try {
      const response = await fetch('http://localhost:8000/process-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: requestText }),
      })

      if (!response.ok) throw new Error('AI Processing Failed')
      
      setRequestText('')
      fetchRequests() 
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="dash-header">
        <h1>Hospital Workspace</h1>
        <p>Post emergencies and track active blood requests.</p>
      </div>

      <div className="metrics-ribbon">
        <div className="metric-card">
          <span className="metric-title">Active Requests</span>
          <span className="metric-value">{activeRequests.length}</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Network Status</span>
          <span className="metric-value" style={{color: 'var(--accent-primary)'}}>Healthy</span>
        </div>
        <div className="metric-card">
          <span className="metric-title">Available Donors (Live)</span>
          <span className="metric-value">142</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="request-form">
        <h3>Create New AI-Routed Request</h3>
        <textarea 
          value={requestText}
          onChange={(e) => setRequestText(e.target.value)}
          placeholder="Describe the emergency. e.g. 'Patient in Chennai needs 2 units of O+ blood urgently for a rapid surgery.'"
        />
        {error && <p style={{color: 'var(--accent-red)'}}>{error}</p>}
        <button type="submit" className="btn-primary" style={{alignSelf: 'flex-start'}} disabled={loading}>
          {loading ? 'Processing via Gemini AI...' : 'Submit Emergency Request'}
        </button>
      </form>

      <div className="table-container">
        <div className="table-header">
          <h3>Active Emergency Requests</h3>
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Location</th>
              <th>Blood Needed</th>
              <th>Urgency Extraction</th>
              <th>AI Action Prediction</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {activeRequests.map((req, i) => (
              <tr key={i}>
                <td style={{color: 'var(--text-secondary)', fontFamily: 'monospace'}}>#{req._id ? req._id.substring(0,6).toUpperCase() : 'SYS'}</td>
                <td>{req.extracted_info?.city || 'Unknown'}</td>
                <td><strong>{req.extracted_info?.units_needed} Units</strong> of <strong>{req.extracted_info?.blood_group}</strong></td>
                <td>
                  <span className={`badge ${req.extracted_info?.urgency_level?.toLowerCase() === 'high' ? 'badge-danger' : 'badge-warning'}`}>
                    {req.extracted_info?.urgency_level || 'Medium'}
                  </span>
                </td>
                <td>
                  <span className={`badge ${req.ai_prediction === 1 ? 'badge-success' : 'badge-danger'}`}>
                    {req.prediction_message}
                  </span>
                </td>
                <td><button className="btn-primary" style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}>Manage</button></td>
              </tr>
            ))}
            {activeRequests.length === 0 && (
              <tr>
                <td colSpan="6" style={{textAlign: 'center', color: 'var(--text-secondary)'}}>No active requests currently found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
