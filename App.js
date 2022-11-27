//Declaración de variables
const fs = require(`fs`)
let prodList = []
let randomProd = {"title": "Oreos",     "price": 175,     "thumbnail": "https://d1on8qs0xdu5jz.cloudfront.net/webapp/images/fotos/b/0000000000/835_1.jpg",     "id": 1}
let waitingTime = 2200
const express = require(`express`)
const app = express()
//Fin declaración de variables

//Clase Contenedor
class Contenedor{
    constructor(nombreArchivo){
        this.nombreArchivo = nombreArchivo
    }
    async save(newProduct){
        return fs.promises.readFile(this.nombreArchivo, `utf-8`)
        .then(content =>{
            const products = JSON.parse(content)
            const lastObj = products[products.length - 1]
            newProduct.id=lastObj.id+1
            products.push(newProduct)
            fs.promises.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2))
            return newProduct.id
        })
        .catch(error => {
            newProduct.id=1
            console.log(error)
            const products=[newProduct]
            fs.promises.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2))
            return newProduct.id
        })
    }
    async getById(idToSearch){
        return fs.promises.readFile(this.nombreArchivo, `utf-8`)
        .then(content =>{
            const products = JSON.parse(content)
            const foundProd = products.find(element=>element.id==idToSearch)
            if (foundProd == undefined){
                return null
            } else{
                return foundProd
            }
        })
        
    }
    async getAll(){
        return fs.promises.readFile(this.nombreArchivo, `utf-8`)
        .then(content =>{
        const products = JSON.parse(content)
        return products
        })
    }
    deleteById(idToSearch){
        fs.promises.readFile(this.nombreArchivo, `utf-8`)
        .then(content =>{
        const products = JSON.parse(content)
        const prodToDelete = products.findIndex(element=>element.id==idToSearch)
        products.splice(prodToDelete,1)
        fs.promises.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2))
        })
    }
    deleteAll(){
        const products = []
        fs.promises.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2))
    }
    restoreFromRef(){
        fs.promises.readFile(`ProductosRef.txt`, `utf-8`)
        .then(content=>{
            const products = JSON.parse(content)
            fs.promises.writeFile(this.nombreArchivo, JSON.stringify(products, null, 2))
        })
    }
}
//Termina Clase Contenedor
//Contenedor y Productos a Agregar
const Producto1 = new Contenedor ("Productos.txt")

const Alfajores = {
    title: "Alfajores",
    price: 750,
    thumbnail: "https://ardiaprod.vtexassets.com/arquivos/ids/225929/Alfajores-de-Chocolate-DIA-6-Un-_1.jpg?v=637903771366630000"
}
const Caramelos = {
    title: "Caramelos",
    price: 640,
    thumbnail: "https://arcorencasa.com/wp-content/uploads/2020/07/20200630-1001782.jpg"
}
const PanDulce = {
    title: "Pan Dulce",
    price: 800,
    thumbnail: "https://carrefourar.vtexassets.com/arquivos/ids/195276/7798141716265_02.jpg?v=637516045195370000"
}
//Fin Contenedor y Productos a Agregar

//Funciones de Contenedor a utilizar
async function saveProduct(Producto){

    const saveProduct = await Producto1.save(Producto)
    console.log(saveProduct)
}

async function getAllProds(){
    const allProds = await Producto1.getAll()
    return allProds
 }
async function idObject(idToSearch) {
   const idObject = await Producto1.getById(idToSearch)
   return idObject
}
//Fin de funciones de Contenedor a utilizar

//Función para elegir un número al azar
function getRandomInt(max) {
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - 1 + 1) + 1)
  }
//Fin de Función para elegir un número al azar.

//Función que se asegura de agregar 3 productos si no hay 5 productos en la lista (a trabajar mejor ya que es bastante precaria.)
function prepareProducts (){
    getAllProds().then(allProds=> {
       if(allProds.length != 5){
        saveProduct(Alfajores)
        setTimeout(()=>{
            saveProduct(Caramelos)
        }, 1000)
        setTimeout(()=>{
            saveProduct(PanDulce)
        }, 2000)
    }else{
        waitingTime = 200
    }}) }
    prepareProducts()
//Fin de Función que se asegura de agregar 3 productos si no hay 5 productos en la lista.



//Si se quiere que se retorne únicamente el nombre del producto se usa esta parte del código -- Apertura
getAllProds().then(allProds =>allProds.forEach(prod => {
    prodList.push(prod.title)
 }))
//Si se quiere que se retorne únicamente el nombre del producto se usa esta parte del código -- Cierre

//Si se quiere que se retorne toda la información del producto se usa esta parte del código -- Apertura
//  getAllProds().then(allProds => prodList = allProds)
//Si se quiere que se retorne toda la información del producto se usa esta parte del código -- Cierre

//Declaración y funcionamiento de servidor -- Apertura
app.get(`/productos`, (req, res)=>{
    getAllProds().then(allProds =>{
        if (allProds.length > prodList.length){
            prodList = []
            getAllProds().then(allProds =>allProds.forEach(prod => {
                prodList.push(prod.title)
             }))  
        }
    })
    res.send(prodList)
})
app.get(`/productoRandom`, (req, res)=>{
    getAllProds().then(allProds => {
        setTimeout(()=>{
            const randomNum = getRandomInt(allProds.length)
            console.log(randomNum)
            idObject(randomNum).then(idObject=>randomProd = idObject)
        }, waitingTime)
    })
    res.send(`
    <div>
        <h2>${randomProd.title}</h2>
        <img src="${randomProd.thumbnail}" alt="" style="width:400px">
        <h3>${randomProd.price}</h3>
    </div>
    `)
})

const PORT = 8080
const server = app.listen(PORT, ()=>
{
    console.log(`Servidor HTTP está escuchando en el puerto ${server.address().port}`)
})

//Declaración y funcionamiento de servidor -- Cierre