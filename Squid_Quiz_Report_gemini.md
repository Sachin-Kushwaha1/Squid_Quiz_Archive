### **Introduction**

The Squid Quiz project is a full-stack web application that provides users with an immersive, two-level quiz game experience. The application is themed around the popular "Squid Game" series, incorporating video assets and a time-pressure environment to create a challenging and engaging quiz. The project is built with a modern technology stack, featuring a Node.js and Express.js backend, a MongoDB database, and a React.js frontend with Tailwind CSS for styling.

### **Backend (Squid_B-main)**

#### **Architecture**

The backend of the Squid Quiz application is built on Node.js and the Express.js framework. It follows a standard Model-View-Controller (MVC) pattern, with a clear separation of concerns between the data models, controllers (business logic), and routes. The backend is responsible for handling all user authentication, game logic, and data persistence.

*   **Framework:** Express.js is used to create the RESTful API endpoints and manage the server-side logic.
*   **Database:** MongoDB is the database of choice, with Mongoose used as the Object Data Modeling (ODM) library to interact with the database.
*   **Authentication:** Passport.js is used as a middleware for handling user authentication. It is configured with two strategies:
    *   **`passport-local`:** For traditional username and password authentication.
    *   **`passport-google-oauth20`:** For authentication using a Google account.
    *   **JWT (JSON Web Tokens):** Used for session management. Once a user is authenticated, a JWT is generated and sent to the client, who then includes it in the headers of subsequent requests to access protected routes.
*   **Email:** Nodemailer is used to send emails for OTP verification during the password reset process.

#### **File Structure**

The backend code is organized into the following directories:

*   `config/`: Contains configuration files for the database connection (`mongo.config.js`), email service (`nodemailer.config.js`), and Passport.js (`passport.config.js`).
*   `src/`: The main source code directory.
    *   `controller/`: Contains the controller files that handle the application's business logic.
        *   `controller.js`: Handles the core game logic, such as starting the game, checking tokens, and ending the game.
        *   `loginController.js`: Manages user registration, login, and password reset functionality.
    *   `middleware/`: Contains custom middleware functions.
        *   `checkaccess.js`: (Not fully implemented in the provided code) Likely intended for checking user access rights.
        *   `confirm.js`: Middleware to confirm that the password and confirm password fields match during registration.
    *   `model/`: Contains the Mongoose data models.
        *   `LoginSchema.js`: Defines the schema for the `User` collection.
        *   `Squid.js`: Defines the schema for the `Squid` collection, which stores user progress in the quiz.
        *   `user.repo.js`: (Not fully implemented in the provided code) Likely intended as a repository for user-related database operations.
    *   `routes/`: Contains the route definitions.
        *   `user_routes.js`: Defines all the API endpoints under the `/user` path.
*   `Waste/`: Contains several files that appear to be unused or are from previous development iterations.
*   `index.js`: The main entry point of the application, which starts the server and connects to the database.
*   `server.js`: The file where the Express application is created and configured with middleware and routes.

#### **API Endpoints**

All API endpoints are defined in `src/routes/user_routes.js` and are prefixed with `/user`.

| Method | Path | Description | Middleware | Controller Function |
| :--- | :--- | :--- | :--- | :--- |
| `POST` | `/register` | Registers a new user. | `confirmPasswords` | `registerUser` |
| `POST` | `/login` | Logs in a user using local credentials. | `passport.authenticate('local')` | (anonymous function) |
| `GET` | `/auth/google` | Initiates the Google OAuth 2.0 authentication flow. | `passport.authenticate('google')` | (none) |
| `GET` | `/auth/google/callback`| The callback URL for Google OAuth 2.0. | `passport.authenticate('google')` | (anonymous function) |
| `POST` | `/reset-password` | Sends a password reset OTP to the user's email. | (none) | `resetPassword` |
| `POST` | `/verifyOtp` | Verifies the OTP for password reset. | (none) | `verifyOtp` |
| `POST` | `/resendOtp` | Resends the OTP for password reset. | (none) | `resendOtp` |
| `POST` | `/set-password` | Sets a new password for the user. | (none) | `setNewPassword` |
| `POST` | `/select_cand` | Checks if a user is selected for the game. | (none) | `isSelected` |
| `POST` | `/get_token` | Generates and saves a token for the second level of the quiz. | (none) | `saveToken` |
| `POST` | `/verify_token` | Verifies the token for the second level. | (none) | `checkToken` |
| `POST` | `/Start_Game` | Starts the first level of the quiz for the user. | (none) | `firstLogin` |
| `POST` | `/End_Game` | Ends the game for the user. | (none) | `Final` |
| `POST` | `/End` | A final endpoint that is called when the user runs out of lives or time. | (none) | `thank` |

#### **Data Models**

*   **`User` (`LoginSchema.js`):**
    *   `name`: `String` - The user's full name.
    *   `email`: `String` - The user's email address (unique).
    *   `password`: `String` - The user's hashed password.
    *   `token`: `String` - The OTP for password reset.
*   **`Squid` (`Squid.js`):**
    *   `email`: `String` - The user's email address.
    *   `Level1`: `Number` - The user's score in level 1.
    *   `Level2`: `Number` - The user's score in level 2.
    *   `Token`: `String` - The token for level 2.
    *   `isPlayed`: `Boolean` - Whether the user has already played the game.

### **Frontend (Squid_F-main)**

