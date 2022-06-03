import auth from "./auth.js"
import user from "./user.js"

export default function(app) {
  app.use('/api/auth', auth);
  app.use('/api/user', user);
}