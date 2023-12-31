import mongoose from "mongoose";
import { CompanyAuthMongo, CompanyDataMongo } from "./mongoDB.js";

const uri =
  "mongodb+srv://ishu:lNwKH7FlCS8wwZBx@cluster0.bbugwp2.mongodb.net/?retryWrites=true&w=majority";

async function connect() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to the database");
  } catch (error) {
    console.error("Error connecting to the database", error);
  }
}

async function closeConnection() {
  try {
    await mongoose.connection.close();
    console.log("Connection closed");
  } catch (error) {
    console.error("Error closing connection", error);
  }
}

// Create company new authorization
async function createCompanyAuth(data) {
  try {
    const companyAuth = new CompanyAuthMongo(data);
    console.log(companyAuth);
    const result = await companyAuth.save();
    console.log(`User inserted with _id: ${result._id}`);
  } catch (error) {
    console.error("Error creating company authorization", error);
  }
}

//Create company
async function createCompany(data) {
  try {
    const company = new CompanyDataMongo(data);
    const result = await company.save();
    console.log(
      `Company created with _id: ${result._id}, name: ${result.name}`
    );
  } catch (error) {
    console.error("Error creating new company", error);
  }
}

// Read operation
async function readCompanyAuth() {
  try {
    const users = await CompanyAuthMongo.find({});
    console.log("Users retrieved:", users);
    return users;
  } catch (error) {
    console.error("Error retrieving users", error);
  }
}

async function readCompanyData() {
  try {
    const users = await CompanyDataMongo.find({});
    console.log("Company data retrieved:", users);
    return users;
  } catch (error) {
    console.error("Error retrieving users", error);
  }
}

// Update operation
async function addCompanyProduct(companyName, product) {
  try {
    const filter = { name: companyName };
    const update = { $push: { arr: product } };

    const result = await CompanyDataMongo.updateOne(filter, update);
    console.log(
      `Product added to ${companyName}: ${result.modifiedCount} modified`
    );
  } catch (error) {
    console.error("Error adding product to company", error);
  }
}

export {
  connect,
  closeConnection,
  createCompanyAuth,
  createCompany,
  readCompanyData,
  addCompanyProduct,
  readCompanyAuth,
};

// Connect to MongoDB
// connect()
//   .then(async () => {
//     // Perform CRUD operations
//     const userToInsert = { name: 'John Doe', age: 30 };
//     await createUser(userToInsert);

//     await readUsers();

//     const filterToUpdate = { name: 'John Doe' };
//     const updateData = { age: 31 };
//     await updateUser(filterToUpdate, updateData);

//     const filterToDelete = { name: 'John Doe' };
//     await deleteUser(filterToDelete);
//   })
//   .finally(() => {
//     // Close the connection when done
//     closeConnection();
//   });
