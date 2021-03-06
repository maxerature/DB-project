import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";

export default {
  login: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      // await AuthSchema.validateAsync(req.body);
      const { username, password, userType } = req.body;

      let selectTable = "";
      if(userType == "customer") {
        selectTable = "customers"
      } else if (userType == "employee") {
        selectTable = "employees"
      } else {
        selectTable = "suppliers"
      }

      let currUser: any;

      var mysql = require('mysql2');

      const foreignHost = "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com";
      const localHost = "localhost";
      const hostUsed = foreignHost;
      var con = await mysql.createConnection({
          host: hostUsed,
          user: "root",
          password: "databaseproject",
          port: 3306,
          database: "databases_project"
      });

      let query = `SELECT\n\
        emailAddress\n\
      FROM ${selectTable}\n\
      WHERE\n\
        username = \"${username}\"\n\
        AND ${selectTable}.password = MD5(\"${password}\");`
      
      con.connect(function(err) {
        if(err) throw err;
        con.query(query, function (err, result) {
          if(err) throw err;

          if(result == null || result == '') {
            res.json({error: "Error: Login failed\nUsername does not exist, or password was typed incorrectly."});
          } else {
            if (result[0].emailAddress == '') {
              res.json({ success: "register.html" });
            } else {
              res.json({success: "index.html"})
            }
          }
        });
      });
    } catch (error) {
      if (error.isJoi === true)
        return next(new createError.BadRequest("Invalid Username/Password"));
      next(error);
    }
  },
};
