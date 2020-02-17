const express = require('express');
const app = express();
const port = 3000;
const routes = require('./routes');

app.use(express.json());
app.use('/api', routes);

app.use((req,res,next)=>{
    const err = new Error('Not Found');
    res.status(404);
    next(err);
});

app.use((err,req,res,next)=>{
    res.status(err.status || 500);
    res.json({
        error: {
            message: err.message
        }
    });
});

// start server
app.listen(port, () => {
    console.log('Server started on port' + port);
});