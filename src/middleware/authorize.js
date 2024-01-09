const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next(); 
    } else {
      res.status(403).json({ message: 'No tienes permisos de administrador.' });
    }
  };
  
   const isUser = (req, res, next) => {
    if (req.user && req.user.role === 'user') {
      next(); 
    } else {
      res.status(403).json({ message: 'No tienes permisos de usuario.' });
    }
  };

  const isPremiun = (req, res, next) => {
    if (req.user && req.user.role === 'premiun') {
      next(); 
    } else {
      res.status(403).json({ message: 'No tienes permisos de administrador.' });
    }
  };

  module.exports = {isAdmin, isUser, isPremiun}
  