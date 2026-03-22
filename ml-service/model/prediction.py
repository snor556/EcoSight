# from tensorflow.keras.applications.mobilenet_v2 import decode_predictions
from keras.applications.mobilenet_v2 import MobileNetV2
from keras.applications.mobilenet_v2 import preprocess_input, decode_predictions
from utils.labelMap import IMAGENET_TO_COMMON  
#above is imported to give common name 


def get_common_name(imagenet_label):
    # check for exact match first
    if imagenet_label in IMAGENET_TO_COMMON:
        return IMAGENET_TO_COMMON[imagenet_label]
    
    # check if any key contains the label
    for key, value in IMAGENET_TO_COMMON.items():
        if imagenet_label.lower() in key.lower():
            return value
    
    # fallback — return as is
    return imagenet_label


# def get_prediction(model, processed_image):
#     """Run model inference and decode the top ImageNet class."""
#     preds = model.predict(processed_image)
#     decoded = decode_predictions(preds, top=1)[0][0]

#     raw_species = decoded[1]  # human-readable label
#     species = get_common_name(raw_species) #send name and convert it
#     confidence = float(decoded[2] * 100.0)
#     return species, round(confidence, 2)


def get_prediction(model, processed_image):
    """Run model inference and decode the top ImageNet class."""
    try:
        preds = model.predict(processed_image)
        decoded = decode_predictions(preds, top=1)[0][0]

        raw_species = decoded[1]        # raw ImageNet label
        confidence  = float(decoded[2]) * 100.0  # convert to percentage

        species = get_common_name(raw_species)  # translate to common name

        # # ✅ log both so you can debug easily
        # print(f"Raw label   : {raw_species}")
        # print(f"Common name : {species}")
        # print(f"Confidence  : {round(confidence, 2)}%")

        return species, round(confidence, 2)

    except Exception as e:
        print(f"Prediction error: {e}")
        raise e