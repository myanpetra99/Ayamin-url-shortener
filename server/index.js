const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongodb = require('mongodb')

const indexrouter = require('./routes/api/indexrouter')
app.use(morgan("combined"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended : false}))

app.listen(process.env.PORT || 8000)


app.use('/api/posts',indexrouter)

if(process.env.NODE_ENV === 'production'){
    app.use(express.static(__dirname+'/public/'))

    app.get(/.*/, (req,res)=> res.sendFile(__dirname+ '/public/index.html'));
}


async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect('mongodb://127.0.0.1/Ayam', {
    useNewUrlParser:true , useUnifiedTopology:true
})
return await client.db('Ayam').collection('posts')
}

async function findLink(slug){
    const posts = await loadPostsCollection()
    return await posts.findOne({slug:slug})
}


app.get('/:slug',async (req,res)=>{
    const posts = await findLink(req.params.slug)
    res.status(200).redirect(posts.url)
    console.log(posts.url)
})

console.log(`Server running at http://localhost:8000/`);