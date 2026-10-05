const appHttpStatus = {
    ok: 200,
    created: 201,
    noContent: 204,

    badRequest: 400,
    unauthorized: 401,
    forbidden: 403,
    notFound: 404,
    conflict: 409,
    unProcessableContent: 422,

    internalServerError: 500,
    serviceUnavailable: 503,
};

export default appHttpStatus;
