"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToDate = exports.getClassName = exports.generateApiResponse = void 0;
const api_response_base_model_1 = require("../models/dto/api-response-base.model");
const generateApiResponse = (response) => {
    var _a, _b, _c;
    const apiResponse = new api_response_base_model_1.ApiResponse();
    apiResponse.message = (_a = response.message) !== null && _a !== void 0 ? _a : 'OK';
    apiResponse.data = response.data;
    apiResponse.status = (_b = response.status) !== null && _b !== void 0 ? _b : true;
    apiResponse.statusCode = (_c = response.statusCode) !== null && _c !== void 0 ? _c : 200;
    apiResponse.errors = response.errors;
    return apiResponse;
};
exports.generateApiResponse = generateApiResponse;
//get class and function name from error
const getClassName = (stackTrace) => {
    const stackTraceArray = stackTrace.split('at ');
    const className = stackTraceArray[2].split(' ')[0]; //get class name
    const functionName = stackTraceArray[2].split(' ')[1]; //get function _getClassName
    return { className, functionName };
};
exports.getClassName = getClassName;
//convert yymmdd to Date object
const convertToDate = (date) => {
    const year = date.substring(0, 2);
    const month = date.substring(2, 4);
    const day = date.substring(4, 6);
    return new Date(`20${year}-${month}-${day}`);
};
exports.convertToDate = convertToDate;
//# sourceMappingURL=api.utils.js.map