import { createPool } from "mysql2";
let pass = "password"
const foreignHost = "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com";
const localHost = "localhost";
const hostUsed = localHost;

var MySQL = createPool({
  host: hostUsed,
  user: "root",
  password: "password",
  port: 3306,
  database: "databases_project",
});

MySQL.getConnection((err) => {
  if (err) throw console.error("Unable to connect to the database:", err);
  console.log("MySQL Connected.");
});
process.on("SIGINT", async () => {
  await MySQL.end();
  process.exit(0);
});

export default MySQL;
