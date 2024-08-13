exports.HTTP_BAD_REQUEST=400
exports.HTTP_OK=200
exports.HTTP_RESET_CONTENT=403
exports.HTTP_NOT_FOUND=404 
exports.TOKEN="TCABCDEFGH"

exports.checkIsNumber=(value)=> typeof value === 'number';
exports.checkIsString=(value)=> typeof value === 'string';
exports.checkIsObject=(value)=> typeof value === 'object';
exports.checkIsArray=(value)=> typeof value === 'array';
exports.checkIsset=(value)=> typeof value !== 'undefined';
exports.checkKeyExist=(object,key)=> object.hasOwnProperty(key);

// exports.checkIsset=(object,key)=> (key in object);