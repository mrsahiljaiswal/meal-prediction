# Luminescent POS System

A full-stack Point of Sale (POS) system with AI-powered meal demand prediction. This project consists of three main components: a Spring Boot backend, a React frontend, and a Python ML model for demand forecasting.

## Project Structure

```
├── backend/          # Spring Boot REST API
├── frontend/         # React + Vite web application
├── model/            # Python ML pipeline for demand prediction
└── README.md         # This file
```

---

## Prerequisites

Before setting up any component, ensure you have:

- **Java 17+** - For backend
- **Node.js 18+** - For frontend
- **Python 3.9+** - For ML model
- **PostgreSQL 12+** - Database
- **Maven** - For building backend
- **Git** - For version control

---

## Backend Setup & Run

### Prerequisites

- Java 17+
- Maven
- PostgreSQL running locally on port 5432

### Installation

```bash
cd backend
mvn clean install
```

### Configuration

Update `src/main/resources/application.properties` with your PostgreSQL credentials:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/luminescent_db
spring.datasource.username=postgres
spring.datasource.password=your_password
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.hibernate.ddl-auto=update
```

**Note:** Create the PostgreSQL database first:

```sql
CREATE DATABASE luminescent_db;
```

### Running the Backend

```bash
# Option 1: Using Maven
cd backend
mvn spring-boot:run

# Option 2: Using JAR file (after building)
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8081`

### API Documentation

- Base URL: `http://localhost:8081`
- Available endpoints:
  - Admin: `/api/admin/*`
  - Inventory: `/api/inventory/*`
  - Meals: `/api/meals/*`
  - Predictions: `/api/predict/*`

---

## Frontend Setup & Run

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Running in Development Mode

```bash
cd frontend
npm run dev
```

The frontend will start on `http://localhost:5173` (or another available port if 5173 is in use)

### Building for Production

```bash
cd frontend
npm run build
```

The optimized production build will be in the `dist/` directory.

### Preview Production Build

```bash
cd frontend
npm run preview
```

### Features

- **POS Page** - Point of sale interface
- **Inventory Management** - Track stock levels
- **Analytics Dashboard** - View sales metrics
- **Prediction Page** - View AI-powered demand predictions

---

## ML Model Setup & Run

### Prerequisites

- Python 3.9+
- pip or conda

### Installation

```bash
cd model
pip install -r requirements.txt
python setup.py install
```

### Configuration

Update `config/config.yaml` with your settings (paths, model parameters, etc.)

### Running the ML Pipeline

```bash
cd model

# Training pipeline
python src/pipelines/train_pipeline.py

# Prediction pipeline
python src/pipelines/predict_pipeline.py
```

### Notebooks

Explore the data and model development:

```bash
cd model
jupyter notebook notebooks/eda.ipynb          # Exploratory Data Analysis
jupyter notebook notebooks/train_1.ipynb      # Model Training
```

### Key Components

- **Data Ingestion** - Load and prepare data
- **Data Transformation** - Feature engineering and preprocessing
- **Model Trainer** - Train XGBoost, CatBoost, LightGBM models
- **Model Pusher** - Register models with MLflow

### MLflow Tracking

View training runs and compare models:

```bash
cd model
mlflow ui
```

Open `http://localhost:5000` to view MLflow dashboard

---

## Full Stack Startup Guide

### Quick Start (All Components)

**Terminal 1 - Backend:**

```bash
cd backend
mvn spring-boot:run
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

**Terminal 3 (Optional) - ML Model:**

```bash
cd model
python src/pipelines/predict_pipeline.py
```

### Environment Variables (Optional)

Create `.env` files in each folder if needed:

**backend/.env**

```
DB_URL=jdbc:postgresql://localhost:5432/luminescent_db
DB_USERNAME=postgres
DB_PASSWORD=your_password
```

**frontend/.env**

```
VITE_API_BASE_URL=http://localhost:8081
```

**model/.env**

```
MODEL_PATH=./artifacts/models/
DATA_PATH=./artifacts/data/
```

---

## Database Setup

### PostgreSQL Installation

1. Install PostgreSQL from https://www.postgresql.org/download/
2. Start the PostgreSQL service
3. Create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE luminescent_db;
\q
```

### Database Initialization

The backend will automatically initialize tables via Hibernate (ddl-auto=update). CSV data from `backend/src/main/resources/` will be loaded on startup.

---

## Docker Support (Optional)

### Build and Run with Docker Compose

```bash
docker-compose up -d
```

### Manual Docker Setup

```bash
# Backend
docker build -t luminescent-backend ./backend
docker run -p 8081:8081 luminescent-backend

# Frontend
docker build -t luminescent-frontend ./frontend
docker run -p 5173:5173 luminescent-frontend

# PostgreSQL
docker run -p 5432:5432 -e POSTGRES_PASSWORD=your_password postgres:latest
```

---

## Troubleshooting

### Backend Issues

**Port 8081 already in use:**

```bash
# Change port in application.properties
server.port=8082
```

**PostgreSQL connection failed:**

- Ensure PostgreSQL is running
- Verify credentials in `application.properties`
- Check database exists: `psql -l`

### Frontend Issues

**Port 5173 already in use:**

```bash
npm run dev -- --port 5174
```

**Dependencies not installing:**

```bash
rm -rf node_modules package-lock.json
npm install
```

### ML Model Issues

**Package installation fails:**

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

**MLflow not starting:**

```bash
pip install mlflow
mlflow ui
```

---

## Testing

### Backend Tests

```bash
cd backend
mvn test
```

### Frontend Tests

```bash
cd frontend
npm run test
```

### ML Model Tests

```bash
cd model
pytest tests/
```

---

## Deployment

### Backend Deployment

- Build JAR: `mvn clean package`
- Deploy to: AWS EC2, Heroku, DigitalOcean, etc.
- Set environment variables for production DB

### Frontend Deployment

- Build: `npm run build`
- Deploy to: Vercel, Netlify, AWS S3 + CloudFront

### ML Model Deployment

- Register models in MLflow
- Deploy via FastAPI or Docker
- Use model endpoints in backend

---

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add your feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a Pull Request

---

## License

This project is licensed under the MIT License - see LICENSE file for details

---

## Support

For issues and questions:

- Backend: Check Spring Boot logs
- Frontend: Check browser console
- Model: Check training logs in `model/log/`

---

## Project Info

- **Version:** 0.0.1
- **Backend:** Spring Boot 3.3.5
- **Frontend:** React 18 + Vite
- **ML:** Python with XGBoost, CatBoost, LightGBM
- **Database:** PostgreSQL
- **ML Tracking:** MLflow
