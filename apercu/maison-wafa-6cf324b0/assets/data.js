// Articles d'exemple (photos libres de droits Unsplash, prix d'exemple)
const U = (id, w = 900, h = 1125) => `https://images.unsplash.com/photo-${id}?w=${w}&h=${h}&fit=crop&auto=format&q=75`;

const NAMES = { deco: "Décoration", vaisselle: "Art de la table", paniers: "Paniers", textiles: "Textile", bienetre: "Bien-être", bijoux: "Bijoux" };
const CAT_ORDER = ["deco", "vaisselle", "paniers", "textiles", "bienetre", "bijoux"];

const PRODUCTS = [
  { id: 1, cat: "vaisselle", name: "Assiette Fès", price: 24, fm: true, ph: ["1553523292-1140e57d4f87", "1790090760761-91bfc916c082", "1792073224718-45d194192044"], desc: "Assiette en céramique peinte à la main, aux motifs géométriques inspirés des zelliges. Parfaite pour servir ou pour décorer un mur.", specs: [["Matière", "Céramique émaillée"], ["Dimensions", "Ø 26 cm"], ["Entretien", "Lavage à la main"], ["Origine", "Fès"]] },
  { id: 2, cat: "vaisselle", name: "Bol Atlas", price: 18, fm: true, ph: ["1733590634381-b58fce897229", "1621453571889-0b228e998080", "1523367438061-01c055ce790c"], desc: "Bol en céramique émaillée, tourné à la main. Pour les salades, les fruits ou en vide-poche.", specs: [["Matière", "Céramique émaillée"], ["Dimensions", "Ø 18 cm"], ["Entretien", "Lavage à la main"], ["Origine", "Safi"]] },
  { id: 3, cat: "vaisselle", name: "Tajine en terre cuite", price: 39, fm: true, ph: ["1706793986649-5c6516491489", "1706794831005-e0cbae755fae", "1761168955192-d710bf401325"], tag: "Pièce unique", desc: "Tajine en terre cuite, façonné à la main. Pour la table ou pour la décoration.", specs: [["Matière", "Terre cuite"], ["Dimensions", "Ø 30 cm"], ["Usage", "Service ou décoration"], ["Origine", "Salé"]] },
  { id: 4, cat: "paniers", name: "Panier de Marrakech", price: 35, fm: true, ph: ["1659520709425-31b547254b59", "1578678809626-a3741782f0b8", "1626037235530-fe56de7d6459"], tag: "Nouveau", desc: "Panier tressé à la main, anses solides. Pour le marché, la plage ou comme rangement.", specs: [["Matière", "Paille tressée"], ["Dimensions", "40 × 30 cm"], ["Anses", "Tressées"], ["Origine", "Marrakech"]] },
  { id: 5, cat: "paniers", name: "Paniers de rangement", price: 45, fm: true, ph: ["1455669175216-9017c9b02fc6", "1481061730414-e888962bd2c0", "1562835154-7ac43f0fec10"], desc: "Paniers en osier tressé pour ranger plaids, jouets ou linge. Plusieurs tailles disponibles.", specs: [["Matière", "Osier tressé"], ["Dimensions", "Ø 35 cm"], ["Usage", "Rangement"], ["Origine", "Marrakech"]] },
  { id: 6, cat: "textiles", name: "Rideau en lin écru", price: 59, fm: true, ph: ["1682421938316-4b186e25174c", "1615225502559-842cbc296205", "1764422097759-1fa737c50c51"], tag: "Nouveau", desc: "Rideau tissé couleur écrue. Il filtre la lumière avec douceur et habille la pièce sans l'assombrir.", specs: [["Matière", "Lin"], ["Dimensions", "140 × 260 cm"], ["Fixation", "Passants"], ["Origine", "Chefchaouen"]] },
  { id: 7, cat: "deco", name: "Lanterne Medina", price: 49, fm: true, ph: ["1778486897678-b0bd710edf5a", "1786437548087-3ff73341a247", "1774853672959-1a6a6e0f8b5d"], desc: "Lanterne en métal ajouré. Avec une bougie, elle projette des motifs sur les murs.", specs: [["Matière", "Métal"], ["Hauteur", "38 cm"], ["Usage", "Intérieur"], ["Origine", "Marrakech"]] },
  { id: 8, cat: "textiles", name: "Voilage blanc", price: 32, ph: ["1688732614684-220c19395b2b", "1633304688070-780d36751e2e", "1689155627959-03a8e553ef33"], desc: "Voilage léger et lumineux, pour adoucir la lumière du jour.", specs: [["Matière", "Coton léger"], ["Dimensions", "140 × 250 cm"], ["Fixation", "Œillets"], ["Origine", "Maroc"]] },
  { id: 21, cat: "bienetre", name: "Huile d'argan", price: 22, fm: true, ph: ["1608571423539-e951b9b3871e", "1608571702600-5a5419d31475", "1573461160327-b450ce3d8e7f"], tag: "Bio", desc: "Huile d'argan pure, pressée à froid par une coopérative de femmes du Souss. Pour le visage, le corps et les cheveux.", specs: [["Composition", "100 % huile d'argan"], ["Contenance", "100 ml"], ["Usage", "Visage, corps, cheveux"], ["Origine", "Agadir et le Souss"]] },
  { id: 22, cat: "bienetre", name: "Henné naturel", price: 9, fm: false, ph: ["1781377012601-93162be3a433", "1652757359639-575cbb557a38", "1722172312997-068983715fd1"], desc: "Poudre de henné naturel, pour colorer et fortifier les cheveux, ou pour les dessins au henné.", specs: [["Composition", "100 % feuilles de henné"], ["Contenance", "250 g"], ["Usage", "Cheveux, mains"], ["Origine", "Maroc"]] },
  { id: 23, cat: "bienetre", name: "Ghassoul", price: 8, fm: false, ph: ["1704650312022-ed1a76dbed1b", "1632001605599-54f8b1c3fe3a", "1633509817627-5a29634475af"], desc: "Argile naturelle du hammam. Mélangée à un peu d'eau, elle nettoie la peau et les cheveux en douceur.", specs: [["Composition", "100 % argile ghassoul"], ["Contenance", "200 g"], ["Usage", "Masque visage, cheveux"], ["Origine", "Moyen Atlas"]] },
  { id: 24, cat: "bienetre", name: "Eau de rose", price: 12, fm: false, ph: ["1762328843295-1194af964b2e", "1762328837175-672d686c1bae", "1769251032437-8fc834524264"], tag: "Nouveau", desc: "Eau florale de rose, pour rafraîchir et parfumer la peau. Un geste beauté traditionnel au Maroc.", specs: [["Composition", "Eau de rose distillée"], ["Contenance", "200 ml"], ["Usage", "Visage, corps"], ["Origine", "Vallée des roses (Kelaat M'Gouna)"]] },
  { id: 25, cat: "bienetre", name: "Savon artisanal", price: 6, fm: true, ph: ["1600857544200-b2f666a9a2ec", "1618840152526-92682643af2d", "1605264964528-06403738d6dc"], desc: "Savon fait main, doux pour la peau. Parfait pour le hammam à la maison.", specs: [["Composition", "Huiles végétales"], ["Poids", "100 g"], ["Usage", "Corps"], ["Origine", "Maroc"]] },
  { id: 11, cat: "bijoux", name: "Collier Cercle", price: 29, ph: ["1783541507490-edb026e2a961", "1773929345739-94db8a4ccd0c", "1623321673989-830eff0fd59f"], tag: "Doré", desc: "Fine chaîne et pendentif cercle. Léger, à porter tous les jours.", specs: [["Matière", "Acier inoxydable"], ["Finition", "Dorée"], ["Longueur", "45 cm, réglable"], ["Livré", "Dans son écrin"]] },
  { id: 12, cat: "bijoux", name: "Jonc Marrakech", price: 25, ph: ["1689367436442-76c859315008", "1689367436629-1d288f1e23b6", "1786052347285-3ad7f12c738f"], desc: "Bracelet jonc ouvert, il s'ajuste au poignet.", specs: [["Matière", "Acier inoxydable"], ["Finition", "Dorée"], ["Taille", "Ajustable"], ["Livré", "Dans son écrin"]] },
  { id: 13, cat: "bijoux", name: "Boucles Goutte", price: 19, ph: ["1727990865600-91f8cb8b0168", "1723802205505-2f88b2227718", "1671644730555-916aa8d8157f"], tag: "Nouveau", desc: "Boucles d'oreilles en forme de goutte, au volume doux.", specs: [["Matière", "Acier inoxydable"], ["Finition", "Dorée"], ["Hauteur", "2 cm"], ["Livré", "Dans son écrin"]] },
  { id: 14, cat: "bijoux", name: "Bague fine", price: 15, ph: ["1631982686092-e6561a853187", "1628926379972-9843ad139a8c", "1622398925373-3f91b1e275f5"], desc: "Bague fine et minimaliste, à porter seule ou à plusieurs.", specs: [["Matière", "Acier inoxydable"], ["Finition", "Dorée"], ["Taille", "Ajustable"], ["Livré", "Dans son écrin"]] },
  { id: 15, cat: "bijoux", name: "Collier Argent", price: 29, ph: ["1588444968576-f8fe92ce56fd", "1676329945867-01c9975aa9d1", "1511253819057-5408d4d70465"], tag: "Argenté", desc: "Collier fin en finition argentée, pour un style minimal.", specs: [["Matière", "Acier inoxydable"], ["Finition", "Argentée"], ["Longueur", "45 cm, réglable"], ["Livré", "Dans son écrin"]] },
  { id: 16, cat: "bijoux", name: "Bracelets fins", price: 22, ph: ["1761222101900-9c9e34fac2ce", "1589674781759-c21c37956a44", "1763029513623-37d488cb97b1"], desc: "Bracelets fins argentés, à superposer.", specs: [["Matière", "Acier inoxydable"], ["Finition", "Argentée"], ["Taille", "Ajustable"], ["Livré", "Dans son écrin"]] },
];

