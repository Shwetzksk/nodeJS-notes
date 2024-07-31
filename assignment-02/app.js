const express = require("express");
const app = express();
const PORT = 3000;

const domain = "https://ciphersprint.pulley.com";
const email = "kshwetakumari22@gmail.com";

async function fetch1(email) {
  try {
    const res = await fetch(`${domain}/${email}`);
    const data = await res.json();
    console.log(data);
    return data;
  } catch (err) {
    console.log("fetch-1 err", err);
  }
}

async function fetch2(encrypted_path) {
  try {
    const res = await fetch(`${domain}/${encrypted_path}`);
    const data = await res.json();
    console.log("fetch-2 data", data);
    return data;
  } catch (err) {
    console.log("fetch-2 err", err);
  }
}
async function fetch3(code) {
  try {
    const decoded = Buffer.from(code.split("_")[1], "base64").toString("ascii");
    const res = await fetch(`${domain}/task_${decoded}`);
    const data = await res.json();
    console.log("fetch-3 data", data);
    return data;
  } catch (err) {
    console.log("fetch-3 err", err);
  }
}

function circularLeftRotate(str, num) {
  return str.slice(num) + str.slice(0, num);
}
async function decodeHex(code) {
  const replacedChar = code.split("_")[1].replace(/[^a-fA-F0-9]/g, "");
  const decoded = Buffer.from(replacedChar, "hex").toString("hex");
  return decoded;
}
async function fetch4(code) {
  try {
    const decoded = await decodeHex(code);
    const res = await fetch(`${domain}/task_${decoded}`);
    const data = await res.json();
    console.log("fetch-4 data", data);
    return data;
  } catch (err) {
    console.log("fetch-4 err", err);
  }
}
async function fetch5(code) {
  try {
    const fetch1_data = await fetch1(email);
    const fetch2_data = await fetch2(fetch1_data.encrypted_path);
    const fetch3_data = await fetch3(fetch2_data.encrypted_path);
    const fetch4_data = await fetch4(fetch3_data.encrypted_path);

    if (fetch4_data) {
      const res = await fetch(
        `${domain}/task_${fetch4_data.encrypted_path.split("_")[1]}`
      );
      console.log(
        fetch4_data.encrypted_path,
        +fetch4_data.encryption_method.split(" ").at(-1),
        circularLeftRotate(
          fetch4_data.encrypted_path.split("_")[1],
          +fetch4_data.encryption_method.split(" ").at(-1)
        )
      );
      // const data = await res.json();
      console.log("fetch-5 res", res);
    }
  } catch (err) {
    console.log("fetch-5 err", err);
  }
}

fetch5();
app.use((req, res, next) => {
  console.log("Go through here!");

  next();
});
app.use("/users", (req, res, next) => {
  console.log("Users route!!");
  res.send("<html><body><h1>Users</h1></body></html>");
});
app.use("/", (req, res, next) => {
  console.log("Home route!!");
  res.send("<html><body><h1>Home</h1></body></html>");
});

app.listen(PORT);
