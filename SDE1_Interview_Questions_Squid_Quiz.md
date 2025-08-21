# SDE1 Interview Questions & Answers - Squid Quiz Project

## Frontend Development Questions

### 1. React State Management

**Q: How would you manage complex state across multiple components in this quiz application?**

**A:** For this project, I would use React's Context API or a state management library like Redux Toolkit. Currently, the app uses multiple useState hooks which can become hard to manage. Here's how I'd refactor it:

```jsx
// Create a QuizContext
const QuizContext = createContext();

const QuizProvider = ({ children }) => {
  const [gameState, setGameState] = useState({
    intro: true,
    story: false,
    loginRegister: false,
    questionNumber: 1,
    stop: false,
    username: null,
    levelUp: false,
    lives: 4,
    timer: 40,
  });

  const updateGameState = (updates) => {
    setGameState((prev) => ({ ...prev, ...updates }));
  };

  return (
    <QuizContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </QuizContext.Provider>
  );
};
```

**Follow-up:** What are the trade-offs between Context API and Redux for this use case?

### 2. Component Architecture

**Q: How would you refactor the large App.jsx component to make it more maintainable?**

**A:** I'd break it down into smaller, focused components using the Single Responsibility Principle:

```jsx
// App.jsx - Main orchestrator
const App = () => {
  const { gameState, updateGameState } = useQuizContext();

  return (
    <div className="app">
      <ToastContainer />
      <GameFlowManager
        gameState={gameState}
        updateGameState={updateGameState}
      />
    </div>
  );
};

// Separate component for game flow logic
const GameFlowManager = ({ gameState, updateGameState }) => {
  if (gameState.username) {
    return <GamePlay gameState={gameState} updateGameState={updateGameState} />;
  }

  if (gameState.intro) {
    return (
      <Start
        onStart={() => updateGameState({ intro: false, loginRegister: true })}
      />
    );
  }

  // ... other flow conditions
};
```

**Follow-up:** How would you handle component communication between these separated components?

### 3. Performance Optimization

**Q: What performance optimizations would you implement in this React application?**

**A:** Several key optimizations:

1. **React.memo for expensive components:**

```jsx
const Sques = React.memo(({ data, questionNumber, onAnswer }) => {
  // Component logic
});
```

2. **useMemo for expensive calculations:**

```jsx
const currentQuestion = useMemo(() => {
  return data[questionNumber - 1];
}, [data, questionNumber]);
```

3. **useCallback for event handlers:**

```jsx
const handleAnswer = useCallback(
  (answer) => {
    onAnswer(answer);
  },
  [onAnswer]
);
```

4. **Lazy loading for video assets:**

```jsx
const videoSrc = useMemo(() => {
  return ratio >= 1.6 ? vid16_9 : vid4_3;
}, [ratio]);
```

**Follow-up:** How would you measure the performance impact of these optimizations?

### 4. Video Asset Management

**Q: How would you optimize the video loading and management in this application?**

**A:** I'd implement several strategies:

1. **Preloading critical videos:**

```jsx
useEffect(() => {
  const preloadVideos = async () => {
    const videoUrls = [vid16_9, vid4_3, vid1level, vid2level];
    await Promise.all(
      videoUrls.map((url) => {
        const video = new Audio(url);
        return video.load();
      })
    );
  };
  preloadVideos();
}, []);
```

2. **Video compression and format optimization:**

   - Use WebM format for better compression
   - Implement adaptive bitrate streaming
   - Add loading states and fallbacks

3. **Lazy loading with intersection observer:**

```jsx
const useVideoLazyLoad = (videoRef, src) => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && videoRef.current) {
          videoRef.current.src = src;
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, [src]);
};
```

**Follow-up:** How would you handle video loading failures or slow connections?

## Backend Development Questions

### 5. API Design & Security

**Q: What security vulnerabilities do you see in the current API design and how would you fix them?**

**A:** Several critical vulnerabilities:

1. **JWT Secret Hardcoding:**

```javascript
// Current (vulnerable)
const token = jwt.sign({ email: req.user.email }, "privacykey");

// Fixed
const token = jwt.sign(
  { email: req.user.email, iat: Date.now() },
  process.env.JWT_SECRET,
  { expiresIn: "24h" }
);
```

2. **Missing Authentication on Game Endpoints:**

```javascript
// Add middleware to protect game routes
const authenticateToken = async (req, res, next) => {
  const token = req.cookies.sid;
  if (!token) {
    return res.status(401).json({ error: "Access denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Apply to game routes
userRoutes.post("/Start_Game", authenticateToken, firstLogin);
userRoutes.post("/select_cand", authenticateToken, isSelected);
```

3. **Rate Limiting:**

