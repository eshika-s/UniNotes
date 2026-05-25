const axios = require('axios');

async function testAuth() {
  try {
    console.log("Testing Registration...");
    const regRes = await axios.post('http://localhost:5000/api/auth/register', {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    console.log("Registration Success:", regRes.data);

    console.log("\nTesting Login...");
    const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'test@example.com',
      password: 'password123'
    });
    console.log("Login Success:", loginRes.data);

    console.log("\nTesting Get User with Token...");
    const userRes = await axios.get('http://localhost:5000/api/auth/me', {
      headers: {
        'x-auth-token': loginRes.data.token
      }
    });
    console.log("Get User Success:", userRes.data);

  } catch (err) {
    if (err.response) {
      console.error("API Error:", err.response.data);
    } else {
      console.error("Error:", err.message);
    }
  }
}

testAuth();
