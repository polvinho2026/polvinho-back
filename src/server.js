import app from "./app.js";
import "dotenv/config";

const PORT = process.env.PORT

app.listen(PORT, () => {
    console.log(`Servidor iniciado ✅! Rodando na porta ${PORT}`)
})
