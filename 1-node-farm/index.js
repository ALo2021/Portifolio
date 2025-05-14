const fs = require('fs');
const http = require('http');
const url = require('url');

////////////////////////////////////////////////
// FILES

//const hello = 'hello world!!!';
//console.log(hello);

/*
const textIn = fs.readFileSync('./txt/input.txt', 'utf8');
console.log(textIn);
const textOut = `Keep going, you can do this!!! ${textIn}.\nCreated on ${Date.now()}`;
fs.writeFileSync('File written!');
*/

// Non-blocking, synchrous way 

/*
fs.readFile('../QWERTY123456.txt', 'utf-8', (error, data1) =>{
    fs.readFile(`../${data1}.txt`, 'utf-8', (error, data2) =>{
        console.log(data2); 
    });
});
console.log('aaa read the file');
*/

////////////////////////////////////////////////
// SERVER
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g, product.image);
    output = output.replace(/{%PRICE%}/g, product.price); 
    output = output.replace(/{%FROM%}/g, product.from);  
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients); 
    output = output.replace(/{%QUANTITY%}/g, product.quantity); 
    output = output.replace(/{%DESCRIPTION%}/g, product.description); 
    output = output.replace(/{%ID%}/g, product.id);

    if(!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic'); 
    return output;  
}

const tempOverview = fs.readFileSync(`${__dirname}/starter/templates/template-overview.html`, 'utf-8');
const tempProdduct = fs.readFileSync(`${__dirname}/starter/templates/template-product.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/starter/templates/template-card.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/starter/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);  
    
const server = http.createServer((req, res) => {
    console.log(req.url);
    console.log(url.parse);
    const pathName = req.url;

//OVERVIEW PAGE
    if(pathName === '/' || pathName === '/overview') {
        res.writeHead(200, {'content-type': 'text/html'});

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
        //console.log(cardsHtml);
        res.end(output);

//PRODUCT PAGE 
    } else if (pathName === '/product') {
        res.end('This is the product');
// API 
    } else if (pathName === '/api') {
        //fs.readFile(`${__dirname}/starter/dev-data/data.json`, 'utf-8', (err, data) => {
            res.writeHead(200, {'content-type': 'aplication/json'});
            res.end(data);  
            //console.log(data);  
        //});
        //res.end('This is the API placeholder');


//NOT FOUND
    } else {
        res.writeHead(404, {
            'content-type': 'text/html'
        });
        res.end('<h1>Page not found!<h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening to requests in port 8000');
});