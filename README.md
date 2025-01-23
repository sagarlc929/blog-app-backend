<a name="top"></a>
# API Blog App

This is a simple API Blog app built with Node.js and various other technologies. It provides the functionality for managing blog posts, handling user authentication, and more.

## Features

- User authentication using JWT (JSON Web Tokens)
- Form validation using Joi
- Password hashing with bcrypt
- Email notifications via Nodemailer
- Redis caching for optimized performance
- Logging with Winston

## Technologies Used

- **Node.js**: Server-side JavaScript runtime
- **Express**: Web framework for building the API
- **MongoDB & Mongoose**: Database and ORM for managing data
- **JWT**: User authentication via JSON Web Tokens
- **bcrypt**: Password hashing
- **Joi**: Input validation
- **Redis**: Caching system
- **Nodemailer**: Sending emails
- **Winston**: Logging

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (or MongoDB Atlas for a cloud-based solution)
- [Redis](https://redis.io/) (for caching, optional)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/api-blog-app.git
   ```

2. Navigate to the project directory:

   ```bash
   cd api-blog-app
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory and add your environment variables:

   ```dotenv
    PORT=3000
    # mongodb database
    DATABASE_URL=your_mongo_connection_string
    # jwt token
    ACCESS_TOKEN_SECRET=your_jwt_acess_token_secret
    REFRESH_TOKEN_SECRET=your_jwt_refresh_token_secret
    # nodemailer otp email sender
    GMAIL_USER=your_gamil_user
    GMAIL_PASS=your_gamil_password  
   ```

### Running the Application

To start the application in development mode, run:

```bash
npm run dev
```

This will run the application with `nodemon`, which will automatically restart the server when changes are made.

### Testing

To run tests (if implemented), you can use:

```bash
npm test
```

However, currently, no tests are set up in this project.

## Linting and Formatting

The project uses ESLint and Prettier for code quality. To automatically fix issues in your code, you can run:

```bash
npm run lint
```

Additionally, `lint-staged` is set up to run on pre-commit hooks via [Husky](https://typicode.github.io/husky/). It will automatically format and lint your staged files before committing.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [JWT](https://jwt.io/)
- [bcrypt](https://www.npmjs.com/package/bcrypt)
- [Joi](https://joi.dev/)
- [Redis](https://redis.io/)
- [Nodemailer](https://nodemailer.com/)
- [Winston](https://github.com/winstonjs/winston)
```

[Back to top](#top)
