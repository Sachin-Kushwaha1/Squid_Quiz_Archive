### **JavaScript and Node.js**

*   **What is the difference between `require` and `import` in Node.js? How have you used them in this project?**

    `require` is part of the CommonJS module system, the traditional way of importing modules in Node.js. `import` is part of the ES Modules (ESM) system, a newer standard.

    *   **`require`:** Can be called anywhere, is synchronous, and imports the entire module.
    *   **`import`:** Must be at the top level, is asynchronous, and can selectively import parts of a module (allowing for tree shaking).

    This project's backend uses ES Modules (`"type": "module"` in `package.json`), so it uses `import`. For example, in `server.js`:
    ```javascript
    import express from "express";
    import cors from "cors";
    ```

*   **Explain the concept of asynchronous programming in JavaScript. How have you handled asynchronous operations in the backend of this project?**

    Asynchronous programming allows long-running tasks to occur without blocking the main thread. In single-threaded JavaScript, this is vital for operations like network requests or database calls.

    The backend handles asynchronous operations using Promises with `async/await`. For instance, in `index.js`, the server waits for the database connection to be established before starting:
    ```javascript
    app.listen(PORT, async (err) => {
      if (err) console.log(err);
      else {
        await connectDb();
        console.log("Server is active");
      }
    });
    ```

*   **What are Promises and async/await? Can you give an example from the codebase where you have used them?**

    *   **Promises:** An object representing the eventual completion or failure of an asynchronous operation.
    *   **`async/await`:** Syntactic sugar for Promises, making asynchronous code look more synchronous.

    In `loginController.js`, the `registerUser` function uses `async/await` to handle saving a new user:
    ```javascript
    export const registerUser = async (req, res) => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        const newUser = new userModel({ ...req.body, password: hashedPassword });
        await newUser.save();
        res.status(201).send({ status: true, message: "User registered" });
      } catch (err) {
        res.status(400).send({ status: false, message: "User already registered" });
      }
    };
    ```

*   **What is the event loop in Node.js? How does it work?**

    The event loop is the core of Node.js's non-blocking I/O model. It allows Node.js to handle I/O operations without blocking the main thread. It continuously checks the event queue for new events and executes their callbacks.

*   **What is the purpose of `package.json` and `package-lock.json`?**

    *   **`package.json`:** The project's manifest, containing metadata and a list of dependencies.
    *   **`package-lock.json`:** Records the exact versions of all dependencies, ensuring consistent installations across different environments.

*   **What are environment variables and why are they important? How have you used them in this project?**

    Environment variables store configuration settings outside the source code, which is important for security and for configuring the application for different environments. This project uses a `.env` file and the `dotenv` package to manage variables like the port number, database connection string, and email credentials.

*   **What is the purpose of the `cors` middleware in Express.js? Why is it necessary for this application?**

    The `cors` middleware enables Cross-Origin Resource Sharing. It's necessary because the frontend and backend run on different origins (ports), and browsers would otherwise block requests from the frontend to the backend for security reasons.

### **React.js**

*   **What is the difference between a class component and a functional component in React? Which type of components have you used in this project and why?**

    This project uses functional components with Hooks. This is the modern approach to writing React components, resulting in more concise and readable code than class components.

*   **What are React Hooks? Can you explain the purpose of `useState`, `useEffect`, and `useRef` and provide examples from the components you have built?**

    *   **`useState`:** Adds state to a functional component. Example from `App.jsx`: `const [questionNumber, setQuestionNumber] = useState(1);`
    *   **`useEffect`:** Performs side effects. Example from `App.jsx`:
        ```javascript
        useEffect(() => {
          setQuestion(data[questionNumber - 1]);
        }, [data, questionNumber]);
        ```
    *   **`useRef`:** Creates a mutable reference. Example from `Begin.jsx`: `const inputRef = useRef();`

*   **What is the virtual DOM in React? How does it improve performance?**

    The virtual DOM is a lightweight in-memory representation of the real DOM. When a component's state changes, React creates a new virtual DOM, compares it to the previous one ("diffing"), and then efficiently updates only the necessary parts of the real DOM, improving performance.

*   **Explain the concept of component lifecycle in React. How have you used lifecycle methods (or their equivalent in Hooks) in this project?**

    The component lifecycle consists of mounting, updating, and unmounting phases. In functional components, `useEffect` is used to handle these events. For example, `useEffect(() => { ... }, [])` is equivalent to `componentDidMount`.

*   **How have you handled state management in this application? When would you consider using a global state management library like Redux?**

    State is managed at the component level with `useState`. State that needs to be shared is lifted up to the nearest common ancestor. A global state management library like Redux would be considered for more complex applications where state needs to be shared between many components at different levels of the component tree.

*   **How have you handled user input and forms in this project?**

    User input is handled using controlled components, where the value of the input field is controlled by the component's state.

