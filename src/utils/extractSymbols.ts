export function extractSymbols(data: any): { data: { symbols: string[], length: number }, client_id: string } {
    if (!Array.isArray(data)) {
        console.error("[ERROR] Invalid or unexpected JSON format");
        return { data: { symbols: [], length: 0 }, client_id: "scanner" };
    }

    const symbols = data.map((item) => item.symbol).filter(Boolean);
    return { data: { symbols, length: symbols.length }, client_id: "scanner" };
}