# InstaYa - Aplicación de Servidor

## Dependencias:

Esta aplicación web (de lado del servidor), se encuentra desarrollada con las siguientes tecnologías:

- [express](https://www.npmjs.com/package/express), nos permite generar y ejecutar nuestro servidor
- [cookie-parser](https://www.npmjs.com/package/cookie-parser), para poder interactuar con las cookies en los encabezados de nuestras solicitudes y respuestas http
- [cors](https://www.npmjs.com/package/cors), para definir la lista de hosts o clientes web permitidos
- [helmet](https://www.npmjs.com/package/helmet), para generar encabezados con respecto a nuestras solicitudes y respuestas
- [morgan](https://www.npmjs.com/package/morgan), para mostrar en consola de forma automatizada los logs de nuestro servidor asi mismo como poder escribirlos en un archivo
- [mongoose](https://www.npmjs.com/package/mongoose), para conectarnos a un cluster [MongoDB](https://www.mongodb.com/)
- [mongoose-sequence](https://www.npmjs.com/package/mongoose-sequence), para generar de una forma sencilla un indice de con auto-incremento en MongoDB
- [argon2](https://www.npmjs.com/package/argon2), para poder hashear las contraseñas de nuestros usuarios
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken), para poder autenticar a nuestros usuarios, en este proyecto manejaremos la autenticación por medio de 2 tokens uno de refresco con larga duración (7 días), y uno de acceso con corta duración (15 minutos)
- [zod](https://www.npmjs.com/package/zod), para validar objetos json de una forma rápida y sencilla

Y también cuenta con otras tecnologías para facilitar la experiencia como desarrollador:

- [babel](https://www.npmjs.com/package/babel), el cual nos permite tener sintaxis de ECMAScript moderno, como por ejemplo usar `import export` en nuestros archivos sin la necesidad de incluir archivos innecesarios en las rutas o sus extensiones
- [eslint](https://www.npmjs.com/package/eslint), para validar estándares y reglas de formato en nuestro código
- [prettier](https://www.npmjs.com/package/prettier), para darle formato a nuestro código de forma automática
- [husky](https://www.npmjs.com/package/husky), para ejecutar comandos antes de hacer commit con nuestros cambios
- [lint-staged](https://www.npmjs.com/package/lint-staged), para ejecutar comandos tomando en cuenta solo los archivos en el área de stage
- [nodemon](https://www.npmjs.com/package/nodemon), el cual nos permite reiniciar nuestro servidor con cada cambio que realicemos en algún archivo

## Comandos

Este proyecto cuenta con los siguientes comandos:

- `clean`
- `build:babel`
- `build`
- `start`
- `dev`
- `lint`
- `lint:fix`
- `prettier:fix`
- `prettier:check`

Para ejecutar algún, por lo general usaremos `npm run <comando>`, estaremos trabajando la mayor parte del tiempo con el comando `npm run dev`.

## Configuración

### Entorno Local

Primero que todo, vamos a crear un archivo en la raíz de nuestro proyecto que se llame `nodemon.json`, con la finalidad de definir variables de entorno de forma local, este archivo contara con la siguiente estructura:

```jsonc
{
	"env": {
		// no usaremos 3000 puesto que puede generar problemas con nuestro cliente web.
		"PORT": "<puerto del servidor>",
		// nombre del archivo donde generaremos nuestros logs con morgan
		"LOG_ACCESS": "dev.log",
		// cadena de conexión a nuestra bases de datos en mongo
		"DB_CONNECTION_STRING": "<mongodb_srv_connection_string>",
		// valor de la propiedad "kid" de nuestro par de llaves de acceso
		"ACCESS_TOKEN_SECRET": "<kid_header_value>",
		// valor de la propiedad "kid" de nuestro par de llaves de refresco
		"REFRESH_TOKEN_SECRET": "<kid_header_value>",
		// host de nuestro cliente, como este sera un entorno local, debemos permitir conexiones que provengan desde nuestro cliente local
		"ALLOWED_HOST": "http://localhost:3000"
	}
}
```

Por último, vamos a necesitar configurar nuestras llaves privadas y publicas para poder firmar los tokens [JWT](https://jwt.io/), que vamos a utilizar para autenticar a nuestros usuarios.

Para esto, vamos a necesitar dirigirnos a la siguiente [herramienta en línea](https://8gwifi.org/jwsgen.jsp), en donde:

1. Marcaremos el algoritmo (_JWS Algo_) con la opción **ES256** ya que estamos utilizando un algoritmo ECDSA para generar nuestros tokens, para más información con respecto a los algoritmos de cifrado ver [este artículo](https://auth0.com/blog/json-web-token-signing-algorithms-overview/#RSA-and-ECDSA-algorithms)
2. Llenaremos el campo **Payload** siguiente JSON para generar nuestro par de llaves de refresco:

```json
{
	"type": "refresh"
}
```

3. Hacemos click en "Generar JWS Keys".
4. Crearemos una carpeta que llame `keys` dentro de nuestra carpeta raíz
5. Guardamos la info de nuestra _refresh_ key:
   1. Copiaremos el valor de la propiedad `kid` de la sección **Header** en nuestra variable de entorno local en la variable `REFRESH_TOKEN_SECRET` en [`nodemon.json`](#entorno-local)
   2. Crearemos el archivo `refresh.private.pem` en el folder `keys` que acabamos crear con el contenido de la sección **Private Key**
   3. Crearemos el archivo `refresh.public.pem` en el folder `keys` que acabamos crear con el contenido de la sección **Public Key**
6. Subimos hasta la sección de payload y reemplazaremos el contenido JSON por el siguiente:

```json
{
	"type": "access"
}
```

7. Hacemos click en "Generar JWS Keys".
8. Guardamos la info de nuestra _refresh_ key:
   1. Copiaremos el valor de la propiedad `kid` de la sección **Header** en nuestra variable de entorno local en la variable `ACCESS_TOKEN_SECRET` en [`nodemon.json`](#entorno-local)
   2. Crearemos el archivo `access.private.pem` en el folder `keys` que acabamos crear con el contenido de la sección **Private Key**
   3. Crearemos el archivo `access.public.pem` en el folder `keys` que acabamos crear con el contenido de la sección **Public Key**

### Entorno Productivo

Es necesario haber configurado previamente las llaves privadas públicas para poder seguir con estas configuraciones.

Antes de realizar el despliegue de nuestro servidor, es necesario configurar las variables de entorno que usaremos.

Por lo que hemos de necesitar acceso a la plataforma en al que haremos nuestros despliegues:

1. Necesitamos crear una cuenta en [Fly](fly.io)
2. Hacemos click en _Sign In_, lo cual nos llevara al [inicio de sesión](https://fly.io/app/sign-in), podemos iniciar sesión con github
3. No es necesario introducir ningún método de pago, ya que podemos omitirlo
4. Instalaremos la interfaz por consola de Fly, [Fly CTL](https://fly.io/docs/hands-on/install-flyctl/)
5. Una vez descargado Fly CTL, iniciaremos sesión desde nuestra terminal con el comando `fly auth login`
6. Ahora podremos configurar todas nuestras variables de entorno con el comando `fly secrets set VARIABLE_DE_ENTORNO="VALOR_VARIABLE_DE_ENTORNO"`, por ejemplo: `fly secrets set ALLOWED_HOST=https://insta-ya.netlify.app`
7. Es probable que para la variable de conexión a base de datos toque envolver el valor entre comillas debido a sus caracteres especiales.

## Despliegue

Para realizar el despliegue estaremos siguiendo paso a paso las [instrucciones en la página de Fly](https://fly.io/docs/languages-and-frameworks/node/#launch-the-app-on-fly).

1. Necesitaremos haber configurado todas nuestras variables de entorno según lo explicado en [Configuración](#entorno-productivo)
2. Ejecutaremos el comando `fly launch`, aquí Fly se dará cuenta de que contamos con un `Dockerfile` y con un archivo de configuración `fly.toml` por lo que nos preguntara si queremos mantener estas configuraciones, a lo que deberemos responder que **si**
3. Ejecutaremos el comando `fly deploy`
4. Una vez haya terminado el despliegue ejecutaremos `fly status` para revisar el estado de nuestro despliegue
5. Finalmente ejecutaremos `fly open` para ver la URL de nuestra API
   - Es posible que al abrir la url nos salte un error, pero si nos dirigimos a ['/api'](https://insta-ya-server.fly.dev/api) podremos ver el mensaje de "hola mundo" que tenemos configurado
