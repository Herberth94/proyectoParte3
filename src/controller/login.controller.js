import { userData } from "../services/users.service";

class loginControlllers {
    register = (req, res) => {
        if (!req.user) {
          return res.json({ error: 'something went wrong' });
        }
        req.session.user = { _id: req.user._id, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, isAdmin: req.user.isAdmin };
         return res.redirect('/')
    };

    login = async (req, res) => {
        if (!req.user) {
          return res.json({ error: 'invalid credentials' });
        }
      
         req.session.user = {
          email: req.user.email,
          firstName: req.user.firstName,
          rol: req.user.rol,
          id: req.user._id.toString(),
          cartID:req.user.cart
        };
         return res.redirect('/products');
    };

    currentDatauser = async (req, res) => {
        const id = req.session.user.id;
        const viewCart = await userData.usersInformation(id);
        req.session.user.cart = viewCart.cart
        return res.status(200).json({
          status: 'success',
          msg: 'datos de la session',
          payload: req.session.user || {},
      });
    };

    failRegister = async (req, res) => {
        return res.json({ error: 'fail to register' });
    };
    logout =(req, res) => {
      console.log(req.session)
      req.session.destroy((err) => {
        if (err) {
          return res.status(500).render('error', { error: 'error inesperado no se pudo eliminar session' });
        }
        console.log(req.session)
        return res.redirect('/');
      });
    
    }
}

export const loginController = new loginControlllers()