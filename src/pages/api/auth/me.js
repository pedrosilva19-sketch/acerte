import jwt from "jsonwebtoken";

export default function handler(req, res) {
    const { token } = req.cookies;

    if (!token) return res.status(200).json({ logged: false });

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return res.status(200).json({ logged: true, user });
    } catch {
        return res.status(200).json({ logged: false });
    }
}
