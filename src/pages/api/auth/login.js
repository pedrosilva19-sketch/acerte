// api/auth/login.js - NOVO ARQUIVO
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ 
            success: false, 
            message: "Método inválido." 
        });
    }

    await connectDB();

    const { email, password } = req.body;

    // Validações
    if (!email || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "E-mail e senha são obrigatórios." 
        });
    }

    try {
        // Buscar usuário
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ 
                success: false, 
                message: "E-mail ou senha incorretos." 
            });
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ 
                success: false, 
                message: "E-mail ou senha incorretos." 
            });
        }

        // Criar JWT
        const token = jwt.sign(
            { 
                id: user._id, 
                name: user.name, 
                email: user.email 
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        // Retornar resposta
        return res.status(200).json({
            success: true,
            message: "Login bem-sucedido!",
            token: token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error("Erro no login:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Erro interno do servidor." 
        });
    }
}