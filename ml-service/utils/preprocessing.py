import numpy as np
from PIL import Image
from keras.applications.efficientnet import preprocess_input

def prepare_image(image_stream):
    """Prepare image for EfficientNet B4."""

    # ✅ EfficientNet B4 needs 380x380
    IMAGE_SIZE = (380, 380)

    img       = Image.open(image_stream).convert("RGB")
    img       = img.resize(IMAGE_SIZE)
    img_array = np.array(img, dtype=np.float32)

    # ✅ EfficientNet has its own preprocessing
    img_array = preprocess_input(img_array)

    # add batch dimension → (1, 380, 380, 3)
    img_array = np.expand_dims(img_array, axis=0)

    return img_array