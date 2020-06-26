const express = require('express');

const app = express();

const PORT = process.env.PORT || 4000;

app.get('/', (req, res) => {
    res.send({"message": "Okairi Onii Chan ~"});
});

app.listen(PORT, () => console.log(`Listening at PORT: ${PORT}`));