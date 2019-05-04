import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp()

export const getFeed = functions.https.onRequest(async (req, res)=> {
    const docs = await admin.firestore().collection('posts').limit(10).get()
    res.send(docs.docs.map(doc => doc.data()))
})