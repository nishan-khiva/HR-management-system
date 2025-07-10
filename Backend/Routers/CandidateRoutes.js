const express = require('express');
const router = express.Router();
const candidateController = require('../Controller/CandidateController');
const upload = require('../middleware/upload'); // Multer Cloudinary config

router.post('/create', upload.single('resume'), candidateController.createCandidate); //  http://localhost:5000/api/candidates/create

router.get('/', candidateController.getAllCandidates);

router.get('/resume/:id', candidateController.downloadResume);

router.post('/promote/:id', candidateController.promoteToEmployee);

router.get('/:id', candidateController.getCandidateById);

router.patch('/:id/status', candidateController.updateCandidateStatus);

router.delete('/:id', candidateController.deleteCandidate);

module.exports = router;
