FROM python:3.11

WORKDIR /app

COPY requirements.txt .
COPY setup.py .
COPY src ./src

RUN pip install -r requirements.txt

COPY . .

EXPOSE 5001

CMD ["python3", "app.py"]