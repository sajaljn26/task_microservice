const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const port = 3002;
const amqplib = require("amqplib");

app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect("mongodb://mongo:27017/tasks", {
   
})
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt : {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model("Task", TaskSchema);

let channel,connection;

async function connectToRabbitMQWithRetry(retries = 5,delay = 3000){
    while(retries > 0){
        try {
            connection = await amqplib.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_created");
            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.error("Failed to connect to RabbitMQ, retrying...",error);
            retries--;
            await new Promise(resolve => setTimeout(resolve,delay));
            delay *= 2;
        }
    }
    throw new Error("Failed to connect to RabbitMQ after multiple retries");
}



app.post('/tasks',async(req,res)=>{
    const  {title,description,userId} = req.body;
    try {
        const task = new Task({title,description,userId});
        await task.save();

        const message = {taskId : task._id,userId,title};
        if(!channel){
            return res.status(500).json({error: "RabbitMQ connection not established"});
        }

        await channel.sendToQueue("task_created",Buffer.from(JSON.stringify(message)));
        console.log("Message sent to RabbitMQ");

        res.status(201).json(task);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to create task"});
    }
})

app.get('/tasks',async(req,res)=>{
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: "Failed to fetch tasks"});
    }
})

app.listen(port, async () => {
    console.log(`Task service is running on port ${port}`);
    try {
        await connectToRabbitMQWithRetry();
    } catch (error) {
        console.error("Failed to connect to RabbitMQ:", error);
    }
})