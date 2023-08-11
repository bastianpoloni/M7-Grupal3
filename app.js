import express from 'express';
import {pool} from './connection.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use (express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
});

app.get ('/usuarios', async (req, res) => {
    try{
        const usuarios = await pool.query('SELECT * FROM usuarios');
        res.json(usuarios.rows);
    } catch (error){
        console.log(error);
    } finally{
        pool.release;
    }


});

app.post ('/usuario', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const usuario = await pool.query('INSERT INTO usuarios (email, password) VALUES ($1, $2)', [email, password]);
        res.json(usuario.rows);
    } catch (error){
        console.log(error);
    } finally{
        pool.release;
    }
    
});


app.post ('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        
        console.log(req.body.email);
        console.log(req.body.password);
        
        const usuario = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND password = $2', [email, password]);
        
        if (usuario.rowCount > 0){ 
            console.log("Usuario encontrado");
            res.send(usuario.rows[0]);
        } else {
            res.status(404).send("");
        }
        
    } catch (error){
        console.log(error);
    } finally{
        pool.release;
    }
})

app.listen(3000,()=>console.log("Servidor corriendo en puerto 3000"));