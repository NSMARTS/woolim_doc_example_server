const mongoose = require('mongoose');

const example = require('../example');

mongoose.Promise = global.Promise;

const mongoApp = {};

mongoApp.appSetObjectId = function (app) {
    app.set('ObjectId', mongoose.Types.ObjectId);
    console.log('complete to set mongoose ObjectId');
}


async function main() {
    await mongoose.connect(process.env.MONGODB_URI).then(async () => {
        createNamespace();
        console.log('Database Connected')

        // for (let i of example) {
        //     await global.DB_MODELS.Search(i).save()

        // }
    })
}

main().catch(err => console.error(err));

function createNamespace() {
    const dbModels = {};
    dbModels.Search = require('../namespace/search_namespace');

    global.DB_MODELS = dbModels;
}

module.exports = mongoApp;