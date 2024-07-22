const puppeteer = require("puppeteer");

const generatePDF = async (jsonData) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const { name, address, bets } = jsonData;
    const addressString = `${address.addressLine1}, ${address.addressLine2}, ${address.State}`;

    const tableRows = bets
        .map((bet) => `<tr>
        <td>${bet.month}</td>
        <td>${bet.totalBets}</td>
        <td>${bet.wins}</td>
        <td>${bet.loss}</td>
        <td>${bet.totalBetAmount}</td>
        </tr>`
        )
        .join("");

    const content = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                margin: 0;
                padding: 0;
                color: #333;
                background-color: #f4f4f4;
            }
            header {
                text-align: center;
                margin-bottom: 20px;
                background-color: #4CAF50;
                color: white;
                padding: 20px 0;
            }
            footer {
                text-align: center;
                position: fixed;
                bottom: 0;
                width: 100%;
                background-color: #4CAF50;
                color: white;
                padding: 10px 0;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                background-color: white;
                margin-bottom: 20px;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 12px;
                text-align: center;
            }
            th {
                background-color: #4CAF50;
                color: white;
            }
            tr:nth-child(even) {
                background-color: #f2f2f2;
            }
            tr:hover {
                background-color: #ddd;
            }
            @media print {
                body, header, footer, table {
                    background-color: white;
                    color: black;
                }
                header, footer {
                    page-break-before: always;
                }
            }
        </style>
    </head>
    <body>
        <header>
            <h1>${name}</h1>
            <p>${addressString}</p>
        </header>
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Total Bets</th>
                    <th>Wins</th>
                    <th>Loss</th>
                    <th>Total Bet Amount</th>
                </tr>
            </thead>
            <tbody>
                ${tableRows}
            </tbody>
        </table>
        <footer>
            <p>Page <span class="pageNumber"></span></p>
        </footer>
        <script>
            document.addEventListener('DOMContentLoaded', () => {
                const pageNumbers = document.querySelectorAll('.pageNumber');
                pageNumbers.forEach((pageNumber, index) => {
                    pageNumber.textContent = index + 1;
                });
            });
        </script>
    </body>
    </html>    
    `;

    await page.setContent(content);
    const pdf = await page.pdf({ format: "A4", printBackground: true });
    await browser.close();

    return pdf;
};


module.exports = generatePDF;