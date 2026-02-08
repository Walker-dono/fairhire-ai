from flask import Blueprint, jsonify, request, send_file
import pandas as pd
from utils import generate_data, calculate_metrics, train_and_eval
import io
import os

api_bp = Blueprint('api', __name__)

# Constants for file paths (assuming they are in the root directory, one level up from backend)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATASET_PATH = os.path.join(BASE_DIR, 'experiment_dataset.csv')
RESULTS_PATH = os.path.join(BASE_DIR, 'evaluation_results.json')

# In-memory storage for the current session data (Demo simplified)
current_data = None

import json

# Helper to update results JSON
def update_json_results(new_data):
    if os.path.exists(RESULTS_PATH):
        with open(RESULTS_PATH, 'r') as f:
            try:
                data = json.load(f)
            except:
                data = {}
    else:
        data = {}
    
    # Deep merge for dataset_summary if needed, or just top-level update
    # Simple top-level update is sufficient for now based on structure
    data.update(new_data)
    
    with open(RESULTS_PATH, 'w') as f:
        json.dump(data, f, indent=4)

@api_bp.route('/generate', methods=['POST'])
def generate():
    global current_data
    df = generate_data(n_samples=1000)
    current_data = df
    
    # Save to disk for download
    try:
        df.to_csv(DATASET_PATH, index=False)
        
        # Update summary in results
        summary = {
            "dataset_summary": {
                "total_samples": len(df),
                "male_count": int(df['Gender'].sum()),
                "female_count": int(len(df) - df['Gender'].sum())
            }
        }
        update_json_results(summary)
    except Exception as e:
        print(f"Error saving data: {e}")
    
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
        # Try to load from disk if fresh start
        if os.path.exists(DATASET_PATH):
            current_data = pd.read_csv(DATASET_PATH)
        else:
            return jsonify({'error': 'No data generated'}), 404
        
    # Return first 50 rows for table
    return jsonify(current_data.head(50).to_dict(orient='records'))

@api_bp.route('/train-biased', methods=['POST'])
def train_biased():
    global current_data
    if current_data is None:
        # Try load
        if os.path.exists(DATASET_PATH):
            current_data = pd.read_csv(DATASET_PATH)
        else:
            return jsonify({'error': 'No data generated'}), 400
        
    metrics = train_and_eval(current_data, use_weights=False)
    
    # Save metrics
    update_json_results({"biased_model_metrics": metrics})
    
    return jsonify({'metrics': metrics, 'status': 'Biased Model Trained'})

@api_bp.route('/modules/mitigation', methods=['POST']) 
def mitigate():
    global current_data
    if current_data is None:
        if os.path.exists(DATASET_PATH):
            current_data = pd.read_csv(DATASET_PATH)
        else:
            return jsonify({'error': 'No data generated'}), 400
        
    metrics = train_and_eval(current_data, use_weights=True)
    
    # Save metrics
    update_json_results({"mitigated_model_metrics": metrics})
    
    return jsonify({'metrics': metrics, 'status': 'Mitigated Model Trained (Reweighing Applied)'})

@api_bp.route('/report', methods=['GET'])
def export_report():
    # Simple text report
    return jsonify({
        'report': "FairHire AI Audit Report\n\nMetric Summary: ... (Download PDF future feature)"
    })

@api_bp.route('/download/dataset', methods=['GET'])
def download_dataset():
    if not os.path.exists(DATASET_PATH):
        return jsonify({'error': 'Dataset not found. Please generate data first.'}), 404
    return send_file(DATASET_PATH, as_attachment=True, download_name='experiment_dataset.csv')

@api_bp.route('/download/results', methods=['GET'])
def download_results():
    if not os.path.exists(RESULTS_PATH):
        return jsonify({'error': 'Results not found. Please run evaluation first.'}), 404
    return send_file(RESULTS_PATH, as_attachment=True, download_name='evaluation_results.json')
