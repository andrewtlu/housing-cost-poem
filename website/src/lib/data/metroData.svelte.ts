import educationDataRaw from "./metroEducation.json";
import homeVsIncomeDataRaw from "./metroHomeVsIncome.json";

export type MetroEducation = {
    metro_area: string;
    median_home_value: number;
    median_income: number;
    education_attainment: number;
    total_population: number;
    education_attainment_population: number;
};

export const educationData = $state<MetroEducation[]>(educationDataRaw);

export type MetroHomeVsIncome = {
    metro_area: string;
    median_home_value: number;
    median_income: number;
    median_home_value_to_income: number;
    proportion_under_25: number;
};

export const under25Data = $state<MetroHomeVsIncome[]>(homeVsIncomeDataRaw);
