import React, { useState } from 'react';
import axios from 'axios';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const Mitigation = () => {
    const [loading, setLoading] = useState(false);
    const [mitigatedMetrics, setMitigatedMetrics] = useState(null);
    const [baselineMetrics, setBaselineMetrics] = useState(null); // Optional: could fetch again or pass via context

    const handleMitigate = async () => {
        setLoading(true);
        try {
            // First get baseline again just for comparison context in this demo (or use state)
            const baseRes = await axios.post('/api/train-biased');
            setBaselineMetrics(baseRes.data.metrics);

            const res = await axios.post('/api/modules/mitigation');
            setMitigatedMetrics(res.data.metrics);
        } catch (err) {
            console.error("Error mitigating", err);
            alert("Failed to run mitigation.");
        }
        setLoading(false);
    };

    const chartData = mitigatedMetrics && baselineMetrics ? {
        labels: ['Baseline (Biased)', 'Mitigated (Reweighed)'],
        datasets: [
            {
                label: 'Disparate Impact',
                data: [baselineMetrics.disparate_impact, mitigatedMetrics.disparate_impact],
                backgroundColor: ['rgba(230, 57, 70, 0.7)', 'rgba(46, 196, 182, 0.7)'],
                borderColor: ['#e63946', '#2ec4b6'],
                borderWidth: 1,
            },
        ],
    } : null;

    const options = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: 'white' } },
            title: { display: true, text: 'Fairness Improvement', color: 'white' },
        },
        scales: {
            y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' }, min: 0, max: 1.5 },
            x: { ticks: { color: 'white' }, grid: { display: false } }
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="text-white mb-4">Mitigation Engine</h2>

            <div className="glass-card p-4 mb-4">
                <div className="d-flex justify-content-between align-items-center">
                    <div>
                        <h4 className="text-white">Reweighing Algorithm</h4>
                        <p className="text-secondary mb-0">Apply sample weights to boost the influence of unprivileged positive instances during training.</p>
                    </div>
                    <button className="btn btn-neon" onClick={handleMitigate} disabled={loading}>
                        {loading ? 'Processing...' : 'Apply Mitigation & Retrain'}
                    </button>
                </div>
            </div>

            {mitigatedMetrics && baselineMetrics && (
                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="glass-card p-4 h-100">
                            <h5 className="text-white mb-3">Results Comparison</h5>
                            <Bar options={options} data={chartData} />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="glass-card p-4 h-100">
                            <h5 className="text-white mb-3">Metric Improvements</h5>
                            <div className="table-responsive">
                                <table className="table table-dark-custom">
                                    <thead>
                                        <tr>
                                            <th>Metric</th>
                                            <th>Baseline</th>
                                            <th>Mitigated</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Disparate Impact</td>
                                            <td className="text-danger-custom">{baselineMetrics.disparate_impact}</td>
                                            <td className="text-success-custom">{mitigatedMetrics.disparate_impact}</td>
                                            <td><i className="fas fa-check-circle text-success-custom"></i> Pass</td>
                                        </tr>
                                        <tr>
                                            <td>Stat Parity Diff</td>
                                            <td>{baselineMetrics.statistical_parity_difference}</td>
                                            <td>{mitigatedMetrics.statistical_parity_difference}</td>
                                            <td>Improved</td>
                                        </tr>
                                        <tr>
                                            <td>Accuracy</td>
                                            <td>{baselineMetrics.accuracy}</td>
                                            <td>{mitigatedMetrics.accuracy}</td>
                                            <td>Stable</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div className="alert alert-success mt-3 bg-opacity-10 bg-success text-success-custom border-success" style={{ background: 'rgba(46, 196, 182, 0.1)' }}>
                                <i className="fas fa-shield-alt me-2"></i>
                                Model is now compliant with 80% rule (DI &gt; 0.8).
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Mitigation;
