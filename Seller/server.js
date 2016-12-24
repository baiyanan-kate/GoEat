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
var fs = require('fs');

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


// ----------------------------------------------------左镇纲开始
router.route('/shops')

    // create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {
        //处理图片
        var imgData = req.param('shopImage');
        //过滤data:URL
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');

        var shop = new Shop();      // create a new instance of the Bear model

        shop.sellerName = req.param('sellerName');
        shop.shopName = req.param('shopName');
        shop.shopAddress = req.param('shopAddress');
        shop.shopContact = req.param('shopContact');
        shop.shopImage = "E:/"+shop.shopName+".png";
        shop.shopIntroduction = req.param('shopIntroduction');

        shop.save(function(err) {
            if (err)
                res.send(err);

            //将图片写入文件
            fs.writeFile(shop.shopImage, dataBuffer, function(err) {
                if(err){
                    res.send(err);
                }else{
                    res.json({ message: 'OK' });
                }
            });

        });

router.route('/shops/:sellerName')

        .get(function (req,res) {
            var shop = new Shop();
            shop.find({sellerName:req.params.sellerName},function (err,shops) {
                if(err)
                    res.send(err);
                res.json({message:shops[0].shopName});
            })
        });

        
    });



router.route('/register_sellers')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {

        var seller = new Seller();      // create a new instance of the Bear model

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


//-------------------------------------------------------------左镇纲结束


router.route('/product')

// create a bear (accessed at POST http://localhost:8080/bears)
    .post(function(req, res) {
        //处理图片
        var imgData = req.param('productImage');
        //过滤data:URL
        var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
        var dataBuffer = new Buffer(base64Data, 'base64');

        //创建product类
        var product = new Product();		// create a new instance of the Bear model

        product.productName= req.param('productName');
        product.productPrice=req.param('productPrice');
        product.productClass=req.param('productClass');
        //product.productImage="E:/"+product.productName+".png";
        product.productImage = "E:/"+product.productName+".png";
        product.shopName=req.param('shopName');
        product.productIntroduction=req.param('productIntroduction');
        product.productCarriage=req.param('productCarriage');
        product.createTime=req.param('createTime');
        product.productStock=req.param('productStock');

        product.save(function(err) {
            if (err)
                res.send(err);
            //将图片写入文件
            fs.writeFile(product.productImage, dataBuffer, function(err) {
                if(err){
                    res.send(err);
                }else{
                    res.json({ message: 'OK' });
                }
            });

        });




    });

//-------------------------------------------------------------王畅
router.route('/products/:shopName')
    .get(function (req,res) {
        var productsFinal = new Array();
        console.log("shopName:"+req.params.shopName);
        Product.find(function (err,products) {

            if(err)
                res.send(err);
            for(var i=0;i<products.length;i++)
            {
                if(products[i].shopName.indexOf(req.params.shopName)>=0)
                {
                    if(products[i].productClass == 1)
                    {
                        products[i].productClass = "饼干";
                    }else if(products[i].productClass == 2)
                    {
                        products[i].productClass = "蛋糕";
                    }else if(products[i].productClass == 3)
                    {
                        products[i].productClass = "面包";
                    }else if(products[i].productClass == 4)
                    {
                        products[i].productClass = "饮品";

                    }else
                    {
                        products[i].productClass = "套餐";
                    }
                    productsFinal.push(products[i]);
                }
            }
            console.log(productsFinal);
            res.json({message:productsFinal});
        })
    });

router.route('/products')
    .delete(function (req,res) {
        Product.remove(
            {productName:req.param('productname')
            },function (err,info) {
                if (err)
                    res.send(err);

                res.json({ message: 'OK' });
            });
    });
//-------------------------------------------------------------白亚楠

// router.route('/image')
//     .post(function (req,res) {
//         var imgData = req.param('image');
//         //过滤data:URL
//         var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
//         var dataBuffer = new Buffer(base64Data, 'base64');
//         console.log(dataBuffer);
//         fs.writeFile("E:/image.png", dataBuffer, function(err) {
//             if(err){
//                 res.send(err);
//             }else{
//                 res.json({ message: 'OK' });
//             }
//         });
//
//     });
// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
