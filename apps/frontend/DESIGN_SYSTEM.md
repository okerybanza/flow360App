# 🎨 Design System - 360Flow

## Charte Graphique Premium

### 🎯 Philosophie
Design minimaliste et professionnel, axé sur la lisibilité et l'efficacité. Interface épurée avec des accents subtils pour une expérience utilisateur premium.

### 🎨 Palette de Couleurs

#### Couleurs Principales
- **Bleu Primaire** : `#1e40af` (blue-600)
- **Bleu Secondaire** : `#0ea5e9` (sky-500)
- **Slate** : `#64748b` (slate-500)

#### Couleurs Neutres
- **Fond Principal** : `#f8fafc` (gray-50)
- **Cartes** : `#ffffff` (white)
- **Texte Principal** : `#1e293b` (gray-800)
- **Texte Secondaire** : `#64748b` (gray-500)
- **Bordures** : `#e2e8f0` (gray-200)

#### Couleurs d'État
- **Succès** : `#10b981` (emerald-500)
- **Erreur** : `#ef4444` (red-500)
- **Warning** : `#f59e0b` (amber-500)
- **Info** : `#3b82f6` (blue-500)

### 📐 Typographie

#### Hiérarchie
- **H1** : `text-3xl font-bold text-gray-900`
- **H2** : `text-2xl font-bold text-gray-900`
- **H3** : `text-xl font-semibold text-gray-900`
- **Body Large** : `text-lg text-gray-700`
- **Body** : `text-base text-gray-700`
- **Body Small** : `text-sm text-gray-600`
- **Caption** : `text-xs text-gray-500`

### 🧩 Composants

#### Cartes
```css
/* Carte standard */
bg-white rounded-lg shadow-sm border border-gray-200

/* Carte avec ombre */
bg-white rounded-lg shadow-md border border-gray-200

/* Carte avec ombre importante */
bg-white rounded-lg shadow-lg border border-gray-200
```

#### Boutons
```css
/* Bouton primaire */
bg-blue-600 hover:bg-blue-700 text-white

/* Bouton outline */
border-gray-300 text-gray-700 hover:bg-gray-50

/* Bouton ghost */
text-gray-600 hover:bg-gray-100
```

#### Inputs
```css
/* Input standard */
border-gray-300 focus:border-blue-500 focus:ring-blue-500

/* Label */
text-sm font-medium text-gray-700
```

### 📱 Layout

#### Conteneurs
- **Page principale** : `min-h-screen bg-gray-50`
- **Contenu centré** : `flex items-center justify-center`
- **Espacement** : `space-y-6` (entre sections), `space-y-4` (entre éléments)

#### Grilles
- **Responsive** : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
- **Gap** : `gap-4` (petit), `gap-6` (moyen), `gap-8` (grand)

### 🎭 États Visuels

#### Hover
- **Cartes** : `hover:bg-gray-50 transition-colors`
- **Boutons** : `hover:bg-blue-700` (primaire), `hover:bg-gray-50` (outline)

#### Focus
- **Inputs** : `focus:border-blue-500 focus:ring-blue-500`
- **Boutons** : `focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`

#### Loading
- **Skeleton** : `animate-pulse bg-gray-200`
- **Spinner** : `animate-spin`

### 🚫 À Éviter

❌ **Ne pas utiliser :**
- Gradients colorés (`bg-gradient-to-br from-blue-50 to-indigo-100`)
- Couleurs trop vives ou saturées
- Ombres trop prononcées
- Espacement incohérent
- Typographie non hiérarchisée

✅ **Toujours utiliser :**
- Couleurs neutres en base
- Accents subtils en bleu
- Ombres légères et cohérentes
- Espacement régulier
- Hiérarchie typographique claire

### 📋 Checklist de Conformité

Avant de créer un nouveau composant, vérifiez :

- [ ] Utilise la palette de couleurs définie
- [ ] Respecte la hiérarchie typographique
- [ ] A des espacements cohérents
- [ ] Inclut les états hover/focus
- [ ] Est responsive
- [ ] N'utilise pas de gradients colorés
- [ ] A des ombres subtiles
- [ ] Utilise les classes Tailwind standardisées

---

*Ce design system garantit une expérience utilisateur cohérente et professionnelle sur toute l'application 360Flow.*
