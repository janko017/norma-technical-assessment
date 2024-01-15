import { PermanentTaxRate } from "../constants/taxRates";
import { Taxes } from "../types/formTypes";
import { sum } from 'lodash';

export function getAnnualizedMonthlySalary(amount: number): number {
    return amount * 12;
}

export function getPermanentTaxesAnnualizedTotal(rows: Taxes["rows"]): number {
    return sum(rows.map((row) => getAnnualizedMonthlySalary(row.monthlySalary)));
}

export function getPermanentTaxesAnnualizedTotalAfterTaxes(rows: Taxes["rows"]): number {
    return sum(rows.map((row) => {
        const annualizedMonthlySalary = getAnnualizedMonthlySalary(row.monthlySalary);
        return annualizedMonthlySalary * (1 - PermanentTaxRate);
    }));
}
