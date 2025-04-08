const express = require("express");
const bodyParser = require("body-parser");
const app = express();

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Default route
app.get("/", (req, res) => {
    res.send("Server is running! Navigate to your pages.");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
