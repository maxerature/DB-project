import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";

export default {
  checkoutPopulate: async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      const {unique, counts} = req.body;


      let first = true;

      //Connect to sql
      var mysql = require('mysql2');

      var con = await mysql.createConnection({
          host: "localhost",
          user: "root",
          password: "password",
          port: 3306,
          database: "databaseproject"
      });

      //Set query
      let query = `
      SELECT\n\
        name,\n\
        listPrice\n\
      FROM Products\n\
      WHERE\n`

      //Attach product numbers
      for(let object of unique) {
        if(first) {
          first = false;
        } else {
          query += `OR `
        }
        query += `\
          productID = ${object}\n`
      }
      query += `;`;

      //Run query
      con.connect(function(err) {
        if(err) throw err;
        con.query(query, function (err, result) {
          if(err) throw err;

          let total = 0;
          let divString = `
          <table style="width:100%">\n\
            <tr>\n\
              <th>Count</th>\n\
              <th>Product</th>\n\
              <th>Price</th>\n\
            </tr>\n`
          
          let objNum = 0;
          for(let object of result) {
            total += counts[objNum]*object.listPrice;
            divString += `
            <tr>\n\
              <th>${counts[objNum]}</th>\n\
              <th>${object.name}</th>\n\
              <th>\$${(object.listPrice*counts[objNum])}</th>\n\
            </tr>\n`
            objNum++;
          }
          divString += `
          </table>`
          let price = `<b>$` + total + "</b>";

          res.json({success: divString, price:price});
          
        })
      })
        
    } catch(error) {
      res.json({Error: "Error.  Could not retrieve cart."})
    }
  }
}



