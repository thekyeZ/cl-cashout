const fs = require('fs');
const pdf = require('pdf-parse');
const path = require('path');

const directoryPath = path.join(__dirname, 'pdfs');

fs.readdir(directoryPath, async (err, files) => {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    const promises = files.map(file => {
        console.log(file);
        return parsePDF(file);
    });

    let data = await Promise.all(promises);
    let values = data.map(el => getCashValue(el.text));

    const sum = getSum(values);
    console.log(sum);
});


function getSum(values) {
    return values.reduce((p,c) => p + c);
}



function parsePDF(file) {
    let dataBuffer = fs.readFileSync(path.join(__dirname, 'pdfs', file));
    return pdf(dataBuffer);
}

function getCashValue(data) {
    const cashArr = data.match(/Do wypłaty ((\d+|\s)+,\d\d)/gm);
    if (!cashArr || cashArr.length === 0) return;

    const cash = clearNumber(cashArr[0]);

    if (typeof cash === 'number') {
        return cash;
    }
}

function clearNumber(stringNumber) {
    return parseFloat(stringNumber.replace(/\D+/, '').replace(',', '.').replace(' ', ''));
}
