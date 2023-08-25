const fs = require("fs");
const puppeteer = require("puppeteer");
const { excelData, peerResponsesData } = require("./Readexcel.js");
console.log(peerResponsesData);
function generateStars(rating) {
  numStars = parseInt(rating);
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
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head class="header">
        <title>${email} - Peer Responses</title>
        <link rel="stylesheet" type="text/css" href="generatepdfs.css">
      </head>
      <body>
        <h1>Peer Responses</h1>
        <style>${cssContent}</style>
       
        ${questionList
          .map((question) => {
            const peerResponsesForQuestion = peerResponsesData
              .filter(
                (peerData) =>
                  peerData[
                    "E-mail Id of the team member you are filling this form for"
                  ] === email
              )
              .map((peerData) => peerData[question])
              .filter(Boolean);

            console.log(peerResponsesForQuestion);
            return `
              <h2 class="question-heading">${question}</h2>
              <div class="peer-responses">
            
             
                ${peerResponsesForQuestion
                  .map(
                    (response, index) => `
                    
                    <p class="peer-response">
                    
                    ${name}: ${
                      question.includes("rate")
                        ? generateStars(response)
                        : response
                    }</p>
                  `
                  )
                  .join("")}
              </div>
            `;
          })
          .join("")}
         
      </body>
      </html>
    `;

    const pdfFileName = `${email}_PeerResponses.pdf`;

    await page.setContent(htmlContent);
    await page.pdf({ path: pdfFileName, format: "A4" });

    console.log(`Generated PDF: ${pdfFileName}`);
  }

  await browser.close();
})();
