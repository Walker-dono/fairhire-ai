import React, { useState } from 'react';
import axios from 'axios';

const Report = () => {
    const [report, setReport] = useState(null);

    const generateReport = async () => {
        try {
            const res = await axios.get('/api/report');
            setReport(res.data.report);
        } catch (err) {
            console.error("Error fetching report", err);
            alert("Failed to generate report.");
        }
    };

    const downloadTxt = () => {
        if (!report) return;
        const element = document.createElement("a");
        const file = new Blob([report], { type: 'text/plain' });
        element.href = URL.createObjectURL(file);
        element.download = "fairhire_audit_report.txt";
        document.body.appendChild(element); // Required for this to work in FireFox
        element.click();
    };

    return (
        <div className="container-fluid">
            <h2 className="text-white mb-4">Export Audit Report</h2>

            <div className="glass-card p-5 text-center">
                <i className="fas fa-file-alt fa-4x text-light mb-4"></i>
                <h4 className="text-white">Generate Comprehensive Audit Log</h4>
                <p className="text-secondary mb-4">Download a summary of the bias metrics, before and after mitigation, for compliance records.</p>

                <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-neon px-4" onClick={generateReport}>
                        <i className="fas fa-eye me-2"></i> Preview Report
                    </button>
                    {report && (
                        <>
                            <button className="btn btn-outline-light px-4" onClick={downloadTxt}>
                                <i className="fas fa-download me-2"></i> Download TXT
                            </button>
                            <a href="/api/download/results" className="btn btn-outline-info px-4" target="_blank" download>
                                <i className="fas fa-file-code me-2"></i> Download JSON
                            </a>
                        </>
                    )}
                </div>

                {report && (
                    <div className="mt-5 text-start bg-dark p-3 rounded border border-secondary">
                        <pre className="text-light mb-0" style={{ whiteSpace: 'pre-wrap' }}>{report}</pre>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Report;
