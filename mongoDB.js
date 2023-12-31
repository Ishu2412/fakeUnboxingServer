import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: String,
  emailId: String,
  password: String,
});

const dataSchema = new mongoose.Schema({
  name: String,
  unqId: Number,
  arr: [],
});

const hederaSchema = new mongoose.Schema({
  unqId: Number,
  hash: String,
});

const CompanyAuthMongo = mongoose.model("CompanyAuth", authSchema);
const CompanyDataMongo = mongoose.model("CompanyData", dataSchema);
const HederaData = mongoose.model("HederaData", hederaSchema);

export { CompanyAuthMongo, CompanyDataMongo, HederaData };
