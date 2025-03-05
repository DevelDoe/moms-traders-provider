import axios from "axios";
import { buildQuery } from "../utils/buildQuery";
import { FMP_KEY, FMP_URL } from "../config"

const filters = {
    marketCapLowerThan: "30000000",
    priceMoreThan: "1",
    priceLowerThan: "7",
    volumeMoreThan: "100000",
    exchange: "NASDAQ",
    isActivelyTrading: "true",
    isEtf: "false",
    isFund: "false"
};

export async function fetchStocks(): Promise<any> {
    const url = buildQuery(FMP_URL, FMP_KEY, filters);
    try {
        const response = await axios.get(url);
        console.log(`FMP Response Status: ${response.status}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return null;
    }
}