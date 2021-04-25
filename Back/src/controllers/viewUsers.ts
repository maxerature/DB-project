import express from "express";
import createError from "http-errors";
import { AuthSchema } from "../config/Validation/auth";
import MySQL from "../config/Init/initTypeMySQL";
import { count } from "node:console";


function getCustomers(con, firstName, lastName, email, phoneNumber) {
    return new Promise((resolve) => {
        let count = 0;
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

        if(firstName != '') {
            query += `\n\
            WHERE\n\
                customers.firstName = \"${firstName}\"`
            count++;
        }
        if(lastName != '') {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `customers.lastName = \"${lastName}\"`
        }
        if(email != ``) {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `customers.emailAddress = \"${email}\"`
        }
        if(phoneNumber != ``) {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `customers.phoneNumber = \"${phoneNumber}\"`
        }
        let divString = ``;
        con.connect(function (err) {
            if(err) throw err;
            con.query(query, function (err, result) {
                if(err) throw err;

                divString += `\
                    <h3>Customers</h3>
                    <table class="blueTable">
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
                resolve(divString);
            })
        })
        
    })
}

function getEmployees(con, firstName, lastName, email, phoneNumber) {
    return new Promise((resolve) => {
        let count = 0;
        let query = `\
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

        if(firstName != '') {
            query += `\n\
            WHERE\n\
                employees.firstName = \"${firstName}\"`
            count++;
        }
        if(lastName != '') {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `employees.lastName = \"${lastName}\"`
        }
        if(email != ``) {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `employees.emailAddress = \"${email}\"`
        }
        if(phoneNumber != ``) {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `employees.phoneNumber = \"${phoneNumber}\"`
        }
        let divString = ``;
        con.connect(function (err) {
            if(err) throw err;
            con.query(query, function (err, result) {
                if(err) throw err;

                divString += `\
                <h3>Employees</h3>
                <table class="blueTable">
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
                resolve(divString);
            })
        })
        
    })
}

function getSuppliers(con, firstName, email, phoneNumber) {
    return new Promise((resolve) => {
        let count = 0;
        let query = `\
        SELECT
            supplierName,
            emailAddress,
            phoneNumber,
            username
        FROM suppliers`

        if(firstName != '') {
            query += `\n\
            WHERE\n\
                suppliers.supplierName = \"${firstName}\"`
            count++;
        }

        if(email != ``) {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `suppliers.emailAddress = \"${email}\"`
        }
        if(phoneNumber != ``) {
            if(count == 0) {
                query += `\n\
            WHERE\n`
            } else {
                query += `\n\
                 AND `
            }
            query += `suppliers.phoneNumber = \"${phoneNumber}\"`
        }
        let divString = ``;
        con.connect(function (err) {
            if(err) throw err;
            con.query(query, function (err, result) {
                if(err) throw err;

                divString += `\
                <h3>Suppliers</h3>
                <table class="blueTable">
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
                resolve(divString);
            })
        })
        
    })
}


export default {
    viewUsers: async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {
        try {
            const {customers, suppliers, employees, firstName, lastName, email, phoneNumber} = req.body;

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
            //If customers checked, get custoemrs
            if(customers) {
                divString += await getCustomers(con, firstName, lastName, email, phoneNumber);
            }
            if(employees) {
                divString += await getEmployees(con, firstName, lastName, email, phoneNumber);
            }
            if(suppliers) {
                divString += await getSuppliers(con, firstName, email, phoneNumber);
            }
            res.json({success:divString})

        } catch(error) {
            res.json({Error: "Error.  Could not checkout."})
        }
    }
}