const Router = require("express"); 
const user_details = Router() ;
const userDetails = require("../models/detailsSchemaModels") ;
const axios = require("axios") ;
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');
const fs = require("fs")


let cachedUserData = null; 

const fetchAndStoreUserDetails = async() =>{

try {
  if (cachedUserData) {
    console.log('User data found in cache.',cachedUserData );
    return cachedUserData; 
  }
    const response = await axios.get('https://gorest.co.in/public-api/users', {
      headers: {
        Authorization: 'Bearer 599c933a8aabf46e975467970743e791f525c6f4127e447677fdb97f565327a5' 
      }
    });
    const userData = response.data.data;
    // console.log(userData)
  if (!Array.isArray(userData)) {
      throw new Error('Invalid user data');
    }

    cachedUserData = userData; 
   
    for (const user of userData) {
        
        const currentDate = new Date();
    const userSave =  new userDetails({
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        status: user.status,
        created_at: currentDate,
        updated_at: currentDate
      });
      await userSave.save()
    }

    console.log('User data stored in the database.');
    
} catch (error) {
    console.error('Error fetching and storing user data:', error);
    throw error;
}

}

user_details.get("/fetch-store", (req, res) => {
  
    fetchAndStoreUserDetails()
    .then(async() => {
        let allData = await userDetails.find({}) 
        res.send(allData);
      })
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).send('Internal Server Error');
      });
     
})


user_details.put("/users/:id", (req, res) => {
    const userId = req.params.id;
    const updatedData = req.body;
  
    
    userDetails.findOneAndUpdate({id :userId}, updatedData, { new: true })
      .then(updatedUser => {
        res.json(updatedUser);
      })
      .catch(error => {
        console.error('Error updating user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      });
})

async function exportUserDataToCSV() {
    try {
      const users = await userDetails.find().lean();
  
      const csvWriter = createCsvWriter({
        path: path.join(__dirname, '../uploads/user_master.csv'),
        header: [
          { id: 'id', title: 'ID' },
          { id: 'name', title: 'Name' },
          { id: 'email', title: 'Email' },
          { id: 'gender', title: 'Gender' },
          { id: 'status', title: 'Status' },
          { id: 'created_at', title: 'Created At' },
          { id: 'updated_at', title: 'Updated At' }
        ]
      });
  
      await csvWriter.writeRecords(users);
  
      console.log('User Master data exported to CSV file.');
    } catch (error) {
      console.error('Error exporting User Master data:', error);
      throw error;
    }
  } 

user_details.get("/export-to-csv", async(req, res) => {
  try {
    await exportUserDataToCSV();

    const filePath = path.join(__dirname, '../uploads/user_master.csv');
    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=user_master.csv');
    res.setHeader('Content-Length', stat.size);

    fileStream.pipe(res);
    fileStream.on('error', (err) => {
      console.log(err);
      return res.status(500).send(err);
    });
    fileStream.on('close', () => {
      fs.unlinkSync(filePath);
      console.log('CSV file deleted successfully');
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
})
module.exports = user_details ;
