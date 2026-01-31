import { useState } from 'react';

interface CreditInput {
    latePayment: boolean;
    newAccount: boolean;
    utilizationChange: number;
    hardInquiry: boolean;
}

const CREDIT_TIPS: string[] = [
    'Payment history is the most important credit factor (~35%)',
    'Keep credit utilization below 30% for best results',
    'Hard inquiries typically affect scores for 12 months',
    'New accounts may temporarily lower your average age of credit'
];

function App() {
    const [values, setValues] = useState<CreditInput>({ latePayment: false, newAccount: false, utilizationChange: 0, hardInquiry: false });
    const handleChange = (field: keyof CreditInput, value: boolean | number) => setValues(prev => ({ ...prev, [field]: value }));

    // Calculate impact score
    let totalImpact = 0;
    const factors: { action: string; impact: string; weight: string; color: string }[] = [];

    // Late payment - major negative impact
    if (values.latePayment) {
        totalImpact -= 80;
        factors.push({ action: 'Late Payment (30+ days)', impact: 'Decrease', weight: 'High', color: '#DC2626' });
    }

    // New account - minor negative short-term
    if (values.newAccount) {
        totalImpact -= 15;
        factors.push({ action: 'New Credit Account', impact: 'Slight Decrease', weight: 'Low', color: '#D97706' });
    }

    // Hard inquiry - minor negative
    if (values.hardInquiry) {
        totalImpact -= 10;
        factors.push({ action: 'Hard Inquiry', impact: 'Slight Decrease', weight: 'Low', color: '#D97706' });
    }

    // Utilization change
    if (values.utilizationChange !== 0) {
        if (values.utilizationChange > 20) {
            totalImpact -= 40;
            factors.push({ action: `Utilization +${values.utilizationChange}%`, impact: 'Decrease', weight: 'Medium', color: '#DC2626' });
        } else if (values.utilizationChange > 0) {
            totalImpact -= 15;
            factors.push({ action: `Utilization +${values.utilizationChange}%`, impact: 'Slight Decrease', weight: 'Low', color: '#D97706' });
        } else if (values.utilizationChange < -20) {
            totalImpact += 30;
            factors.push({ action: `Utilization ${values.utilizationChange}%`, impact: 'Increase', weight: 'Medium', color: '#16A34A' });
        } else if (values.utilizationChange < 0) {
            totalImpact += 15;
            factors.push({ action: `Utilization ${values.utilizationChange}%`, impact: 'Slight Increase', weight: 'Low', color: '#16A34A' });
        }
    }

    // Determine overall impact
    let impactLabel = 'Neutral';
    let impactColor = '#64748B';
    let riskLevel = 'Low';
    let riskColor = '#16A34A';

    if (totalImpact <= -50) {
        impactLabel = 'Significant Decrease';
        impactColor = '#DC2626';
        riskLevel = 'High';
        riskColor = '#DC2626';
    } else if (totalImpact <= -20) {
        impactLabel = 'Moderate Decrease';
        impactColor = '#D97706';
        riskLevel = 'Medium';
        riskColor = '#D97706';
    } else if (totalImpact < 0) {
        impactLabel = 'Slight Decrease';
        impactColor = '#D97706';
        riskLevel = 'Low';
        riskColor = '#16A34A';
    } else if (totalImpact >= 20) {
        impactLabel = 'Moderate Increase';
        impactColor = '#16A34A';
        riskLevel = 'Low';
        riskColor = '#16A34A';
    } else if (totalImpact > 0) {
        impactLabel = 'Slight Increase';
        impactColor = '#16A34A';
        riskLevel = 'Low';
        riskColor = '#16A34A';
    }

    if (factors.length === 0) {
        factors.push({ action: 'No actions selected', impact: 'Neutral', weight: 'None', color: '#64748B' });
    }

    return (
        <main style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
            <header style={{ textAlign: 'center', marginBottom: 'var(--space-2)' }}>
                <h1 style={{ marginBottom: 'var(--space-2)' }}>Credit Score Impact Estimator (2026)</h1>
                <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>Understand how actions may affect your credit</p>
            </header>

            <div className="card">
                <div style={{ display: 'grid', gap: 'var(--space-4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                        <input id="latePayment" type="checkbox" checked={values.latePayment} onChange={(e) => handleChange('latePayment', e.target.checked)} />
                        <label htmlFor="latePayment" style={{ margin: 0, cursor: 'pointer', flex: 1 }}>
                            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Late Payment (30+ days)</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Major negative impact on payment history</span>
                        </label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                        <input id="newAccount" type="checkbox" checked={values.newAccount} onChange={(e) => handleChange('newAccount', e.target.checked)} />
                        <label htmlFor="newAccount" style={{ margin: 0, cursor: 'pointer', flex: 1 }}>
                            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Opening New Credit Account</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Affects average age of accounts</span>
                        </label>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3)', backgroundColor: '#F8FAFC', borderRadius: 'var(--radius-md)' }}>
                        <input id="hardInquiry" type="checkbox" checked={values.hardInquiry} onChange={(e) => handleChange('hardInquiry', e.target.checked)} />
                        <label htmlFor="hardInquiry" style={{ margin: 0, cursor: 'pointer', flex: 1 }}>
                            <span style={{ fontWeight: 500, color: 'var(--color-text-primary)' }}>Hard Credit Inquiry</span>
                            <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>Applying for new credit</span>
                        </label>
                    </div>
                    <div>
                        <label htmlFor="utilizationChange">Credit Utilization Change (%)</label>
                        <input id="utilizationChange" type="number" min="-100" max="100" step="5" value={values.utilizationChange || ''} onChange={(e) => handleChange('utilizationChange', parseInt(e.target.value) || 0)} placeholder="0" />
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-1)' }}>Negative = decreased utilization (good), Positive = increased (risky)</div>
                    </div>
                    <button className="btn-primary" type="button">Estimate Impact</button>
                </div>
            </div>

            <div className="card results-panel">
                <div className="text-center">
                    <h2 className="result-label" style={{ marginBottom: 'var(--space-2)' }}>Estimated Credit Impact</h2>
                    <div className="result-hero" style={{ color: impactColor, fontSize: '2rem' }}>{impactLabel}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Based on selected actions</div>
                </div>
                <hr className="result-divider" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', textAlign: 'center' }}>
                    <div>
                        <div className="result-label">Risk Level</div>
                        <div className="result-value" style={{ color: riskColor }}>{riskLevel}</div>
                    </div>
                    <div style={{ borderLeft: '1px solid #BAE6FD', paddingLeft: 'var(--space-4)' }}>
                        <div className="result-label">Factors Affecting</div>
                        <div className="result-value">{factors.length}</div>
                    </div>
                </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--color-primary)' }}>
                <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)' }}>Credit Score Factors</h3>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'grid', gap: 'var(--space-3)' }}>
                    {CREDIT_TIPS.map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', fontSize: '0.9375rem', color: 'var(--color-text-secondary)' }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'var(--color-primary)', flexShrink: 0 }} />{item}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="ad-container"><span>Advertisement</span></div>

            <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: 'var(--space-4) var(--space-6)', borderBottom: '1px solid var(--color-border)' }}>
                    <h3 style={{ fontSize: '1rem' }}>Impact Breakdown</h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9375rem' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                            <th style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'left', color: 'var(--color-text-secondary)' }}>Action</th>
                            <th style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Impact</th>
                            <th style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', color: 'var(--color-text-secondary)' }}>Weight</th>
                        </tr>
                    </thead>
                    <tbody>
                        {factors.map((row, i) => (
                            <tr key={i} style={{ borderBottom: i === factors.length - 1 ? 'none' : '1px solid var(--color-border)', backgroundColor: i % 2 ? '#F8FAFC' : 'transparent' }}>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', color: 'var(--color-text-secondary)' }}>{row.action}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-4)', textAlign: 'center', fontWeight: 600, color: row.color }}>{row.impact}</td>
                                <td style={{ padding: 'var(--space-3) var(--space-6)', textAlign: 'right', fontWeight: 500 }}>{row.weight}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div style={{ maxWidth: 600, margin: '0 auto', fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
                <p>This calculator provides educational estimates of how common credit actions may affect your credit score. Actual impacts vary based on your full credit profile, scoring model used, and other factors. The figures shown are estimates only and do not constitute credit advice. Credit scoring is complex and individualized. Consult a financial advisor or credit counselor for personalized guidance.</p>
            </div>

            <footer style={{ textAlign: 'center', padding: 'var(--space-8) var(--space-4)', color: 'var(--color-text-muted)', borderTop: '1px solid var(--color-border)', marginTop: 'var(--space-8)' }}>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 'var(--space-4)', fontSize: '0.875rem' }}>
                    <li>• Estimates only</li><li>• Not credit advice</li><li>• Free to use</li>
                </ul>
                <p style={{ marginTop: 'var(--space-4)', fontSize: '0.75rem' }}>&copy; 2026 Credit Impact Estimator</p>
            </footer>

            <div className="ad-container ad-sticky"><span>Advertisement</span></div>
        </main>
    );
}

export default App;
