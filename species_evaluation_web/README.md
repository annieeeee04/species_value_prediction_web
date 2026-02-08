# 🌿 Species Value Prediction Web

A machine learning-powered web application that predicts the commercial value of ornamental plant varieties based on their characteristics.

---

## 🎯 What It Does

This tool helps **plant breeders, growers, researchers, and students** evaluate plant varieties without needing coding skills or data science expertise.

**Key Benefits:**
- Get instant value predictions based on 20 plant characteristics
- Make data-informed breeding and market decisions
- Access machine learning insights through a simple web interface

---

## 🧠 How It Works

### The Prediction Process

1. **Input plant characteristics** — Enter values for 20 features (S1–S20) that describe your plant variety
2. **Model analyzes the data** — A pre-trained scikit-learn regression model processes your inputs
3. **Get your prediction** — Receive an instant numerical value score (accurate to 3 decimal places)

### Technical Architecture

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend** | React + Vite | User interface and input forms |
| **API** | FastAPI | Model serving and request handling |
| **ML Model** | scikit-learn | Trained regression model for value prediction |
| **Database** | MySQL + SQLAlchemy | Optional storage for prediction history |

**Data Flow:** User Input → FastAPI Validation → Model Prediction → Result Display

---

## 🚀 Using the Application

### Quick Start

1. **Enter your plant data**
   - Fill in values for features S1–S20
   - Click any label to see what each feature measures
   - Blank fields automatically default to `6`

2. **Get your prediction**
   - Click the **"Predict"** button
   - View your value score instantly

### Understanding Features

Each feature (S1–S20) represents a specific plant characteristic. Click the field labels in the app to see detailed descriptions and value scales.

---

## 📊 About the Model

The prediction model was trained on historical data from ornamental plant varieties, learning the relationship between plant characteristics and their commercial value. 

**Model Details:**
- Algorithm: Regression (scikit-learn)
- Input: 20 numeric features
- Output: Predicted value score
- Format: Serialized with joblib

---

## 🛠️ For Developers

### Tech Stack
- **Frontend:** React, Vite
- **Backend:** FastAPI, Pydantic
- **ML:** scikit-learn, joblib
- **Database:** MySQL, SQLAlchemy

### API Endpoint
```
POST /predict
Content-Type: application/json

Body: { "S1": value, "S2": value, ..., "S20": value }
Response: { "predicted_value": number }
```

---

## 📝 Notes

- All feature inputs accept numeric values
- Default value for empty fields: `6`
- Predictions are returned to 3 decimal places
- Optional: Enable database storage to track prediction history

---

## 🤝 Contributing

We welcome contributions! Whether you're improving the model, enhancing the UI, or fixing bugs, your input helps make this tool better for the plant breeding community.

---

**Questions or feedback?** [Contact information or issue tracker link]