const asyncHandlers = (requestHandler) => {
   return async (req, res, next) => {
        try {
           await requestHandler(req,res,next) 
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                message: error.message
            })
        }
    }
}

const asyncHandler = (requestHandler) => {
    return async (req, res, next) => {
         try {
            await requestHandler(req, res, next); 
         } catch (error) {
             const statusCode = error.statusCode || 500;
             const message = error.message || "Internal Server Error";
             
             res.status(statusCode).json({
                 success: false,
                 message
             });
         }
     };
 };
 

// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }

export {asyncHandler}

