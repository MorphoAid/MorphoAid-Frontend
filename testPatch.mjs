import axios from 'axios';

async function test() {
    try {
        console.log("Logging in...");
        const loginRes = await axios.post('http://localhost:8081/auth/login', {
            email: 'datause@test.com',
            password: 'password'
        });
        const token = loginRes.data.token;
        console.log("Token received.");

        console.log("Fetching Case 620...");
        const getRes = await axios.get('http://localhost:8081/clinical/cases/620', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Current Case Data:", getRes.data);

        console.log("Patching Case 620...");
        const patchRes = await axios.patch('http://localhost:8081/clinical/cases/620/patient-info', {
            patientCode: 999,
            patientMetadata: JSON.stringify({
                age: 50,
                weight: 70,
                riskFactors: 'Travel',
                feverDuration: 5
            })
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Patch Response:", patchRes.data);

        console.log("Fetching Case 620 again...");
        const getRes2 = await axios.get('http://localhost:8081/clinical/cases/620', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("Final Case Data:", getRes2.data);

    } catch (err) {
        console.error("Error:", err.response ? err.response.data : err.message);
    }
}

test();
