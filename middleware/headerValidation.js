exports.bearerTokenPresent = (req, res, next) => {
    // console.log(req.headers['authorization']);
    if (req.headers['authorization']) {
      try {
          let authorization = req.headers['authorization'].split(' ');
          if (authorization[0] !== 'Bearer') {
              res.status(401).send('invalid request'); //invalid request
          } else {
              let token = authorization[1];
              req.body.token = token;
              next();
          }
      } catch (err) {
          res.status(403).send({
            'message': 'User, Token expired!'
          });
      }
    } else {
        res.status(401).send({
          "message": 'Invalid request, token header is missing!'
        });
    }
}