```javascript
import rateLimit from "express-rate-limit";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts",
});

userRoutes.post("/login", authLimiter, passport.authenticate("local"));
```

**Follow-up:** How would you implement session management and token refresh?

### 6. Database Design & Optimization

**Q: How would you optimize the database queries and add proper indexing?**

**A:** Several optimizations:

1. **Add Database Indexes:**

```javascript
// In the schema definitions
const userSchema = mongoose.Schema({
  email: { type: String, required: true, index: true },
  selected: { type: Number, index: true },
  starttime: { type: Date, index: true },
});

// Compound index for common queries
userSchema.index({ email: 1, selected: 1 });
userSchema.index({ selected: 1, starttime: 1 });
```

2. **Optimize Selection Count Queries:**

```javascript
// Current (inefficient)
const count = await userModel.countDocuments({ selected: 3 });

// Optimized with caching
const getSelectionCount = async (selectedValue) => {
  const cacheKey = `selected_${selectedValue}`;
  let count = await redis.get(cacheKey);

  if (!count) {
    count = await userModel.countDocuments({ selected: selectedValue });
    await redis.setex(cacheKey, 300, count); // Cache for 5 minutes
  }

  return parseInt(count);
};
```

3. **Add Database Connection Pooling:**

```javascript
// config/mongo.config.js
export const connectDb = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("Connected with optimized settings");
  } catch (err) {
    console.log("Db connection failed " + err);
  }
};
```

**Follow-up:** How would you handle database connection failures and implement retry logic?

### 7. Error Handling & Logging

**Q: How would you implement proper error handling and logging in this application?**

**A:** Comprehensive error handling strategy:

1. **Global Error Middleware:**

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  const error = {
    message: err.message || "Internal Server Error",
    status: err.status || 500,
    timestamp: new Date().toISOString(),
    path: req.path,
    method: req.method,
    userAgent: req.get("User-Agent"),
  };

  // Log error with structured logging
  logger.error("API Error", error);

  // Send appropriate response
  if (process.env.NODE_ENV === "production") {
    res.status(error.status).json({
      error: "Something went wrong",
      status: error.status,
    });
  } else {
    res.status(error.status).json(error);
  }
};

// Apply to app
app.use(errorHandler);
```

2. **Structured Logging:**

```javascript
// config/logger.js
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}
```

3. **Input Validation Middleware:**

```javascript
import Joi from "joi";

const validateGameStart = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({
      error: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  next();
};
```

**Follow-up:** How would you implement error monitoring and alerting for production?

## System Design Questions

### 8. Scalability & Performance

**Q: How would you scale this application to handle 10,000 concurrent users?**

**A:** Multi-layered scaling approach:

1. **Load Balancing:**

```javascript
// Use multiple Node.js instances behind a load balancer
const cluster = require("cluster");
const numCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
} else {
  // Worker process
  app.listen(PORT);
}
```

2. **Database Scaling:**

```javascript
// Implement read replicas for analytics
const mongoose = require("mongoose");

const readReplica = mongoose.createConnection(process.env.MONGO_READ_REPLICA);
const writeConnection = mongoose.createConnection(process.env.MONGO_WRITE);

// Use read replica for analytics queries
const getGameStats = async () => {
  return await readReplica
    .model("Squidquiz")
    .aggregate([{ $group: { _id: "$selected", count: { $sum: 1 } } }]);
};
```

3. **Caching Strategy:**

```javascript
// Redis caching for frequently accessed data
const redis = require("redis");
const client = redis.createClient();

const cacheGameState = async (email, gameState) => {
  await client.setex(`game:${email}`, 3600, JSON.stringify(gameState));
};

const getGameState = async (email) => {
  const cached = await client.get(`game:${email}`);
  if (cached) return JSON.parse(cached);

  const gameState = await userModel.findOne({ email });
  await cacheGameState(email, gameState);
  return gameState;
};
```

**Follow-up:** How would you handle database sharding for user data?

### 9. Real-time Features

**Q: How would you implement real-time features like live leaderboards?**

**A:** Using WebSocket technology:

1. **WebSocket Server Setup:**

```javascript
// server.js
import { WebSocketServer } from "ws";

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    handleWebSocketMessage(ws, data);
  });
});