#### **Architecture**

The frontend of the Squid Quiz application is a single-page application (SPA) built with React.js. It is responsible for rendering the user interface and interacting with the backend API to handle user authentication and game logic.

*   **Framework:** React.js is used for building the user interface with a component-based architecture.
*   **Styling:** Tailwind CSS is used for styling the application. It is a utility-first CSS framework that allows for rapid UI development.
*   **State Management:** The application primarily uses React's built-in state management (`useState`, `useEffect`, `useRef`) to manage the component-level state. There is no global state management library like Redux or MobX.
*   **API Communication:** The `fetch` API is used to make HTTP requests to the backend.

#### **File Structure**

The frontend code is organized into the following directories:

*   `public/`: Contains the static assets of the application, such as `index.html`, `manifest.json`, and images.
*   `src/`: The main source code directory.
    *   `assets/`: Contains static assets like videos and images used in the application.
    *   `components/`: Contains all the React components.
    *   `app.css`, `index.css`: CSS files for styling.
    *   `App.jsx`: The main component of the application, which manages the overall application state and renders the other components.
    *   `index.js`: The entry point of the React application.
    *   `quizData.js`: Contains the quiz questions and answers for both levels.

#### **Component Breakdown**

*   **`App.jsx`:** The root component that manages the overall state of the application, including the current game state (intro, story, login, quiz), the current user, and the current question number. It conditionally renders the other components based on the application's state.
*   **`Start.jsx`:** The first component that is rendered. It displays a start button and a background video. When the user clicks the start button, it transitions to the `LoginRegister` component.
*   **`LoginRegister.jsx`:** This component acts as a container for the `Login` and `Register` components. It also handles the password reset flow by conditionally rendering the `ResetPassword`, `SetNewPassword`, and `GetOTP` components.
*   **`Login.jsx`:** A form for users to log in with their email and password. It also provides an option to log in with a Google account. Upon successful login, the user is taken to the `Story` component.
*   **`Register.jsx`:** A form for new users to create an account. Upon successful registration, the user is taken to the `Login` component.
*   **`ResetPassword.jsx`:** A form where users can enter their email address to receive a password reset OTP.
*   **`GetOTP.jsx`:** A form where users can enter the OTP they received in their email to verify their identity.
*   **`SetNewPassword.jsx`:** A form where users can set a new password after successfully verifying the OTP.
*   **`Story.jsx`:** This component displays a video intro to the game. The user can skip through the video by clicking a "Next" button. After the story, the game begins.
*   **`Begin.jsx`:** This component prompts the user to enter their email to start the quiz. It also displays the number of lives the user has.
*   **`Sques.jsx`:** The main quiz component. It displays the current question and the possible answers. It handles the user's answer selection, checks if the answer is correct, and updates the game state accordingly. It also handles the transition between levels and the end of the game.
*   **`Timer.jsx`:** A component that displays a countdown timer for each question. If the timer runs out, the user loses a life.
*   **`Interval.jsx`:** This component is displayed between the two levels of the quiz. It shows a countdown timer and then displays a token that the user needs to enter to start the second level.

#### **User Flow**

1.  The user lands on the `Start` page and clicks the "Start" button.
2.  The user is presented with the `LoginRegister` page, where they can either log in or register for a new account.
3.  After logging in, the user is shown the `Story` component, which provides an introduction to the game.
4.  The user then proceeds to the `Begin` component, where they enter their email to start the quiz.
5.  The quiz begins with the `Sques` component. The user has a set amount of time to answer each question, as indicated by the `Timer` component.
6.  If the user answers a question correctly, they move on to the next question. If they answer incorrectly, they lose a life.
7.  After completing the first level, the user is shown the `Interval` component, where they receive a token for the second level.
8.  The user enters the token to start the second level of the quiz.
9.  The game ends when the user completes the second level, runs out of time, or loses all their lives.
10. A final message is displayed to the user, indicating whether they have won or lost the game.

### **Features**

*   **Two-Level Quiz Game:** The application features a quiz with two levels of increasing difficulty.
*   **User Authentication:** Secure user authentication with email/password and Google OAuth.
*   **Password Reset:** A password reset functionality with OTP verification via email.
*   **Immersive Experience:** The use of video assets and a timer creates an engaging and immersive user experience.
*   **Responsive Design:** The application is designed to be responsive and works on different screen sizes.
*   **Anti-Cheat Measures:** Basic anti-cheat measures are in place to prevent users from cheating.

### **Security**

*   **Password Hashing:** Passwords are not stored in plain text. They are hashed using `bcrypt` before being saved to the database.
*   **Authentication:** Passport.js is used to handle authentication securely.
*   **JWT:** JSON Web Tokens are used for session management, which is a secure way to handle user sessions in a stateless environment.
*   **CORS:** The `cors` middleware is used to enable Cross-Origin Resource Sharing, which is necessary for the frontend to communicate with the backend.
*   **Anti-Cheat:** The frontend has some basic anti-cheat measures, such as disabling the browser's developer tools and the refresh key.

### **Conclusion**

The Squid Quiz project is a well-structured and feature-rich full-stack application that successfully delivers an engaging and challenging quiz game experience. The use of modern technologies like Node.js, React.js, and MongoDB, combined with a clean and organized codebase, makes it a solid and maintainable application. The "Squid Game" theme is well-integrated into the application's design and user flow, creating a unique and memorable experience for the users.
