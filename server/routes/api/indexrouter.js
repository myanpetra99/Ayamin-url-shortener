const express = require('express')

const router = express.Router();
const mongodb = require('mongodb')


async function loadPostsCollection(){
    const client = await mongodb.MongoClient.connect('mongodb://127.0.0.1/Ayam', {
    useNewUrlParser:true , useUnifiedTopology:true
})
return await client.db('Ayam').collection('posts')
}

async function savePostsCollection(params){
    const posts = await loadPostsCollection()
    posts.insertOne(params)
}

async function deletePostsCollection(id){
    const posts = await loadPostsCollection()
    posts.deleteOne({_id:id})
}



router.get('/',async (req,res)=>{
    const posts = await loadPostsCollection()
    res.send(await posts.find().toArray())
})



router.post('/', async (req,res) =>{
    const slug = ((req.body.slug).toString()).replace(/\s/g, "");
    savePostsCollection({
        url: req.body.url,
        slug: slug,
        result : req.headers.host +'/'+slug,
        createdAt : new Date()
    })

    res.status(201).send()
})

router.delete('/:id', async(req, res)=>{
deletePostsCollection(new mongodb.ObjectID(req.params.id))
res.status(201).send()
})
module.exports = router