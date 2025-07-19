import jwt from "jsonwebtoken"

const userAuth = async (req, res, next) => {
  const { token } = req.headers;

  if (!token) {
    return res.json({ success: false, message: "Not Authorized. Please login again." });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      req.userId = tokenDecode.id; //  Store in dedicated field
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized. Invalid token." });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth;
