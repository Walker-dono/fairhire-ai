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

const BiasAudit = () => {
    const [loading, setLoading] = useState(false);
    const [metrics, setMetrics] = useState(null);

    const handleTrain = async () => {
        setLoading(true);
        try {
            const res = await axios.post('/api/train-biased');
            setMetrics(res.data.metrics);
        } catch (err) {
            console.error("Error training model", err);
            alert("Failed to train model. Ensure data is generated first.");
        }
        setLoading(false);
    };

    const chartData = metrics ? {
        labels: ['Unprivileged (Female)', 'Privileged (Male)'],
        datasets: [
            {
                label: 'Selection Rate',
                data: [metrics.unprivileged_selection_rate, metrics.privileged_selection_rate],
                backgroundColor: ['rgba(230, 57, 70, 0.7)', 'rgba(46, 196, 182, 0.7)'],
                borderColor: ['#e63946', '#2ec4b6'],
                borderWidth: 1,
            },
        ],
    } : null;

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: 'white' } },
            title: { display: true, text: 'Hiring Rates by Group', color: 'white' },
        },
        scales: {
            y: { ticks: { color: 'white' }, grid: { color: 'rgba(255,255,255,0.1)' } },
            x: { ticks: { color: 'white' }, grid: { display: false } }
        }
    };

    return (
        <div className="container-fluid">
            <h2 className="text-white mb-4">Bias Audit Engine</h2>

            <div className="row mb-4">
                <div className="col-md-12">
                    <div className="glass-card p-4">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h4 className="text-white">Baseline Biased Model</h4>
                                <p className="text-secondary mb-0">Train a Random Forest Classifier on raw synthetic data to audit fairness.</p>
                            </div>
                            <button className="btn btn-neon" onClick={handleTrain} disabled={loading}>
                                {loading ? 'Training...' : 'Train & Audit Model'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {metrics && (
                <div className="row g-4">
                    <div className="col-md-4">
                        <div className="glass-card p-4 h-100">
                            <h5 className="text-white mb-4">Fairness Metrics</h5>

                            <div className="mb-4">
                                <h6 className="text-secondary">DISPARATE IMPACT (DI)</h6>
                                <div className="d-flex align-items-end">
                                    <h2 className={metrics.disparate_impact < 0.8 ? "text-danger-custom" : "text-success-custom"}>
                                        {metrics.disparate_impact}
                                    </h2>
                                    <span className="ms-2 mb-2 text-muted">/ 1.0</span>
                                </div>
                                <div className="progress" style={{ height: '6px' }}>
                                    <div
                                        className={`progress-bar ${metrics.disparate_impact < 0.8 ? 'bg-danger-custom' : 'bg-success-custom'}`}
                                        style={{ width: `${Math.min(metrics.disparate_impact * 100, 100)}%` }}
                                    ></div>
                                </div>
                                <small className="text-muted d-block mt-1">
                                    {metrics.disparate_impact < 0.8 ? '⚠ DI < 0.8 indicates significant bias' : '✓ Fair outcome'}
                                </small>
                            </div>

                            <div>
                                <h6 className="text-secondary">STATISTICAL PARITY DIFF</h6>
                                <h2 className="text-white">{metrics.statistical_parity_difference}</h2>
                                <small className="text-muted">Target: near 0</small>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-8">
                        <div className="glass-card p-4 h-100">
                            <Bar options={chartOptions} data={chartData} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BiasAudit;
