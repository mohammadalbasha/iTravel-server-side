const {check, validationResult} = require('express-validator');

module.exports.validateUser = [
    check('email')
        .trim()
        .normalizeEmail()
        .not()
        .isEmpty()
        .withMessage('Please Enter email!')
        .isEmail()
        .withMessage ('Please Enter a valid Email!'),
    check('password',
        'Please enter a password with only numbers and text and at least 6 characters!')
        .isAlphanumeric()
        .isLength({min:6}),
    check('confirmedPassword')
        .trim()
        .custom((value, { req }) => {
            if (value !== req.body.password) {
            throw new Error('Passwords have to match!');
            }
            return true;
        }),
     check('username')
        .trim()
        .not()
        .isEmpty()
        .withMessage('Please Enter a username!'),
    
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            console.log(errors.array());
            const error = new Error('Validation Error');
            error.statusCode = 422;
            error.data = errors.array();
            throw error;
        } 
        next();
        },
];

module.exports.validateStay = [];
module.exports.validateTouristPlan = [];
module.exports.validatePlace = [];
