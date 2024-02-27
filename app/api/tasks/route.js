import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { Construction } from "lucide-react";
const uri =
  "mongodb+srv://rutunj3:bdIWvHBPdZUFy0D5@cluster0.r8jddph.mongodb.net/";
const client = new MongoClient(uri);
export async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    await initializeCounter();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  try {
    await client.close();
    console.log("Closed MongoDB connection");
  } catch (error) {
    console.error("Error closing MongoDB connection:", error);
    throw error;
  }
}
const database = client.db("crud-todos");
const tasksCollection = database.collection("tasks");

export async function GET(request) {
  try {
    const tasks = await tasksCollection.find().toArray();
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Error fetching data from MongoDB:", error);
    return NextResponse.json({ status: "error", message: error.message });
  }
}

export async function POST(request) {
  try {
    let body = "";
    for await (const chunk of request.body) {
      body += chunk;
    }
    const parsedBody = JSON.parse(body);
    console.log("POST", parsedBody);
    const result = await tasksCollection.insertOne(parsedBody);
    return NextResponse.json({ status: "success", data: result.ops[0] });
  } catch (error) {
    console.error("Error inserting data into MongoDB:", error);
    return NextResponse.json({ status: "error", message: error.message });
  }
}

export async function PUT(request) {
  try {
    let body = "";
    for await (const chunk of request.body) {
      body += chunk;
    }
    const { id, ...updateFields } = JSON.parse(body);
    console.log("INTER updateTask:", id);

    const result = await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateFields }
    );

    if (result.modifiedCount === 0) {
      return NextResponse.json({
        status: "warning",
        message: "No tasks were updated",
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Task updated successfully",
    });
  } catch (error) {
    console.error("Error updating data in MongoDB:", error);
    return NextResponse.json({ status: "error", message: error.message });
  }
}

export async function DELETE(request) {
  try {
    let body = "";
    for await (const chunk of request.body) {
      body += chunk;
    }
    const id = JSON.parse(body);
    const filter = { _id: new ObjectId(id) };
    const result = await tasksCollection.deleteOne(filter);

    if (result.deletedCount === 0) {
      return NextResponse.json({
        status: "warning",
        message: "No tasks were deleted",
      });
    }

    return NextResponse.json({
      status: "success",
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting data from MongoDB:", error);
    return NextResponse.json({ status: "error", message: error.message });
  }
}
