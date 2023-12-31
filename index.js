import express from "express";
import axios from "axios";
import cors from "cors";
// import { storeDataSmart, retrieveDataSmart } from "./smartContract.js";
import {
  connect,
  closeConnection,
  createCompanyAuth,
  createCompany,
  readCompanyData,
  addCompanyProduct,
  readCompanyAuth,
  readHederaData,
  addHederaData,
} from "./mongoDBMethods.js";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "node:crypto";

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.json());
const __dirname = dirname(fileURLToPath(import.meta.url));
let currentCompany = "",
  qrCodeImg;

connect();

app.get("/", (req, res) => {
  res.render("index.ejs");
});

//sign up
app.get("/signup", (req, res) => {
  res.render("signup.ejs");
});

app.post("/signup", async (req, res) => {
  try {
    currentCompany = req.body.name;
    const data = {
      name: req.body.name,
      emailId: req.body.emailId,
      password: req.body.password,
    };
    console.log(data);
    const arrCompany = await readCompanyData();
    const companyData = {
      name: currentCompany,
      unqId: arrCompany.length + 1,
      arr: [],
    };
    await createCompanyAuth(data);
    await createCompany(companyData);
    res.status(200).send("Sucessfully Registered!");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//login
app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const arr = await readCompanyAuth();
    const user = arr.find(
      (user) => user.emailId === emailId && user.password === password
    );
    if (user) {
      currentCompany = user.name;
      res.status(200).send("Login Successful");
    } else res.status(401).send("Authentication Failed");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
});

//company dashboard
app.get("/dashboard", (req, res) => {
  res.render("dashboard.ejs", { qrCodeImg: qrCodeImg });
});

app.post("/dashboard", async (req, res) => {
  let arrCompany = await readCompanyData();
  let currObj = arrCompany.find((company) => company.name === currentCompany);
  let index = arrCompany.indexOf(currObj);
  const unqId = currObj.arr.length + 1;

  // store product data at database
  try {
    const data = {
      productName: req.body.productName,
      serialNumber: req.body.serialNumber,
      manufacturingDate: req.body.manufacturingDate,
    };

    await addCompanyProduct(currentCompany, data);

    // generate hashcode and store and smartcontract
    const hashCode = hash(
      data.productName + data.serialNumber + data.manufacturingDate
    );

    const smartData = {
      unqId: unqId,
      hash: hashCode,
    };

    // storeDataSmart(smartData);

    // arrCompany = retrieveDataCompany();
    // console.log(arrCompany);
    // const arrSmart = retrieveDataSmart();
    // console.log(arrSmart);
    addHederaData(smartData);
    qrCodeImg = qrCodeGenerate(hashCode);
    res.status(200).send(qrCodeImg);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal server error!");
  }
});

//user checking authenticity
app.post("/check", async (req, res) => {
  try {
    const dataMongo = await readCompanyData();
    const dataSmart = await readHederaData();

    // Find the entry in dataSmart with the matching hash
    const smartEntry = dataSmart.find((entry) => entry.hash === req.body.hash);

    if (smartEntry) {
      // Find the entry in dataMongo with the matching unqId
      const obj = dataMongo.find((obj) => obj.unqId === smartEntry.unqId);

      if (obj && obj.serialNumber === req.body.serialNumber) {
        res.status(200).send("true");
      } else {
        res.status(200).send("false");
      }
    } else {
      res.status(200).send("false");
    }
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Internal Server Error");
  }
});

function hash(string) {
  return createHash("sha256").update(string).digest("hex");
}

function qrCodeGenerate(data) {
  return (
    "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" + data
  );
}

app.listen(port, (req, res) => {
  console.log(`Server is running at port ${port}`);
});

process.on("SIGINT", () => {
  closeConnection();
  process.exit();
});
