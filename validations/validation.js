const Joi = require('joi');

const registerValidation = (data) => {
    const schemaValidation = Joi.object({
        username: Joi.string().required().min(3).max(256),
        email: Joi.string().required().min(6).max(256).email(),
        password: Joi.string().required().min(6).max(1024)        
    });
    return schemaValidation.validate(data);
};

const loginValidation = (data) => {
    const schemaValidation = Joi.object({
        email: Joi.string().required().min(6).max(256).email(),
        password: Joi.string().required().min(6).max(1024)        
    });
    return schemaValidation.validate(data);
};

module.exports = {
    registerValidation,
    loginValidation
};
