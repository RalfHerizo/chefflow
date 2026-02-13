# ChefFlow - SaaS de Gestion de Stock & Production

**ChefFlow** est une application de gestion d'inventaire intelligente conçue pour la restauration, mettant l'accent sur la précision chirurgicale des données et l'automatisation de la production.

---

## Philosophie de Développement (Senior-Ready)

Ce projet n'est pas un simple CRUD. Il a été bâti avec une approche **"Enterprise-Grade"** :

* **TDD (Test-Driven Development) :** 100% de la logique métier (mouvements de stock, calculs de recettes) est couverte par des tests automatisés avec **Pest**.
* **Intégrité Financière :** Utilisation du stockage en `integers` (centimes) pour les prix afin d'éliminer les erreurs d'arrondis liées aux calculs en virgule flottante.
* **Précision des Stocks :** Gestion des unités à 4 décimales (`decimal(12,4)`) pour supporter les ingrédients de haute précision (épices, extraits).
* **Clean Architecture :** Utilisation du pattern **Action** pour isoler la logique métier complexe des contrôleurs.

## 🚀 Stack Technique

* **Backend :** Laravel 11 (PHP 8.2+)
* **Frontend :** React + Inertia.js + TailwindCSS
* **Tests :** Pest PHP
* **Database :** MySQL (avec Transactions SQL pour l'intégrité)
* **Environnement :** Docker (Laravel Sail)

---

## Architecture des Données

Le système repose sur une relation **Many-to-Many** complexe entre les Ingrédients et les Produits.



Chaque vente de produit déclenche un processus atomique :
1. Analyse de la recette via la table pivot.
2. Vérification des stocks avec verrouillage (Lock).
3. Déduction automatique au prorata des quantités.
4. Déclenchement d'alertes en cas de franchissement de seuil critique.

## Installation & Tests

```bash
# Installation des dépendances
composer install
npm install

# Lancement des tests (Preuve de fiabilité)
php artisan test
