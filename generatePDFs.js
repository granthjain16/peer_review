const fs = require("fs");
const puppeteer = require("puppeteer");
const { excelData, peerResponsesData, ratingsData } = require("./Readexcel.js");
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
    
    const selfData = excelData.filter(res => res["Email address"] === email);
    const userData = peerResponsesData.filter(
      res => res["E-mail Id of the team member you are filling this form for"] === email
    );
    const ratingsData2 = ratingsData.filter((res) => res["Email address"] === email);
    console.log(ratingsData2);
    let name = "";
    name = selfData.map(res => res["name"]);
    name = name[0];
    let sum1 = 0,
      sum2 = 0,
      sum3 = 0,
      sum4 = 0;
    let sum5 = 0.0;
    userData.map(res => {
      sum1 = sum1 + parseFloat(res['How would you rate the team member on "Customer Obsession"?']);
      (sum2 =
        sum2 + parseFloat(res['How would you rate the team member on their "Bias for Action"'])),
        (sum3 =
          sum3 +
          parseFloat(
            res['How would you rate the team member on "Insisting on Highest Standards"']
          )),
        (sum4 = sum4 + parseFloat(res['How would you rate the team member on "Ownership"']));
    });
    sum1 = (sum1 / userData.length).toFixed(2);
    sum2 = (sum2 / userData.length).toFixed(2);
    sum3 = (sum3 / userData.length).toFixed(2);
    sum4 = (sum4 / userData.length).toFixed(2);
    const averageOfSums =
      (parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3) + parseFloat(sum4)) / 4;
    const averageOfSumsRounded = averageOfSums.toFixed(2);
    const value1 = parseFloat(sum1);
    const value2 = parseFloat(sum2);
    const value3 = parseFloat(sum3);
    const value4 = parseFloat(sum4);
    const maxOfValues = Math.max(value1, value2, value3, value4);

    let varName = "";
    if (maxOfValues === value1) {
      varName = "Customer Obsession";
    } else if (maxOfValues === value2) {
      varName = "Bias for Action";
    } else if (maxOfValues === value3) {
      varName = "Insisting on Highest Standards";
    } else if (maxOfValues === value4) {
      varName = "Ownership";
    }
  
    let meaning = "";
    
    meaning = ratingsData2.map(res => res["PR Conclusion"]);
    const performanceMetrics = {
      "Customer Obsession": ratingsData2.map(res => res["CO"]),
      "Bias for Action": ratingsData2.map(res => res["BA"]),
      Ownership: ratingsData2.map(res => res["Lhs"]),
      "Insisting on Highest Standards":
       ratingsData2.map(res => res["Own"]),
      Cumulative: ratingsData2.map(res => res["SR Total"]),
    };
    function calculateAverageRatings(data) {
      const ratings = [
        parseFloat(data["Customer Obsession"]),
        parseFloat(data["Bias for Action"]),
        parseFloat(data["Ownership"]),
        parseFloat(data["Insisting on Highest Standards"]),
      ];
      const total = ratings.reduce((sum, rating) => sum + rating, 0);
      const average = total / ratings.length;
      return average.toFixed(2);
    }
    const cumulativeRating = calculateAverageRatings(performanceMetrics);
    const columnsToExclude = [
      "E-mail Id of the team member you are filling this form for",
      "Timestamp",
      "Email address",
      "name",
    ];
    const selfResponseQuestions = Object.keys(selfData[0]).filter(
      columnName => !columnsToExclude.includes(columnName)
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
   
      <h1 class ="prl">PERFORMANCE REVIEW LETTER</h1>
      <h3 class ="prl2">H1'23</h3>
     
      
      <p>To,</p>
      <p>${name}</p>
      <p>Date : 31st Aug 2023</p>
      <p class="op">Overall Performance :<span style="color:blue"> ${ratingsData2.map(res => res["PR Conclusion"])}</p>
      <p class="pr">We are pleased to extend this performance letter for your commitment towards our mission to achieve Same-Day Delivery in India. You have performed with utmost<span style="font-weight:bold"> ${varName}</span> and have raised the bar to work backwards to meet the customer needs.
      <p>
      We truly believe in challenging the status quo of the eCommerce brands. The way to do this is by building scalable technology, low-cost infrastructure & easy to use products that we’re proud to recommend to our friends & family.
      </p>
      <p class="pr">
      Market is changing rapidly, that means the user behavior is also changing. The only way to win in this rapidly changing environment is by consistently innovating & solving the  problems of our customers. 
      </p>
      <p class="pr">
      Since inception we’ve worked upon numerous products & Same-Day Delivery is the one of the few products that we’re proud of & believe that we’ll innovate & further launch new products. The larger impact would touch 10,000+ brands by enabling them faster deliveries & empowering 10,000+ micro-entrepreneurs (franchises) providing livelihood to 1,00,000+ delivery partners. 
      </p>
      <p>
      Let’s be the most customer centric company on this earth.
      </p>
      <p>
      Mayank Varshney
      </p>
      Co-founder & CEO,
      </p>
      <p>
      Blitz
      </p>
      
      </p>
     
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
    <br><br>
   
    <h1 class="self-evaluation">SELF EVALUATION RESULTS:</h1>
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
        <td>Peer Rating</td>
        <td>${ratingsData2.map(res => res["3.81"])}</td>
        <td>${ratingsData2.map(res => res["3.89"])}</td>
        <td>${ratingsData2.map(res => res["3.71"])}</td>
        <td>${ratingsData2.map(res => res["4.08"])}</td>
        <td>${ratingsData2.map(res => res["3.80"])}</td>
      </tr>
         
        </table>
    <h3 class="rating">Performance Rating Index</h3>
        <table class="bonus">
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
        <h1 class="_blank">Self Responses:</h1>
        ${selfResponseQuestions
          .map(question => {
            return `
              <h2 class="self-response-heading">${question}</h2>
              <p class="self-responses">${
                question.includes("rate")
                  ? generateStars(selfData[0][question])
                  : selfData[0][question]
              }</p>
            `;
          })
          .join("")}
        
        <h1 class="peer-r">Peer Responses:</h1>
        <style>${cssContent}</style>
       
        ${questionList
          .map(question => {
            return `
              <h2 class="question-heading">${question}</h2>
              <div class="peer-responses">
                ${userData
                  .map(response => {
                    const questionResponse = response[question];
                    if (questionResponse !== null && questionResponse !== undefined) {
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
          
      </body>
      </html>
    `;
    const basePath = "blitz.png";
    await page.setContent(htmlContent, { base: basePath });
    const pdfFileName = `${email}_ANmolPeerResponses.pdf`;
    await page.setContent(htmlContent);
    await page.pdf({
      path: pdfFileName,
      format: "A4",
      displayHeaderFooter: true,
      headerTemplate:
      
        '<div id="header-template"  style="font-size:10px !important; color:#808080; padding-left:10px;  padding-bottom:30rem; text-align:"center"> <img src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTA5IiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTA5IDQwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cGF0aCBkPSJNMTIuNzk3MSAxMy41Mzk0TDAgMTcuMDg5N0w4LjY2NTk1IDI0Ljk1ODJMMTIuNzk3MSAyMS45OTY2VjEzLjUzOTRaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik04Ljk5NDk4IDI1LjczMkwxMi43OTczIDM3Ljg3NzNWMjIuODk0Nkw4Ljk5NDk4IDI1LjczMloiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZD0iTTM3LjA3NiAxOC45NDQ2QzM5LjY2NzMgMTcuMDcgNDEuMjE4OSAxNC4xNTU4IDQxLjI0MjYgMTAuNzk4NUM0MS4yODE5IDQuODE4MzUgMzYuMzIxOCAwIDMwLjM0MTcgMEgxNi4xMjY5QzE0LjI4NzcgMCAxMi43OTcxIDEuNDkwNiAxMi43OTcxIDMuMzI5NzJWMTMuNTM5NEwyOS44MDYxIDguODIxNUMzMC4yNTMxIDguNjk3NDUgMzAuNTM0NyA5LjI4ODE4IDMwLjE1ODYgOS41NTc5NEwxMi43OTcxIDIxLjk5NjdWMjIuODk0NkwzMC4yMDM5IDEwLjQyNDNDMzAuNTc4IDEwLjE1NjUgMzEuMDQ2NiAxMC42MDc1IDMwLjc5MDcgMTAuOTkxNEwxMi43OTkxIDM3Ljg3NzNDMTIuNzk5MSAzOS4wNDg5IDEzLjc1MDIgNDAgMTQuOTIxOCA0MEgzMC44OTVDMzcuMzMzOSA0MCA0Mi42NDA2IDM0Ljc2NDIgNDIuNTIwNSAyOC4zMjUzQzQyLjQ0NTcgMjQuMzE2MiA0MC40MDM3IDIwLjk2MDkgMzcuMDc3OSAxOC45NDQ2SDM3LjA3NloiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik01OS42NTcyIDE0LjgzOUM2MS45NTkxIDE0LjgzOSA2NC4xMTMzIDE1LjcxNTMgNjUuNzI3OSAxNy4zMDQzQzY3LjQ5MjIgMTkuMDQxMSA2OC40NjMgMjEuNDI3NiA2OC40NjMgMjQuMDI0OEM2OC40NjMgMjkuMTQ2NCA2NC43NjUxIDMzLjAwNzggNTkuODY0IDMzLjAwNzhDNTguMjQzNCAzMy4wMDc4IDU2LjYwMTIgMzIuMzkzNCA1NS4zMjEzIDMxLjM1MThWMzIuNjgwOUg1MC4yNzQ2VjcuOTc0ODFINTUuMzE5M1YxNi4zNDU0QzU2LjQxMjIgMTUuNTEyNSA1Ny45MTY2IDE0LjgzOSA1OS42NTcyIDE0LjgzOVpNNTkuNDcyMiAxOS44NjYxQzU3LjIyMzUgMTkuODY2MSA1NS4zMjE0IDIxLjc3MDIgNTUuMzIxNCAyNC4wMjQ4QzU1LjMyMTQgMjUuMDk4IDU1LjczODggMjYuMTAyMiA1Ni40OTg5IDI2Ljg1MDVDNTcuMjM5MyAyNy41NzkgNTguMjIxOCAyNy45ODA3IDU5LjI2NTUgMjcuOTgwN0M2MS41MTYxIDI3Ljk4MDcgNjMuNDE2MyAyNi4wNzY2IDYzLjQxNjMgMjMuODIyQzYzLjQxNjMgMjIuNzQ2OSA2Mi45OTg4IDIxLjc0NDYgNjIuMjM4OCAyMC45OTY0QzYxLjQ5ODQgMjAuMjY3OCA2MC41MTU4IDE5Ljg2NjEgNTkuNDcyMiAxOS44NjYxWiIgZmlsbD0iIzIzMUYyMCIvPgo8cmVjdCB4PSI2OC45MTAyIiB5PSI2Ljk5MjIyIiB3aWR0aD0iNS4wNDQ4IiBoZWlnaHQ9IjI1LjY4NjciIGZpbGw9IiMyMzFGMjAiLz4KPHJlY3QgeD0iNzUuMzgyNSIgeT0iMTUuMTY1OSIgd2lkdGg9IjUuMDQ0OCIgaGVpZ2h0PSIxNy41MTUiIGZpbGw9IiMyMzFGMjAiLz4KPHBhdGggZD0iTTc4LjAwOTQgMTMuNDI1MkM3OS41NjY5IDEzLjQyNTIgODAuNzg3OCAxMi4xOTI2IDgwLjc4OTcgMTAuNjIxM0M4MC43ODk3IDkuODQzNDYgODAuNDYyOSA5LjA3NTUyIDc5Ljg5MTggOC41MTIzNkM3OS4zMjQ3IDcuOTUzMTQgNzguNTgyNCA3LjY0NTk3IDc3LjgwNDYgNy42NDU5N0M3Ni4yNzI3IDcuNjQ1OTcgNzUuMDI2MiA4Ljg4ODQ2IDc1LjAyNjIgMTAuNDE4NEM3NS4wMjYyIDExLjIxMzkgNzUuMzU3IDExLjk5NTcgNzUuOTM0IDEyLjU2MjhDNzYuNDk5MSAxMy4xMiA3Ny4yMzc1IDEzLjQyNTIgNzguMDEzMyAxMy40MjUySDc4LjAwOTRaIiBmaWxsPSIjMjMxRjIwIi8+CjxwYXRoIGQ9Ik04OC44Njg4IDI1LjU2ODZMOTMuMDY0OSAxNS4xNjU5SDg5LjI5MDJWMTAuNzg0N0g4NC4yNDM0VjE1LjE2NTlIODEuMjM2NlYyMC4xOTNIODQuMjQzNFYyNi41MDE5Qzg0LjI0MzQgMjguODg4NSA4NC43NDk1IDMwLjQ5NzIgODUuODM0NCAzMS41NjY0Qzg2LjgxOSAzMi41MzUyIDg4LjI1ODQgMzMuMDA1OCA5MC4yMzczIDMzLjAwNThDOTEuMDkxOSAzMy4wMDU4IDkyLjEgMzIuODkxNiA5Mi44ODE4IDMyLjcxMDVMOTMuMTY5MyAyNi45MTU0SDg5Ljk3MTVDODkuMjc4MyAyNi45MTU0IDg4LjY4OTYgMjYuMTk4NyA4OC44NjY4IDI1LjU2NjZMODguODY4OCAyNS41Njg2WiIgZmlsbD0iIzIzMUYyMCIvPgo8cGF0aCBkPSJNMTA4LjQ5MSAxNS4xNjU5SDk1LjA1MzZMOTQuNDE5NiAyMC44NTQ2SDk4LjY4MjdDOTkuNDU2NSAyMC44NTQ2IDEwMC4wNjEgMjEuNzI4OCA5OS43MjQzIDIyLjM1ODlMOTMuMDQ3MSAzMi42Nzg5SDEwOC4zOFYyNy45MTM3SDEwMi4yMTdMMTA4LjQ4OSAxOC44NzM3VjE1LjE2MzlMMTA4LjQ5MSAxNS4xNjU5WiIgZmlsbD0iIzIzMUYyMCIvPgo8L3N2Zz4K" alt="blitz logo" class="header-logo" style="padding-left:170rem; border-bottom:1px solid black; padding-top:20rem; padding-bottom:30rem; padding-right:190rem; margin-left:50rem"/></div>',
        footerTemplate: `
        <div style="font-size: 9.5rem; text-align: center; margin-top: 30px; padding-left:39%; padding-bottom:3.5rem">
          <div style="font-weight: bold; color:red; font-size:9.5rem;">PRIVATE &amp; CONFIDENTIAL</div>
        </div>
      `,
        margin: {
          top: '100px',
          bottom: '80px',
          right: '30px',
          left: '30px',
        },
      });
  }
  await browser.close();
})();
