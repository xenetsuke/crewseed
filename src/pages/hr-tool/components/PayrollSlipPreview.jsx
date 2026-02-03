export const generatePayrollSlipHTML = ({
  company,
  employee,
  payroll,
  monthYear,
}) => `
<!DOCTYPE html>
<html>
<head>
  <title>Salary Slip - ${employee.name}</title>

  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 40px;
      font-family: 'Inter', sans-serif;
      background: #f8fafc;
      color: #0f172a;
    }

    .container {
      max-width: 820px;
      margin: auto;
      background: #ffffff;
      border-radius: 14px;
      border: 1px solid #e5e7eb;
      box-shadow: 0 20px 40px rgba(0,0,0,0.05);
      overflow: hidden;
    }

    /* ================= HEADER ================= */
    .header {
      padding: 28px 30px;
      background: linear-gradient(135deg, #0f172a, #020617);
      color: #ffffff;
    }

    .company-name {
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    .company-sub {
      font-size: 13px;
      opacity: 0.85;
      margin-top: 4px;
      line-height: 1.5;
    }

    .period-badge {
      margin-top: 14px;
      display: inline-block;
      background: rgba(255,255,255,0.12);
      padding: 6px 12px;
      border-radius: 999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    /* ================= META ================= */
    .meta {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      padding: 24px 30px;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .meta-card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 16px;
    }

    .meta-card h4 {
      margin: 0 0 10px;
      font-size: 11px;
      font-weight: 800;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.12em;
    }

    .meta-row {
      font-size: 13px;
      margin-bottom: 6px;
    }

    .meta-row span {
      color: #64748b;
      font-weight: 600;
    }

    /* ================= TABLE ================= */
    .section {
      padding: 26px 30px;
    }

    .section-title {
      font-size: 12px;
      font-weight: 800;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 14px;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 10px;
    }

    th {
      text-align: left;
      font-size: 12px;
      padding: 10px;
      background: #0f172a;
      color: #ffffff;
    }

    td {
      padding: 12px 10px;
      font-size: 14px;
      border-bottom: 1px solid #e5e7eb;
    }

    .amount {
      text-align: right;
      font-weight: 700;
      font-family: monospace;
    }

    .total-row td {
      font-weight: 800;
      background: #f8fafc;
    }

    /* ================= NET PAY ================= */
    .net-box {
      margin: 24px 30px 30px;
      padding: 22px 26px;
      background: linear-gradient(135deg, #0f172a, #020617);
      color: #ffffff;
      border-radius: 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .net-label {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      opacity: 0.85;
    }

    .net-amount {
      font-size: 30px;
      font-weight: 800;
      letter-spacing: -0.02em;
    }

    /* ================= FOOTER ================= */
    .footer {
      display: flex;
      justify-content: space-between;
      padding: 30px;
      border-top: 1px dashed #e5e7eb;
      font-size: 12px;
      color: #64748b;
    }

    .sign {
      width: 220px;
      text-align: center;
      padding-top: 8px;
      border-top: 1px solid #cbd5e1;
      font-weight: 600;
    }

    @media print {
      body {
        background: #ffffff;
        padding: 0;
      }
      .container {
        box-shadow: none;
        border: none;
      }
    }
  </style>
</head>

<body>
  <div class="container">

    <!-- HEADER -->
    <div class="header">
      <div class="company-name">${company.name}</div>
      <div class="company-sub">
        ${company.address || ""}<br/>
        ${company.gst ? `GST: ${company.gst}` : ""} 
        ${company.pan ? ` | PAN: ${company.pan}` : ""}
        ${company.cin ? ` | CIN: ${company.cin}` : ""}
      </div>
      <div class="period-badge">${monthYear}</div>
    </div>

    <!-- META -->
    <div class="meta">
      <div class="meta-card">
        <h4>Employee Details</h4>
        <div class="meta-row"><span>Name:</span> ${employee.name}</div>
        <div class="meta-row"><span>Designation:</span> ${employee.role}</div>
      </div>

      <div class="meta-card">
        <h4>Work Details</h4>
        <div class="meta-row"><span>Manager:</span> ${company.managerName || "-"}</div>
        <div class="meta-row"><span>Site / Job:</span> ${company.siteName || "-"}</div>
        <div class="meta-row"><span>Generated:</span> ${new Date().toLocaleDateString("en-IN")}</div>
      </div>
    </div>

    <!-- EARNINGS -->
    <div class="section">
      <div class="section-title">Earnings</div>
      <table>
        <tr><th>Description</th><th class="amount">Amount</th></tr>
        <tr><td>Attendance / Daily Pay</td><td class="amount">₹${payroll.dailyPay}</td></tr>
        <tr><td>Overtime</td><td class="amount">₹${payroll.overtimePay}</td></tr>
        <tr><td>Bata / Allowance</td><td class="amount">₹${payroll.bata}</td></tr>
        <tr class="total-row"><td>Gross Earnings</td><td class="amount">₹${payroll.grossPay}</td></tr>
      </table>
    </div>

    <!-- DEDUCTIONS -->
    <div class="section">
      <div class="section-title">Deductions</div>
      <table>
        <tr><th>Description</th><th class="amount">Amount</th></tr>
        <tr><td>Provident Fund (PF)</td><td class="amount">₹${payroll.pfDeduction}</td></tr>
        <tr><td>ESI</td><td class="amount">₹${payroll.esiDeduction}</td></tr>
        <tr><td>Advance Recovery</td><td class="amount">₹${payroll.advanceDeduction}</td></tr>
        <tr class="total-row"><td>Total Deductions</td><td class="amount">₹${payroll.totalDeductions}</td></tr>
      </table>
    </div>

    <!-- NET -->
    <div class="net-box">
      <div class="net-label">Net Payable</div>
      <div class="net-amount">₹${payroll.netPayable}</div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      <div class="sign">Employer Signature</div>
      <div class="sign">Employee Signature</div>
    </div>

  </div>

  <script>window.print()</script>
</body>
</html>
`;
