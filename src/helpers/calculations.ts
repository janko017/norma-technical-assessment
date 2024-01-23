import { FreelanceTaxRate, PermanentTaxRate } from "../constants/taxRates";
import { Taxes } from "../types/formTypes";
import { multiply, sum } from 'lodash';

export function getAnnualizedMonthlySalary(amount: number): number {
    return amount * 12;
}

export function getPermanentTaxesAnnualizedTotal(rows: Taxes["rows"]): number {
    return sum(rows.map((row) => {
        if (row.monthlySalary) {
            return getAnnualizedMonthlySalary(row.monthlySalary);
        } else {
            return getAnnualSales(row.hourlyRate, row.dailyHours, row.daysByYear);
        }
    }));
}

export function getAnnualSales(hourlyRate:number, dailyHours:number, daysByYear:number): number {
    return hourlyRate * dailyHours * daysByYear;
}

export function getPermanentTaxesAnnualizedTotalAfterTaxes(rows: Taxes["rows"]): number {
    return sum(rows.map((row) => {
        if (row.monthlySalary) {
            return getAnnualizedMonthlySalary(row.monthlySalary) * (1 - PermanentTaxRate);
        } else {
            return getAnnualSales(row.hourlyRate, row.dailyHours, row.daysByYear) * (1 - FreelanceTaxRate);
        }
    }));
}
