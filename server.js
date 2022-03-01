const express = require("express");
const app = express();
const path = require("path");
const { v4: uuid } = require("uuid");
const fs = require("fs");

app.use(express.json());
app.use("/assets", express.static(__dirname + "/public/assets"));

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public", "notes.html"));
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

app.post("/api/notes", (req, res) => {
  const note = {
    ...req.body,
    id: uuid(),
  };
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    notes.push(note);
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      if (err) {
        res.status(400).json({ msg: "Error occured" });
      }
      res.send("Added");
    });
  });
});

app.delete("/api/notes/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    const newNotes = notes.filter((note) => note.id !== id);
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err) => {
      if (err) {
        res.status(400).json({ msg: "Error occured" });
      }
      res.send("Removed");
    });
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is up and running");
});
