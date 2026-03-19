from io import BytesIO
from PIL import Image
import numpy as np
# from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from keras.applications.mobilenet_v2 import MobileNetV2
from keras.applications.mobilenet_v2 import preprocess_input, decode_predictions

def prepare_image(file_stream):
    """Convert an uploaded image file stream into MobileNetV2-ready tensor."""
    image = Image.open(BytesIO(file_stream.read()))
    image = image.convert("RGB")
    #image = image.resize((224, 224), Image.ANTIALIAS)
    image = image.resize((224, 224), Image.LANCZOS)

    img_array = np.array(image, dtype=np.float32)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = preprocess_input(img_array)
    return img_array
