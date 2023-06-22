# Rapport de sécurité - Protection contre les injections SQL

## Introduction

Ce rapport vise à expliquer comment notre application Express.js se protège contre les attaques d'injections SQL lors
des requêtes à la base de données. L'injection SQL est une technique couramment utilisée par les attaquants pour
manipuler ou compromettre une application en injectant du code SQL non autorisé. Pour prévenir de telles attaques, nous
avons mis en place des mesures de sécurité appropriées dans notre code.

## Utilisation de placeholders pour les paramètres

Dans notre code, nous utilisons des placeholders sous la forme de points d'interrogation (`?`) pour les paramètres de
requête. Ces placeholders permettent de remplacer les valeurs des paramètres par des valeurs réelles lors de l'exécution
de la requête, évitant ainsi les injections SQL.

Voici un extrait de code qui illustre l'utilisation des placeholders :

```javascript
let params: (string | number | undefined)[] = [];
if (filterOffer) {
    query += ` WHERE FicheDePoste.salaire >= ?`;
    params.push(filterOffer.minSalary);
    if (filterOffer.region) {
        query += ` AND FicheDePoste.lieu = ?'`;
        params.push(filterOffer.region);
    }
}
return new Promise < [OffreDePoste] > (
    (resolve, reject) =>
        pool.query(query, params, (err, result) => {
            // Gestion des résultats de la requête
        })
);
```

Dans cet exemple, nous construisons dynamiquement notre requête SQL en ajoutant des conditions basées sur les paramètres
fournis. Les valeurs des paramètres sont stockées dans un tableau `params`, et lors de l'exécution de la requête, ces
valeurs sont remplacées par les placeholders correspondants. Ainsi, les paramètres ne sont pas interprétés comme du code
SQL potentiellement malveillant.

```
http://localhost:8000/api/offers?salary=1000&region="OR 1=1;"
```

## Avantages de l'utilisation de placeholders

L'utilisation de placeholders présente plusieurs avantages en termes de sécurité :

1. **Prévention des injections SQL**: En utilisant des placeholders, nous séparons clairement les instructions SQL des
   données utilisateur. Cela empêche les attaquants d'injecter du code SQL malveillant en manipulant les données
   fournies.
2. **Protection contre les caractères spéciaux**: Les placeholders assurent l'échappement automatique des caractères
   spéciaux présents dans les valeurs des paramètres. Cela garantit que ces caractères sont traités comme des données
   normales et non comme du code SQL potentiellement dangereux.
3. **Facilité d'utilisation**: L'utilisation de placeholders simplifie la construction des requêtes SQL, en évitant la
   concaténation manuelle des valeurs des paramètres dans la chaîne de requête. Cela réduit les erreurs potentielles et
   facilite la maintenance du code.

# Protection contre les attaques CSRF (Cross-Site Request Forgery)

En plus de la protection contre les injections SQL, notre application Express.js met également en place des mesures de
sécurité pour se prémunir contre les attaques CSRF (Cross-Site Request Forgery). Les attaques CSRF exploitent la
confiance d'un utilisateur authentifié pour effectuer des actions non autorisées à son insu.

## Génération d'un token CSRF unique

Lorsqu'un utilisateur authentifié interagit avec notre application, nous générons un token CSRF unique et l'associons à
sa session. Ce token est créé à l'aide d'un middleware qui s'exécute avant chaque requête. Voici un extrait de code
illustrant cette fonctionnalité :

```javascript
export function createCSRFToken(req: any, res: any, next: any) {
    if (loggedInNoRedirection(req, res)) {
        if (req.session.csrfSecret === undefined) {
            req.session.csrfSecret = randomBytes(64).toString("hex");
            console.log("2. in createCSRFToken req.sessionID: ", req.sessionID);
        }
    }
    next();
}
```

Ce middleware vérifie si l'utilisateur est authentifié et, le cas échéant, génère un token CSRF unique en utilisant la
fonction `randomBytes` pour créer une chaîne aléatoire de 64 octets. Ce token est stocké dans la session de
l'utilisateur.

## Utilisation du token CSRF dans les formulaires

Lors du rendu d'un formulaire, nous ajoutons le token CSRF généré dans un champ caché du formulaire. Cela permet de "
signer" le formulaire avec le token CSRF associé à la session de l'utilisateur. Voici un exemple de code HTML montrant
l'utilisation du token CSRF dans un formulaire :

```html
<input type="hidden" name="_csrf" value="<%= csrfToken %>">
```

Le token CSRF est récupéré depuis la session et inséré dans le champ caché du formulaire à l'aide d'un moteur de
template (dans cet exemple, `<%= csrfToken %>` représente l'insertion du token CSRF dans le HTML).

## Vérification du token CSRF lors de la soumission d'un formulaire

Lorsqu'un utilisateur soumet un formulaire, le contrôleur correspondant à cette action vérifie que le token CSRF du
formulaire correspond à celui stocké dans la session de l'utilisateur. Cela garantit que le formulaire a été généré par
notre serveur et n'a pas été forgé par un attaquant. Voici un extrait de code illustrant cette vérification :

```javascript
let csrfToken = req.body._csrf;
if (!csrfValidation(req, csrfToken)) {
    alerts.push(new Alert("danger", "Erreur CSRF"));
    //TODO message d'erreur
    return res.redirect("/logout");
}
```

Le token CSRF soumis avec le formulaire est extrait de la requête (`req.body._csrf`) et comparé au token stocké dans la
session. Si les tokens ne correspondent pas, une erreur CSRF est générée et l'utilisateur est déconnecté par mesure de
sécurité.

# Rapport de sécurité - Protection contre les attaques XSS

## Introduction

Les mesures de sécurité mises en place dans notre application afin de prévenir les attaques XSS (Cross-Site Scripting).
L'attaque XSS est une technique couramment utilisée par les attaquants pour injecter du code JavaScript malveillant dans
les pages web, qui est ensuite exécuté par les navigateurs des utilisateurs.

## Protection de la base de données

Une des mesures de sécurité que nous avons mises en place consiste à échapper automatiquement tous les caractères
lorsqu'ils sont stockés dans la base de données. L'échappement des caractères implique la conversion de certains
caractères spéciaux en leur équivalent sûr, empêchant ainsi leur interprétation en tant que code exécutable. Lorsqu'un
utilisateur soumet des données, telles que des commentaires, elles sont traitées et échappées avant d'être stockées dans
la base de données.

```javascript
     <script type=text/javascript>alert(‘Vulnérabilité détectée : faille XSS’) ;</script>
