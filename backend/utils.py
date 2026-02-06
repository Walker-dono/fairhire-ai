import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score

# ==========================================
# 1. Synthetic Data Generation
# ==========================================
def generate_data(n_samples=1000):
    np.random.seed(42)
    
    # Features
    # Gender: 0 = Female (Unprivileged), 1 = Male (Privileged)
    gender = np.random.choice([0, 1], size=n_samples, p=[0.4, 0.6])
    
    # University Tier: 1, 2, 3 (1 is best)
    uni_tier = np.random.choice([1, 2, 3], size=n_samples, p=[0.2, 0.5, 0.3])
    
    # Years of Experience: 0 to 15
    experience = np.round(np.random.normal(5, 3, size=n_samples)).astype(int)
    experience = np.clip(experience, 0, 15)
    
    # Interview Score (0-100) with injected bias
    # Base score
    score = 60 + (experience * 2) - (uni_tier * 5) + np.random.normal(0, 5, size=n_samples)
    
    # Penalize Females (0) from lower tiers (2, 3)
    # Bias: Subtract 10-15 points
    bias_mask = (gender == 0) & (uni_tier > 1)
    score[bias_mask] -= np.random.uniform(10, 15, size=bias_mask.sum())
    
    score = np.clip(score, 0, 100)
    
    # Target: Hired (0/1) based on a threshold
    # Threshold for hiring
    threshold = 70
    hired = (score > threshold).astype(int)
    
    # Create DataFrame
    df = pd.DataFrame({
        'Gender': gender,
        'University_Tier': uni_tier,
        'Years_Experience': experience,
        'Interview_Score': score,
        'Hired': hired
    })
    
    return df

# ==========================================
# 2. Bias Metrics
# ==========================================
def calculate_metrics(df, pred_col='Hired'):
    # Unprivileged: Gender 0 (Female)
    # Privileged: Gender 1 (Male)
    
    # Selection Rates
    unprovileged_mask = df['Gender'] == 0
    privileged_mask = df['Gender'] == 1
    
    unprivileged_rate = df[unprovileged_mask][pred_col].mean()
    privileged_rate = df[privileged_mask][pred_col].mean()
    
    # Disparate Impact (DI) = Rate(Unpriv) / Rate(Priv)
    # Ideal: 1.0. Fair: > 0.8
    di = unprivileged_rate / privileged_rate if privileged_rate > 0 else 0
    
    # Statistical Parity Difference (SPD) = Rate(Unpriv) - Rate(Priv)
    # Ideal: 0.
    spd = unprivileged_rate - privileged_rate
    
    accuracy = 0
    if 'Hired' in df.columns: # Compare against ground truth if not predicting
         accuracy = accuracy_score(df['Hired'], df[pred_col])

    return {
        'accuracy': round(accuracy, 4),
        'disparate_impact': round(di, 4),
        'statistical_parity_difference': round(spd, 4),
        'unprivileged_selection_rate': round(unprivileged_rate, 4),
        'privileged_selection_rate': round(privileged_rate, 4)
    }

# ==========================================
# 3. Mitigation: Reweighing (Manual)
# ==========================================
def apply_reweighing(df, target_col='Hired'):
    # Calculate sample weights
    # W = (Probability of Group * Probability of Outcome) / (Probability of Group & Outcome)
    
    n = len(df)
    
    # Groups
    priv = df['Gender'] == 1
    unpriv = df['Gender'] == 0
    
    # Outcomes
    pos = df[target_col] == 1
    neg = df[target_col] == 0
    
    # Counts
    n_priv = priv.sum()
    n_unpriv = unpriv.sum()
    n_pos = pos.sum()
    n_neg = neg.sum()
    
    # Expected Probabilities (if independent)
    # P(Priv)
    p_priv = n_priv / n
    p_unpriv = n_unpriv / n
    # P(Pos)
    p_pos = n_pos / n
    p_neg = n_neg / n
    
    # Weights initialization
    weights = np.ones(n)
    
    # Calculate weights for each of the 4 subgroups
    
    # 1. Privileged + Positive
    count_priv_pos = (priv & pos).sum()
    w_priv_pos = (p_priv * p_pos) / (count_priv_pos / n) if count_priv_pos > 0 else 1
    weights[priv & pos] = w_priv_pos
    
    # 2. Privileged + Negative
    count_priv_neg = (priv & neg).sum()
    w_priv_neg = (p_priv * p_neg) / (count_priv_neg / n) if count_priv_neg > 0 else 1
    weights[priv & neg] = w_priv_neg
    
    # 3. Unprivileged + Positive (This should get boosted for Fairness)
    count_unpriv_pos = (unpriv & pos).sum()
    w_unpriv_pos = (p_unpriv * p_pos) / (count_unpriv_pos / n) if count_unpriv_pos > 0 else 1
    weights[unpriv & pos] = w_unpriv_pos

    # 4. Unprivileged + Negative
    count_unpriv_neg = (unpriv & neg).sum()
    w_unpriv_neg = (p_unpriv * p_neg) / (count_unpriv_neg / n) if count_unpriv_neg > 0 else 1
    weights[unpriv & neg] = w_unpriv_neg
    
    return weights

# ==========================================
# 4. Model Training Helper
# ==========================================
def train_and_eval(df, use_weights=False):
    X = df[['Gender', 'University_Tier', 'Years_Experience', 'Interview_Score']]
    y = df['Hired']
    
    weights = None
    if use_weights:
        weights = apply_reweighing(df)
        
    # Split
    X_train, X_test, y_train, y_test, w_train, w_test = train_test_split(
        X, y, weights if use_weights else np.ones(len(X)), test_size=0.2, random_state=42
    )
    
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train, sample_weight=w_train)
    
    preds = clf.predict(X_test)
    
    # Create evaluation dataframe
    eval_df = X_test.copy()
    eval_df['Hired'] = y_test # Actual
    eval_df['Predicted_Hired'] = preds
    
    # Metrics
    metrics = calculate_metrics(eval_df, pred_col='Predicted_Hired')
    
    return metrics
