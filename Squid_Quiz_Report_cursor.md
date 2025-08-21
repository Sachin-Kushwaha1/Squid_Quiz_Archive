# Squid Quiz Project - Comprehensive Technical Report

## Executive Summary

**Squid Quiz** is a sophisticated two-level quiz web application that combines modern web technologies with an engaging gaming experience. The project implements a competitive quiz system where users progress through multiple levels with selection caps and token-based progression gates.

### Key Features

- **Two-Level Quiz System**: Progressive difficulty with selection caps (30 users for Level 2, 3 winners total)
- **Multi-Authentication**: Local user registration/login + Google OAuth integration
- **Token-Based Progression**: Secure intermission step requiring 6-digit token verification
- **Video-Driven UI**: Responsive design with aspect-ratio adaptive video backgrounds
- **Real-Time Gameplay**: Timed questions, lives system, and immediate feedback

### Technology Stack

- **Backend**: Node.js/Express, MongoDB/Mongoose, Passport.js, JWT, Nodemailer
- **Frontend**: React 18 (CRA), Tailwind CSS, Video-driven UI components
- **Infrastructure**: Hosted on Render, MongoDB Atlas, Gmail SMTP

## Project Architecture

### Repository Structure

```
Squid_Quiz-main/
├── Squid_B-main/          # Backend Node.js application
│   ├── config/            # Configuration files
│   ├── src/               # Source code
│   │   ├── controller/    # Business logic
│   │   ├── middleware/    # Request processing
│   │   ├── model/         # Data models
│   │   └── routes/        # API endpoints
│   └── server.js          # Express app setup
└── Squid_F-main/          # Frontend React application
    ├── src/
    │   ├── components/    # React components
    │   ├── assets/        # Video and media files
    │   └── quizData.js    # Question database
    └── public/            # Static assets
```

### System Architecture

- **Monorepo Design**: Separate backend and frontend projects
- **RESTful API**: `/user` prefixed endpoints for all operations
- **Stateless Backend**: JWT-based authentication without sessions
- **Client-Side Routing**: React-based navigation and state management

## Backend Analysis

### Core Technologies

#### Express.js Framework

- **Version**: 4.18.2
- **Middleware Stack**: CORS, cookie-parser, JSON parsing, URL encoding
- **Route Organization**: Modular routing with `/user` prefix

#### MongoDB Integration

- **Driver**: Mongoose 8.1.0
- **Connection**: Environment-based configuration
- **Collections**: Two main schemas (Logreg, Squidquiz)

#### Authentication System

- **Passport.js**: Local and Google OAuth strategies
- **JWT Implementation**: Cookie-based token storage
- **Password Security**: bcrypt hashing with salt rounds

### Data Models

#### User Authentication Schema (Logreg)

```javascript
{
  name: String,
  email: String (unique, validated),
  password: String (hashed, strength validated),
  resetPasswordToken: Number,
  resetPasswordExpire: Date
}
```

**Password Requirements**:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character

**OTP System**:

- 6-digit numeric tokens
- 10-minute expiration
- Automatic cleanup after TTL

#### Game State Schema (Squidquiz)

```javascript
{
  email: String,
  selected: Number (1=started, 2=level2, 3=winner),
  win: Date,
  token: Number (6-digit),
  starttime: Date,
  question: Number
}
```

**Progression States**:

- **selected: 1**: User started Level 1
- **selected: 2**: User eligible for Level 2 (top 30)
- **selected: 3**: User completed as winner (top 3)

### API Endpoints

#### Authentication Routes

| Method | Endpoint                     | Purpose                 | Security               |
| ------ | ---------------------------- | ----------------------- | ---------------------- |
| POST   | `/user/register`             | User registration       | Password confirmation  |
| POST   | `/user/login`                | Local authentication    | Passport LocalStrategy |
| GET    | `/user/auth/google`          | Google OAuth initiation | OAuth 2.0              |
| GET    | `/user/auth/google/callback` | OAuth callback          | JWT token generation   |

#### Password Management

| Method | Endpoint               | Purpose                | Features           |
| ------ | ---------------------- | ---------------------- | ------------------ |
| POST   | `/user/reset-password` | Password reset request | Email OTP          |
| POST   | `/user/verifyOtp`      | OTP validation         | Expiry checking    |
| POST   | `/user/set-password`   | New password setting   | Confirmation match |
| POST   | `/user/resendOtp`      | OTP regeneration       | New expiry         |

#### Game Flow Endpoints

| Method | Endpoint             | Purpose            | Business Logic     |
| ------ | -------------------- | ------------------ | ------------------ |
| POST   | `/user/Start_Game`   | Game participation | First-time only    |
| POST   | `/user/select_cand`  | Level 2 selection  | Top 30 users       |
| POST   | `/user/get_token`    | Intermission token | 6-digit generation |
| POST   | `/user/verify_token` | Token validation   | Level 2 unlock     |
| POST   | `/user/End_Game`     | Game completion    | Top 3 winners      |
| POST   | `/user/End`          | Game termination   | Progress recording |

