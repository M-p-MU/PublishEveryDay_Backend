/* eslint-disable no-undef */
const express = require("express");
const swaggerJSDoc = require("swagger-jsdoc");
const morgan = require("morgan");
const swaggerUI = require("swagger-ui-express");
const blogsRoutes = require("./routes/blogsRoutes");
const usersRoutes = require("./routes/usersRoutes");
const swaggerOptions = require("./Documentation/swagger.js");
const { connectDatabase } = require("./database.js");
const cors = require("cors");
const compression = require("compression");
const methodOverride = require("method-override");
const path = require("path");
const helmet = require("helmet");
// const fs = require("fs");
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
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "Views"));
// const images = path.join(__dirname, "blogImages");
// app.use("/blogImages", express.static(images));
// app.get("/blogImages/:imageName", (req, res) => {
//   const imagePath = path.join(images, req.params.imageName);

  
//   if (fs.existsSync(imagePath)) {
//     res.sendFile(imagePath);
//   } else {
//     res.status(404).json({ error: "Image not found or invalid image name" });
//   }
// });
const images = path.join(__dirname, "blogImages");
app.use("/blogImages", express.static(images));


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
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("404");
});
module.exports = app;
