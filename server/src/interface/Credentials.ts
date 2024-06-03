import { MongoClient } from 'mongodb';
import { Schema } from 'mongoose';
import { model } from 'mongoose';



const credentialsSchema = new Schema({
    uid: {
        type: String,
        required: true
    },
    doc_id: {
        type: String,
        required: true
    },
    platform: {
        type: String,
        required: true
    },
    app_key: {
        type: String,
        required: true
    },
    app_secret: {
        type: String,
        required: true
    },

    app_email: {
        type: String,
        required: true
    }
});

const Credentials = model('credentials', credentialsSchema);

export default Credentials;