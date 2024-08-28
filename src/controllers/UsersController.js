require("dotenv").config();
var User = require('../models/Users');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

class UsersController{
    async create(req, res){
        let {name, email, password, role} = req.body
        
        let result = await User.new(name, email, password,role)
        result.status
        ? res.status(200).json({sucess: true, massage:"Usuário Cadastrado com Sucesso"})
        : res.status(404).json({sucess: false, message: result.err})
    }
    async findAll(req, res){
        let users = await User.findAll()
        users.status
        ? res.status(200).json({sucess: true, values: users.values})
        : res.status(404).json({sucess: false, message: users.err})
    }
    async findUser(req, res){
        let id = req.params.id
        if (isNaN(id)){
            return res.status(404).json({sucess: false, message:'Parametros Invalidos'})
        }else{
            let user = await User.findById(id)
            if (user.status == undefined)
                res.status(406).json({sucess: false, massage:"Usuário não encontrado"})
            else if (!user.status)
                res.status(404).json({sucess: false, message: result.err})
            else
                res.status(200).json({sucess: true, massage:user.values})
        }
    }

    async remove(req, res){
        let id = req.params.id
        if(isNaN(id)){
            return res.status(404).json({sucess: false, message:'Parametro Inválido'})
        }else{
            let result = await User.delete(id)
            result.status 
            ? res.status(200).json({sucess: result.status, message: result.message})
            : res.status(406).json({sucess: result.status, message: result.err})
        }
    }
    async editUser(req, res){
        let id = req.params.id
        let {name, email, role} = req.body
        if(isNaN(id)){
            return res.status(404).json({sucess: false, message:'Parametro Inválido'})
        }else{
            let result = await User.update(id, name, email, role)
            result.status 
            ? res.status(200).json({sucess: result.status, message: result.message})
            : res.status(406).json({sucess: result.status, message: result.err})
        }
    }

    async login(req, res){
        let {email, password} = req.body;

        let user = await User.findByEmail(email);
        if(user.status === undefined || !user.status){
            user === undefined
            ? res.status(404).json({success: false, message: user.message})
            : res.status(400).json({succes: false, message: user.error})
        }else{
            let isPassword = await bcrypt.compare(password, user.values.password)
            
            if(!isPassword){
                res.status(406).json({success: isPassword, message: 'Senha inválida'})
            }else{
                let token = jwt.sign({email: user.values.email, role: user.values.role},
                     process.env.JWT_SECRET, {expiresIn: "4h"})
                res.status(200).json({succes: isPassword, token: token});
            }
        };

    }
}

module.exports = new UsersController