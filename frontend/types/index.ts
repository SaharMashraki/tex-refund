// User types
export interface User {
  id: number
  fullName: string
  email: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  fullName: string
  email: string
  password: string
}

// Document types
export interface Document {
  id: number
  userId: number
  filename?: string
  originalName?: string
  mimeType?: string
  size?: number
  status: DocumentStatus
  storagePath: string
  tags?: DocumentTag[]
  createdAt: string
  updatedAt?: string
}

export enum DocumentStatus {
  UPLOADED = 'UPLOADED',
  PROCESSING = 'PROCESSING',
  TAGGED = 'TAGGED',
  READY_FOR_PREVIEW = 'READY_FOR_PREVIEW',
  PAID = 'PAID',
  ERROR = 'ERROR'
}

// Tag types
export interface Tag {
  id: number
  key: string
  labelEn: string
  labelHe: string
  category: string
  isSystem: boolean
}

// Document tag with confidence score
export interface DocumentTag {
  confidence: number
  tag: Tag
}

// Wizard form data types
export interface WizardFormData {
  personal: PersonalInfo
  family: FamilyInfo
  children: ChildrenInfo
  divorce: DivorceInfo
  health: HealthInfo
  specialStatus: SpecialStatusInfo
  income: IncomeInfo
  deductions: DeductionsInfo
  severance: SeveranceInfo
}

export interface PersonalInfo {
  fullName: string
  idNumber: string
  address: string
  email: string
  phone: string
  taxYears: number[]
}

export interface FamilyInfo {
  gender: 'male' | 'female'
  maritalStatus: 'single' | 'married' | 'divorced' | 'widowed'
  spouseWorking?: boolean
  spouseRetirementAge?: boolean
  spouseDisabled?: boolean
}

export interface ChildrenInfo {
  children: Child[]
  gaveBirthThisYear?: boolean
  isSingleMother?: boolean
}

export interface Child {
  birthYear: number
  custodyStatus: 'full' | 'shared' | 'none'
  hasDisability?: boolean
}

export interface DivorceInfo {
  isDivorced: boolean
  paysChildSupport?: boolean
  remarried?: boolean
}

export interface HealthInfo {
  hasDisability?: boolean
  disabilityOver90?: boolean
  disabilityDays?: number
  childWithDisability?: boolean
  nursingHomeExpenses?: number
  nursingHomeReceipts?: File[]
}

export interface SpecialStatusInfo {
  isNewImmigrant?: boolean
  aliyahDate?: string
  isReturningResident?: boolean
  armyService?: {
    served: boolean
    monthsServed?: number
    dischargeDate?: string
  }
  peripheryResident?: {
    isResident: boolean
    locality?: string
    monthsLived?: number
  }
}

export interface IncomeInfo {
  annualIncome: number
  form106?: File
  unemploymentPeriods?: UnemploymentPeriod[]
}

export interface UnemploymentPeriod {
  startDate: string
  endDate: string
  type: 'unemployment' | 'halat'
}

export interface DeductionsInfo {
  donations?: {
    amount: number
    receipts?: File[]
  }
  pension?: {
    employeeContribution?: number
    selfEmployedContribution?: number
  }
  lifeInsurance?: {
    amount: number
  }
}

export interface SeveranceInfo {
  yearsWorked?: number
  lastSalary?: number
  totalGrantReceived?: number
}

// Payment types
export interface Payment {
  id: number
  userId: number
  documentId: number
  amount: number
  currency: string
  status: PaymentStatus
  provider: PaymentProvider
  transactionId?: string
  createdAt: string
  updatedAt: string
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum PaymentProvider {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL'
}

export interface CheckoutSession {
  checkoutUrl: string
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: ApiError
}

export interface ApiError {
  code: string
  message: string
  details?: any
}

// Pagination types
export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
