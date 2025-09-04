<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

# 🚀 API Usage Guide

This guide explains how to interact with the API using `curl` commands.

---

## 🔑 Authentication

### 1. Register a New User

```bash
curl --location 'http://localhost:3001/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
  "name": "ramim2",
  "email": "ramim2@gmail.com",
  "password": "123456"
}'
```

### 2. Login

```bash
curl --location 'http://localhost:3001/auth/login' \
--header 'Content-Type: application/json' \
--data-raw '{
  "email": "tamim@gmail.com",
  "password": "123456"
}'
```

➡️ Returns a **JWT token** that you’ll use in other requests.

### 3. Get Profile (Protected Route)

```bash
curl --location --request GET 'http://localhost:3001/auth/profile' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--header 'Content-Type: application/json'
```

---

## 📝 Posts

### Create a New Post

```bash
curl --location 'http://localhost:3001/posts' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--header 'Content-Type: application/json' \
--data '{
  "title": "new Posts",
  "content": "contextf lkmbbnlkj knhbkjnb kljmjb"
}'
```

---

## 📂 File Upload

### Upload a File

```bash
curl --location 'http://localhost:3001/file-upload' \
--header 'Authorization: Bearer <YOUR_JWT_TOKEN>' \
--form 'file=@"/C:/Users/tamim/Downloads/nano-banana-no-bg-2025-08-31T03-24-26.jpg"'
```

---

## ⚡ Notes

- Replace `<YOUR_JWT_TOKEN>` with the token received from the **login API**.
- `Content-Type` must be `application/json` for JSON requests.
- For **file uploads**, use `--form file=@"/path/to/file"` instead of `--data`.

---

👉 This README provides a simple step-by-step flow:  
**Register → Login → Get Token → Use Token for Profile/Posts/File Upload.**

curl --location --request GET 'localhost:3001/auth/profile' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbWltQGdtYWlsLmNvbSIsInN1YiI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTY3OTc0MTEsImV4cCI6MTc4ODMzMzQxMX0.69irPsLHW_sU8yDc2sQtmSpVnPkOt_jQjPj3CKOtJgQ' \
--header 'Content-Type: application/json' \
--data-raw ' {
"email":"tamim@gmail.com",
"password":"123456"
}'

curl --location 'localhost:3001/auth/login' \
--header 'Content-Type: application/json' \
--data-raw ' {
"email":"tamim@gmail.com",
"password":"123456"
}'

curl --location 'localhost:3001/auth/register' \
--header 'Content-Type: application/json' \
--data-raw '{
"name":"ramim2",
"email":"ramim2@gmail.com",
"password":"123456"
}'curl --location 'localhost:3001/posts' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbWltQGdtYWlsLmNvbSIsInN1YiI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTY3OTc0MTEsImV4cCI6MTc4ODMzMzQxMX0.69irPsLHW_sU8yDc2sQtmSpVnPkOt_jQjPj3CKOtJgQ' \
--header 'Content-Type: application/json' \
--data ' {
"title": "new Posts",
"content": "contextf lkmbbnlkj knhbkjnb kljmjb"
}'curl --location 'localhost:3001/file-upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbWltQGdtYWlsLmNvbSIsInN1YiI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTY5MDMyNTQsImV4cCI6MTc4ODQzOTI1NH0.qUWb6CXu7biRdE9BQtNSh-ZRYHf5d1pGuYsaQTnTuKo' \
--form 'file=@"/C:/Users/tamim/Downloads/nano-banana-no-bg-2025-08-31T03-24-26.jpg"'

curl --location 'localhost:3001/file-upload' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRhbWltQGdtYWlsLmNvbSIsInN1YiI6Miwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTY3OTc0MTEsImV4cCI6MTc4ODMzMzQxMX0.69irPsLHW_sU8yDc2sQtmSpVnPkOt_jQjPj3CKOtJgQ' \
--data ''
