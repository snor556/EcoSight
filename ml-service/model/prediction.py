from keras.applications.efficientnet import decode_predictions
from utils.labelMap import IMAGENET_TO_COMMON

MARINE_SPECIES = [
    "shark", "ray", "fish", "tuna", "salmon", "eel",
    "stingray", "whale", "dolphin", "seal", "crab",
    "lobster", "jellyfish", "walrus", "otter"
]

def get_common_name(imagenet_label):
    # 1. Remove those underscores for Wikipedia! (tiger_cat -> tiger cat)
    clean_label = imagenet_label.replace('_', ' ')
    
    # 2. Check exact match first
    if clean_label in IMAGENET_TO_COMMON:
        return IMAGENET_TO_COMMON[clean_label]
        
    # 3. Smarter substring match (prevents "tiger" matching "tiger shark")
    for key, value in IMAGENET_TO_COMMON.items():
        # Split the ImageNet string by commas to check exact animal names
        possible_names = [name.strip().lower() for name in key.split(',')]
        if clean_label.lower() in possible_names:
            return value
            
    # 4. Fallback — return the clean label capitalized (e.g. "Tiger Cat")
    return clean_label.title()

def is_marine(label):
    return any(marine in label.lower() for marine in MARINE_SPECIES)

def get_prediction(model, processed_image):
    """Run EfficientNet B4 inference with top 3 predictions."""
    try:
        preds   = model.predict(processed_image)

        # ✅ get top 3 predictions
        decoded = decode_predictions(preds, top=3)[0]

        print("\n--- Top 3 Predictions ---")
        for i, (id, label, score) in enumerate(decoded):
            print(f"{i+1}. {label} → {round(score * 100, 2)}%")
        print("-------------------------\n")

        # ✅ pick best non-marine result
        best = None
        for (id, label, score) in decoded:
            common = get_common_name(label)
            if is_marine(common.lower()):
                print(f"Skipping marine: {common}")
                continue
            best = (label, common, float(score) * 100)
            break

        # fallback if all are marine
        if not best:
            id, label, score = decoded[0]
            best = (label, get_common_name(label), float(score) * 100)

        raw_label, species, confidence = best

        print(f"Final prediction : {species}")
        print(f"Confidence       : {round(confidence, 2)}%")

        return species, round(confidence, 2)

    except Exception as e:
        print(f"Prediction error: {e}")
        raise e
