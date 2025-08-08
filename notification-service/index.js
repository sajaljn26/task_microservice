const amqp = require("amqplib");


async function start(){
    
        try {
            connection = await amqplib.connect("amqp://rabbitmq_node");
            channel = await connection.createChannel();

            await channel.assertQueue("task_created");
            console.log("Notification service is listening to messages");
           
            channel.consume("task_created",(msg)=>{
                 const taskData = json.parse(msg.content.toString());
                 console.log("Notification : NEW TASK: ",taskData.title);
                 console.log("Notification : NEW TASK: ",taskData);
                 channel.ack(msg);
            })

        } catch (error) {
            console.error("Failed to connect to RabbitMQ, retrying...",error);
            retries--;
            await new Promise(resolve => setTimeout(resolve,delay));
            delay *= 2;
        }
    }

start();
    
