# DavidEstate

Welcome to **DavidEstate**, a real estate application built using the MERN stack. DavidEstate allows users to easily find, list, and manage properties, with features designed to provide a seamless experience. 

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [App Images](#App)

## Features

- **Authentication:** 
  - Email/Password authentication
  - Google OAuth integration
- **CRUD Operations:** 
  - Create, Read, Update, and Delete property listings
- **Image Upload:** 
  - Upload property images using Firebase Storage
- **Search Functionality:** 
  - Strong search capabilities to find listings based on user preferences
- **User Profile Management:** 
  - Edit user profile information, including email and password

## Technologies Used

### Frontend
- **React:** For building the user interface
- **React Router:** For handling routing within the app
- **Redux Toolkit:** For state management
- **Material-UI:** For responsive and accessible UI components
- **Firebase:** For image storage
- **TailwindCSS:** For utility-first CSS styling

### Backend
- **Express:** Backend framework for building APIs
- **MongoDB:** NoSQL database for storing data
- **Mongoose:** ORM for MongoDB
- **JWT (JsonWebToken):** For secure authentication
- **BcryptJS:** For password hashing
- **Dotenv:** For environment variable management

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (installed and running)

### Frontend Setup
1. Navigate to the frontend directory:
    ```bash
    cd client
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Start the development server:
    ```bash
    npm run dev
    ```

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```
3. Create a `.env` file in the backend directory and add the following environment variables:
    ```env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```
4. Start the development server:
    ```bash
    npm run dev
    ```

## Usage

1. Navigate to `http://localhost:5174` in your browser to access the frontend.
2. Use the authentication options to log in or sign up.
3. Browse or create property listings.
4. Manage your profile through the user settings.

## Project Structure
![image](https://github.com/user-attachments/assets/98411b85-8f1c-4cb0-ba32-7614334791e6)

## App

### Inmultiple screeens:
![image](https://github.com/user-attachments/assets/aad3ebdf-a25e-41e1-bb8d-b5a6ded88441)
![image](https://github.com/user-attachments/assets/b4d02fd3-774a-4b5d-8f7c-824d14f7f08d)

### Landing Page:
![image](https://github.com/user-attachments/assets/28ee2541-4eb7-4add-b5ca-1eb479500f7c)

### Listing component:
![image](https://github.com/user-attachments/assets/c3fe12b3-e9f4-4beb-bd08-67b1701c9f70)

### Listing Page:
![image](https://github.com/user-attachments/assets/b9614017-4d49-4cd2-9707-febf0954d935)

### About Page:
![image](https://github.com/user-attachments/assets/34674f3a-16a4-44cc-aeb5-5b0fc882daba)

### Profile's Page
![image](https://github.com/user-attachments/assets/1dcbf7fd-4edb-4530-8227-9daed0383cce)

### Create Listing Page:
![image](https://github.com/user-attachments/assets/e76eb214-45aa-41d9-b483-2e506c8b99d7)

### Update Listing Page:
![image](https://github.com/user-attachments/assets/2ae78eb7-bcef-42fd-9bea-730ef7a52baf)

### Search Page:
![image](https://github.com/user-attachments/assets/0901e3e5-a1fa-4012-ab12-7ec8f0b89d60)

