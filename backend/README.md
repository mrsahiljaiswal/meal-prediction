# Backend Module

Spring Boot backend for the Meal Demand Prediction System.

## Current Features Implemented

- Sales transaction API
- Meal creation API
- Ingredient creation API
- Meal-ingredient mapping API
- Inventory creation API

## Current APIs

### POST /api/sales
Stores meal sales transaction.

### POST /api/meals
Creates meal master data.

### POST /api/ingredients
Creates ingredient master data.

### POST /api/meal-ingredients
Maps ingredients to meals.

### POST /api/inventory
Stores center-wise ingredient stock.

## Current Database Tables

- centers
- meals
- ingredients
- meal_ingredients
- inventory
- sales_transactions

## Current Backend Flow

1. Sales transaction received
2. Meal and center validated
3. Price fetched from meal table
4. Transaction saved in sales_transactions

## Pending Work

- weekly aggregation
- ML integration
- prediction API
- ingredient demand calculation
- shortage calculation