from flask import Flask, send_from_directory
from flask_cors import CORS
from auth import auth_bp
from api import api_bp

app = Flask(__name__, static_folder='../frontend/dist', static_url_path='/')
CORS(app) # Enable CORS for all routes

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(api_bp, url_prefix='/api')


@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    # send_from_directory is secure and will not allow access to files outside of static_folder
    try:
        return send_from_directory(app.static_folder, path)
    except:
         # Fallback to index.html for React Router
        return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5000)
