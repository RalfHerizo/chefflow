// Catégories de produits proposées dans les formulaires (création / édition).
// Liste de référence UNIQUE — à garder synchronisée avec les données de démo
// (database/seeders/DemoSeeder.php).
//
// La catégorie reste un champ libre en base : le filtre de la liste produits
// et celui du POS sont dérivés dynamiquement des valeurs réellement présentes.
// Cette liste sert uniquement à guider la saisie vers une taxonomie cohérente.
export const PRODUCT_CATEGORIES = [
    'Entrée',
    'Plat',
    'Accompagnement',
    'Dessert',
    'Boisson',
    'Menu',
];
