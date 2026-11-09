type Response = string | number | boolean | null | undefined | Response[] | { [key: string]: Response };
type CleanResponse = string | number | boolean | CleanResponse[] | { [key: string]: CleanResponse };

function cleanResponse(response: Response): CleanResponse | null | undefined {
    if (response === null || response === undefined) {
        return response;
    }

    if (Array.isArray(response)) {
        return response.map(cleanResponse).filter((value) => value !== null && value !== undefined);
    }

    if (typeof response === "object") {
        return Object.entries(response).reduce((acc: Record<string, CleanResponse>, [key, value]) => {
            const cleanedValue = cleanResponse(value);

            if (
                cleanedValue !== null &&
                cleanedValue !== undefined &&
                !(
                    typeof cleanedValue === "object" &&
                    !Array.isArray(cleanedValue) &&
                    Object.keys(cleanedValue).length === 0
                )
            ) {
                acc[key] = cleanedValue;
            }

            return acc;
        }, {});
    }

    return response;
}

export { cleanResponse };
