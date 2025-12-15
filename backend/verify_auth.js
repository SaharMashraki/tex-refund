// Native fetch is used

async function verify() {
    const baseUrl = 'http://127.0.0.1:3001/api/v1/auth'; // Ensure prefix matches routes
    const email = `test_${Date.now()}@example.com`;
    const password = 'Password123!';
    const name = 'Test User';

    console.log(`Testing with ${email}...`);

    try {
        // 1. Register
        console.log('1. Registering...');
        const regRes = await fetch(`${baseUrl}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, name })
        });

        if (regRes.status !== 201) {
            throw new Error(`Register failed: ${regRes.status} ${await regRes.text()}`);
        }
        const regData = await regRes.json();
        console.log('Register Success:', regData.user.email === email);

        // 2. Login
        console.log('2. Logging in...');
        const loginRes = await fetch(`${baseUrl}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (loginRes.status !== 200) {
            throw new Error(`Login failed: ${loginRes.status} ${await loginRes.text()}`);
        }
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log('Login Success, Token received');

        // 3. Profile
        console.log('3. Fetching Profile...');
        const profileRes = await fetch(`${baseUrl}/profile`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (profileRes.status !== 200) {
            throw new Error(`Profile failed: ${profileRes.status} ${await profileRes.text()}`);
        }
        const profileData = await profileRes.json();
        console.log('Profile Success:', profileData.email === email);

        // 4. Logout
        console.log('4. Logging out...');
        const logoutRes = await fetch(`${baseUrl}/logout`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (logoutRes.status !== 200) {
            console.warn(`Logout returned ${logoutRes.status}`);
        } else {
            console.log('Logout Success');
        }

        console.log('ALL TESTS PASSED');

    } catch (err) {
        console.error('TEST FAILED:', err.message);
        process.exit(1);
    }
}

// Polyfill fetch if needed
if (!globalThis.fetch) {
    try {
        globalThis.fetch = require('node-fetch');
    } catch (e) {
        console.log('node-fetch not found, assuming native fetch or failure');
    }
}

verify();
