import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, r2_score


# ==============================
# Load Dataset
# ==============================

data = pd.read_csv(
    "database/student-mat.csv",
    sep=";"
)


# ==============================
# Select Features
# ==============================

features = [
    "studytime",
    "failures",
    "absences",
    "G1",
    "G2"
]

target = "G3"

X = data[features]
y = data[target]


# ==============================
# Train/Test Split
# ==============================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42
)


# ==============================
# Create and Train Model
# ==============================

model = RandomForestRegressor(
    n_estimators=100,
    random_state=42
)

model.fit(X_train, y_train)


# ==============================
# Evaluate Model
# ==============================

predictions = model.predict(X_test)

print("\n===== ACTUAL VS PREDICTED GRADES =====")

for i, (actual, predicted) in enumerate(
    zip(y_test.iloc[:5], predictions[:5]), start=1
):
    print(
        f"Student {i}: Actual Grade = {actual}, "
        f"Predicted Grade = {predicted:.2f}"
    )

mae = mean_absolute_error(
    y_test,
    predictions
)

r2 = r2_score(
    y_test,
    predictions
)

print("===== ML MODEL =====")
print("Model trained successfully!")
print("Mean Absolute Error:", round(mae, 2))
print("R2 Score:", round(r2, 2))


# ==============================
# Prediction Function
# ==============================

def predict_performance(
    studytime,
    failures,
    absences,
    G1,
    G2
):
    student = pd.DataFrame({
        "studytime": [studytime],
        "failures": [failures],
        "absences": [absences],
        "G1": [G1],
        "G2": [G2]
    })

    prediction = model.predict(student)[0]

    return round(float(prediction), 2)