### Security Implementation

#### Current Security Measures

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Stateless authentication
- **Input Validation**: Mongoose schema validators
- **CORS Protection**: Cross-origin request handling

#### Security Gaps Identified

- **JWT Secret**: Hardcoded ("privacykey")
- **Game Endpoints**: No authentication enforcement
- **Rate Limiting**: Absent on sensitive endpoints
- **Input Sanitization**: Limited server-side validation

## Frontend Analysis

### React Application Structure

#### Core Components

1. **App.jsx**: Main application shell and state management
2. **LoginRegister.jsx**: Authentication flow orchestration
3. **Begin.jsx**: Game initialization and email capture
4. **Sques.jsx**: Quiz mechanics and question handling
5. **Interval.jsx**: Intermission token step
6. **Timer.jsx**: Question countdown management

#### State Management

- **Global State**: React useState hooks for app flow
- **Component Props**: Data passing between components
- **Local Storage**: No persistent client-side storage
- **API Integration**: Fetch API for backend communication

### User Experience Design

#### Video-Driven Interface

- **Background Videos**: Different assets for 16:9 vs 4:3 ratios
- **Responsive Design**: Aspect ratio detection and adaptation
- **Fullscreen Mode**: Automatic fullscreen on game start
- **Video Assets**: Multiple MP4 files for different game phases

#### Game Flow

1. **Introduction**: Video intro with start button
2. **Authentication**: Login/register with video background
3. **Story Phase**: Narrative video before gameplay
4. **Game Start**: Email input with video background
5. **Level 1**: 15 questions with timer and lives
6. **Intermission**: Token fetch and verification
7. **Level 2**: 20 questions with extended timer
8. **Completion**: Win/lose screen with video

### Question Database

#### Level 1 Questions (15 total)

- **Categories**: Riddles, wordplay, logic puzzles
- **Format**: Multiple choice with 4 options
- **Difficulty**: Beginner to intermediate
- **Examples**: "Forward I am heavy, backwards I am not"

#### Level 2 Questions (20 total)

- **Categories**: Mathematical logic, pattern recognition
- **Format**: Multiple choice with 4 options
- **Difficulty**: Intermediate to advanced
- **Examples**: Mathematical sequences, logical deductions

## Technical Implementation Details

### Backend Configuration

#### Environment Variables Required

```bash
MONGO_URL=mongodb://localhost:27017/squidquiz
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
BASE_URL=https://your-domain.com
SENDER_EMAIL=your_email@gmail.com
SENDER_PASSWORD=your_app_password
```

#### Database Connection

```javascript
// config/mongo.config.js
export const connectDb = async () => {
  try {
    await mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected");
  } catch (err) {
    console.log("Db connection failed " + err);
  }
};
```

#### Passport Configuration

