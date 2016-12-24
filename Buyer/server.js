// BASE SETUP
// =============================================================================

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


var port     = process.env.PORT || 8080; // set our port

//var mongoose   = require('mongoose');
//mongoose.connect('mongodb://node:node@novus.modulusmongo.net:27017/Iganiq8o'); // connect to our database
//var mongoose = require('mongoose');

//module.exports = function (done) {
//    mongoose.connect("mongodb://zzg:zzg@127.0.0.1:27017/test", {auto_reconnect: true}, done);
//};


var crypto = require('crypto');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

/*
var bearSchema = new mongoose.Schema({
    name: String,
    password: String,
});
var Bear = mongoose.model('Bear', bearSchema);
*/

var userScheme = new mongoose.Schema({
	username:String,
	phone:String,
	email:String,
	password:String
});
var User = mongoose.model('User', userScheme);

var  productScheme = new mongoose.Schema({
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

var cartScheme = new mongoose.Schema({
	username:String,
	productname:String,
	productImage:String,
	productNum:String,
	productPrice:String,
    productCarriage:String
});
var Cart = mongoose.model('Cart', cartScheme);

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



//var Bear     = require('./app/models/bear');

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

// on routes that end in /bears
// ----------------------------------------------------
router.route('/users')

	// create a bear (accessed at POST http://localhost:8080/bears)
	.post(function(req, res) {
		
		var user = new User();		// create a new instance of the Bear model
        user.username = req.param('username'); // set the bears name (comes from the request)
        user.phone = req.param('phone');
        user.email = req.param('email');
        user.password = req.param('password');

        user.save(function(err) {
			if (err)
				res.send(err);

            // res.json({ message:  bear.name,
            //             message2: bear.password
            // });
            res.json({ message:"OK"});

        });

		
	})

	// get all the bears (accessed at GET http://localhost:8080/api/bears)
	.get(function(req, res) {
		User.find(function(err, users) {
			if (err)
				res.send(err);

			res.json(users);
		});
	});
router.route('/addProduct')
	.post(function (req,res) {
        var product = new Product();
        product.productName="上午能量补充佳品";
        product.productPrice="22";
        product.productClass="5";
		product.productImage="img/taocan/taocan1.png";
        product.shopName="星巴克";
		product.productIntroduction="更相配"
		product.productCarriage="300";
		product.createTime="2016.12.12";
		product.productStock="25";

        product.save(function(err) {
            if (err)
                res.send(err);

            // res.json({ message:  bear.name,
            //             message2: bear.password
            // });
            res.json({ message:"OK"});

        });
    })



router.route('/product/:class')
    .get(function(req, res) {
        var product = new Product();		// create a new instance of the Bear model
        product.productClass = req.params.class;
        console.log(product.productClass);
        Product.find({productClass:product.productClass},function(err, product) {
            if (err)
                res.send(err);
           // console.log(product[0].productName);
			res.json({message:product});
        });
    })
// ----------------------------------------------------
router.route('/users/:user_name')

    .get(function(req, res) {

    	//var postName = req.params.user_name;
        //var reg=new RegExp('\\{'+(req.params.user_name)+'\\}');
		console.log(req.params.user_name)
		var postName = req.params.user_name;
		var reg = eval("\w+"+postName+"\w+");
        User.find({username:reg},function(err, users) {
            if (err)
                res.send(err);

            res.json(users);
        });
    })

	.put(function(req, res) {
		User.findById(req.params.user_name, function(err, user) {

			if (err)
				res.send(err);

			user.username = req.body.name;
            user.save(function(err) {
				if (err)
					res.send(err);

				res.json({ message: 'user updated!' });
			});

		});
	})

    .delete(function(req, res) {
        User.remove({
            password:/5/,
            username:/22/
        }, function(err, user) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });
        });
    });


