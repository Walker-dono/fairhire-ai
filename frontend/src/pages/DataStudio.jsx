import React, { useState } from 'react';
import axios from 'axios';

const DataStudio = () => {
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(null);
    const [previewData, setPreviewData] = useState([]);

    // Check if we have stats in localStorage on mount (optional enhancement)

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/generate');
            setStats(res.data.stats);
            setPreviewData(res.data.preview);
        } catch (err) {
            console.error("Error generating data", err);
            alert("Failed to generate data");
        }
        setLoading(false);
    };

    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="text-white">Data Studio</h2>
                <button
                    className="btn btn-neon"
                    onClick={handleGenerate}
                    disabled={loading}
                >
                    {loading ? <i className="fas fa-spinner fa-spin me-2"></i> : <i className="fas fa-bolt me-2"></i>}
                    Generate Synthetic Data
                </button>
            </div>

            {stats && (
                <div className="row g-4 mb-4">
                    <div className="col-md-3">
                        <div className="glass-card p-3">
                            <h6 className="text-secondary">TOTAL APPLICANTS</h6>
                            <h3 className="text-white">{stats.total_applicants}</h3>
                            <small className="text-success-custom"><i className="fas fa-arrow-up"></i> New Batch</small>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card p-3">
                            <h6 className="text-secondary">MALE (PRIVILEGED)</h6>
                            <h3 className="text-white">{stats.male_applicants}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card p-3">
                            <h6 className="text-secondary">FEMALE (UNPRIVILEGED)</h6>
                            <h3 className="text-white">{stats.female_applicants}</h3>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="glass-card p-3">
                            <h6 className="text-secondary">AVG SCORE GAP (M-F)</h6>
                            <h3 className={stats.avg_score_gap > 0 ? "text-danger-custom" : "text-success-custom"}>
                                {stats.avg_score_gap > 0 ? '+' : ''}{stats.avg_score_gap}
                            </h3>
                            <small className="text-secondary">Points Difference</small>
                        </div>
                    </div>
                </div>
            )}

            {previewData.length > 0 && (
                <div className="glass-card p-4">
                    <h4 className="text-white mb-3">Data Preview (First 10 Rows)</h4>
                    <div className="table-responsive">
                        <table className="table table-dark-custom table-hover">
                            <thead>
                                <tr>
                                    <th>Gender</th>
                                    <th>University Tier</th>
                                    <th>Experience (Yrs)</th>
                                    <th>Interview Score</th>
                                    <th>Hired Outcome</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((row, idx) => (
                                    <tr key={idx} className={row.Gender === 0 ? 'row-female' : 'row-male'}>
                                        <td>{row.Gender === 0 ? <i className="fas fa-venus text-danger-custom"></i> : <i className="fas fa-mars text-success-custom"></i>} {row.Gender === 0 ? 'Female' : 'Male'}</td>
                                        <td>Tier {row.University_Tier}</td>
                                        <td>{row.Years_Experience}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <span className="me-2">{Math.round(row.Interview_Score)}</span>
                                                <div className="progress w-100" style={{ height: '4px' }}>
                                                    <div className="progress-bar bg-primary" style={{ width: `${row.Interview_Score}%` }}></div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {row.Hired === 1 ?
                                                <span className="badge bg-success-custom">Hired</span> :
                                                <span className="badge bg-secondary">Rejected</span>
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DataStudio;
