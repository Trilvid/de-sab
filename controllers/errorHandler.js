const AppError = require('./../utils/AppError');
const errorHandeler = (error, req, res, next) => {
  if (error.name === 'ValidationError') {
    return res.status(400).send({
      type: 'ValidatorError',
      details: error.message,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      errorCode: error.errorCode,
      title: 'an error occurred',
      msg: error.message,
    });
  }

  if ((process.env.NODE_ENV = 'development'))
    return res.status(500).send(error.message);
  return res.status(500).send('Something Went Wrong');
};

module.exports = errorHandeler;
