const API_URL = 'http://localhost:5000/api';

export const api = {
    async get(endpoint: string) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        return res.json();
    },

    async post(endpoint: string, body: any) {
        const res = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(body)
        });
        return res.json();
    }
};
