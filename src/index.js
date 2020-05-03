const express = require ('express'); 
const jwt = require('jsonwebtoken');
const env = require('dotenv-safe')

const serve = express();

serve.use(express.json()); // PRA INFORMAR AO SERVE QUE A ESTRUTURA QUE ESTAMOS RECEBENDO É JASON

env.config();


serve.get('', verifyJWT, (rec, res) => {
res.json({ mensage: 'Hello World!' });

});

serve.post('/login',(req,res) => {
    const {user, pass} = req.body;
    const id = 1; 
    if(validUser(user, pass)){
        let token = jwt.sign(
            {
                id //LOGIN 
            }, 
            
            process.env.SECRET, // CHAVE SECRETA
            
            {
                expiresIn: 300 // 5 min
            });

            res.status(200).header({token}).json({ 
                auth: true,
                token
                });

    }

    res.status(500).send('Login Invalido!');
});

function validUser(user, pass){


    return user === 'samuel' && pass === '12345'

}

function verifyJWT (req, res, next){
    const token = req.headers['authorization'] ? req.headers['authorization'].replace('Bearer ','') : false; //Bearer (O portador)

    if(!token) return res.status(401).json({ auth : false, message: 'Não tem token (No token provided.)' });

    jwt.verify(
        token,
        process.env.SECRET,
        (err, decoded) => {
            if (err) return res.status(500).json({ atuh: false, message: 'Failed to authentication token.'});

            req.userId = decoded.id;
            next();
        });
        
        
        
    
}

serve.listen(3333);