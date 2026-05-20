import qdrantClient from "./config/qdrant.js";

const createIndex = async () => {
  try {
    console.log("Creating payload index for frameworkId...");
    await qdrantClient.createPayloadIndex("frameworks", {
      field_name: "frameworkId",
      field_schema: "keyword",
    });
    console.log("Index created successfully!");
  } catch (error) {
    console.error("Error creating index:", error.message);
  }
};

createIndex();


