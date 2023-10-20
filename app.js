const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const blogsRoutes = require("./routes/blogsRoutes.js");
const usersRoutes = require("./routes/usersRoutes.js");
const swaggerOptions = require("./Documentation/swagger.js");
const { connectDatabase } = require("./database.js");
const cors = require("cors");
const compression = require("compression");
const path = require("path");
const helmet = require("helmet");

const app = express();
app.use(morgan("dev"));
connectDatabase();

// Middleware setup

app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "Views"));
//routes configuration
app.use("/api/v1/ped/", blogsRoutes);
app.use("/api/v1/ped/", usersRoutes);

// Swagger documentation setup
const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocs));

// Default route
app.get("/", (req, res) => {
  res.status(200);
  res.render("index.ejs");
});

// Error handling
app.use((req, res) => {
  res.status(404);
  res.render("404");
});
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
module.exports = app;
