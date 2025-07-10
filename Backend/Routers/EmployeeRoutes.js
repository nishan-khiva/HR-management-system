const express = require('express');
const router = express.Router();
const employeeController = require('../Controller/EmployeeController');

router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.put('/:id', employeeController.updateEmployee);
router.delete('/:id', employeeController.deleteEmployee);
router.get('/:id/download-resume', employeeController.downloadResume);

module.exports = router;
