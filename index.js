'use strict'
const HTTP_CODE_CONSTANTS = require('./config');

var JsonResponse = {};

/**
 * @type object
 * @description Optional configurations such us whether should show custom error messages or not
 * @property {Boolean} showCustomErrMessages - Show custom error messages
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
var _options = {
	showCustomErrMessages: process.env.DEV
}

/**
 * @type function
 * @description Creats error
 * @returns {Object} error information with error message and code
 * @param {Number} code: http error status code 
 * @param {String} message: Information about the error
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
JsonResponse.makeError = (code, message) => {
	let httpCode = HTTP_CODE_CONSTANTS["ERROR_" + code];
	let error;
	try {
		code = httpCode.CODE;
		error = {
			code: code,
			message: message || httpCode.MESSAGE
		}
		if(!_options.showCustomErrMessages){
			error.message = httpCode.MESSAGE;
		}
	} catch (error) {
		let err = new RangeError("The provided [code] http code:" + JSON.stringify(code)
			+ " is not valid. Please check the http config file.");
		throw err;
	}
	return error;
}

/**
 * @type function
 * @description Sends http failer response based on specified error status code
 * @returns {undefined}
 * @param {object} res: http response for sending failer response
 * @param {number} code: http status code
 * @param {object} error: optional parameter describs error message with error code
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
JsonResponse.sendFailure = (res, code, error) => {
	if(code && code.code){
		error = code;
	}else if(!error){
		error = JsonResponse.makeError(code);
	}
	res.status(error.code);
	res.json({
		"status": error.code,
		"message": error.message
	});
	

}

/**
 * @type function
 * @description Sends http succeed response
 * @returns {undefined}
 * @param {object} res: http response for sending successful response
 * @param {number} code: http status code
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */
JsonResponse.sendSuccess = (res, data) => {
	if(!data){
		data = {
			"status": HTTP_CODE_CONSTANTS.SUCCESS_200.CODE,
			"message": HTTP_CODE_CONSTANTS.SUCCESS_200.MESSAGE
		}
	}
	res.status(HTTP_CODE_CONSTANTS.SUCCESS_200.CODE);
	res.json({
		status: HTTP_CODE_CONSTANTS.SUCCESS_200.CODE,
		data: data
	});
}



/**
 * @exports http response functions
 * @description Response to http request
 * @author Karlen Manaseryan <kmanaseryan@gmail.com>
 */

module.exports = JsonResponse;
