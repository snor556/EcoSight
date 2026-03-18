from tensorflow.keras.applications.mobilenet_v2 import decode_predictions


def get_prediction(model, processed_image):
    """Run model inference and decode the top ImageNet class."""
    preds = model.predict(processed_image)
    decoded = decode_predictions(preds, top=1)[0][0]

    species = decoded[1]  # human-readable label
    confidence = float(decoded[2] * 100.0)
    return species, round(confidence, 2)
