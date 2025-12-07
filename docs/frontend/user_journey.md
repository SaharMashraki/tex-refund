# 📋 User Stories & Specifications: Israel Tax Refund Web Application

**Project:** Tax Refund Self-Service Portal  
**Goal:** To enable users to check eligibility, input financial data, and calculate tax refunds for the past 6 years based on Israeli Tax Authority regulations (2025).

## 🧩 Epic 1: Onboarding & System Access
**Focus:** Authentication, Dashboard, and Session Management.

### US-1.1: User Authentication
As a User, I want to log in using a secure authentication method (JWT/OAuth), So that my personal financial data remains private and secure.

**Acceptance Criteria:**
- Support login via Email/Password or Google/Facebook OAuth.
- Optional field for Identity Verification (Tax Authority ID link).
- Upon successful login, redirect to Dashboard.

### US-1.2: Application Dashboard
As a User, I want to see a dashboard upon logging in, So that I understand the process, estimated time, and required documents before starting.

**Acceptance Criteria:**
- Display "Start New Form" and "Resume Saved Form" buttons.
- Display a progress stepper (0% to 100%).
- List required documents (Form 106, 857, Medical certs, etc.).

### US-1.3: Auto-Save & Resume
As a User, I want the system to save my progress automatically every 30 seconds or when I click "Save", So that I don't lose my data if I close the browser or time out.

**Acceptance Criteria:**
- System triggers a backend save on field blur or 30-second interval.
- User can click "Save & Continue Later".
- Returning users land on the last completed step.

## 👤 Epic 2: Personal Profile & Family Status
**Focus:** Basic info, Marital Status, and Child Credits (Sections 2.1, 2.2, 2.9).

### US-2.1: Basic Information Input
As a User, I want to enter my personal details and select the tax years (1-6 years back), So that the system knows who I am and which years to calculate.

**Acceptance Criteria:**
- Fields: Full Name, ID, Address, Email, Phone.
- Checkbox selection for years (e.g., 2019–2024).

### US-2.2: Marital Status & Spousal Credits
As a User, I want to specify my gender and marital status, So that the correct base credit points are applied.

**Acceptance Criteria:**
- **Logic:**
  - Male base: 2.25 points.
  - Female base: 2.75 points.
- **Dependencies:**
  - If "Married" and "Spouse does not work": Ask if spouse is retirement age or disabled.
  - If YES to above: Apply +1 Credit Point.

### US-2.3: Children & Maternity Credits
As a User, I want to list my children and their birth years, So that I receive age-based tax credits.

**Acceptance Criteria:**
- Input for each child: Birth Year, Custody Status.
- **Logic:**
  - Apply specific credit points for ages 0–5, 6–17, 18.
  - If "Gave birth this year": Mother gets +1.5 points.
  - If "Single Mother": Up to +4 points for birth year.

### US-2.4: Divorce & Alimony
As a User, I want to declare if I am divorced and paying child support, So that I can claim the relevant tax relief.

**Acceptance Criteria:**
- Question: "Do you pay child support?" and "Did you remarry?"
- **Logic:**
  - Divorced parent raising child: +1 point.
  - Paying support + remarried: +1 point.

## 🏥 Epic 3: Health, Disability & Care
**Focus:** Medical status and nursing expenses (Section 2.3).

### US-3.1: Disability Status
As a User, I want to input medical disability details for myself or a child, So that I can receive tax exemptions or credits.

**Acceptance Criteria:**
- Question: "Disability > 90% for ≥185 days?"
- **Logic:** If YES, apply full tax exemption up to the annual threshold.
- Question: "Child with disability?" -> Apply +2 credit points.

### US-3.2: Nursing Home Expenses
As a User, I want to upload receipts for a parent/spouse in a nursing home, So that I can claim the 35% tax credit.

**Acceptance Criteria:**
- Upload field for receipts.
- Calculation: Credit = (Expenses over threshold) * 35%.

## 🎖️ Epic 4: Special Status (Army, Aliyah, Location)
**Focus:** Immigrants, Soldiers, and Periphery residents (Sections 2.4, 2.5, 2.7).

### US-4.1: New Immigrant / Returning Resident
As a User, I want to enter my immigration date and upload my Teudat Oleh, So that I get graduated tax credits.

**Acceptance Criteria:**
- Date picker for "Aliyah Date".
- **Logic:** Apply credits based on months since Aliyah (valid for 54 months).
- If "Returning Resident Veteran": Flag for foreign income exemption.

