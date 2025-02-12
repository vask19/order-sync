# Order-Sync

This application fetches purchase data from Idosell and stores it in MongoDB. It also provides an API for creating users and exporting orders in CSV format.

## Requirements

- Docker

## Running the Application

### 1. Clone the Repository

```bash
git clone git@github.com:vask19/order-sync.git
cd <../order-sync>

```

# Application Setup Guide

## 2. Set Up Environment

Before running the application, you need to set up the `.env` file with the necessary environment variables. Add the following lines to your `.env` file:
```bash
API_KEY=your-api-key
BASE_URL=https://your-api-url.com
CRON='30 22 * * *' The cron schedule for fetching the data 
(default 10:30 PM every day)
```
## 3. Start the Application with Docker Compose

Ensure Docker and Docker Compose are installed on your machine.

Run the following command in the terminal:

```bash
docker-compose up --build
```

## 4. Verify the Application

Once the containers are running, the application will be available at:  
`http://localhost:3000`

---

## Post-Launch

After the application has started, you can create an initial user.

### Create User

To create a user, run the following cURL request:

```bash
curl --location --request POST 'http://localhost:3000/api/users' \
--header 'accept: application/json' \
--header 'content-type: application/json' \
--data-raw '{
    "username" : "admin2",
    "password" : "admin2"
}'
```

### Export Orders (CSV)
To export orders with filters for minWorth, maxWorth, limit, and page, use the following cURL request:
```bash
curl --location --request GET 'http://localhost:3000/api/orders/export/csv?limit=1000&page=1&minWorth=100&maxWorth=300' \
--header 'accept: application/json' \
--header 'content-type: application/json' \
--header 'Authorization: Basic YWRtaW4yOmFkbWluMg==' \
--header 'Cookie: Cookie_5=value'
```

### Export Order by ID (CSV)
To export an order by its ID, use this cURL request:
```bash
curl --location --request GET 'http://localhost:3000/api/orders/67ac9c95755a613409e23d9a/export/csv' \
--header 'accept: application/json' \
--header 'content-type: application/json' \
--header 'Authorization: Basic YWRtaW4yOmFkbWluMg==' \
--header 'Cookie: Cookie_5=value'
```