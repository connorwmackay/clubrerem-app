/*
 * This is a test of the Rest API that the server runs.
 */

const express = require('express');
const app = express();
const port = 4002;

app.listen(port, () => {
    console.log(`Running api_test at http://localhost:${port}`);
});