// Articles ajoutes par la vendeuse dans son espace (enregistres dans ce navigateur)
try { JSON.parse(localStorage.getItem("mm_articles") || "[]").forEach(a => { a.isNew = true; PRODUCTS.unshift(a); }); } catch (e) {}

// Livraison (exemples, a confirmer avec la vendeuse)
const SHIPPING = [
  { id: "relais", name: "Point relais", delay: "3 à 5 jours ouvrés", price: 4.9 },
  { id: "domicile", name: "Colissimo à domicile", delay: "2 à 3 jours ouvrés", price: 6.9 },
];
const FREE_FROM = 80;

const REGIONS = [
  ["Marrakech", "Paniers tressés, lanternes en métal ajouré, babouches en cuir.", "Marrakech"],
  ["Fès", "Céramique bleue, zellige et cuir des tanneries.", "Fès"],
  ["Meknès", "Damasquinerie : du fil d'argent incrusté dans le métal.", ""],
  ["Safi", "Poterie et céramique émaillée.", "Safi"],
  ["Agadir et le Souss", "Huile d'argan, pressée par des coopératives de femmes.", "Souss"],
  ["Essaouira", "Marqueterie en bois de thuya.", ""],
  ["Tanger et Tétouan", "Broderies fines et bois peint du Nord.", ""],
  ["Chefchaouen", "Tissages et couvertures en laine.", "Chefchaouen"],
  ["Rabat et Salé", "Tapis de Rabat et poterie de Salé.", "Salé"],
  ["Moyen Atlas", "Tapis berbères en laine et ghassoul, l'argile du hammam.", "Moyen Atlas"],
  ["Vallée des roses", "Eau de rose et pétales séchés de Kelaat M'Gouna.", "roses"],
  ["Tiznit", "Bijoux berbères en argent.", ""],
];
