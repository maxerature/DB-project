import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";

export default {
    viewUsers: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            //Connect to sql
            var mysql = require('mysql2');

            var con = await mysql.createConnection({
                host: "database-1.cdpxda8fq2yw.us-east-2.rds.amazonaws.com",
                user: "root",
                password: "databaseproject",
                port: 3306,
                database: "databases_project"
            });

            let divString = ``;

            //Get Customers
            let query = `\
            SELECT 
                customers.firstName,
                customers.lastName,
                customers.userName,
                DATE(customers.dateOfBirth)
                    as dateOfBirth,
                customers.emailAddress,
                customers.phoneNumber,
                customers.membershipStatus,
                customers.rewardsPoints
            FROM customers`
            con.connect(function(err) {
                if(err) throw err;
                con.query(query, function (err, result) {
                    if(err) throw err;
                    //Create Customers table
                    divString += `\
                    <h3>Customers</h3>
                    <table>
                        <tr>
                            <th>Name</th>
                            <th>Username</th>
                            <th>Birthday</th>
                            <th>Email Address</th>
                            <th>Phone Number</th>
                            <th>Membership Status</th>
                            <th>Rewards Points</th>
                        </tr>`
                    for(let object of result) {
                        let points = ``;
                        let status = ``;
                        if(object.membershipStatus == 0) {
                            points = `-`;
                            status = `No`
                        } else {
                            status = `Yes`
                        }
                        console.log(object)
                        divString += `\
                        <tr>
                            <th>${object.firstName} ${object.lastName}</th>
                            <th>${object.userName}</th>
                            <th>${object.dateOfBirth}</th>
                            <th>${object.emailAddress}</th>
                            <th>${object.phoneNumber}</th>
                            <th>${status}</th>
                            <th>${points}</th>
                        </tr>`
                    }
                    divString += `</table>`

                    //Get Suppliers
                    query = `\
                    SELECT
                        supplierName,
                        emailAddress,
                        phoneNumber,
                        username
                    FROM suppliers`

                    con.connect(function(err) {
                        if(err) throw err;
                        con.query(query, function (err, result) {
                            if(err) throw err;
                            //Create Customers table
                            divString += `\
                            <h3>Suppliers</h3>
                            <table>
                                <tr>
                                    <th>Name</th>
                                    <th>Username</th>
                                    <th>Email Address</th>
                                    <th>Phone Number</th>
                                </tr>`
                            for(let object of result) {
                                divString += `\
                                <tr>
                                    <th>${object.supplierName}</th>
                                    <th>${object.username}</th>
                                    <th>${object.emailAddress}</th>
                                    <th>${object.phoneNumber}</th>
                                </tr>`
                            }
                            divString += `</table>`
        
                            //Get Employees
                            query = `\
                            SELECT
                                firstName,
                                lastName,
                                username,
                                employeeID,
                                position,
                                DATE(dateOfBirth)
                                    AS date,
                                emailAddress,
                                phoneNumber
                            FROM employees`
                            con.connect(function(err) {
                                if(err) throw err;
                                con.query(query, function (err, result) {
                                    if(err) throw err;
                                    console.log(result)
                                    //Create Employees table
                                    divString += `\
                                    <h3>Employees</h3>
                                    <table>
                                        <tr>
                                            <th>Employee ID</th>
                                            <th>Position</th>
                                            <th>Name</th>
                                            <th>Username</th>
                                            <th>Birthday</th>
                                            <th>Email Address</th>
                                            <th>Phone Number</th>
                                        </tr>`
                                    for(let object of result) {
                                        let points = ``;
                                        if(object.membershipStatus == 0) {
                                            points = `-`;
                                        }
                                        divString += `\
                                        <tr>
                                            <th>${object.employeeID}</th>
                                            <th>${object.position}</th>
                                            <th>${object.firstName} ${object.lastName}</th>
                                            <th>${object.username}</th>
                                            <th>${object.date}</th>
                                            <th>${object.emailAddress}</th>
                                            <th>${object.phoneNumber}</th>
                                        </tr>`
                                    }
                                    divString += `</table>`;
                
                                    res.json({success:divString})
                                })
                            })
                        })
                    })
                })
            })
        } catch(error) {
            res.json({Error: "Error.  Could not checkout."})
        }
    }
}