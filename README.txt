# Poch'List

- Dossier img : contient toutes les images relatives à l'application.
- Dossier font: contient la bibliothèque des icônes et la police.
- Dossier public: contient tous les fichiers CSS / JAVASCRIPT relatifs à l'application.

1) Importer depuis gitHub : https://github.com/CDelf/pochLib

2) Installer le projet : 
- Il faut d'abord s'assurer qu'un serveur web est bien installé ( ex: apache ou nginx )

- Installer avec Apache :
Afin de faliciter l'installation et la configuration du serveur web, nous utilisons le logiciel XAMPP avec un control panel pour l'activation et la désactivation d'Apache

vous pouvez le télécharger sur le site officel et l'installer:
https://www.apachefriends.org/

3) Configuration de la VHOST :
	1- Aller sur le fichier d'installation XAMPP
	2- Aller sur apache \apache\conf\extra
	3- Ouvrir "httpd-vhosts.conf"
	4- Ajouter une VHOST dans le fichier, qui pointe sur le code source de l'application

4) Exemple :

<VirtualHost *:80>
	ServerAdmin c.delfino@live.fr
	ServerName pochlib.local
	DocumentRoot "B:\Documents\Carole\Openclassroom\P6\PochLib"
	<Directory "B:\Documents\Carole\Openclassroom\P6\PochLib">
		Options All
		AllowOverride All
		Require all granted
	</Directory>
</VirtualHost>

5) Configurer le servername de l'application hosts 
Pour windows vous pouvez suivre la procédure ci-dessous :
	1- Aller sur le repertoire "C:\Windows\System32\drivers\etc"
	2- Ouvrir le fichier "hosts" en tant que admin
	3- Rajouter la ligne en bas de fichier : 127.0.0.1 pochlib.local

6) Lancer le serveur WEB
	1- Aller sur xampp\apache\
	2- Lancer "xampp-control.exe"
	3- Cliquer sur le button "Start apache"

7) Test 
	1- Lancer le navigateur 
	2- Taper "http://pochlib.local/" 
	3- La page index se lance automatiquement