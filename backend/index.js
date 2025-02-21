const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `${process.env.MONGO_URI}`;

// Middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Connect to MongoDB
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const db = await client.connect();
    const taskCollection = db.db("To-do").collection("tasks");
    const userCollection = db.db("To-do").collection("users");

    // POST route to add a task
    app.post("/tasks", async (req, res) => {
      const task = req.body;
      const result = await taskCollection.insertOne(task);
      res.send(result);
    });

    // GET route
    app.get("/tasks", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const medicine = await taskCollection.find(query).toArray();
      res.send(medicine);
    });

    // UPDATE route
    app.put(
      "/tasks/:id",

      async (req, res) => {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const data = req.body;

        const { title, description, status, category, dueDate } = data;
        const updated = {
          $set: {
            title: title,
            description: description,
            status: status,
            category: category,
            dueDate: dueDate,
          },
        };
        const result = await taskCollection.updateOne(filter, updated);
        res.send(result);
      }
    );
    //drag nd drop
    // backend (server.js)

    // app.patch("/tasks/:taskId/move", async (req, res) => {
    //   const { taskId } = req.params;
    //   const { category } = req.body; // New category to move the task to

    //   try {
    //     // Ensure the task exists
    //     const task = await taskCollection.findOne({
    //       _id: new ObjectId(taskId),
    //     });
    //     if (!task) {
    //       return res.status(404).json({ error: "Task not found" });
    //     }

    //     // Update the category of the task
    //     const updatedTask = await taskCollection.updateOne(
    //       { _id: new ObjectId(taskId) },
    //       { $set: { category } } // Update the category
    //     );

    //     if (updatedTask.modifiedCount === 0) {
    //       return res.status(400).json({ error: "Task not updated" });
    //     }

    //     res
    //       .status(200)
    //       .json({ message: "Task category updated", taskId, category });
    //   } catch (error) {
    //     console.error("Error updating task:", error);
    //     res.status(500).json({ error: "Error updating task" });
    //   }
    // });

    //delete
    // DELETE route to delete a task
    app.delete("/tasks/:taskId", async (req, res) => {
      const { taskId } = req.params;

      // Check if the taskId is valid
      if (!ObjectId.isValid(taskId)) {
        return res.status(400).json({ error: "Invalid taskId format" });
      }

      try {
        // Convert taskId to ObjectId
        const objectId = new ObjectId(taskId);

        // Delete the task
        const result = await taskCollection.deleteOne({ _id: objectId });

        if (result.deletedCount === 0) {
          return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully" });
      } catch (error) {
        console.error("Error deleting task:", error);
        res
          .status(500)
          .json({ message: "Error deleting task", error: error.message });
      }
    });

    // User save in db route
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };

      const isExist = await userCollection.findOne(query);
      if (isExist) {
        return res.send(isExist);
      }
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");
  } catch (error) {
    console.error(error);
  }
}

run().catch(console.dir);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
