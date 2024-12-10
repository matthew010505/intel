import json
import torch
from torch.utils.data import DataLoader, Dataset
from transformers import BertTokenizer, BertForSequenceClassification, AdamW
from transformers import get_scheduler
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from tqdm import tqdm
import pickle

# Replace 'path_to_your_file.pkl' with the actual path to your PKL files
with open("processed_entries.pkl", 'rb') as file:
    combined_texts = pickle.load(file)
with open("schemes.pkl", "rb") as file:
    scheme_names = pickle.load(file)

# Encode scheme names (labels)
label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(scheme_names)

# Train/test split
train_texts, val_texts, train_labels, val_labels = train_test_split(
    combined_texts, labels, test_size=0.2, random_state=42
)

# Load BERT tokenizer
tokenizer = BertTokenizer.from_pretrained("bert-base-uncased")

# Tokenization
def tokenize_texts(texts, tokenizer, max_length=512):
    return tokenizer(
        texts,
        padding="max_length",
        truncation=True,
        max_length=max_length,
        return_tensors="pt"
    )

train_encodings = tokenize_texts(train_texts, tokenizer)
val_encodings = tokenize_texts(val_texts, tokenizer)

# Custom Dataset class
class SchemeDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __len__(self):
        return len(self.labels)

    def __getitem__(self, idx):
        item = {key: val[idx] for key, val in self.encodings.items()}
        item["labels"] = torch.tensor(self.labels[idx], dtype=torch.long)
        return item

train_dataset = SchemeDataset(train_encodings, train_labels)
val_dataset = SchemeDataset(val_encodings, val_labels)

# Load BERT model
model = BertForSequenceClassification.from_pretrained(
    "bert-base-uncased", num_labels=len(label_encoder.classes_))

# DataLoader
train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=8)

# Optimizer and Scheduler
optimizer = AdamW(model.parameters(), lr=5e-5)
num_training_steps = len(train_loader) * 3  # Assuming 3 epochs
lr_scheduler = get_scheduler("linear", optimizer=optimizer, num_warmup_steps=0, num_training_steps=num_training_steps)

# Device setup
device = torch.device("cuda") if torch.cuda.is_available() else torch.device("cpu")
model.to(device)

# Training loop
epochs = 3
progress_bar = tqdm(range(num_training_steps))

for epoch in range(epochs):
    # Training phase
    model.train()
    for batch in train_loader:
        batch = {key: val.to(device) for key, val in batch.items()}
        outputs = model(**batch)
        loss = outputs.loss
        loss.backward()
        optimizer.step()
        lr_scheduler.step()
        optimizer.zero_grad()
        progress_bar.update(1)

    # Validation phase
    model.eval()
    total_acc, total_count = 0, 0
    with torch.no_grad():
        for batch in val_loader:
            batch = {key: val.to(device) for key, val in batch.items()}
            outputs = model(**batch)
            predictions = torch.argmax(outputs.logits, dim=-1)
            total_acc += (predictions == batch["labels"]).sum().item()
            total_count += batch["labels"].size(0)

    print(f"Epoch {epoch + 1}: Validation Accuracy = {total_acc / total_count:.4f}")

# Save the model
model.save_pretrained("bert_scheme_classifier")
tokenizer.save_pretrained("bert_scheme_classifier")

# Helper function to combine fields
def combine_fields(item):
    return " ".join([item[key] for key in item if isinstance(item[key], str)])

# Test inference
def predict(item):
    text = combine_fields(item)
    model.eval()
    with torch.no_grad():  # Disable gradients for inference
        inputs = tokenizer(
            text, 
            return_tensors="pt", 
            truncation=True, 
            padding="max_length", 
            max_length=512
        ).to(device)
        outputs = model(**inputs)
        prediction = torch.argmax(outputs.logits, dim=-1).item()
    return label_encoder.inverse_transform([prediction])[0]

# Example prediction
example_item = {
    "scheme_name": "Education Scheme",
    "description": "This scheme provides financial aid to students pursuing higher education.",
    "eligibility": "Students with low income.",
    "benefits": "Full tuition fees and living expenses covered.",
}
print(f"Predicted Scheme: {predict(example_item)}")
