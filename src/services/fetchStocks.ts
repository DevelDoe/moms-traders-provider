import axios from "axios";
import { buildQuery } from "../utils/buildQuery";
import { FMP_KEY, FMP_URL } from "../config";

export async function fetchStocks(filters: Record<string, any>): Promise<any> {
    const queryFilters = {
        priceMoreThan: filters.priceMoreThan || "1",
        priceLowerThan: filters.priceLowerThan || "7",
        volumeMoreThan: filters.volumeMoreThan || "100000",
        marketCapLowerThan: filters.marketCapLowerThan || "30000000",
        exchange: filters.exchange || "NASDAQ",
        isActivelyTrading: filters.isActivelyTrading || "true",
        isEtf: filters.isEtf || "false",
        isFund: filters.isFund || "false",
    };

    const url = buildQuery(FMP_URL, FMP_KEY, queryFilters);
    try {
        const response = await axios.get(url);
        console.log(`FMP Response Status: ${response.status}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching stock data:", error);
        return null;
    }
}