```javascript
// Local Strategy
passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, next) => {
      // Password verification logic
    }
  )
);

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BASE_URL}/user/auth/google/callback`,
    },
    async (req, accessToken, refreshToken, profile, next) => {
      // User creation/retrieval logic
    }
  )
);
```

### Frontend Implementation

#### Component Architecture

```jsx
// App.jsx - Main state machine
const [intro, setIntro] = useState(true);
const [story, setStory] = useState(false);
const [loginRegister, setLoginRegister] = useState(false);
const [questionNumber, setQuestionNumber] = useState(1);
const [stop, setStop] = useState(false);
const [username, setUsername] = useState(null);
const [LevelUp, setLevelUp] = useState(false);
const [Lives, setLives] = useState(4);
```

#### API Integration

```javascript
// Example API call
const handleSubmit = async (e) => {
  e.preventDefault();
  const response = await fetch("https://squid-b.onrender.com/user/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await response.json();
  // Handle response
};
```

#### Video Asset Management

```javascript
// Aspect ratio detection
const [ratio, setRatio] = useState(
  (window.innerWidth / window.innerHeight).toFixed(1)
);

// Video selection based on ratio
useEffect(() => {
  if (videoRef.current) {
    videoRef.current.src = ratio >= 1.6 ? vid16_9 : vid4_3;
  }
}, [ratio]);
```

## Deployment and Operations

### Current Deployment

- **Backend**: Hosted on Render platform
- **Frontend**: Static build deployment
- **Database**: MongoDB Atlas (cloud)
- **Email**: Gmail SMTP with app passwords

### Environment Configuration

- **Production URL**: https://squid-b.onrender.com
- **CORS Settings**: Broadly enabled for development
- **Cookie Settings**: HTTP-only cookies for JWT
- **Error Handling**: Basic console logging

### Monitoring and Observability

- **Logging**: Console.log statements only
- **Metrics**: No structured monitoring
- **Error Tracking**: Basic error responses
- **Performance**: No performance metrics

## Security Analysis

### Authentication Flow

1. **User Registration**: Email/password with validation
2. **Local Login**: Passport LocalStrategy with bcrypt
3. **Google OAuth**: OAuth 2.0 flow with JWT
4. **Session Management**: Stateless JWT tokens

### Authorization Gaps

- **Game Endpoints**: No authentication required
- **Email Spoofing**: Can submit progress for any email
- **Token Exposure**: Intermission tokens visible to clients
- **Rate Limiting**: No protection against abuse

### Data Protection

- **Password Storage**: Properly hashed with bcrypt
- **JWT Security**: Stateless but hardcoded secret
- **Input Validation**: Basic Mongoose validators
- **SQL Injection**: Protected by Mongoose ODM

## Performance Considerations

### Database Performance

- **Query Optimization**: Simple findOne operations
- **Indexing**: No explicit indices defined
- **Connection Pooling**: Default Mongoose settings
- **Caching**: No caching layer implemented

### Frontend Performance

- **Bundle Size**: Standard CRA build
- **Asset Loading**: Video files loaded on demand
- **State Management**: Local component state
- **API Calls**: Direct fetch without caching

### Scalability Factors

- **Selection Caps**: Hardcoded limits (30, 3)
- **Concurrent Users**: No load testing performed
- **Database Scaling**: Single MongoDB instance
- **CDN**: No content delivery network

## Testing and Quality Assurance

### Current Testing Status

- **Unit Tests**: None implemented
- **Integration Tests**: None implemented
- **End-to-End Tests**: None implemented
- **Manual Testing**: Basic functionality verified

### Code Quality

- **Linting**: Frontend uses CRA defaults
- **Backend Linting**: No linting configuration
- **Code Formatting**: No consistent formatting rules
- **Documentation**: Basic inline comments

### Testing Recommendations

1. **Unit Tests**: Component and utility function testing
2. **Integration Tests**: API endpoint testing
3. **E2E Tests**: Complete user flow testing
4. **Load Testing**: Performance under user load

## Risk Assessment

### High-Risk Areas

1. **Authentication Bypass**: Game endpoints unguarded
2. **JWT Secret Exposure**: Hardcoded secret key
3. **Rate Limiting**: No protection against abuse
4. **Input Validation**: Limited server-side validation

### Medium-Risk Areas

1. **Token Exposure**: Intermission tokens visible
2. **Error Handling**: Generic error messages
3. **Logging**: No structured error tracking
4. **Environment Variables**: Some hardcoded values

### Low-Risk Areas

1. **Password Security**: Proper hashing implemented
2. **CORS Configuration**: Basic protection enabled
3. **Database Security**: Mongoose ODM protection
4. **HTTPS**: Production deployment with SSL

## Recommendations and Roadmap

### Immediate Actions (High Priority)

1. **Secure Game Endpoints**: Implement JWT validation
2. **Environment Variables**: Move JWT secret to env
3. **Rate Limiting**: Add protection to sensitive endpoints
4. **Input Validation**: Enhance server-side validation

### Short-term Improvements (1-2 months)

1. **Error Handling**: Implement global error middleware
2. **Logging**: Add structured logging system
3. **Testing**: Implement basic test suite
4. **Documentation**: API documentation and guides

### Medium-term Enhancements (3-6 months)

1. **Admin Dashboard**: Monitor user progress and winners
2. **Performance Optimization**: Database indexing and caching
3. **Security Hardening**: Additional security measures
4. **Monitoring**: Application performance monitoring

### Long-term Vision (6+ months)

1. **Scalability**: Multi-instance deployment
2. **Advanced Features**: Leaderboards, achievements
3. **Mobile App**: React Native implementation
4. **Analytics**: User behavior and performance analytics

## Conclusion

The Squid Quiz project demonstrates a well-architected quiz application with modern web technologies. While the core functionality is solid and the user experience is engaging, there are several security and operational improvements needed for production readiness.

### Strengths

- **Clean Architecture**: Well-organized code structure
- **User Experience**: Engaging video-driven interface
- **Technology Stack**: Modern, maintainable technologies
- **Game Mechanics**: Innovative token-based progression

### Areas for Improvement

- **Security**: Authentication and authorization gaps
- **Testing**: Comprehensive testing strategy needed
- **Monitoring**: Operational visibility and alerting
- **Documentation**: Technical and user documentation

### Overall Assessment

The project shows strong technical implementation with room for security and operational improvements. With the recommended enhancements, it can become a robust, production-ready quiz application suitable for enterprise use.

---

_Report generated on: $(Get-Date)_
_Project Version: 1.0.0_
_Analysis Scope: Complete codebase review_
