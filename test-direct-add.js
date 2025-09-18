const axios = require('axios');

async function testDirectAddMember() {
  try {
    console.log('Testing direct add member functionality...');
    
    // Login first
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.token;
    const headers = { Authorization: `Bearer ${token}` };
    
    console.log('✅ Login successful');
    
    // Get boards
    const boardsResponse = await axios.get('http://localhost:5000/api/boards', { headers });
    const boards = boardsResponse.data.data;
    
    if (boards.length === 0) {
      console.log('❌ No boards found');
      return;
    }
    
    const boardId = boards[0]._id;
    console.log(`📋 Testing with board: ${boardId}`);
    
    // Test get board members
    const membersResponse = await axios.get(`http://localhost:5000/api/boards/${boardId}/members`, { headers });
    console.log('✅ Get board members successful');
    console.log('Current members:', membersResponse.data.data.members.length);
    console.log('User role:', membersResponse.data.data.userRole);
    
    // Test add member (this will fail if user doesn't exist, but that's expected)
    try {
      const addResponse = await axios.post(`http://localhost:5000/api/boards/${boardId}/add-member`, {
        email: 'nonexistent@example.com',
        role: 'member'
      }, { headers });
      console.log('✅ Add member API endpoint working');
    } catch (error) {
      if (error.response?.status === 404) {
        console.log('✅ Add member API endpoint working (user not found as expected)');
      } else {
        console.log('❌ Add member API error:', error.response?.data);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testDirectAddMember();
