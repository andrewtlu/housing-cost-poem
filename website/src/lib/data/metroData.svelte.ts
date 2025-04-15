import educationDataRaw from "./metroEducation.json";
import under25DataRaw from "./metroUnder25.json";

export type CountyEducation = {
    metro_area: string;
    median_housing_price: number;
    median_income: number;
    education_attainment: number;
    total_population: number;
    education_attainment_population: number;
};

export const educationData = $state<CountyEducation[]>(educationDataRaw);

export type CountyUnder25 = {
    metro_area: string;
    median_housing_price: number;
    median_income: number;
    median_home_value_to_income: number;
    proportion_under_25: number;
};

export const under25Data = $state<CountyUnder25[]>(under25DataRaw);
