export default function handler(req, res) {
    res.setHeader(
        "Set-Cookie",
        `token=; Path=/; HttpOnly; Max-Age=0`
    );

    return res.status(200).json({ message: "Logout realizado" });
}
