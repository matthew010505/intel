const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();


app.use(cors()); 
app.use(bodyParser.json()); 


app.post('/fill', (req, res) => {
  try {
    const formData = req.body; // Access JSON data from the request
    console.log('Received JSON data:', formData); // Print the JSON to the console
    res.status(200).json({ message: 'Data received successfully', data: formData });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server is running on port 8080');
});
