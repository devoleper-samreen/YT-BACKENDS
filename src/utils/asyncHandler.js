const asyncHandler = (requestHandler) => {
   return async (req, res, next) => {
        try {
           await requestHandler(req,res,next) 
        } catch (error) {
            res.status(error.code || 500).json({
                success: false,
                massage: error.massage
            })
        }
    }
}

// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
//     }
// }

export {asyncHandler}

