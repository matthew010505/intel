from flask import Flask, request, jsonify
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from sklearn.preprocessing import LabelEncoder
import pickle
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
# Flask app

try:
    with open("utils/scheme_data.json", "r", encoding="utf-8") as file:
        json_data = json.load(file) 
except Exception as e:
    print(f"An error occurred while loading JSON data: {e}")
    json_data = []
# print(json_data)


# Load saved model, tokenizer, and label encoder
MODEL_PATH = "utils/bert_scheme_classifier"
with open("utils/label_encoder.pkl", "rb") as file:
    label_encoder = pickle.load(file)

device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
model = BertForSequenceClassification.from_pretrained(MODEL_PATH).to(device)
tokenizer = BertTokenizer.from_pretrained(MODEL_PATH)


# Helper function to combine fields
def combine_fields(item):
    return " ".join(
        [item[key] for key in item if isinstance(item[key], str)]
    )

# Prediction function for a single item
def predict_scheme(item):
    text = combine_fields(item)
    model.eval()
    with torch.no_grad():
        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding="max_length",
            max_length=512
        ).to(device)
        outputs = model(**inputs)
        logits = outputs.logits.squeeze().cpu().numpy()  # Get raw logits
        probabilities = torch.nn.functional.softmax(torch.tensor(logits), dim=-1).numpy()  # Convert to probabilities
    return probabilities

# Flask route for batch predictions
@app.route("/predict", methods=["POST"])
def predict():

    try:
        
        data = request.get_json()

        # print(f"Received data: {data}") 
        if not data or not isinstance(data, list):
            return jsonify({"error": "Invalid JSON data. Expected a list of schemes."}), 400

        # Transform the JSON data to a lookup dictionary for scheme_name -> url mapping
        # print("Hi")
        url_lookup = {
    entry["scheme_name"]: entry["url"] if "url" in entry and entry["url"] else "N/A"
    for entry in json_data
}
        
        predictions = []
        for item in data:
            probabilities = predict_scheme(item)

            # Get top 10 schemes based on probabilities and include URL instead of score
            top_schemes = sorted(
                [
                    {
                        "scheme_name": label_encoder.inverse_transform([i])[0],
                        "url": url_lookup.get(label_encoder.inverse_transform([i])[0], "URL not found"),
                        "probability": float(prob),
                    }
                    for i, prob in enumerate(probabilities)
                ],
                key=lambda x: x["probability"],  # Sort based on probability
                reverse=True
            )[:10]  # Select top 10

            predictions.append({"input": item, "top_schemes": top_schemes})

        # Return response as a JSON array
        return jsonify(predictions)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run Flask app
if __name__ == "__main__":
    app.run(debug=True)