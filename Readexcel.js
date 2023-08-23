const fs = require("fs");
const xlsx = require("xlsx");

const workbook = xlsx.readFile("peer_review.xlsx");
const worksheet = workbook.Sheets[workbook.SheetNames[0]];
const excelData = xlsx.utils.sheet_to_json(worksheet);
const peerResponsesSheet = workbook.Sheets[workbook.SheetNames[1]];
const peerResponsesData = xlsx.utils.sheet_to_json(peerResponsesSheet);
module.exports = { excelData, peerResponsesData };
