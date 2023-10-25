const fs = require('fs');

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) {
      console.error(`Error deleting file: ${err}`);
    } else {
      console.log('File deleted successfully');
    }
  });
};

const checkFileSize = (req, res, next) => {
  if (req.file && req.file.size > 10 * 1024 * 1024) {
    deleteFile(req.file.path);
    return res.status(400).json({ message: 'File size cannot exceed 10 megabytes' });
  }
  next();
};

module.exports = { checkFileSize };