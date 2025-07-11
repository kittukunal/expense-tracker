import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import connectDB from "./config/db.js";

import userRoutes from "./routes/userRoutes.js";
import incomeRoutes from "./routes/incomeRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";

import authenticateUser from "./middlewares/authenticateUser.js";

// ⚠️⚠️⚠️ Note ⚠️⚠️⚠️
// If you're a developer viewing this code in my repository, please make sure to create your own .env file with the necessary environment variables as it is not provided in this repository.

// env variables configuration
dotenv.config();

// App Configuration
const PORT = process.env.PORT || 3000;
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configurations

const allowedOrigins = [
  "http://localhost:8080",
  "https://expense-track-frontend-nine.vercel.app",
  "https://expense-tracker.kunalyadav.site"
  // ✅ your Vercel domain
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // ✅ VERY IMPORTANT for cookies
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       const allowedOrigins = [
//         "http://localhost:8080",
//         "https://expense-track-frontend-gy1p.vercel.app",
//       ];

//       if (!origin || allowedOrigins.includes(origin)) {
//         callback(null, true);
//       } else {
//         callback(new Error("Not allowed by CORS"));
//       }
//     },
//     credentials: true,
//   })
// );


// Routes
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/incomes",authenticateUser, incomeRoutes);
app.use("/api/v1/expenses",authenticateUser, expenseRoutes);

// Start Server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server started on PORT ${PORT}!`);
    });
  } catch (error) {
    console.log(`Error in starting the server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
// Initial backend structure