### US-4.2: Army / National Service
As a User, I want to input my service duration and upload a discharge certificate, So that I get credit points for 36 months post-discharge.

**Acceptance Criteria:**
- Input: Months served.
- **Logic:**
  - 12–23 months: +1 point.
  - 23+ months: +2 points.

### US-4.3: Periphery / National Priority Area
As a User, I want to select my locality and duration of residence, So that I receive the regional tax credit.

**Acceptance Criteria:**
- Dropdown of eligible localities (validated against backend list).
- Question: "Lived 12+ consecutive months?"
- Upload: Form 1312A.
- Calculation: Income * Rate (5-12%) (Capped at local limit).

## 💰 Epic 5: Financials, Deductions & Income
**Focus:** Salary, Donations, Pension, Severance (Sections 2.6, 2.8, 2.10, 2.11).

### US-5.1: Income & Employment History
As a User, I want to input my annual income and upload Form 106, So that the system knows my taxable base.

**Acceptance Criteria:**
- Input: Sum of all income sources (Forms 106, 857, Pension).
- Handle "Unemployment / Halat" periods (treated as self-employed deposits logic).

### US-5.2: Donations (Section 46)
As a User, I want to enter total donations to recognized institutions (>207 NIS), So that I get a 35% refund on the donated amount.

**Acceptance Criteria:**
- Input: Total donation amount.
- Upload: Receipts.
- Calculation: Credit = Min(Donation, 30% of Income) * 35%.

### US-5.3: Pension & Life Insurance (Employee/Self-Employed)
As a User, I want to enter my independent contributions to Pension/Gemel/Life Insurance, So that I can maximize my deductions and credits.

**Acceptance Criteria:**
- Distinguish between Employee (beyond employer contrib) and Self-Employed.
- **Calculation:**
  - Deduction part (tax base reduction).
  - Credit part (35% tax offset).

### US-5.4: Severance & Retirement Grants
As a User, I want to enter severance pay or early retirement grants, So that the system calculates the tax-exempt portion.

**Acceptance Criteria:**
- Inputs: Years worked, Last Salary, Total Grant Received.
- **Logic (Exemption):** Min(1.5 * Last Salary * Years, 13,750 * Years).
- Subtract exemption from total to find taxable amount.

## ⚙️ Epic 6: Calculation Engine & Logic
**Focus:** The math behind the refund (Section 3).

### US-6.1: Tax Liability Calculation
As a System, I must calculate the gross tax liability based on annual income brackets, So that we have a starting point for deductions.

**Acceptance Criteria:**
- Implement 2025 Tax Brackets.
- Formula: Sum(Income_in_Bracket * Bracket_Rate).

### US-6.2: Final Refund Computation
As a System, I must aggregate all credits and subtract them from the liability, So that the final refund/owe amount is accurate.

**Acceptance Criteria:**
- Total Credit Value = Sum(Credit Points) * 2,904 NIS.
- Final Tax = Gross Tax - (Total Credit Value + Donation Credit + Pension Credit + Periphery Credit).
- If Final Tax < 0, set liability to 0.
- Refund = Tax Paid (from Form 106) - Final Tax.

## 📄 Epic 7: Output & Recommendations
**Focus:** Results, PDF generation, and Action items (Section 4).

### US-7.1: Results Summary
As a User, I want to see a clear summary of my estimated refund, So that I know if it is worth filing.

**Acceptance Criteria:**
- Display: Annual Income, Tax Paid, Total Credits (Broken down), Final Refund Amount.
- Color coded: Green for Refund, Red for Owe.

### US-7.2: Optimization Recommendations
As a User, I want to see recommendations on how to increase my refund, So that I don't miss out on money.

**Acceptance Criteria:**
- Logic: Identify missing documents (e.g., "You marked disability but didn't upload a cert").
- Suggest checking adjacent years.

### US-7.3: PDF Report Generation
As a User, I want to download a professional PDF summary, So that I can use it to file my taxes officially.

**Acceptance Criteria:**
- Generate PDF containing: User details, Calculations table, List of attached evidence, Submission instructions.

## 🛠 Technical Requirements (Non-Functional)
- **Security:** All uploads must be virus-scanned. Data encrypted at rest (AES-256) and in transit (TLS 1.3).
- **Accessibility:** Compliant with WCAG 2.1 AA (Screen reader support for form inputs).
- **Performance:** Tax calculation must complete in < 2 seconds.
- **Storage:** Integrate with cloud storage (S3/Azure Blob) for document retention.
