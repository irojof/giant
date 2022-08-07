var express = require('express');
var router = express.Router();
const multer = require('multer');
const mainController = require('../controllers/userController')
const validationRegister = require('../middlewares/register');
const validationLogin = require('../middlewares/login');
const path = require('path'); 

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'public/images/users')
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({ storage: storage })

/* GET users listing. */
router.get('/', mainController.index);
router.get('/login', mainController.login);
router.post('/login', validationLogin, mainController.userLogin);
router.get('/register', mainController.register);
router.post('/register', upload.any(), validationRegister, mainController.store);
router.get('/userDetail/:id/', mainController.userDetail);
router.get('/userEdit/:id/', mainController.edit);
// revisar
router.post('/userDetail/:id', upload.any(), mainController.update);
// revisar
router.delete('/delete/:id', mainController.destroy);
module.exports = router;