const express = require('express');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;

const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('services'));

const port = process.env.PORT || 5000;

app.get('/', (req, res) => {
  res.send('Hello World!')
})


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bmaaw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  console.log('connection error : ', err);

  const galleryCollection = client.db("careFordb").collection("gallery");
  const volunteerRequestCollection = client.db("careFordb").collection("volunteerRequest");
  const cashDonationCollection = client.db("careFordb").collection("cashDonation");
  const campaignDonationCollection = client.db("careFordb").collection("campaignDonation");
  const donationRequestCollection = client.db("careFordb").collection("donationRequest");


  // Photo Gallery
  app.get('/photo-gallery', (req, res) => {
    galleryCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })

  // Add Photo
  app.post('/addPhoto', (req, res) => {
    const newPhoto = req.body;
    galleryCollection.insertOne(newPhoto)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  // All Volunteer Request
  app.get('/volunteer-requests', (req, res) => {
    volunteerRequestCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })


  // New Volunteer Request
  app.post('/newVolunteerRequest', (req, res) => {
    const newVolunteerReq = req.body;
    volunteerRequestCollection.insertOne(newVolunteerReq)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })

  // Delete Volunteer Request
  app.delete('/deleteVolunteerRequest/:id', (req, res) => {
    volunteerRequestCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })


  // Cash Donation
  app.post('/addCashDonation', (req, res) => {
    const newCashDonation = req.body;
    cashDonationCollection.insertOne(newCashDonation)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  // Campaign Donation
  app.post('/addCampaignDonation', (req, res) => {
    const newCampaignDonation = req.body;
    campaignDonationCollection.insertOne(newCampaignDonation)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })


  // All Donation Requests
  app.get('/donationRequest', (req, res) => {
    donationRequestCollection.find()
      .toArray((err, items) => {
        res.send(items);
      })
  })


  // User Specific Requests
  app.get('/userSpecificRequests', (req, res) => {
    donationRequestCollection.find({ email: req.query.email })
      .toArray((err, items) => {
        res.send(items);
      })
  })



  // Add New Donation Request
  app.post('/newDonationRequest', (req, res) => {
    const newDonationRequest = req.body;
    donationRequestCollection.insertOne(newDonationRequest)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
  })



  // Delete Donation Request
  app.delete('/deleteDonationRequest/:id', (req, res) => {
    donationRequestCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0);
      })
  })

})


app.listen(port, () => { });