const handleWebSocketMessage = (ws, data) => {
  switch (data.type) {
    case "JOIN_GAME":
      ws.gameId = data.gameId;
      ws.join(data.gameId);
      break;
    case "UPDATE_SCORE":
      broadcastToGame(ws.gameId, {
        type: "SCORE_UPDATE",
        email: data.email,
        score: data.score,
      });
      break;
  }
};
```

2. **Real-time Leaderboard:**

```javascript
// Update leaderboard in real-time
const updateLeaderboard = async (gameId) => {
  const topPlayers = await userModel
    .find({ selected: { $gte: 2 } })
    .sort({ question: -1, starttime: 1 })
    .limit(10)
    .select("email question selected");

  broadcastToGame(gameId, {
    type: "LEADERBOARD_UPDATE",
    players: topPlayers,
  });
};
```

**Follow-up:** How would you handle WebSocket connection failures and reconnection?

### 10. Testing Strategy

**Q: How would you implement a comprehensive testing strategy for this application?**

**A:** Multi-layered testing approach:

1. **Unit Tests (Jest):**

```javascript
// __tests__/controllers/gameController.test.js
import { firstLogin, selectCand } from "../../src/controller/controller";
import { userModel } from "../../src/model/Squid";

jest.mock("../../src/model/Squid");

describe("Game Controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("firstLogin should create new user record", async () => {
    const mockReq = { body: { email: "test@example.com" } };
    const mockRes = { json: jest.fn() };

    userModel.countDocuments.mockResolvedValue(0);
    userModel.create.mockResolvedValue({ email: "test@example.com" });

    await firstLogin(mockReq, mockRes);

    expect(userModel.create).toHaveBeenCalledWith({
      email: "test@example.com",
      selected: 1,
      win: expect.any(Date),
      starttime: expect.any(Date),
      question: 0,
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "success",
      selected: true,
    });
  });
});
```

2. **Integration Tests (Supertest):**

```javascript
// __tests__/integration/game.test.js
import request from "supertest";
import { app } from "../../server";
import { connectDb, closeDb } from "../../config/mongo.config";

describe("Game API Integration", () => {
  beforeAll(async () => await connectDb());
  afterAll(async () => await closeDb());

  test("POST /user/Start_Game should register new player", async () => {
    const response = await request(app)
      .post("/user/Start_Game")
      .send({ email: "newplayer@example.com" })
      .expect(200);

    expect(response.body.selected).toBe(true);
    expect(response.body.message).toBe("success");
  });
});
```

3. **E2E Tests (Playwright):**

```javascript
// tests/game-flow.spec.js
import { test, expect } from "@playwright/test";

test("Complete game flow from start to finish", async ({ page }) => {
  await page.goto("/");

  // Start game
  await page.click('[data-testid="start-button"]');
  await expect(page.locator('[data-testid="login-form"]')).toBeVisible();

  // Login
  await page.fill('[data-testid="email-input"]', "test@example.com");
  await page.fill('[data-testid="password-input"]', "password123");
  await page.click('[data-testid="login-button"]');

  // Verify game starts
  await expect(
    page.locator('[data-testid="question-container"]')
  ).toBeVisible();
});
```

**Follow-up:** How would you implement test data management and database seeding?

## Problem-Solving Questions

### 11. Algorithm & Data Structures

**Q: How would you implement a fair selection algorithm for the top 30 users?**

**A:** Several approaches with different trade-offs:

1. **Priority Queue Approach:**

```javascript
class UserSelectionQueue {
  constructor(maxSize = 30) {
    this.maxSize = maxSize;
    this.queue = [];
  }

  addUser(user) {
    if (this.queue.length < this.maxSize) {
      this.queue.push(user);
      this.queue.sort((a, b) => b.score - a.score);
    } else if (user.score > this.queue[this.maxSize - 1].score) {
      this.queue.pop();
      this.queue.push(user);
      this.queue.sort((a, b) => b.score - a.score);
    }
  }

  getSelectedUsers() {
    return this.queue;
  }
}
```

2. **Database Query Optimization:**

```javascript
const selectTopUsers = async () => {
  const pipeline = [
    { $match: { selected: { $lt: 2 } } },
    { $sort: { question: -1, starttime: 1 } },
    { $limit: 30 },
    { $update: { selected: 2 } },
  ];

  return await userModel.aggregate(pipeline);
};
```

**Follow-up:** How would you handle ties in scores and ensure fairness?

### 12. Security Implementation

**Q: How would you implement secure token generation and validation?**

**A:** Multi-layered security approach:

1. **Cryptographically Secure Token Generation:**

```javascript
import crypto from "crypto";

const generateSecureToken = () => {
  return crypto.randomInt(100000, 999999).toString();
};

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

