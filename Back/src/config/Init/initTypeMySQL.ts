import { createPool } from "mysql2";
let pass = "password"
var MySQL = createPool({
  host: "localhost",
  user: "root",
  password: pass,
  port: 3306,
  database: "softwareproject",
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
