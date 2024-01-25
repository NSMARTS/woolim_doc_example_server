const express = require('express');
const axios = require('axios');
const http = require('http');
const cors = require('cors')
const app = express();
const port = 3200;
const FormData = require('form-data');
const multer = require('multer');
const fs = require('fs');

require("dotenv").config();
//==========================================================

const allowedOrigins = ['http://localhost:4200', 'http://localhost:4300', 'http://192.168.0.5:4200', 'http://192.168.0.5:4300', 'http://192.168.0.42:4200', 'http://192.168.0.42:4300', 'https://buildingtalks.com'];
app.use(cors({
    origin: '*',
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json({ limit: '100mb' }))

const upload = multer({ storage: multer.memoryStorage() })

// naver OCR test
app.post('/api/test', upload.single('file'), async (req, res) => {

    let formData = new FormData();


    formData.append('file', req.file.buffer, { filename: 'test.pdf' })

    formData.append("message", JSON.stringify({ "images": [{ "format": "png", "name": "demo" }], "requestId": "guide-demo", "version": "V2", "timestamp": 1584062336793 }))

    console.log(formData)
    const response = await axios.post(process.env.OCR_URI, formData, {
        headers: {
            'Accept': process.env.OCR_ACCEPT,
            'X-OCR-SECRET': process.env.OCR_SECRET
        }
    })
    let text = '';
    for (let i of response.data.images[0]['fields']) {
        text += i['inferText'] + ' ';
    }

    await global.DB_MODELS.Search({
        title: req.body.title,
        context: text,
        page: req.body.page
    }).save()

    return res.send(response.data.images)

})


// 검색 test
//https://m.blog.naver.com/ijoos/221304624264
app.post('/api/search', async (req, res) => {
    const search = req.body.search;

    //https://lunker91.tistory.com/entry/Mongoose-regex-%EC%82%AC%EC%9A%A9%ED%95%98%EA%B8%B0
    const query = new RegExp(search)
    const test = await global.DB_MODELS.Search.find({ context: query }).select({ title: 1, page: 1 }).sort({ page: 1 })

    return res.send(test)
})


const mongoApp = require('./database/mongoDB');

const server = http.createServer(app).listen(port, '0.0.0.0', async () => {
    console.log(`Example app listening on port ${port}`)
    mongoApp.appSetObjectId(app);

})