import React from 'react';

const Overview = () => {
    return (
        <div className="container-fluid">
            <h2 className="mb-4 text-white">System Overview</h2>

            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="glass-card p-4">
                        <h4 className="text-white">Audit Status</h4>
                        <div className="d-flex align-items-center mt-3">
                            <i className="fas fa-search pulse text-warning me-3 fa-2x"></i>
                            <div>
                                <h5 className="mb-0 text-muted">Ready to Audit</h5>
                                <p className="text-small text-secondary mb-0">Generate data in Data Studio to begin analysis</p>
                            </div>
                            <div className="ms-auto">
                                <span className="badge bg-secondary p-2">Pending Data</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100 text-center">
                        <i className="fas fa-users fa-3x text-primary mb-3"></i>
                        <h5 className="text-white">1. Generate Data</h5>
                        <p className="text-secondary">Create synthetic applicant profiles with embedded bias patterns.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100 text-center">
                        <i className="fas fa-robot fa-3x text-danger-custom mb-3"></i>
                        <h5 className="text-white">2. Detect Bias</h5>
                        <p className="text-secondary">Train specific AI models and measure Disparate Impact.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="glass-card p-4 h-100 text-center">
                        <i className="fas fa-scale-balanced fa-3x text-success-custom mb-3"></i>
                        <h5 className="text-white">3. Mitigate</h5>
                        <p className="text-secondary">Apply reweighing algorithms to ensure fair hiring outcomes.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;
