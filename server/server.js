const express = require('express');
const multer = require('multer');
const xlsx = require('xlsx');
const app = express();
const upload = multer({ dest: 'uploads/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/upload', upload.single('excelFile'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheetNames = workbook.SheetNames;
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNames[0]]);

  res.render('display', { data });
});

app.post('/display', upload.single('excelFile'), (req, res) => {
  const workbook = xlsx.readFile(req.file.path);
  const sheetNames = workbook.SheetNames;
  const selectedSheetName = req.body.sheet;
  const selectedSheet = workbook.Sheets[selectedSheetName];
  const data = xlsx.utils.sheet_to_json(selectedSheet);

  res.render('display', { sheetNames, selectedSheetName, data });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