//创建购物车
router.route('/cart')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {

        var cart = new Cart();		// create a new instance of the cart
        cart.username = req.param('username');
        cart.productname = req.param('productname');
        cart.productImage = req.param('productImage');
        cart.productPrice = req.param('productPrice');
        cart.productNum = req.param('productNum');
        cart.productCarriage = req.param('productCarriage');

        cart.save(function(err) {
            if (err)
                res.send(err);
            // res.json({ message:  bear.name,
            //             message2: bear.password
            // });
            res.json({ message:"Successfully added"});

        });


    })
	

    .delete(function(req, res) {
        Cart.remove({
            productname:req.param('productname'),
            username:req.param('username')

        }, function(err, user) {
            if (err)
                res.send(err);
            console.log(req.param('productname'));
            res.json({ message: 'Successfully deleted' });

        });
    });


function isEmpty(e) {
    var t;
    for (t in e)
        return !1;
    return !0
}


router.route('/cart/:user_name')
// get all the bears (accessed at GET http://localhost:8080/api/bears)
    .get(function(req, res) {
        Cart.find({username:req.params.user_name},function(err,carts) {
            if (err)
                res.send(err);

            console.log(req.param('username'));

            if(isEmpty(carts))
                res.json({message:"请先添加商品"});
            else
                res.json({userCart:carts,
                    message:"获取成功"
                });
        });
    })

    .delete(function(req, res) {
        Cart.remove({
            username:req.params('username'),
            productname:req.params('productname')
        }, function(err, cart) {
            if (err)
                res.send(err);

            res.json({ message: 'Successfully deleted' });

        });
    });

router.route('/cart2/:info')
	.get(function (req,res) {
        var infoAll = req.params.info.split(",");
        var uName = infoAll[0];
        var pName = infoAll[1];
        Cart.find({username: uName, productname: pName}, function (err, carts) {
            if (err)
                res.send(err);


            if(!isEmpty(carts)){
            	console.log("already"+carts[0].productNum);
            	res.json({message:carts[0].productNum});}
            else
            	res.json({message:"mei"});
        });
    })
	
	.put(function (req,res) {
        var infoAll = req.params.info.split(",");
        var uName = infoAll[0];
        var pName = infoAll[1];
        var pNum = (parseInt(infoAll[2])+1).toString();
        console.log("jinru put"+infoAll[2]);
        Cart.update({productname:pName,username:uName},{$set:{productNum:pNum}},function(err){
            if (err)
                res.send(err);
            res.json({message:"updated"});
		});

})


router.route('/search/shop/:content')
    .get(function (req,res) {
        var content = req.params.content;
        var searchShop = new Array();
        Shop.find(function (err, shops) {
            if (err)
                res.send(err);
                for(var i=0;i<shops.length;i++){
                    if(shops[i].shopName.indexOf(content)>=0)
                        searchShop.push(shops[i]);
                }
                res.json({message:searchShop});
        });
    })
router.route('/search/product/:content')
    .get(function (req,res) {
        var content = req.params.content;
        var searchProduct = new Array();
        Product.find(function (err, products) {
            if (err)
                res.send(err);
            for(var i=0;i<products.length;i++){
                if(products[i].productName.indexOf(content)>=0)
                    searchProduct.push(products[i]);
            }
            res.json({message:searchProduct});
        });
    })

router.route('/search/shopProduct/:content')
    .get(function (req,res) {
        var content = req.params.content;
        var searchProduct = new Array();
        Product.find(function (err, products) {
            if (err)
                res.send(err);
            for(var i=0;i<products.length;i++){
                if(products[i].shopName.indexOf(content)>=0)
                    searchProduct.push(products[i]);
            }
            res.json({message:searchProduct});
        });
    })
//////////////////////////////////////////////////////左镇纲-开始
router.route('/checkEmail')

//根据传来的 email，判断是否已经注册过
    .post(function(req, res) {

        //精确查找
        User.find({email:req.param('email')},function(err, users) {

            if (err)
                res.send(err);

            res.json(users);

        });

    })

router.route('/login')

//根据传来的账户和密码，判断登录是否成功
    .post(function(req, res) {
        //精确查找
        User.find({
            email:req.param('email'),
            password:req.param('password')
        },function(err, users) {

            if (err)
                res.send(err);

            res.json(users);

        });

    })
//////////////////////////////////////////////////////左镇纲-结束

// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
