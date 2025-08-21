# Squid Quiz Project: SDE1 Interview Questions & Answers

---

## Frontend (React, Tailwind CSS)

### 1. How is the component structure organized in the Squid Quiz frontend?

**Answer:**  
The frontend uses React components stored in `src/components/`. Each component is responsible for a specific part of the UI, such as authentication (`Login.jsx`, `Register.jsx`, `LoginRegister.jsx`), quiz logic (`Sques.jsx`, `Timer.jsx`, `Interval.jsx`), and story screens (`Begin.jsx`, `Start.jsx`, `story.jsx`). This modular structure improves maintainability and reusability.

---

### 2. What is the role of Tailwind CSS in this project?

**Answer:**  
Tailwind CSS provides utility-first classes for rapid and consistent styling. It is configured in `tailwind.config.js` and used in CSS files like `index.css`. This enables responsive design and reduces the need for custom CSS.

---

### 3. How does the quiz timer work in the frontend?

**Answer:**  
The `Timer.jsx` component manages countdowns for quiz questions using React state and effects (`useState`, `useEffect`). It updates the timer and triggers actions when time runs out, ensuring a timed quiz experience.

---

### 4. How is user authentication handled in the frontend?

**Answer:**  
Authentication flows are managed by components like `LoginRegister.jsx`, `Login.jsx`, and `Register.jsx`. These components collect user input and communicate with backend API endpoints to register, log in, and handle OTP verification and password resets.

---

### 5. How are assets and videos managed in the frontend?

**Answer:**  
Videos and images are stored in `src/assets/` and loaded into components as needed. This keeps static files organized and allows for easy referencing in JSX.

---

## Backend (Node.js, Express, MongoDB, Passport.js)

### 6. How does the backend handle user authentication and session management?

**Answer:**  
The backend uses Passport.js for authentication, as configured in `config/passport.config.js`. User credentials are verified, and sessions can be managed (though session middleware is commented out in `server.js`). JWT or cookies may be used for maintaining user sessions.

---

### 7. What is the purpose of middleware in the backend?

**Answer:**  
Middleware like `checkaccess.js` and `confirm.js` in `src/middleware/` is used to protect routes, verify user permissions, and handle request validation before reaching controllers. This ensures secure and controlled access to API endpoints.

---

### 8. How does the backend send OTPs and handle password resets?

**Answer:**  
Nodemailer is configured in `config/nodemailer.config.js` to send OTPs to users’ emails for verification and password resets. The relevant logic is handled in controllers such as `loginController.js`.

---

### 9. How is quiz and user data modeled in MongoDB?

**Answer:**  
Mongoose schemas are defined in `src/model/LoginSchema.js` (for users) and `src/model/Squid.js` (for quiz data). These schemas structure the data stored in MongoDB, enabling efficient querying and updates.

---

### 10. How does the frontend communicate with the backend?

**Answer:**  
The frontend sends HTTP requests (using `fetch` or `axios`) to backend API endpoints defined in `src/routes/user_routes.js`. These endpoints handle actions like registration, login, OTP verification, and quiz data retrieval.

---

## Full Stack & General

### 11. Describe the end-to-end flow for a user registering and taking a quiz.

**Answer:**  
A user registers via the frontend, which sends data to the backend. The backend verifies and stores the user, sends an OTP for email confirmation. After verification, the user logs in and accesses the quiz. The frontend displays questions and timers, sending answers and progress to the backend for storage and validation.

---

### 12. What security measures are implemented in this project?

**Answer:**  
Security is handled via Passport.js for authentication, middleware for route protection, and environment variables for sensitive data (`dotenv`). Passwords are likely hashed, and OTPs are used for email verification and password resets.

---

### 13. How would you add a new feature, such as a leaderboard, to this project?

**Answer:**  
I would create a new Mongoose schema for leaderboard data, add backend routes and controllers to manage scores, and build frontend components to display rankings. API endpoints would allow fetching and updating leaderboard data.

---

### 14. What testing strategies would you use for this project?

**Answer:**  
Unit tests for individual functions and components, integration tests for API endpoints, and end-to-end tests for user flows. Tools like Jest (for JS) and Supertest (for Express) could be used.

---

### 15. How do you manage environment variables and sensitive information?

**Answer:**  
Sensitive data like database URIs and email credentials are stored in a `.env` file and loaded using `dotenv`. This keeps secrets out of source code and version control.

---

These questions and answers cover architecture, implementation, security, and practical problem-solving, all relevant for an SDE1 interview based on your
