const successResponse = (res, successCode, successMessage, data) => {
  res.status(successCode).json({
    status: true,
    message: successMessage,
    data: data
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

async function rawQuery(query) {
  return new Promise((resolve, reject) => {
    dbConfig.pool.query(query, (error, results) => {
      if (error) {
        console.log(error)
        reject(error)
      } else {
        resolve(results.rows)
      }
    })
  })
}

module.exports = {
  successResponse,
  failureResponse,
  rawQuery
}
