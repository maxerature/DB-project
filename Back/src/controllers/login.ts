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
        selectTable = "Customers"
      } else if (userType == "employee") {
        selectTable = "Employees"
      } else {
        selectTable = "Suppliers"
      }

      let currUser: any;

      var mysql = require('mysql2');

      var con = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "password",
          port: 3306,
          database: "databaseproject"
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
            console.log(result);
            if (result[0].emailAddress == '') {
              res.json({ success: "ProfileManage.html" });
            } else {
              res.json({success: "ProfileComplete.html"})
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
