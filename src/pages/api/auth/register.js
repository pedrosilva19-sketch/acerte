import connectMongo from "../../../lib/mongodb";
import User from "../../../models/User";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
    if (req.method !== "POST")
        return res.status(405).json({ message: "Método não permitido" });

    await connectMongo();

    const { name, email, password } = req.body;

    if (!name || !email || !password)
        return res.status(400).json({ message: "Preencha todos os campos" });

    const existing = await User.findOne({ email });
    if (existing)
        return res.status(400).json({ message: "E-mail já cadastrado" });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashed
    });

    return res.status(201).json({
        message: "Conta criada com sucesso!",
        user: { id: newUser._id, name: newUser.name, email: newUser.email }
    });
}
