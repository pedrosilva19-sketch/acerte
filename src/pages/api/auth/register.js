// api/auth/register.js - CORRETO
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();

    await connectDB();

    const { name, email, password } = req.body;

    // Validações básicas
    if (!name || !email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Todos os campos são obrigatórios." 
        });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ 
            success: false, 
            message: "E-mail já registrado." 
        });
    }

    const hashed = await bcrypt.hash(password, 10);

    try {
        const newUser = await User.create({
            name,
            email,
            password: hashed,
        });

        // Criar token JWT
        const token = jwt.sign(
            { id: newUser._id, name: newUser.name, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({ 
            success: true,
            message: "Conta criada com sucesso!",
            token: token,
            user: {
                _id: newUser._id,
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: "Erro ao criar conta." 
        });
    }
}