# LChatBot
LChatBot est un chatbot Discord apprenant grâce aux messages envoyés par les membres sur les serveurs où il est présent.

## Questions générales

### A quoi sert-il ?
Si vous n'avez pas d'amis, les chatbots sont des inventions très utiles *tousse, tousse*
Pardon, je me suis égaré. LChatBot vous permet de combler de longues journées d'ennui, de vous amusez... de passer le temps, quoi.

### Où le trouver ?
Actuellement, vous ne pouvez retrouver LChatBot uniquement sur Discord grâce à son [lien d'invitation](https://discord.com/api/oauth2/authorize?client_id=742780203717361756&permissions=3072&scope=bot).
Il est prévu qu'une version Web soit développée, affaire à suivre.

### Comment participer au projet ?
Votre aide est la bienvenue ! Vous pouvez aider LChatBot à apprendre de nouvelles phrases en l'ajoutant sur votre serveur avec son [lien d'invitation](https://discord.com/api/oauth2/authorize?client_id=737659120219586652&permissions=67584&scope=bot), deplus, grâce à ça, plus d'utilisateurs le connaîtront et ça, ça me fera très plaisir 🥰

### Pour plus d'informations...
...n'hésitez pas à me contacter par [e-mail](mailto:lprogead@mailo.com), via [Twitter](https://twitter.com/lprogead) ou via Discord (LProgead#3667).


## Questions développement
Entrons maintenant dans le vif du sujet pour les développeurs !

### Quel langage est utilisé pour le développement du robot ?
J'utilise JavaScript pour le script principal et SQL pour les requêtes à la base de données. Le programme est supporté par NPM.

### Quels sont les modules utilisés ?
Pour ce projet, j'ai utilisé le module de la librairie Discord.JS pour faire le pont avec l'API Discord, le module MySQL pour communiquer avec la base de données ainsi que le module DotENV pour charger le fichier .env.

### Puis-je ré-utiliser le robot sur mon compte Discord ?
Comme le stipule la licence Affero, vous pouvez utiliser, fork, et distribuer ce projet à quelques conditions :
- Me citer (LProgead)
- Permettre à tous de télécharger votre nouveau code source
- Ne pas l'inclure dans un produit commercial
- Le distribuer sous la même licence, Affero.

Ainsi, vous pouvez sans risque l'utiliser pour une utilisation personnelle.

Je ne suis pas fermé à l'idée de donner à certains utilisateurs une dérogation de permissions. Si vous en souhaitez une, contactez-moi par [e-mail](mailto:lprogead@mailo.com) et nous en parlerons ensemble.

### Quels sont les prérequis pour lancer MacronBot sur mon équipement ?
- Tout d'abord, il vous faut avoir installé Node.JS sur votre ordinateur/serveur.
- Ensuite, vous pouvez cloner le repository, effectuer la commande `npm i` dans le dossier résultant.
- Créez un fichier .env dans lequel vous indiquez 
```
token=VOTRE TOKEN
db_id=IDENTIFIANT DE LA BASE DE DONNÉES
db_mdp=MOT DE PASSE DE LA BASE DE DONNÉES
```
- Pour lancer le programme, lancez `node .`.
Et là, swhoosh !, votre application Discord se lance 😁