// Store hashed token in database
const saveToken = async (email) => {
  const token = generateSecureToken();
  const hashedToken = hashToken(token);

  await userModel.updateOne(
    { email },
    {
      tokenHash: hashedToken,
      tokenExpiry: new Date(Date.now() + 5 * 60 * 1000), // 5 minutes
    }
  );

  return token; // Return plain token to user
};
```

2. **Token Validation with Rate Limiting:**

```javascript
const validateToken = async (email, token) => {
  const user = await userModel.findOne({ email });

  if (!user || !user.tokenHash) {
    return false;
  }

  if (Date.now() > user.tokenExpiry) {
    return false;
  }

  const hashedInput = hashToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(user.tokenHash, "hex"),
    Buffer.from(hashedInput, "hex")
  );
};
```

**Follow-up:** How would you implement token rotation and prevent replay attacks?

## Behavioral Questions

### 13. Code Review & Quality

**Q: What code quality issues do you see in this project and how would you address them?**

**A:** Several areas for improvement:

1. **Code Organization:**

   - Separate business logic from controllers
   - Implement service layer pattern
   - Add input validation layer

2. **Error Handling:**

   - Replace generic error messages with specific ones
   - Implement proper HTTP status codes
   - Add error logging and monitoring

3. **Configuration Management:**

   - Move hardcoded values to environment variables
   - Implement configuration validation
   - Add configuration documentation

4. **Code Standards:**
   - Add ESLint and Prettier configuration
   - Implement pre-commit hooks
   - Add code formatting guidelines

**Follow-up:** How would you implement these changes without breaking existing functionality?

### 14. Learning & Growth

**Q: What technologies or concepts from this project would you like to learn more about?**

**A:** Several areas for growth:

1. **Real-time Communication:**

   - WebSocket implementation
   - Server-Sent Events
   - WebRTC for peer-to-peer communication

2. **Performance Optimization:**

   - Database query optimization
   - Caching strategies
   - CDN implementation

3. **Security:**

   - OAuth 2.0 implementation
   - JWT best practices
   - Rate limiting strategies

4. **Testing:**
   - Test-driven development
   - Performance testing
   - Security testing

**Follow-up:** How would you apply these learnings to improve the current project?

## Technical Deep-Dive Questions

### 15. Architecture Decisions

**Q: How would you refactor this application to use microservices architecture?**

**A:** Strategic service decomposition:

1. **Service Breakdown:**

```javascript
// User Service
const userService = {
  register: async (userData) => {
    /* user registration logic */
  },
  authenticate: async (credentials) => {
    /* authentication logic */
  },
  resetPassword: async (email) => {
    /* password reset logic */
  },
};

// Game Service
const gameService = {
  startGame: async (email) => {
    /* game initialization logic */
  },
  processAnswer: async (email, answer) => {
    /* answer processing logic */
  },
  endGame: async (email) => {
    /* game completion logic */
  },
};

// Notification Service
const notificationService = {
  sendEmail: async (to, subject, content) => {
    /* email sending logic */
  },
  sendSMS: async (to, message) => {
    /* SMS sending logic */
  },
};
```

2. **API Gateway:**

```javascript
// Gateway routing
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
app.use("/api/notifications", notificationRoutes);

// Service discovery
const serviceRegistry = {
  userService: process.env.USER_SERVICE_URL,
  gameService: process.env.GAME_SERVICE_URL,
  notificationService: process.env.NOTIFICATION_SERVICE_URL,
};
```

**Follow-up:** How would you handle service communication and data consistency?

### 16. Performance Monitoring

**Q: How would you implement performance monitoring and alerting?**

**A:** Comprehensive monitoring solution:

1. **Application Performance Monitoring:**

```javascript
// Custom performance middleware
const performanceMonitor = (req, res, next) => {
  const start = Date.now();

  res.on("finish", () => {
    const duration = Date.now() - start;
    const metrics = {
      path: req.path,
      method: req.method,
      statusCode: res.statusCode,
      duration,
      timestamp: new Date().toISOString(),
    };

    // Send to monitoring service
    monitoringService.recordMetric("api_response_time", metrics);

    // Alert if response time is too high
    if (duration > 1000) {
      alertingService.sendAlert("High API Response Time", metrics);
    }
  });

  next();
};
```

2. **Database Performance Monitoring:**

```javascript
// Database query monitoring
mongoose.plugin((schema) => {
  schema.pre("find", function () {
    this.startTime = Date.now();
  });

  schema.post("find", function () {
    const duration = Date.now() - this.startTime;
    monitoringService.recordMetric("db_query_time", {
      operation: "find",
      collection: this.model.modelName,
      duration,
    });
  });
});
```

**Follow-up:** How would you set up dashboards and alerting thresholds?

---

## Summary of Key Areas to Focus On:

1. **Frontend:** React state management, performance optimization, component architecture
2. **Backend:** Security implementation, error handling, database optimization
3. **System Design:** Scalability, real-time features, microservices
4. **Testing:** Unit, integration, and E2E testing strategies
5. **Security:** Authentication, authorization, input validation
6. **Performance:** Monitoring, optimization, caching strategies
7. **Code Quality:** Standards, review processes, refactoring strategies

These questions cover the essential skills expected from an SDE1 role while being specifically tailored to the technologies and challenges present in the Squid Quiz project.
