const knex = require('../data/conection')
const bcrypt = require('bcryptjs')

class User{
    async new(name, email, password, role){
        let salt = bcrypt.genSaltSync(10)
        let pass = bcrypt.hashSync(password,salt)
        try { 
            await knex.insert({
                  name: name, email: email, password: pass, role: role})
                  .table('users')
            return {status: true }
        } catch (err) {
            return {status: false, err: err}
        }
    }
    async findAll(){
        try {
           let users =  await knex.select(["name","email"]).table('users')
            return {status: true, values: users}
        } catch (err) {
            console.log(err)
            return { status: false, err: err }
        }
    }
    async findById(id){
        try{
            let user = await knex.select(["name","email"]).where({id: id}).table('users')
            return user.length > 0 ? {status: true, values: user } : {status: undefined, message: 'Usuário Inesistente!'}
        } catch (err) {
            return {status: false, err: err}
        }
    }

    async delete(id){
        let user = await this.findById(id)

        if (user.status){
            try {
                await knex.delete().where({id:id}).table('users')
                return {status: true, message:'Usuário Excluido com Sucesso'}
            } catch (err) {
                return {status: false, err: err}
            }
        }else{
            return {status: false, err: 'Usuário não existe, portanto não pode ser deletado.'}
        }
    }

    async update(id, name, email, role){
        let user = await this.findById(id)
        if(user.status){
            
            let editUser = {}

            name != undefined ? editUser.name = name : null
            email != undefined ? editUser.email = email : null
            role != undefined ? editUser.role = role : null

            try {
                await knex.update(editUser).where({id:id}).table('users')
                return ({status: true, message:'Usuário editado com sucesso!'})
            } catch (err) {
                return ({status: false, err: err})
            }
        }else{
            return {status: false, err: 'Usuário não existe, portanto não pode ser deletado.'}
        }    
    }

    async findByEmail(email){
        try{
            
            let user = await knex.select(['email', 'password', 'role']).where({email: email}).table('users')
            return user.length > 0 
            ? {status: true, values: user[0]}
            : {satus: undefined, message: "Email não encontrado"} 

        }catch(error){
            return {status: false, error: error}
        }
    };

}

module.exports = new User