*   **How have you made API calls to the backend from your React components?**

    API calls are made using the `fetch` API, which returns a Promise that is handled with `.then()` or `async/await`.

*   **What is conditional rendering in React? Can you show an example from the `App.jsx` component?**

    Conditional rendering is the process of rendering different UI elements based on a condition. In `App.jsx`, it's used to display different components based on the application's state:
    ```javascript
    {username ? (/* quiz */) : intro ? (<Start />) : (/* other components */)}
    ```

### **Backend and API Design**

*   **How have you designed the RESTful API for this application? What are the key principles of a good RESTful API design?**

    The API is designed around the `user` resource, with endpoints for managing user data and game progress. Key principles of RESTful API design include using nouns for resource URIs, HTTP methods for actions, and HTTP status codes to indicate the outcome of a request.

*   **Explain the purpose of the different HTTP methods (GET, POST, PUT, DELETE). Which ones have you used in this project and for what purpose?**

    This project uses `GET` for the Google OAuth callback and `POST` for all other actions, such as registration, login, and managing game state.

*   **What is middleware in Express.js? Can you give an example of a custom middleware you have written or used in this project?**

    Middleware is a function that has access to the request, response, and `next` function. The `confirmPasswords` middleware in `src/middleware/confirm.js` is a good example of a custom middleware.

*   **How have you handled user authentication and authorization in this application? Explain the role of Passport.js and JWT.**

    Passport.js is used for authentication with local and Google strategies. JWT is used for session management. When a user logs in, a JWT is generated and sent to the client, who then includes it in subsequent requests.

*   **How does the Google OAuth 2.0 authentication flow work in this project?**

    The user is redirected to Google to log in and grant permission. Google then redirects the user back to the application with an authorization code, which is exchanged for an access token and user profile information.

*   **How have you handled errors in your API?**

    Errors are handled using `try...catch` blocks in the controller functions. If an error occurs, a response with an appropriate HTTP status code and error message is sent to the client.

### **Databases (MongoDB)**

*   **What is MongoDB? What are its advantages over traditional relational databases?**

    MongoDB is a NoSQL, document-oriented database. Its advantages include a flexible schema, scalability, and high performance for certain types of queries.

*   **What is Mongoose? What is its purpose?**

    Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js. It provides a schema-based solution to model application data.

*   **Explain the data models you have designed for this application. Why did you choose this schema?**

    The `User` model stores authentication information, and the `Squid` model stores game progress. This separation of concerns makes the application more modular and maintainable.

*   **How have you performed CRUD (Create, Read, Update, Delete) operations on the database in this project?**

    CRUD operations are performed using Mongoose methods like `new userModel(...)`, `newUser.save()`, `userModel.findOne(...)`, and `userModel.updateOne(...)`.

*   **What is indexing in MongoDB? How can it improve performance?**

    Indexing is a way of organizing data to improve query performance. An index stores the values of a specific field, ordered by the value of the field.

### **System Design and Architecture**

*   **Can you draw a high-level architecture diagram of this application?**
    ```
    +----------+      +-----------+      +----------+
    | Frontend |----->|  Backend  |----->| Database |
    | (React)  |      | (Node.js) |      | (MongoDB)|
    +----------+      +-----------+      +----------+
    ```

*   **How would you scale this application to handle a large number of concurrent users?**

    By using horizontal scaling, database sharding, caching, and a Content Delivery Network (CDN).

*   **What are some potential bottlenecks in this application? How would you identify and address them?**

    Potential bottlenecks include database queries, API requests, and server performance. These can be addressed by optimizing queries, using caching, and using a load balancer.

*   **How would you add a new feature to this application, such as a leaderboard?**

    This would require changes to the database (adding a score field), backend (creating a new API endpoint), and frontend (creating a new component to display the leaderboard).

### **Problem Solving and DSA**

*   **Given a list of questions and a set of user answers, how would you calculate the user's score?**

    By iterating through the list of questions and comparing the user's answer to the correct answer.

*   **How would you generate a random token for the second level of the quiz?**

    By using a library like `crypto` to generate a random string of characters.

*   **How would you implement a timer for the quiz?**

    By using the `setInterval` function in JavaScript to create a timer that decrements a counter every second.

### **Behavioral and Situational**

*   **What was the most challenging part of building this project? How did you overcome it?**

    (Answer should focus on a specific technical challenge and the steps taken to solve it.)

*   **What would you do differently if you were to build this project again?**

    (Answer should show an ability to reflect on your work and identify areas for improvement.)

*   **How do you stay up-to-date with the latest technologies in web development?**

    (Answer should mention activities like reading blogs, following experts, attending meetups, and working on personal projects.)

*   **Tell me about a time you had to debug a difficult problem in your code.**

    (Answer should follow the STAR method: Situation, Task, Action, Result.)
