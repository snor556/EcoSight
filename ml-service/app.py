import os
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

from model.mobilenet_model import load_mobilenet_model
from model.prediction import get_prediction
from utils.preprocessing import prepare_image


app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB limit
ALLOWED_EXTENSIONS = {"jpg", "jpeg", "png", "bmp"}


def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS


# Load model once at startup
# model = load_mobilenet_model()
model = load_mobilenet_model()


@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "ok", "model_loaded": True})


@app.route("/predict", methods=["POST"])
def predict():
    if "file" not in request.files:
        return jsonify({"error": "no file part"}), 400

    file = request.files["file"]

    if file.filename == "":
        return jsonify({"error": "no selected file"}), 400

    if not allowed_file(file.filename):
        return jsonify({"error": f"file type not allowed, allowed: {sorted(ALLOWED_EXTENSIONS)}"}), 400

    try:
        processed_image = prepare_image(file.stream)
        species, confidence = get_prediction(model, processed_image)

        return jsonify({"species": species, "confidence": confidence}), 200

    except Exception as e:
        return jsonify({"error": "invalid image or prediction failed", "details": str(e)}), 400


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