```

## Avantages de l'échappement automatique en base de données

L'échappement automatique des caractères en base de données présente plusieurs avantages en termes de sécurité :

1. **Prévention des attaques XSS**: En échappant automatiquement tous les caractères lorsqu'ils sont stockés en base de
   données, nous nous assurons que le code JavaScript malveillant ne sera pas exécuté lors de l'affichage des données
   sur notre site. Les caractères spéciaux sont convertis en leur forme sécurisée, évitant ainsi l'injection de scripts
   malveillants.
2. **Protection contre les erreurs humaines**: L'échappement automatique en base de données réduit les risques d'erreurs
   humaines lors de l'affichage des données. Même si une étape de filtrage ou d'encodage est omise lors de l'affichage,
   les caractères échappés en base de données garantissent que le code potentiellement dangereux ne sera pas exécuté.
3. **Uniformité de la sécurité**: En échappant les caractères au niveau de la base de données, nous appliquons une
   mesure de sécurité uniforme à toutes les données stockées. Cela garantit que toutes les données, même celles qui ont
   été stockées antérieurement, sont protégées contre les attaques XSS lors de leur affichage.

## Conclusion

Grâce à l'échappement automatique des caractères en base de données, notre application prévient efficacement les
attaques XSS en empêchant l'exécution de code JavaScript malveillant lors de l'affichage des données. Cette mesure de
sécurité assure l'intégrité et la sécurité de notre application en empêchant les attaquants d'exploiter cette faille de
sécurité.
