// BASE SETUP
// =============================================================================
function isEmptyObject(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}
// call the packages we need
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var index = require('./routes/index');
var users = require('./routes/users');
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(morgan('dev')); // log requests to the console

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev')); // log requests to the console

// configure body parser


var port     = process.env.PORT || 8081; // set our port


var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');



var productScheme = new mongoose.Schema({
	shopName:String,
	productName:String,
	productPrice:String,
	productIntroduction:String,
	productImage:String,
	productClass:String,
	productCarriage:String,
	createTime:String,
	productStock:String
});
var Product = mongoose.model('Product', productScheme);


var sellerScheme = new mongoose.Schema({
	sellerName:String,
	sellerPassword:String
});
var Seller = mongoose.model('Seller', sellerScheme);

var shopScheme = new mongoose.Schema({
	sellerName:String,
	shopName:String,
	shopAddress:String,
	shopContact:String,
	shopImage:String,
	shopIntroduction:String
});
var Shop = mongoose.model('Shop', shopScheme);


// ROUTES FOR OUR API
// =============================================================================

// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'hooray! welcome to our api!' });	
});


// ----------------------------------------------------左镇纲
router.route('/shops')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {
		
		var shop = new Shop();		// create a new instance of the Bear model

        shop.sellerName = req.param('sellerName');
        shop.shopName = req.param('shopName');
        shop.shopAddress = req.param('shopAddress');
        shop.shopContact = req.param('shopContact');
        shop.shopImage = req.param('shopImage');
        shop.shopIntroduction = req.param('shopIntroduction');

        shop.save(function(err) {
			if (err)
				res.send(err);

            // res.json({ message:  bear.name,
            //             message2: bear.password
            // });
            res.json({ message:"OK"});

        });

		
	})


router.route('/register_sellers')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {

        var seller = new Seller();		// create a new instance of the Bear model

        seller.sellerName = req.param('sellerName');
        seller.sellerPassword = req.param('sellerPassword');
        seller.save(function(err) {
            if (err)
                res.send(err);

            res.json({ message:"OK"});

        });


    })

router.route('/checkPhone')

//根据传来的 email，判断是否已经注册过
    .post(function(req, res) {

        //精确查找
        Seller.find({sellerName:req.param('sellerName')},function(err, sellers) {

            if (err)
                res.send(err);

            res.json(sellers);

        });

    })
router.route('/login_sellers')

//根据传来的账户和密码，判断登录是否成功
    .post(function(req, res) {
        //精确查找
        Seller.find({
            sellerName:req.param('sellerName'),
            sellerPassword:req.param('sellerPassword')
        },function(err, sellers) {

            if (err)
                res.send(err);

            res.json(sellers);

        });

    })
//-------------------------------------------------------------左镇纲





// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
