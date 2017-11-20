# Node Mongodb server
Nodejs server, biedt API op een Mongodb database met userinformatie.


## Vooraf
- nodejs installeren
- Mongodb installeren

## Gebruik
Vanaf command line:
```
npm install
npm start
```
De server runt op [localhost:3000](http://localhost:3000).

## API Endpoints
Aanroepen van de endpoints kan met [Postman](https://www.getpostman.com/docs/introduction). 

Voorbeelden van endpoints: 
- GET,POST [localhost:3000/api/v1/users](http://localhost:3000/api/v1/users)
- GET, PUT, DELETE [localhost:3000/api/v1/users/2](http://localhost:3000/api/v1/users/2)

## Heroku
Je kunt de server gemakkelijk op Heroku of een andere cloudprovider deployen. Je moet dan wel zorgen dat je ook een Mongo database-in-the-cloud hebt. Dat kan onder andere gratis bij [mLab](https://mlab.com). Let dan ook op dat je server de connection string naar de online database heeft.

### Omgevingsvariabelen
In de cloud moet je een aantal omgevingsvariabelen instellen. Dit zijn variablelen waarin configuratiewaarden zijn opgeslagen. Je wilt die settings (bv username, password) niet hardcoded in je programmabestanden opslaan.

De variabelen die je moet instellen:
- DB_HOST: de host waar je database draait
- DB_USER: username waarmee je in je database inlogt
- DB_PASSWORD: password van de database user
- DB_DATABASE: de naam van je database
- ALLOW_ORIGIN: de URL van je Angular frontend. Hiermee geef je je frontend toegang tot de server.

