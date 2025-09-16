const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testUpload() {
  try {
    // Créer un fichier de test
    const testContent = 'Test file content';
    fs.writeFileSync('test.txt', testContent);
    
    // Créer FormData
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test.txt'));
    formData.append('projectId', 'test-project-id');
    
    console.log('Testing file upload...');
    
    // Test upload de fichier
    const response = await axios.post('http://localhost:3001/api/files', formData, {
      headers: {
        ...formData.getHeaders(),
        'Authorization': 'Bearer test-token' // Vous devrez remplacer par un vrai token
      }
    });
    
    console.log('Upload successful:', response.data);
    
    // Nettoyer
    fs.unlinkSync('test.txt');
    
  } catch (error) {
    console.error('Upload failed:', error.response?.data || error.message);
  }
}

testUpload();
