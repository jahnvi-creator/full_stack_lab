const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const PORT = 3000;

const dataFile = path.join(__dirname, "data", "items.json");

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/items", (req, res) => {
    const items = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    res.json(items);
});

app.post("/api/items", (req, res) => {

    const items = JSON.parse(fs.readFileSync(dataFile, "utf8"));

    const newItem = {
        id: Date.now(),
        type: req.body.type,
        name: req.body.name,
        description: req.body.description,
        location: req.body.location,
        date: req.body.date,
        contact: req.body.contact
    };

    items.push(newItem);

    fs.writeFileSync(
        dataFile,
        JSON.stringify(items, null, 4)
    );

    res.status(201).json(newItem);
});
// Mark an item as returned
app.put("/api/items/:id/return", (req, res) => {

    const items = JSON.parse(fs.readFileSync(dataFile, "utf8"));

    const item = items.find(
        (item) => item.id === Number(req.params.id)
    );

    if (!item) {
        return res.status(404).json({
            message: "Item not found"
        });
    }

    item.status = "Returned";

    fs.writeFileSync(
        dataFile,
        JSON.stringify(items, null, 4)
    );

    res.json(item);
});

app.listen(PORT, () => {
    console.log("Campus Lost and Found Hub");
    console.log(`Server running at http://localhost:${PORT}`);
});