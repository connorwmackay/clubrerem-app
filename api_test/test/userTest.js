const assert = require('assert');

describe('User Route', () => {
    let userId = -1;
    describe('POST Endpoint', () => {
        it('should return a JSON response with isSuccess set to true', () => {
            (async() => {
                const body = {
                    username: 'testuser123',
                    email: 'testuser123@email.com',
                    password: 'Testpass 123'
                };

                const response = await fetch('http://localhost:4001/api/v1/users/', {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(body)
                })
                .then(response => response.json())
                .then(data => {
                    return data;
                })
                .catch(err => {
                    console.error(err);
                    return {isSuccess: false};
                });

                assert.equal(response.isSuccess, true);
            });
        });
    });

    describe('GET Endpoint', () => {
        it('should return a JSON response with isSuccess set to true', () => {
            (async() => {
                const testUsername = "testuser123";

                const response = await fetch(`http://localhost:4001/api/v1/users/${testUsername}`, {
                    method: 'GET',
                    mode: 'cors',
                })
                .then(response => response.json())
                .then(data => {
                    userId = data.user.id;
                    return data;
                })
                .catch(err => {
                    console.error(err);
                    return {isSuccess: false};
                });

                assert.equal(response.isSuccess, true);
            });
        });
    });

    let jwtToken = '';
    describe('Auth Route POST Endpoint', () => {
        it('should return a JSON response with isSuccess set to true', () => {
            (async() => {
                const body = {
                    username: 'testuser123',
                    password: 'Testpass 123'
                };

                const response = await fetch(`http://localhost:4001/api/v1/auth`, {
                    method: 'POST',
                    mode: 'cors',
                    body: JSON.stringify(body)
                })
                .then(response => response.json())
                .then(data => {
                    return data;
                })
                .catch(err => {
                    console.error(err);
                    return {isSuccess: false};
                });

                jwtToken = response.jwt_token;
                assert.equal(response.isSuccess, true);
            });
        });
    });

    describe('PUT Endpoint', () => {
        it('should return a JSON response with isSuccess set to true', () => {
            (async() => {
                const body = {
                    email: 'testuser@email.com',
                };

                const response = await fetch('http://localhost:4001/api/v1/users/', {
                    method: 'POST',
                    mode: 'cors',
                    headers: {
                        'Authorization': `Bearer ${jwtToken}`
                    },
                    body: JSON.stringify(body)
                })
                .then(response => response.json())
                .then(data => {
                    return data;
                })
                .catch(err => {
                    console.error(err);
                    return {isSuccess: false};
                });

                assert.equal(response.isSuccess, true);
            });
        });
    });
});