export function buildQuery(baseUrl: string, apiKey: string, filters: Record<string, string>): string {
    const params = new URLSearchParams({ apikey: apiKey });

    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    return `${baseUrl}?${params.toString()}`;
}