import { createPool } from "mysql2";
let pass = "password"
var MySQL = createPool({
  host: "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com",
  user: "root",
  password: "databaseproject",
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
