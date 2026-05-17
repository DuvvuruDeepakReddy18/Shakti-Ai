const PDFDocument = require('pdfkit');
const fs = require('fs');

const doc = new PDFDocument();
doc.pipe(fs.createWriteStream('test_resume.pdf'));
doc.fontSize(25).text('John Doe', 100, 100);
doc.fontSize(16).text('Software Engineer', 100, 130);
doc.fontSize(12).text('Skills: React, JavaScript, Node.js, AI, Machine Learning', 100, 160);
doc.end();
