const user = require('../Models/user');


//Signup form:

module.exports.singnUpForm = (req,res) => {

   res.render('users/signup');
}


//SignUP logic:

module.exports.signUp = async (req,res, next) => {
  
  try {
    let {username, email, password} = req.body;

    const newUser = new user({email, username});

    const registeredUser = await user.register (newUser, password);

    req.login(registeredUser, (err) => {

       if (err) {

          return next(err)
       }

       req.flash('success', "Welcome to CasaNova");

       res.redirect('/listings');

    })

   }

  catch (e) {

     req.flash('error', e.message);

     res.redirect('/signup');
  }

 
}



//Login Form:

module.exports.loginForm = (req,res) => {

  res.render('users/login');
}


//Login Logic:

module.exports.login = async(req,res)=> {

  req.flash("success", 'Welcome To CasaNova! Enjoy the ride');
  
  let redirectUrl = res.locals.redirectUrl  || '/listings';
  
  res.redirect(redirectUrl);
  
  }


  //Logout:

  module.exports.logout = (req,res, next) => {

    req.logout((err) => {

       if (err) {

          return next(err)
       }

       req.flash('success', 'User logged out');

       res.redirect('/listings');
    })
}

