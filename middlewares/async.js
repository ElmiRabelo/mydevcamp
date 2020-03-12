//This will handle the async function, that way I don't need to use the Try Catch block into the Controllers

const asyncHandler = fn => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
