from flask import Flask, jsonify, request
from retrieve import Retriever
from vectordb import VectorDB
# from pydantic import BaseModel, Field
import os
from flask_cors import CORS


app = Flask(__name__)

# CORS(
#     app,
#     resources={
#         r"/api/*": {"origins": [
#             "http://localhost:3000",
#             "http://130.63.65.112:3000"]}
#     },
# )

CORS(app, resources={r"/api/*": {"origins": "*"}})


UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

retriever = Retriever()
db = VectorDB()


@app.route('/api/getdocuments', methods=['POST'])
def retrieve():
    data = request.get_json()
    question = data.get('question')
    docs = retriever.retrieve(question)
    if docs:
        joined_content = "\n".join([doc.page_content for doc in docs])
        return {"response": joined_content}
    return jsonify({"response": "No documents found"}), 404


@app.route('/api/upload', methods=['POST'])
def vectordb():
    if not request.files:
        return jsonify({'error': 'No files uploaded'}), 400

    uploaded_files = []
    for key, file in request.files.items():
        if file.filename == '':
            continue

        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        uploaded_files.append(file.filename)

    # Create vector database
    db.create_vectordb("uploads")

    if not uploaded_files:
        return jsonify({'error': 'No valid files uploaded'}), 400

    return jsonify({
        'message': 'Files uploaded successfully',
        'files': uploaded_files,
        'count': len(uploaded_files)
    }), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5328)
