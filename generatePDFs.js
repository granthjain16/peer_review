
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
    const selfData = excelData.filter((res) => res["Email address"] === email);
   console.log(selfData);
    const userData = peerResponsesData.filter(
      (res) =>
        res["E-mail Id of the team member you are filling this form for"] ===
        email
    );
   

    let sum1=0 , sum2 =0, sum3 =0, sum4=0;
    let sum5 =0.0; 
    userData.map((res) =>{
    sum1 = sum1 + parseFloat(res['How would you rate the team member on "Customer Obsession"?']);
    sum2 = sum2 + parseFloat(res['How would you rate the team member on their "Bias for Action"']),
    sum3 = sum3 + parseFloat(res['How would you rate the team member on "Insisting on Highest Standards"']), 
    sum4 = sum4 + parseFloat(res['How would you rate the team member on "Ownership"'])}
    );
    sum1 = (sum1/userData.length).toFixed(2);
    sum2 = (sum2/userData.length).toFixed(2);
    sum3 = (sum3/userData.length).toFixed(2);
    sum4 = (sum4/userData.length).toFixed(2);
    const averageOfSums = (parseFloat(sum1) + parseFloat(sum2) + parseFloat(sum3) + parseFloat(sum4)) / 4;
    const averageOfSumsRounded = averageOfSums.toFixed(2);
    
    console.log(averageOfSumsRounded );
   
      const performanceMetrics = {
        "Customer Obsession": selfData[0]['How would you rate yourself on "Customer Obsession"?'],
        "Bias for Action": selfData[0]['How would you rate yourself on their "Bias for Action"'],
        "Ownership": selfData[0]['How would you rate yourself on "Ownership"'],
        "Insisting on Highest Standards": selfData[0]['How would you rate yourself on "Insisting on Highest Standards?"'],
        "Cumulative": selfData[0]["Cumulative"]
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
      <h1>PERFORMANCE REVIEW LETTER</h1>
   
      <p>To,</p>
      <p>{Name}</p>
      <p>Date : 30th Aug 2023</p>
      <p>Overall Performance : {Great +}</p>
      <p class="pr">We are pleased to extend this performance letter for your commitment towards our mission to achieve Same-Day Delivery in India. You have performed with utmost {Ownership} and have raised the bar to work backwards to meet the customer needs.
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
      <div class="header-logo">
      <img src="blitz.png" alt="Header Logo" class="logo-image"/>
      <img src="homepagelogo.png" alt="Header Logo" class="logo-image">
    </div>
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
        <td>${sum1}</td>
        <td>${sum2}</td>
        <td>${sum4}</td>
        <td>${sum3}</td>
        <td>${averageOfSumsRounded}</td>
      </tr>
         
        </table>
    <h1 class="rating">Ratings:</h1>
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
        <div class="page-break">    </div>
        <h1 class="page-break-before">Self Responses:</h1>
        ${selfResponseQuestions
          .map((question) => {
            return `
              <h2 class="self-response-heading">${question}</h2>
              <p class="self-responses">${question.includes("rate")
                  ? generateStars(data[question])
                  :data[question]}</p>
            `;
          })
          .join("")}
     
        <h1 class="peer-r">Peer Responses:</h1>
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
