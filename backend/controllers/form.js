require('dotenv').config();
const Contact = require('../models/form'); 
const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;
const keys = require('../utils/constants/service-account.json');


const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth: client });

async function writeToGoogleSheets() {
  try {
    // Récupérer des données de MongoDB
    const results = await Contact.find({}).exec();
    
    // Préparer les données pour Google Sheets
    // Prepare the data for Google Sheets
    const data = results.map(item => [
      item.name,
      item.surname,
      item.email,
      item.phone || '',  // Include a fallback for optional fields
      item.message || ''
    ]);

        // Determine the size of the data to set the range correctly
        // const numRows = data.length;
        // const numCols = data[0].length;
        // const range = `Sheet1!A1:${getColumnLetter(numCols)}${numRows}`;

    // Spécifier les paramètres de la requête Google Sheets
    const request = {
      spreadsheetId: process.env.GOOGLE_SHEET_ID, // Remplacez par l'ID de votre Google Sheet
      range: 'Contacts!A2', // Adaptez selon la plage que vous souhaitez écrire
      valueInputOption: 'USER_ENTERED',
      resource: { values: data }
    };


    // Écrire les données dans Google Sheets
    const response = await sheets.spreadsheets.values.update(request);
    console.log('Data written to Sheet:', response.data);
  } catch (err) {
    console.error('Error writing to Sheets', err);
  }
}

const getFormInfo = async (req, res) => {
  try {
    const { name, surname, email, phone, message } = req.body;
    const contact = new Contact({ name, surname, email, phone, message });
    await contact.save();
    await writeToGoogleSheets();
    res.status(204).send();
  } catch (error) {
    console.error('Failed to process form:', error);
    res.status(500).send('Internal Server Error');
  }
}

module.exports = { getFormInfo};