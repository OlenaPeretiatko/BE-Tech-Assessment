const express = require("express");
const cors = require("cors");
const db = require("./app/models");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const init = async () => {
  try {
    await db.mongoose.connect(db.url);
    console.log("Connected to the database!");
  } catch (err) {
    console.error("Cannot connect to the database!", err);
    process.exit();
  }

  app.get("/", (req, res) => {
    res.json({ message: "Welcome to the application." });
  });

  require("./app/routes/acronym.routes")(app);

  app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  });

  const PORT = 8080;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  });
};

init();



