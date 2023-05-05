import path from "path";
import fs from 'fs';

export default async (req, res) => {
    let { url, method } = req;


    console.log(`📣 CLIENT-REQUEST: ${req.url} ${req.method}`);

    // Enrutando peticiones
    switch (url) {
        case '/':
            const rutaIndex = path.join('views', 'index.html');

        if (req.url === '/') {
            fs.readFile(rutaIndex, (err, data) => {
                if (err) {

                    res.writeHead(404, { 'Content-Type': 'text/html' });

                    res.end('404 Not Found');

                } else {

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    console.log('contestando');
                    res.write(data);
                    res.end();

                }
            });

        }
           
    // Peticion raiz
    // Estableciendo cabeceras

            break;
        case '/author':
            const rutaAuthor = path.join('views', 'author.html');

        if (req.url === '/author') {
            fs.readFile(rutaAuthor, (err, data) => {
                if (err) {

                    res.writeHead(404, { 'Content-Type': 'text/html' });

                    res.end('404 Not Found');

                } else {

                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    console.log('contestando');
                    res.write(data);
                    res.end();

                }
            });

        }
            break;
            case "/favicon.ico":
                // Especificar la ubicación del archivo de icono
                const faviconPath = path.join(__dirname, 'favicon.ico');
                try {
                    const data = await fs.readFile(faviconPath);
                    res.writeHead(200, { 'Content-Type': 'image/x-icon' });
                    res.end(data);
                } catch (err) {
                    console.error(err);
                    // Peticion raiz
                    // Estableciendo cabeceras
                    res.setHeader('Content-Type', 'text/html');
                    // Leyendo el archivo 500.html
                    fs.readFile(path.join('views', '500.html'), (err, data) => {
                        if (err) {
                            console.error(err);
                            res.writeHead(500, { 'Content-Type': 'text/html' });
                            res.end('500 Internal Server Error');
                        } else {
                            console.log(`📣 Respondiendo: 500 ${req.url} ${req.method}`);
                            // Estableciendo codigo de respuesta
                            res.statusCode = 500;
                            // Enviando el contenido del archivo como respuesta
                            res.end(data);
                        }
                    });
                }
                break;
    
            case "/message":
                if (method === "POST") {
                    let body = "";
                    req.on("data", (data => {
                        body += data;
                        if (body.length > 1e6) return req.socket.destroy();
                    }));
                    req.on("end", () => {
                        const params = new URLSearchParams(body);
                        const parsedParams = Object.fromEntries(params);
                        fs.writeFile('message.txt', parsedParams.message, (err) => {
                            if (err) {
                                console.error(err);
                                res.writeHead(500, { 'Content-Type': 'text/html' });
                                res.end('500 Internal Server Error');
                            } else {
                                res.statusCode = 302;
                                res.setHeader('Location', '/');
                                res.end();
                            }
                        });
                    });
                } else {
                    res.statusCode = 404;
                    res.setHeader('Content-Type', 'text/html');
                    res.write("404: Endpoint no encontrado");
                    res.end();
                }
                break;
            // Continua con el defautl
    
            default:
                const filePath404 = path.join('views', '404.html');
                fs.readFile(filePath404, (err, data) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/html' });
                        res.end('500 Internal Server Error');
                    } else {
                        res.writeHead(404, { 'Content-Type': 'text/html' });
                        res.write(data);
                        res.end();
                    }
                });
                break;
    
        }
    };