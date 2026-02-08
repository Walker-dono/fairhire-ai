import pandas as pd
import json
import sys
import os

# Add backend directory to path to import utils
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from utils import generate_data, calculate_metrics, train_and_eval

def run_experiment():
    print("Generating Synthetic Dataset...")
    df = generate_data(n_samples=5000)
    
    # Save Dataset
    df.to_csv('experiment_dataset.csv', index=False)
    print("Saved experiment_dataset.csv")
    
    # Bias Audit
    print("Training Biased Model...")
    biased_metrics = train_and_eval(df, use_weights=False)
    
    # Mitigation
    print("Applying Mitigation...")
    mitigated_metrics = train_and_eval(df, use_weights=True) # Wait, python is Title Case True
    
    results = {
        "dataset_summary": {
            "total_samples": len(df),
            "male_count": int(df['Gender'].sum()),
            "female_count": int(len(df) - df['Gender'].sum())
        },
        "biased_model_metrics": biased_metrics,
        "mitigated_model_metrics": mitigated_metrics
    }
    
    # Save Results
    with open('evaluation_results.json', 'w') as f:
        json.dump(results, f, indent=4)
    print("Saved evaluation_results.json")

if __name__ == "__main__":
    run_experiment()
