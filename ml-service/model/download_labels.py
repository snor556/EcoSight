# model/download_labels.py
import json
import os
import requests

def download_inaturalist_labels():
    
    # ✅ alternative URL — ImageNet labels for EfficientNet
    urls_to_try = [
        # try these in order
        "https://raw.githubusercontent.com/visipedia/inat_comp/master/2021/categories.json",
        "https://storage.googleapis.com/download.tensorflow.org/data/ImageNetLabels.txt",
    ]
    
    for url in urls_to_try:
        try:
            print(f"Trying: {url}")
            res = requests.get(url, timeout=30)
            
            print(f"Status: {res.status_code}")
            print(f"Content preview: {res.text[:200]}")  # ✅ shows first 200 chars
            
            if res.status_code == 200:
                print("✅ Success!")
                break
                
        except Exception as e:
            print(f"Failed: {e}")
            continue

if __name__ == "__main__":
    download_inaturalist_labels()