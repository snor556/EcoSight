# model/mobilenet_model.py
from keras.applications.efficientnet import EfficientNetB4

def load_mobilenet_model():
    """Load EfficientNetB4 — drop-in replacement for MobileNet."""
    print("Loading EfficientNet B4 model...")
    model = EfficientNetB4(weights='imagenet')
    print("EfficientNet B4 loaded successfully!")
    return model