import pandas as pd
import joblib

from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.ensemble import RandomForestRegressor
from sklearn.pipeline import Pipeline

# Load dataset
df = pd.read_csv("waste_war.csv")

features = [
    "category",
    "material",
    "weight_kg",
    "age_years"
]
target = "reward_points"

X = df[features]
y = df[target]

categorical_cols = ["category", "material"]
numerical_cols = ["weight_kg", "age_years"]

preprocessor = ColumnTransformer(
    transformers=[
        ("num", StandardScaler(), numerical_cols),
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_cols
        )
    ]
)

model_pipeline = Pipeline(steps=[
    ("preprocessor", preprocessor),
    (
        "regressor",
        RandomForestRegressor(
            n_estimators=100,
            random_state=42
        )
    )
])

model_pipeline.fit(X, y)

joblib.dump(model_pipeline, "model.pkl")

print("Model trained and saved successfully!")