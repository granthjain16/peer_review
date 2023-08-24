const fs = require("fs");
const puppeteer = require("puppeteer");
const { excelData, peerResponsesData } = require("./Readexcel.js");

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  const cssContent = fs.readFileSync("./generatePDFs.css", "utf-8");
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
        <link rel="stylesheet" type="text/css" href="./generatePDFs.css">
      </head>

      <body>
      <style>${cssContent}</style>
      <h1 class="header_text">${email}</h1>
       <h2 class="s_response"> Self Response:</h2>
        <p class="core_projects">${
          data[
            "List the core projects you have completed in the past 6 months, along with the impact they've had on customer experience and the business."
          ]
        }</p>
        
        <h2 class="peer_res">Peer Responses</h2>
        ${peerResponsesForEmail
          .map(
            (peerResponse, index) => `
          <div key="${index}" class="res_main">
          <h3 class"res_main_top">Peer Response: 
          <strong>${index + 1}</strong>
          </h3>
          <div class="res_body">
          <ul>
          <li class="cust_obs">How would you rate the team member on <strong>"Customer Obsession"</strong> ?:
          <br>  
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'How would you rate the team member on "Customer Obsession"?'
            ]
          }</li>
          <li class="customer_obs">Highlight a few instances of why you gave the team member a particular rating in <strong>"Customer Obsession"</strong> : 
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating in "Customer Obsession"'
            ]
          }
            </li>
            <li class="insisting">How would you rate the team member on <strong>"Insisting on Highest Standards"</strong> ?
            <br>
            &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'How would you rate the team member on "Insisting on Highest Standards"'
            ]
          }</li>
          <li class="highest">Highlight a few instances of why you gave the team member a particular rating on <strong>"Insisting on Highest Standards"</strong> :
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating on "Insisting on Highest Standards".'
            ]
          }</li>
          <li class="bias">How would you rate the team member on  <strong>"Bias For Action"</strong> :
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'How would you rate the team member on their "Bias for Action"'
            ]
          }</li>
          <li class="bias_action">Highlight a few instances of why you gave the team member a particular rating in <strong>"Bias For Action"</strong> :
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating in "Bias For Action"'
            ]
          }</li>
          <li class="ownership">How would you rate the team member on <strong>"Ownership"</strong> :
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse['How would you rate the team member on "Ownership"']
          }</li>
          <li class="rating">Highlight a few instances of why you gave the team member a particular rating on <strong>"Ownership"</strong>:
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${
            peerResponse[
              'Highlight a few instances of why you gave the team member a particular rating on "Ownership"'
            ]
          }</li>
          <li class="diff">What should this person do differently ?:
          <br>
          &nbsp;<strong class="s_underline">Ans </strong>:&nbsp;
          ${peerResponse["What should this person do differently?"]}</li>
          </ul>
          </div>
          </div>
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
