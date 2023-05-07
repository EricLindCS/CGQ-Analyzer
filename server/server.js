const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const upload = multer({ dest: 'uploads/' }).single('file');



app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.redirect('/display');
});

app.post('/display', (req, res) => {
  const files = fs.readdirSync('uploads');
  const fileNames = files
    .filter(file => path.extname(file).toLowerCase() === '.xlsx')
    .map(file => file);

  const selectedFile = req.body.file;
  const selectedFilePath = selectedFile ? path.join('uploads', selectedFile) : null;
  const workbook = selectedFilePath ? xlsx.readFile(selectedFilePath) : null;
  const sheetNames = workbook ? workbook.SheetNames : [];

  res.render('display', { fileNames: fileNames, selectedFile: selectedFile, sheetNames: sheetNames });
});


app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
