from tensorflow.keras.applications import MobileNetV2


def load_mobilenet_model():
    """Load MobileNetV2 once at server start to keep inference fast."""
    model = MobileNetV2(weights="imagenet")
    return model
