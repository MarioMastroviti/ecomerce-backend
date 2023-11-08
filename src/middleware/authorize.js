const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
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

  module.exports = {isAdmin, isUser}