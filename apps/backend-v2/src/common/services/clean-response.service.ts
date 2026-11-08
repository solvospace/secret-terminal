type Response = string | number | boolean | null | undefined | Response[] | { [key: string]: Response };
type CleanResponse = string | number | boolean | CleanResponse[] | { [key: string]: CleanResponse };

function cleanResponse(response: Response): CleanResponse {
    if (response === null || response === undefined) {
        throw new Error("response is required!");
    }

    if (Array.isArray(response)) {
        return response.map(cleanResponse).filter((value) => value !== null && value !== undefined);
    }

    if (typeof response === "object") {
        return Object.entries(response).reduce((acc: Record<string, CleanResponse>, [key, value]) => {
            if (value !== null && value !== undefined) {
                acc[key] = cleanResponse(value);
            }
            return acc;
        }, {});
    }

    return response;
}

export { cleanResponse };
