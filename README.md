# Burger Queen - API with Node.js | Express | MongoDB

## Table of Contents

1. [Overview](#1-overview)
2. [Usage](#2-usage)
3. [API Endpoints](#3-api-endpoints)
    - [3.1 Authentication](#3.1-authentication)
        - [3.1.1 `/login`](#3.1.1-login)
    - [3.2 Users](#3.2-users)
        - [3.2.1 `GET /users`](#3.2.1-get-users)
        - [3.2.2 `GET /users/:uid`](#3.2.2-get-users-uid)
        - [3.2.3 `POST /users`](#3.2.3-post-users)
        - [3.2.4 `PATCH /users/:uid`](#3.2.4-patch-users-uid)
        - [3.2.5 `DELETE /users/:uid`](#3.2.5-delete-users-uid)
    - [3.3 Products](#3.3-products)
        - [3.3.1 `GET /products`](#3.3.1-get-products)
        - [3.3.2 `GET /products/:productid`](#3.3.2-get-products-productid)
        - [3.3.3 `POST /products`](#3.3.3-post-products)
        - [3.3.4 `PATCH /products/:productid`](#3.3.4-patch-products-productid)
        - [3.3.5 `DELETE /products/:productid`](#3.3.5-delete-products-productid)
    - [3.4 Orders](#3.4-orders)
        - [3.4.1 `GET /orders`](#3.4.1-get-orders)
        - [3.4.2 `GET /orders/:orderId`](#3.4.2-get-orders-orderid)
        - [3.4.3 `POST /orders`](#3.4.3-post-orders)
        - [3.4.4 `PATCH /orders/:orderId`](#3.4.4-patch-orders-orderid)
        - [3.4.5 `DELETE /orders/:orderId`](#3.4.5-delete-orders-orderid)
4. [Technologies Used](#4-technologies-used)

## 1. Overview

Welcome to Burger Queen API! This API is built using Node.js, Express, and MongoDB, and it's designed to support the operations of a burger restaurant. With this API, you can manage users, products, and orders efficiently.

Please note that this project is not intended for production use and is provided for educational and testing purposes. You are welcome to interact with the API to explore its functionality and improve your skills.

## 2. Usage

To use the Burger Queen API, you can follow the API endpoints described in the next section. The API is secured with authentication, and it provides different routes for various actions.

To use the Burger Queen API with Postman, follow these steps:

1. **Obtain an Access Token**:
   - Start by sending a `POST` request to the `/login` endpoint to obtain an access token. Provide your admin credentials (username and password) in the request body. Upon a successful login, the API will respond with an access token.

   You can use these credentials to log in:
   - As admin:
    email: admin@bq.com
    password: 123456
   - As waiter:
    email: waiter@bq.com
    password: 123456
   - As chef:
    email: chef@bq.com
    password: 123456

2. **Set Authorization Header**:
   - Copy the access token received in the previous step.
   - In Postman, create a new request and go to the "Headers" tab.
   - Add a header named `Authorization` with the value `Bearer <access_token>`, replacing `<access_token>` with the actual token. This header is necessary for authenticating subsequent requests.

3. **Accessing User-Related Endpoints**:
   - For user-related endpoints (e.g., `/users`, `/users/:uid`), you can use the following HTTP methods:
     - `GET`: Retrieve user information. (Admin only)
     - `POST`: Create a new user (Admin only).
     - `PATCH`: Update user information (Admin only).
     - `DELETE`: Delete a user (Admin only).
   - Ensure you have the appropriate permissions as an admin.

4. **Accessing Product-Related Endpoints**:
   - For product-related endpoints (e.g., `/products`, `/products/:productid`), you can use the following HTTP methods:
     - `GET`: Retrieve product information.
     - `POST`: Add a new product (Admin only).
     - `PATCH`: Update product information (Admin only).
     - `DELETE`: Delete a product (Admin only).
   - Make sure you have the necessary permissions.

5. **Accessing Order-Related Endpoints**:
   - For order-related endpoints (e.g., `/orders`, `/orders/:orderId`), you can use the following HTTP methods:
     - `GET`: Retrieve order information.
     - `POST`: Place a new order.
     - `PATCH`: Update order status.
     - `DELETE`: Delete an order.
   - Make sure you have the necessary permissions.

6. **Send Requests**:
   - In Postman, create a new request for the desired endpoint and set the HTTP method accordingly.
   - Fill in the request headers, parameters, and body as needed based on the specific endpoint's requirements.

7. **View Responses**:
   - After sending the request, you can view the API's responses in the "Response" tab in Postman. Check for status codes and response data.

8. **Repeat for Other Endpoints**:
   - You can repeat these steps for other endpoints to interact with the Burger Queen API as needed.

## 3. API Endpoints

### 3.1 Authentication

#### 3.1.1 `/login`

* `POST /login`
    - Use this endpoint to authenticate as an admin user and obtain an access token.

### 3.2 Users

#### 3.2.1 `GET /users`

* `GET /users`
    - Retrieve a list of all users.

#### 3.2.2 `GET /users/:uid`

* `GET /users/:uid`
    - Retrieve user details by user ID.

#### 3.2.3 `POST /users`

* `POST /users`
    - Create a new user.

#### 3.2.4 `PATCH /users/:uid`

* `PATCH /users/:uid`
    - Update user information by user ID.

#### 3.2.5 `DELETE /users/:uid`

* `DELETE /users/:uid`
    - Delete a user by user ID.

### 3.3 Products

#### 3.3.1 `GET /products`

* `GET /products`
    - Retrieve a list of all available products.

#### 3.3.2 `GET /products/:productid`

* `GET /products/:productid`
    - Retrieve product details by product ID.

#### 3.3.3 `POST /products`

* `POST /products`
    - Add a new product.

#### 3.3.4 `PATCH /products/:productid`

* `PATCH /products/:productid`
    - Update product information by product ID.

#### 3.3.5 `DELETE /products/:productid`

* `DELETE /products/:productid`
    - Delete a product by product ID.

### 3.4 Orders

#### 3.4.1 `GET /orders`

* `GET /orders`
    - Retrieve a list of all orders.

#### 3.4.2 `GET /orders/:orderId`

* `GET /orders/:orderId`
    - Retrieve order details by order ID.

#### 3.4.3 `POST /orders`

* `POST /orders`
    - Place a new order.

#### 3.4.4 `PATCH /orders/:orderId`

* `PATCH /orders/:orderId`
    - Update order status by order ID.

#### 3.4.5 `DELETE /orders/:orderId`

* `DELETE /orders/:orderId`
    - Delete an order by order ID.

## 4. Technologies Used

Burger Queen API is built with the following technologies:

- Node.js
- Express
- MongoDB

Feel free to explore the various API endpoints to manage your burger restaurant efficiently. Please note that certain operations are restricted to admin users for security and management purposes.
