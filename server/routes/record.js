const express = require("express");

// Controls requests to various endpoints
const recordRoutes = express.Router();

const dbo = require("../db/conn");
const { Collection } = require("mongodb");

//Fetch all records of color data for the multDiv table
recordRoutes.route("/multDivTable").get(async function (req, res) {
 const find = dbo.getDb().collection("multiplication_chart").find({});
 const result = await find.toArray();
 res.json(result);
});

module.exports = recordRoutes;