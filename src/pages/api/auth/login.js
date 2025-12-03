import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Método não permitido" });

    await connectMongo();

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
        return res.status(400).json({ message: "E-mail ou senha incorretos" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass)
        return res.status(400).json({ message: "E-mail ou senha incorretos" });

    const token = jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    return res.status(200).json({
        message: "Login efetuado!",
        token,
        user: { id: user._id, name: user.name, email: user.email }
    });
}
