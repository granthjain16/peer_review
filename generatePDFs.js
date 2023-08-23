const fs = require("fs");
const puppeteer = require("puppeteer");
const { excelData, peerResponsesData } = require("./Readexcel.js");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const cssContent = fs.readFileSync("generatepdfs.css", "utf-8");
  for (const data of excelData) {
    const email = data["Email address"];
    const peerResponsesForEmail = peerResponsesData.filter(
      (peerData) =>
        peerData[
          "E-mail Id of the team member you are filling this form for"
        ] === "priyamvada@growsimplee.com"
    );

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>${email} - Responses</title>
        
        <link rel="stylesheet" type="text/css" href="generatepdfs.css">
     
      </head>
      <body>
      <style>${cssContent}</style>
        <h1>Self Response:</h1>
        <p class="core_projects">${
          data[
            "List the core projects you have completed in the past 6 months, along with the impact they've had on customer experience and the business."
          ]
        }</p>
        
        <h1 class="peer_res">Peer Responses:</h1>
        ${peerResponsesForEmail
          .map(
            (peerResponse, index) => `
          <h2>Peer Response ${index + 1}:</h2>
          <p class="cust_obs">How would you rate the team member on "Customer Obsession"?: ${
            peerResponse[
              'How would you rate the team member on "Customer Obsession"?'
            ]
          }</p>
          <p class="customer_obs">Highlight a few instances of why you gave the team member a particular rating in "Customer Obsession": ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating in "Customer Obsession"'
            ]
          }</p>
          <p class="insisting">How would you rate the team member on "Insisting on Highest Standards"? ${
            peerResponse[
              'How would you rate the team member on "Insisting on Highest Standards"'
            ]
          }</p>
          <p class="highest">Highlight a few instances of why you gave the team member a particular rating on "Insisting on Highest Standards": ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating on "Insisting on Highest Standards".'
            ]
          }</p>
          <p class="bias">How would you rate the team member on "Bias for Action": ${
            peerResponse[
              'How would you rate the team member on their "Bias for Action"'
            ]
          }</p>
          <p class="bias_action">Highlight a few instances of why you gave the team member a particular rating in "Bias For Action": ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating in "Bias For Action"'
            ]
          }</p>
          <p class="ownership">How would you rate the team member on "Ownership": ${
            peerResponse['How would you rate the team member on "Ownership"']
          }</p>
          <p class="rating">Highlight a few instances of why you gave the team member a particular rating on "Ownership": ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating on "Ownership"'
            ]
          }</p>
          <p class="diff">What should this person do differently?: ${
            peerResponse["What should this person do differently?"]
          }</p>
        `
          )
          .join("")}
      </body>
      </html>
    `;

    const pdfFileName = `${email}.pdf`;

    await page.setContent(htmlContent);
    await page.pdf({ path: pdfFileName, format: "A4" });

    console.log(`Generated PDF: ${pdfFileName}`);
  }

  await browser.close();
})();
