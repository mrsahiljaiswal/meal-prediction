# Frontend Endpoint Integration Guide

## Backend Base URL

```text
http://localhost:8083/api
```

Use this as the base URL in frontend constants.

Example:

```javascript
const API_BASE = "http://localhost:8083/api";
```

---

# 1. Save Billing Transaction

## Endpoint

```text
POST /sales
```

## Full URL

```text
http://localhost:8083/api/sales
```

## Purpose

Send billing transaction whenever a meal is purchased.

## Request Body

```json
{
  "centerCode": 55,
  "mealCode": 1885,
  "quantity": 3,
  "weekNumber": 18
}
```

## Response

```json
{
  "message": "Sale saved successfully"
}
```

## Frontend Notes

- Send `mealCode`, not DB id
- Send `centerCode`, not DB id
- `weekNumber` must match current business week

---

# 2. Trigger Prediction

## Endpoint

```text
POST /predict
```

## Full URL

```text
http://localhost:8083/api/predict
```

## Purpose

Ask backend to call ML model and predict meal demand.

## Request Body

```json
{
  "weekNumber": 18,
  "centerCode": 55,
  "mealCode": 1885
}
```

## Response

```json
{
  "success": true,
  "mealCode": 1885,
  "centerCode": 55,
  "predictedOrders": 87
}
```

## Frontend Notes

- Backend automatically fetches pricing
- Frontend does not send price manually

---

# 3. Get Ingredient Demand

## Endpoint

```text
GET /ingredient-demand/{weekNumber}
```

## Example

```text
http://localhost:8083/api/ingredient-demand/18
```

## Purpose

Get ingredient requirement after prediction.

## Response

```json
[
  {
    "ingredientName": "Rice",
    "requiredQuantity": 17.4,
    "availableStock": 12.0,
    "shortage": 5.4
  }
]
```

## Frontend Notes

- Show shortage clearly
- Highlight ingredients with shortage > 0

---

# 4. Deduct Inventory

## Endpoint

```text
POST /ingredient-demand/deduct/{weekNumber}
```

## Example

```text
http://localhost:8083/api/ingredient-demand/deduct/18
```

## Purpose

Apply inventory deduction after approval.

## Response

```json
{
  "message": "Inventory updated"
}
```

## Frontend Notes

- Trigger only after admin confirmation

---

# 5. Get Meals

## Endpoint

```text
GET /meals
```

## Full URL

```text
http://localhost:8083/api/meals
```

## Purpose

Populate meal dropdown.

## Response

```json
[
  {
    "mealCode": 1885,
    "mealName": "Biryani Rice Bowl"
  }
]
```

---

# 6. Get Centers

## Endpoint

```text
GET /centers
```

## Full URL

```text
http://localhost:8083/api/centers
```

## Purpose

Populate center dropdown.

## Response

```json
[
  {
    "centerCode": 55,
    "centerName": "Mumbai Center"
  }
]
```

---

# Recommended Frontend Flow

1. Load centers and meals
2. Save billing transaction
3. Trigger prediction
4. Fetch ingredient demand
5. Deduct inventory after approval

---

# Important Integration Rule

Frontend must always use:

- `centerCode`
- `mealCode`

Never use internal database IDs.
