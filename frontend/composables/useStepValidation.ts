import { z } from 'zod'

export const useStepValidation = () => {
    // Step 1: Personal
    const personalSchema = z.object({
        fullName: z.string().min(2, 'Name must be at least 2 characters'),
        idNumber: z.string().regex(/^\d{9}$/, 'ID must be 9 digits'),
        address: z.string().min(5, 'Address is required'),
        email: z.string().email('Invalid email address'),
        phone: z.string().regex(/^05\d-?\d{7}$/, 'Invalid phone number'),
        years: z.array(z.number()).min(1, 'Select at least one tax year')
    })

    // Step 2: Family
    const familySchema = z.object({
        maritalStatus: z.enum(['single', 'married', 'divorced', 'widowed']),
        spouseName: z.string().optional(),
        spouseId: z.string().optional(),
        spouseWorkStatus: z.enum(['working', 'not_working', 'retired', 'disabled']).optional()
    }).refine((data) => {
        if (data.maritalStatus === 'married') {
            return !!data.spouseName && !!data.spouseId
        }
        return true
    }, {
        message: "Spouse details are required when married",
        path: ["spouseName"]
    })

    // Step 3: Children
    const childrenSchema = z.object({
        children: z.array(z.object({
            birthYear: z.number(),
            custody: z.enum(['full', 'joint', 'other'])
        })).optional(),
        maternityLeave: z.boolean().optional()
    })

    // Step 4: Divorce
    const divorceSchema = z.object({
        paysChildSupport: z.boolean().optional(),
        remarried: z.boolean().optional()
    })

    // Step 5: Health
    const healthSchema = z.object({
        hasDisability: z.boolean().optional(),
        hasNursingHomeExpenses: z.boolean().optional()
    })

    // Step 6: Special Status
    const specialStatusSchema = z.object({
        aliyahDate: z.string().optional(),
        isReturningResident: z.boolean().optional(),
        serviceMonths: z.number().min(0).max(60).optional(),
        dischargeDate: z.string().optional(),
        locality: z.string().optional(),
        livedTwelveMonths: z.boolean().optional()
    })

    // Step 7: Income
    const incomeSchema = z.object({
        incomeDocs: z.array(z.any()).optional(),
        annualSalary: z.number().optional(),
        taxPaid: z.number().optional()
    }).refine((data) => {
        // Require either docs or manual input
        const hasDocs = data.incomeDocs && data.incomeDocs.length > 0
        const hasManual = data.annualSalary !== undefined && data.taxPaid !== undefined
        return hasDocs || hasManual
    }, {
        message: "Please upload Form 106 or enter income details manually",
        path: ["incomeDocs"]
    })

    // Step 8: Deductions
    const deductionsSchema = z.object({
        hasDonations: z.boolean().optional(),
        donationAmount: z.number().optional(),
        hasLifeInsurance: z.boolean().optional(),
        lifeInsuranceAmount: z.number().optional()
    })

    // Step 9: Severance
    const severanceSchema = z.object({
        receivedSeverance: z.boolean().optional(),
        yearsWorked: z.number().optional(),
        lastSalary: z.number().optional(),
        totalGrant: z.number().optional()
    })

    // Step 10: Summary
    const summarySchema = z.object({
        // Validation handled by checkbox in component, but can add here if needed
    })

    return {
        personalSchema,
        familySchema,
        childrenSchema,
        divorceSchema,
        healthSchema,
        specialStatusSchema,
        incomeSchema,
        deductionsSchema,
        severanceSchema,
        summarySchema
    }
}
