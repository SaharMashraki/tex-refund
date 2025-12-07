-- 02_seeds.sql
-- Initial Data for Tags

-- Insert Default System Tags
INSERT INTO Tags ([key], label_en, label_he, category, is_system) VALUES
('FORM_106', 'Form 106', N'טופס 106', 'INCOME', 1),
('INCOME_REPORT', 'Annual Income Report', N'דו"ח הכנסות שנתי', 'INCOME', 1),
('INSURANCE_CLAIM', 'Insurance Claim', N'תביעת ביטוח', 'INSURANCE', 1),
('MEDICAL_EXPENSE', 'Medical Expense', N'הוצאה רפואית', 'EXPENSE', 1),
('DONATION_RECEIPT', 'Donation Receipt', N'קבלה על תרומה', 'DEDUCTION', 1);
