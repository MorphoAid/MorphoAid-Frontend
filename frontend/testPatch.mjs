async function test() {
    try {
        console.log("Logging in as DATA_USE user...");
        const loginRes = await fetch('http://localhost:8081/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'demo@morphoaid.com', password: 'demopass' })
        });
        if (!loginRes.ok) throw new Error("Login failed: " + loginRes.status);
        const loginData = await loginRes.json();
        const token = loginData.accessToken; // FIXED!
        console.log("Token received.");

        console.log("Fetching /auth/me...");
        const meRes = await fetch('http://localhost:8081/auth/me', {
            headers: { Authorization: `Bearer ${token}` }
        });
        console.log("/auth/me Response:", await meRes.json());
        
        let targetCaseId = 620;
        
        console.log(`Patching Case ${targetCaseId}...`);
        const patchRes = await fetch(`http://localhost:8081/clinical/cases/${targetCaseId}/patient-info`, {
            method: 'PATCH',
            headers: { 
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                patientCode: 999,
                patientMetadata: JSON.stringify({
                    age: 50,
                    weight: 70,
                    riskFactors: 'Travel',
                    feverDuration: 5
                })
            })
        });
        if (!patchRes.ok) {
            console.error("Patch failed:", await patchRes.text());
        } else {
            console.log("Patch Response:", await patchRes.json());
            console.log(`Fetching Case ${targetCaseId} again to verify...`);
            const getRes2 = await fetch(`http://localhost:8081/clinical/cases/${targetCaseId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("Final Case Data:", await getRes2.json());
        }

    } catch (err) {
        console.error("Error:", err.message);
    }
}

test();
