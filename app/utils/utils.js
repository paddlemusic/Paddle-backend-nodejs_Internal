const successResponse = (res, successCode, successMessage, data) => {
    res.status(successCode).json({
        status: true,
        message: successMessage,
        data: data,
    })
}

const failureResponse = (res, errorCode, errorMessage) => {
    res.status(errorCode).json({
        status: false,
        error: {
            error_code: errorCode,
            message: errorMessage
        }
    })
}

module.exports = {
    successResponse,
    failureResponse
}