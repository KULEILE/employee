const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    // MySQL duplicate entry error
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
            success: false,
            message: 'Duplicate entry found'
        });
    }

    // MySQL connection errors
    if (err.code === 'ECONNREFUSED') {
        return res.status(503).json({
            success: false,
            message: 'Database connection failed'
        });
    }

    res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : {}
    });
};

module.exports = errorHandler;