from flask import Blueprint, jsonify, request
import pandas as pd
from utils import generate_data, calculate_metrics, train_and_eval
import io

api_bp = Blueprint('api', __name__)

# In-memory storage for the current session data (Demo simplified)
current_data = None

@api_bp.route('/generate', methods=['POST'])
def generate():
    global current_data
    df = generate_data(n_samples=1000)
    current_data = df
    
    # Stats for dashboard
    total = len(df)
    male = len(df[df['Gender'] == 1])
    female = len(df[df['Gender'] == 0])
    
    avg_score_m = df[df['Gender'] == 1]['Interview_Score'].mean()
    avg_score_f = df[df['Gender'] == 0]['Interview_Score'].mean()
    gap = avg_score_m - avg_score_f
    
    preview = df.head(10).to_dict(orient='records')
    
    return jsonify({
        'message': 'Data generated successfully',
        'stats': {
            'total_applicants': total,
            'male_applicants': male,
            'female_applicants': female,
            'avg_score_gap': round(gap, 2)
        },
        'preview': preview
    })

@api_bp.route('/data-preview', methods=['GET'])
def get_data_preview():
    global current_data
    if current_data is None:
        return jsonify({'error': 'No data generated'}), 404
        
    # Return first 50 rows for table
    return jsonify(current_data.head(50).to_dict(orient='records'))

@api_bp.route('/train-biased', methods=['POST'])
def train_biased():
    global current_data
    if current_data is None:
        return jsonify({'error': 'No data generated'}), 400
        
    metrics = train_and_eval(current_data, use_weights=False)
    return jsonify({'metrics': metrics, 'status': 'Biased Model Trained'})

@api_bp.route('/modules/mitigation', methods=['POST']) 
def mitigate():
    global current_data
    if current_data is None:
        return jsonify({'error': 'No data generated'}), 400
        
    metrics = train_and_eval(current_data, use_weights=True)
    return jsonify({'metrics': metrics, 'status': 'Mitigated Model Trained (Reweighing Applied)'})

@api_bp.route('/report', methods=['GET'])
def export_report():
    # Simple text report
    return jsonify({
        'report': "FairHire AI Audit Report\n\nMetric Summary: ... (Download PDF future feature)"
    })
