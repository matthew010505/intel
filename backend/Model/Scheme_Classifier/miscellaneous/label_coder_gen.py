import pickle
from sklearn.preprocessing import LabelEncoder

# Assume you already have your scheme names and LabelEncoder
with open("schemes.pkl", "rb") as file:
    scheme_names = pickle.load(file)


# Initialize and fit the LabelEncoder
label_encoder = LabelEncoder()
labels = label_encoder.fit_transform(scheme_names)

# Save the LabelEncoder to a file
with open("label_encoder.pkl", "wb") as file:
    pickle.dump(label_encoder, file)

print("LabelEncoder saved successfully!")

# Optional: To verify, reload the LabelEncoder and print the classes
with open("label_encoder.pkl", "rb") as file:
    loaded_label_encoder = pickle.load(file)

print("Loaded LabelEncoder classes:", loaded_label_encoder.classes_)
