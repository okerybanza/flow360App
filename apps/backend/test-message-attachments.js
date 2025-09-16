const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

async function testMessageAttachments() {
  try {
    console.log('🧪 Testing Message Attachments...\n');
    
    // 1. Créer un message
    console.log('1. Creating a message...');
    const messageResponse = await axios.post('http://localhost:3001/api/messages', {
      content: 'Test message with attachment',
      projectId: 'test-project-id'
    }, {
      headers: {
        'Authorization': 'Bearer test-token'
      }
    });
    
    const messageId = messageResponse.data.id;
    console.log(`✅ Message created with ID: ${messageId}\n`);
    
    // 2. Créer un fichier de test
    const testContent = 'Test file content for message attachment';
    fs.writeFileSync('test-attachment.txt', testContent);
    
    // 3. Attacher le fichier au message
    console.log('2. Attaching file to message...');
    const formData = new FormData();
    formData.append('file', fs.createReadStream('test-attachment.txt'));
    
    const attachmentResponse = await axios.post(
      `http://localhost:3001/api/messages/${messageId}/attachments`,
      formData,
      {
        headers: {
          ...formData.getHeaders(),
          'Authorization': 'Bearer test-token'
        }
      }
    );
    
    console.log('✅ File attached successfully:', attachmentResponse.data);
    
    // 4. Récupérer les pièces jointes du message
    console.log('\n3. Getting message attachments...');
    const attachmentsResponse = await axios.get(
      `http://localhost:3001/api/messages/${messageId}/attachments`,
      {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      }
    );
    
    console.log('✅ Attachments retrieved:', attachmentsResponse.data);
    
    // 5. Récupérer les fichiers du projet depuis les messages
    console.log('\n4. Getting project files from messages...');
    const projectFilesResponse = await axios.get(
      `http://localhost:3001/api/messages/project/test-project-id/files-from-messages`,
      {
        headers: {
          'Authorization': 'Bearer test-token'
        }
      }
    );
    
    console.log('✅ Project files from messages:', projectFilesResponse.data);
    
    // Nettoyer
    fs.unlinkSync('test-attachment.txt');
    
    console.log('\n🎉 All tests passed! Message attachments are working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testMessageAttachments();
