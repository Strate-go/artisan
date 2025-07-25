# Carte Interactive Stratégo - Style Stripe

Une carte interactive inspirée du design de Stripe.com, adaptée pour présenter les solutions Stratégo aux artisans.

## 🎯 Fonctionnalités

- **3 sections interactives** avec animations séquentielles
- **Scroll-based animations** - les animations se déclenchent quand la section entre dans le viewport
- **Design responsive** adapté mobile et desktop
- **Tuiles animées** avec effets de hover et transitions fluides
- **Connexions SVG** avec animations de tracé progressif
- **Typographie personnalisée** (Space Grotesk + Raleway)
- **Palette de couleurs** conforme à la charte Stratégo

## 🎨 Structure des sections

### Section 1 : Rentabilité
- **Problèmes** : Devis, Matières Premières, Temps de Travail
- **Solution** : Marge par Chantier
- **Bénéfice** : Décisions Éclairées

### Section 2 : Trésorerie  
- **Problèmes** : Fournisseurs/Achats, Charges/Salaires, Factures Clients
- **Solution** : Prévisionnel de Trésorerie
- **Bénéfice** : Sérénité/Anticipation

### Section 3 : Croissance
- **Problèmes** : Doute/Incertitude, Investissement Matériel, Recrutement
- **Solution** : Conseil Stratégique  
- **Bénéfice** : Croissance Sereine

## 🔧 Intégration

### Option 1 : Site web complet
Ouvrez simplement `index.html` dans votre navigateur.

### Option 2 : Intégration dans un CMS (recommandé pour vous)

#### Pour intégrer dans votre site existant :

1. **Copiez les fichiers CSS et JS** sur votre serveur
2. **Ajoutez les liens** dans votre page :
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Raleway:wght@400;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="chemin/vers/styles.css">
```

3. **Insérez le HTML** dans un bloc HTML de votre page :
```html
<div id="interactive-map-container">
    <!-- Copiez le contenu des sections depuis index.html -->
    <section class="section" data-section="1">
        <!-- Contenu de la section 1 -->
    </section>
    <!-- etc. -->
</div>
```

4. **Ajoutez le script** avant la fermeture `</body>` :
```html
<script src="chemin/vers/script.js"></script>
```

### Option 3 : HTML à insérer directement

Si vous pouvez insérer du HTML brut dans votre CMS, voici le code minimal :

```html
<div style="font-family: 'Raleway', sans-serif;">
    <!-- Coller ici le contenu des sections -->
</div>

<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;700&family=Raleway:wght@400;700&display=swap" rel="stylesheet">
<style>
    /* Coller ici le contenu de styles.css */
</style>
<script>
    /* Coller ici le contenu de script.js */
</script>
```

## 🎬 Animations incluses

- **Fade-in progressif** des tuiles
- **Lignes de connexion animées** (tracé progressif)
- **Effets de pulse** et **glow** 
- **Transitions fluides** entre les états
- **Lignes pointillées → pleines** pour la section trésorerie
- **Effet d'intervention** (ligne bleue) pour la section croissance

## 🎨 Couleurs utilisées

- **Bleu foncé** : `#0B2957` (titres, textes importants)
- **Doré** : `#BF9B30` (mots-clés, connexions problèmes)
- **Bleu clair** : `#3a8eff` (solutions, bénéfices)
- **Gris foncé** : `#4A4A4A` (texte standard)
- **Gris inactif** : `#e5e7eb` (tuiles inactives)

## 📱 Responsive

- **Desktop** : Grille 6 colonnes, layout côte-à-côte
- **Tablet** : Grille 4 colonnes, layout empilé  
- **Mobile** : Grille réduite, tailles adaptées

## ⚡ Performance

- **Intersection Observer** pour déclencher les animations au scroll
- **Debounced resize** pour optimiser le recalcul des chemins SVG
- **CSS transforms** et **opacity** pour des animations fluides
- **Timers nettoyés** pour éviter les fuites mémoire

## 🛠️ Personnalisation

### Modifier les couleurs
Changez les variables CSS dans `:root` :
```css
:root {
    --dark-blue: #VotreCouleur;
    --gold: #VotreCouleur;
    /* etc. */
}
```

### Modifier les timings d'animation
Dans `script.js`, ajustez les `setTimeout` :
```javascript
this.animationTimers.push(setTimeout(() => {
    // votre animation
}, 1200)); // ← changez cette valeur
```

### Ajouter des tuiles
1. Ajoutez l'HTML de la tuile
2. Ajoutez les connexions SVG  
3. Mise à jour du JavaScript pour inclure la nouvelle tuile

## 🐛 Dépannage

- **Les animations ne se déclenchent pas** : Vérifiez que le script est bien chargé
- **Les lignes SVG ne s'affichent pas** : Vérifiez les `data-tile` et `data-from/data-to`
- **Problème de responsive** : Vérifiez les media queries CSS

## 📞 Support

Ce code est prêt à utiliser ! Si vous rencontrez des difficultés d'intégration, n'hésitez pas à demander de l'aide.