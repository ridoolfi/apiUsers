require('dotenv').config();
let jwt = require('jsonwebtoken');

module.exports = function(req, res, next){
    
    const authToken = req.headers['autorization']

    if(authToken === undefined){
        return res.status(403).json({
            success: false,
            message: "usuário não autorizado" 
        })
    }else{
        const bearer = authToken.split(' ')
        const token = bear[1];

        try {
            var decoded = jwt.verify(token, process.env.JWT_TOKEN);
            
            return decoded.role === 1 
            ? next()
            : res.status(403).json({
                success: false,
                message: "usuário não autorizado" 
            })

        }catch(error) {
            return res.status(403).json({
                success: false,
                message: "usuário não autorizado" 
            })
        }
    }
}
