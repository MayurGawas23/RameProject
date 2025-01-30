const errorMiddleware = (err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    const extraDetails = err.extraDetails || 'Error from Backend';


    res.status(status).json({ message, extraDetails });
};


module.exports = errorMiddleware;