interface BaseTaxRow {
    year: number;
}

export interface PermanentTaxesRow extends BaseTaxRow {
    monthlySalary: number;
    hourlyRate: number;
    dailyHours: number;
    daysByYear: number;
}

export interface Taxes  {
    rows: PermanentTaxesRow[];
}