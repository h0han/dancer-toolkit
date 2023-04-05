const express = require('express');
const app = express();
const multer = require('multer');
const fs = require('fs');

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(express.static('public'));

app.post('/upload', upload.single('video'), (req, res) => {
// 동영상 업로드 처리 로직
// 예를 들어, 데이터베이스에 저장하거나, 파일 시스템에 저장하는 코드 작성
console.log('Video uploaded:', req.file.filename);
// 처리 후 응답
res.sendStatus(200);
// 전송된 데이터 처리 로직
// 예를 들어, 데이터베이스에 저장하거나, 파일 시스템에 저장하는 코드 작성
console.log('Data received:', { start, end, joint });

app.post('/upload-csv', upload.single('csvData'), (req, res) => {
    console.log('CSV uploaded:', req.file.filename);

    // 처리 후 응답
    res.sendStatus(200);
});

// 처리 후 응답
res.sendStatus(200);});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
console.log('Server running on port ${PORT}');
});
