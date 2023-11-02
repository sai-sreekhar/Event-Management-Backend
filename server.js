const app = require("./app");
const { connectToDatabase } = require("./src/configs/db.config");

const PORT = process.env.PORT || 8080;

// Connect to the database
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server Up and Running on port ${PORT}...`);
    });
  })
  .catch((error) => {
    console.error("Unable to start the server:", error);
  });
