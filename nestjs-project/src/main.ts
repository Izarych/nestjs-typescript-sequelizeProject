import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";



// Создаём асинхронную ф-ю, которая будет запускать сервер
async function start() {
    const PORT = process.env.PORT || 5000;
    const app = await NestFactory.create(AppModule);
    // Используем пайп глобально
    // app.useGlobalPipes(new ValidationPipe())
    await app.listen(PORT, () => console.log(`Server started on port = ${PORT}`))
}

start()