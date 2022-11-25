const express = require("express");
const app = express();
const cors= require("cors");
const pool = require("./db")


// Middleware
app.use(cors());
app.use(express.json());


//  Routes

// create a todo
// * sur postman on met POST
app.post("/todos", async(req,res)=>{
    try {

        // on recupere la valeur de l'attribut
        const {description}=req.body;
        // la valeur dans values $1 recupere la description que l'on a ecrit sur postman
        // RETURNING * retourne à chaque fois la data ici description que l'on peut voir sur postman
        const newTodo = await pool.query("INSERT INTO todo (description) VALUES($1) RETURNING * ", [description]);

        
        res.json(newTodo.rows[0])
console.log(req.body)
    }catch(err){
        console.error(err.message)
    }
}
);

// ! GET all todos
// * sur postman on met GET

app.get("/todos", async(req, res) => {
    try{
const allTodos = await pool.query("SELECT * FROM todo");
res.json(allTodos.rows);
    }catch (err){
        console.error(err.message)
    }
})

// ! GET a todo
// /todos/LE_PARAMETRE_ICI_ID
// ID EN PARAMETRE

app.get("/todos/:id",async (req, res) =>{
    try{
        // L'id passé en parametre dans l'url sur postman
        const {id} = req.params;
        const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [id]);
        res.json(todo.rows[0]);
        console.log(req.params)
    }catch (err){
        console.error(err.message)
    }
})

// ! UPDATE a todo
// * sur postman on met PUT

app.put("/todos/:id", async(req, res)=>{
    try{
         // L'id passé en parametre dans l'url sur postman
        const { id } = req.params;
        const {description}=req.body;
        // [description, id] == [argument 1 $1, argument 2 $2]
        const updateTodo = await pool.query("UPDATE todo SET description = $1 WHERE todo_id = $2",[description, id]);
res.json("Todo est mis à jour!")
    }catch (err) {
        console.error(err.message)
    }
})

// ! DELETE a todo

app.delete("/todos/:id", async (req, res)=>{
    try{
        // je recupere le parametre id passer dans l'url
        const {id} =req.params;
        const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [id]);
        res.json("Todo est supprimé!")

    }catch{
        console.error(err.message)
    }
})

// le serveur marche sur le port 5000
app.listen(5000, () =>{
    console.log("server tourne sur le port 5000")
})