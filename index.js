const express = require('express');
const app = express();
const PORT = process.env.PORT || 9000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config()
const cors = require('cors')

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.obhaluk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});



async function run() {
    try {
       client.connect();
        const DNS_INFO = client.db("DNS-manager")
        const domainsInfo =DNS_INFO.collection("DNS-INFORMATION")
       
        app.post('/addingDomain', async (req, res) => {
            const info=req?.body
            const insertDomain=await domainsInfo.insertOne(info)
            console.log("hellow world")

            res.send(insertDomain)
        })
       
        app.delete('/deletingDomain/:id', async (req, res) => {
            const domainId=req?.params?.id
            console.log(domainId)
            const deleteDomain=await domainsInfo.deleteOne({_id:new ObjectId(domainId)})
            console.log("hellow world")

            res.send(deleteDomain)
        })
        app.get('/domains', async (req, res) => {
          
            const domains=await domainsInfo.find().toArray()
            console.log("hellow world")

            res.send(domains)
        })



        app.put('/editDomain/:id', async (req, res) => {
            const domainId = req?.params?.id;
            const updatedInfo = req?.body;
            
            const updateResult = await domainsInfo.updateOne(
              { _id: new ObjectId(domainId) },
              { $set: updatedInfo }
            );
      
            if (updateResult.modifiedCount > 0) {
              console.log('Domain updated successfully:', updatedInfo);
              res.json({ message: 'Domain updated successfully', updatedInfo });
            } else {
              console.log('Domain not found or not updated.');
              res.status(404).json({ error: 'Domain not found or not updated' });
            }
          });









    }
    finally {

    }
}
run().catch(console.dir)


app.listen(PORT, function (err) {

    console.log(`listening at ${PORT}`);
});