from flask import Blueprint, request, jsonify
import jwt
import datetime

auth_bp = Blueprint('auth', __name__)

# Secret key for JWT (Hardcoded for demo, normally env var)
SECRET_KEY = "fairhire_super_secret_key"

# In-memory user store (Demo only)
users = {}

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
        
    if username in users:
        return jsonify({'error': 'User already exists'}), 400
        
    users[username] = password
    return jsonify({'message': 'User registered successfully'}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Username and password required'}), 400
        
    if users.get(username) != password:
        return jsonify({'error': 'Invalid credentials'}), 401
        
    token = jwt.encode({
        'user': username,
        'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    
    return jsonify({'token': token, 'username': username}), 200

@auth_bp.route('/logout', methods=['POST'])
def logout():
    return jsonify({'message': 'Logged out successfully'}), 200
