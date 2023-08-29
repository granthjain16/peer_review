
const fs = require("fs");
const puppeteer = require("puppeteer");
const { excelData, peerResponsesData } = require("./Readexcel.js");

function generateStars(rating) {
  const numStars = parseInt(rating);
  const starIcon = "★";
  const stars = starIcon.repeat(numStars);
  return stars;
}

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cssContent = fs.readFileSync("generatepdfs.css", "utf-8");
  
  
  const questionList = [
    'How would you rate the team member on "Customer Obsession"?',
    'Highlight a few instances of why you gave the team member a particular rating in "Customer Obsession"',
    'How would you rate the team member on their "Bias for Action"',
    'Highlight a few instances of why you gave the team member a particular rating in "Bias For Action"',
    'How would you rate the team member on "Insisting on Highest Standards"',
    'Highlight a few instances of why you gave the team member a particular rating on "Insisting on Highest Standards".',
    'How would you rate the team member on "Ownership"',
    'Highlight a few instances of why you gave the team member a particular rating on "Ownership"',
    "What should this person do differently?",
  ];

  for (const data of excelData) {
    const email = "akarsh@growsimplee.com";
    const userData = peerResponsesData.filter(
      (res) =>
        res["E-mail Id of the team member you are filling this form for"] ===
        email
    );
    const performanceMetrics = {
      "Customer Obsession": data['How would you rate yourself on "Customer Obsession"?'],
      "Bias for Action": data['How would you rate the team member on their "Bias for Action"'],
      "Ownership": data['How would you rate the team member on "Ownership"'],
      "Insisting on Highest Standards": data['How would you rate yourself on "Insisting on Highest Standards?"'],
      "Cumulative": data["Cumulative"]
    };
    
    function calculateAverageRatings(data) {
      const ratings = [
        parseFloat(data["Customer Obsession"]),
        parseFloat(data["Bias for Action"]),
        parseFloat(data["Ownership"]),
        parseFloat(data["Insisting on Highest Standards"])
      ];
    
      const total = ratings.reduce((sum, rating) => sum + rating, 0);
      const average = total / ratings.length;
      return average.toFixed(2);

    }
  
    const cumulativeRating = calculateAverageRatings(performanceMetrics);
   
    const columnsToExclude = [
      "E-mail Id of the team member you are filling this form for",
      "Timestamp",
      "Email address"
      
    ];

    const selfResponseQuestions = Object.keys(data).filter(
      (columnName) => !columnsToExclude.includes(columnName)
    );


    const selfRating = calculateAverageRatings(data);

   
  

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head class="header">
        <title>${email} - Peer Responses</title>
        <link rel="stylesheet" type="text/css" href="generatepdfs.css">
      </head>
      <body>
      <div class="header-logo">
      <img src="gs-logo-black.svg" alt="Header Logo" class="logo-image">
    </div>
    <h1>SELF EVALUATION RESULTS:</h1>
        <table>
          <tr class="blue">
            <th></th>
            <th>Customer Obsession</th>
            <th>Bias for Action</th>
            <th>Ownership</th>
            <th>Insisting on Highest Standards</th>
            <th>Cumulative</th>
          </tr>
          <tr>
            <td>Self</td>
            <td>${performanceMetrics["Customer Obsession"]}</td>
            <td>${performanceMetrics["Bias for Action"]}</td>
            <td>${performanceMetrics["Ownership"]}</td>
            <td>${performanceMetrics["Insisting on Highest Standards"]}</td>
       
          
          <td colspan="5">${cumulativeRating}</td>
        </tr>
        <tr>
        <td>Final Rating</td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
        <td></td>
      </tr>
         
        </table>
    <h1>Ratings:</h1>
        <table>
          <tr>
            <th>Rating</th>
            <th>Meaning</th>
            <th>Performance Bonus %</th>
          </tr>
          <tr>
            <td>1.0</td>
            <td>Poor</td>
            <td>0.0%</td>
          </tr>
          <tr>
            <td>2.0</td>
            <td>Improvement</td>
            <td>0.0%</td>
          </tr>
          <tr>
            <td>3.0</td>
            <td>Good</td>
            <td>10.0%</td>
          </tr>
          <tr>
            <td>3.5</td>
            <td>Good+</td>
            <td>12.5%</td>
          </tr>
          <tr>
            <td>4.0</td>
            <td>Great</td>
            <td>15.0%</td>
          </tr>
          <tr>
            <td>4.5</td>
            <td>Great+</td>
            <td>17.5%</td>
          </tr>
          <tr>
            <td>5.0</td>
            <td>Outstanding</td>
            <td>20.0%</td>
          </tr>
        </table>
        <h1>Self Responses:</h1>
        ${selfResponseQuestions
          .map((question) => {
            return `
              <h2 class="self-response-heading">${question}</h2>
              <p class="self-responses">${data[question]}</p>
            `;
          })
          .join("")}
        
        <h1>Peer Responses:</h1>
        <style>${cssContent}</style>
       
        ${questionList
          .map((question) => {
            return `
              <h2 class="question-heading">${question}</h2>
              <div class="peer-responses">
                ${userData
                  .map((response) => {
                    const questionResponse = response[question];
                    if (
                      questionResponse !== null &&
                      questionResponse !== undefined
                    ) {
                      return `
                        <p class="peer-response">
                          ${response["Name"]}: ${
                        question.includes("rate")
                          ? generateStars(questionResponse)
                          : questionResponse
                      }</p>
                      `;
                    }
                    return ""; 
                  })
                  .join("")}
              </div>
            `;
          })
          .join("")}
          <div class="footer-logo">
          <img src=" alt="Footer Logo" class="logo-image">
        </div>
      </body>
      </html>
    `;
    const pdfFileName = `${email}_ANmolPeerResponses.pdf`;
    await page.setContent(htmlContent);
    await page.pdf({ path: pdfFileName, format: "A4" });
    console.log(`Generated PDF: ${pdfFileName}`);
  }
  await browser.close();
})();
