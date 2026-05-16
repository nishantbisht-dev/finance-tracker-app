# Finance App API Documentation

## Base URL
`/api`

---

## Auth APIs

### Register User
**POST** `/auth/register`

Body:
```json
{
  "name": "Nishant",
  "email": "nishant@gmail.com",
  "password": "123456"
}
Login User

POST /auth/login

Body:

{
  "email": "nishant@gmail.com",
  "password": "123456"
}
Transaction APIs
Create Transaction

POST /transactions

Headers:
Authorization: Bearer TOKEN

Body:

{
  "title": "Salary",
  "amount": 50000,
  "type": "income",
  "category": "job",
  "note": "monthly salary"
}
Get Transactions

GET /transactions

Query params:

type
category
search
startDate
endDate
page
limit

Example:
/transactions?type=expense&page=1&limit=10

Get Dashboard Data

GET /transactions/dashboard

Get Monthly Stats

GET /transactions/monthly-stats

Get Category Breakdown

GET /transactions/category-breakdown

Get Single Transaction

GET /transactions/:id

Update Transaction

PUT /transactions/:id

Delete Transaction

DELETE /transactions/:id

Budget APIs
Create Budget

POST /budgets

Get Budgets

GET /budgets

Get Budget By ID

GET /budgets/:id

Update Budget

PUT /budgets/:id

Delete Budget

DELETE /budgets/:id

Goal APIs
Create Goal

POST /goals

Get Goals

GET /goals

Get Goal By ID

GET /goals/:id

Update Goal

PUT /goals/:id

Delete Goal

DELETE /goals/:id


---

# 5. Add a README file for your project

Create:

```bash id="p3n8lm"
README.md

Add a short project summary like this:

# Finance App Backend

A MERN backend for a modern finance dashboard application.

## Features
- User authentication with JWT
- Transaction CRUD
- Dashboard analytics
- Search, filter, and pagination
- Budget tracking
- Goal tracking
- Security middleware

## Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs

## Setup
1. Install dependencies
2. Create `.env`
3. Run MongoDB
4. Start server with `npm run dev`