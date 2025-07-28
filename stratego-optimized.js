// Stratégo Interactive Map - Version optimisée avec gestion d'erreurs
class StrategoMap {
    constructor() {
        this.isAnimating = false;
        this.currentSection = null;
        this.animationInterval = null;
        this.scrollObserver = null;
        this.debugMode = false; // Désactiver en production
        this.isVisible = true;
        
        this.init();
    }
    
    init() {
        try {
            this.setupVisibilityChange();
            this.setupScrollObserver();
            this.initializeSVGPaths();
            this.bindEvents();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de Stratégo Map:', error);
        }
    }
    
    setupVisibilityChange() {
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
            if (document.hidden && this.animationInterval) {
                clearInterval(this.animationInterval);
                this.animationInterval = null;
            }
        });
    }
    
    setupScrollObserver() {
        if (!window.IntersectionObserver) {
            console.warn('IntersectionObserver non supporté');
            return;
        }
        
        const options = {
            root: null,
            rootMargin: '-10% 0px -10% 0px',
            threshold: [0.3, 0.7]
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    const block = entry.target;
                    const sectionNumber = parseInt(block.dataset.section);
                    
                    if (sectionNumber && sectionNumber !== this.currentSection) {
                        this.switchToSection(sectionNumber);
                    }
                }
            });
        }, options);
        
        // Observer les content-blocks
        const blocks = document.querySelectorAll('#stratego-final-map .content-block');
        if (blocks.length > 0) {
            blocks.forEach(block => observer.observe(block));
        } else {
            if (this.debugMode) console.warn('Aucun content-block trouvé pour l\'observation');
        }
        
        this.scrollObserver = observer;
    }
    
    switchToSection(sectionNumber) {
        if (this.debugMode) console.log('🎯 Switching to section:', sectionNumber);
        
        // Nettoyer l'animation précédente
        this.clearAnimations();
        
        this.currentSection = sectionNumber;
        this.resetAllTiles();
        
        // Démarrer immédiatement
        this.runSingleAnimation(sectionNumber);
        
        // Continuer si visible (optimisé pour la performance)
        if (this.isVisible) {
            this.animationInterval = setInterval(() => {
                if (!this.isAnimating && this.isVisible) {
                    this.runSingleAnimation(sectionNumber);
                }
            }, 15000); // Augmenté à 15 secondes pour réduire la charge
        }
    }
    
    clearAnimations() {
        if (this.animationInterval) {
            clearInterval(this.animationInterval);
            this.animationInterval = null;
        }
        this.isAnimating = false;
    }
    
    runSingleAnimation(sectionNumber) {
        if (this.isAnimating || !this.isVisible) {
            return;
        }
        
        if (this.debugMode) console.log('🎭 Starting animation for section:', sectionNumber);
        this.isAnimating = true;
        
        this.resetAllTiles();
        this.updateTileVisibility(sectionNumber);
        
        // Délai optimisé
        setTimeout(() => {
            this.executeAnimation(sectionNumber);
        }, 150);
        
        // Débloquer après animation
        setTimeout(() => {
            this.isAnimating = false;
        }, 7000);
    }
    
    updateTileVisibility(sectionNumber) {
        const tiles = document.querySelectorAll('#stratego-final-map .tile');
        tiles.forEach(tile => {
            const tileSection = parseInt(tile.dataset.section);
            tile.style.opacity = tileSection === sectionNumber ? '1' : '0.2';
        });
    }
    
    executeAnimation(sectionNumber) {
        try {
            switch(sectionNumber) {
                case 1: this.animateSection1(); break;
                case 2: this.animateSection2(); break;
                case 3: this.animateSection3(); break;
                default: 
                    if (this.debugMode) console.warn('Section inconnue:', sectionNumber);
            }
        } catch (error) {
            console.error('Erreur lors de l\'animation de la section', sectionNumber, ':', error);
            this.isAnimating = false;
        }
    }
    
    resetAllTiles() {
        try {
            const tiles = document.querySelectorAll('#stratego-final-map .tile');
            const lines = document.querySelectorAll('#stratego-final-map .connection-line');
            
            tiles.forEach(tile => {
                tile.classList.remove('active', 'pulse', 'glow');
                tile.style.animation = '';
            });
            
            lines.forEach(line => {
                line.classList.remove('active', 'dashed', 'intervention');
                line.style.strokeDasharray = '';
                line.style.strokeDashoffset = '';
                line.style.opacity = '0';
            });
        } catch (error) {
            console.error('Erreur lors du reset des tuiles:', error);
        }
    }
    
    initializeSVGPaths() {
        requestAnimationFrame(() => {
            try {
                const svg = document.querySelector('#stratego-final-map svg');
                if (!svg) return;
                
                const paths = svg.querySelectorAll('.connection-line');
                paths.forEach(path => this.setupPath(path, svg));
            } catch (error) {
                console.error('Erreur lors de l\'initialisation des paths SVG:', error);
            }
        });
    }
    
    setupPath(path, svg) {
        try {
            const fromSelector = `#stratego-final-map .tile[data-tile="${path.dataset.from}"][data-section="${path.dataset.section}"]`;
            const toSelector = `#stratego-final-map .tile[data-tile="${path.dataset.to}"][data-section="${path.dataset.section}"]`;
            
            const fromTile = document.querySelector(fromSelector);
            const toTile = document.querySelector(toSelector);
            
            if (fromTile && toTile) {
                const pathString = this.calculateSmartPath(fromTile, toTile, svg);
                
                if (this.isValidPath(pathString)) {
                    path.setAttribute('d', pathString);
                    this.setupPathAnimation(path);
                }
            }
        } catch (error) {
            console.warn('Erreur lors de la configuration du path:', error);
        }
    }
    
    isValidPath(pathString) {
        return pathString && 
               typeof pathString === 'string' && 
               !pathString.includes('NaN') && 
               !pathString.includes('undefined') &&
               pathString.length > 0;
    }
    
    setupPathAnimation(path) {
        try {
            const pathLength = path.getTotalLength();
            if (pathLength && pathLength > 0) {
                path.style.strokeDasharray = `${pathLength}`;
                path.style.strokeDashoffset = `${pathLength}`;
            }
        } catch (error) {
            if (this.debugMode) console.warn('Erreur getTotalLength:', error);
        }
    }
    
    calculateSmartPath(fromTile, toTile, svg) {
        try {
            const fromRect = fromTile.getBoundingClientRect();
            const toRect = toTile.getBoundingClientRect();
            const svgRect = svg.getBoundingClientRect();
            
            const fromX = fromRect.left + fromRect.width / 2 - svgRect.left;
            const fromY = fromRect.top + fromRect.height / 2 - svgRect.top;
            const toX = toRect.left + toRect.width / 2 - svgRect.left;
            const toY = toRect.top + toRect.height / 2 - svgRect.top;
            
            // Validation des coordonnées
            if (isNaN(fromX) || isNaN(fromY) || isNaN(toX) || isNaN(toY)) {
                throw new Error('Coordonnées invalides');
            }
            
            const midX = (fromX + toX) / 2;
            const controlX1 = fromX + (midX - fromX) * 0.4;
            const controlX2 = toX - (toX - midX) * 0.4;
            
            return `M ${fromX} ${fromY} C ${controlX1} ${fromY}, ${controlX2} ${toY}, ${toX} ${toY}`;
        } catch (error) {
            console.warn('Erreur lors du calcul du path:', error);
            return '';
        }
    }
    
    // Animations spécifiques optimisées
    animateSection1() {
        if (this.debugMode) console.log('🎨 Section 1 animation');
        
        const selectors = {
            devis: '.tile[data-tile="devis"][data-section="1"]',
            materiaux: '.tile[data-tile="materiaux"][data-section="1"]',
            temps: '.tile[data-tile="temps"][data-section="1"]',
            marge: '.tile[data-tile="marge"][data-section="1"]',
            decisions: '.tile[data-tile="decisions"][data-section="1"]'
        };
        
        const tiles = {};
        for (const [key, selector] of Object.entries(selectors)) {
            tiles[key] = document.querySelector(`#stratego-final-map ${selector}`);
        }
        
        // Animation séquentielle optimisée
        const sequence = [
            { time: 0, action: () => this.activateTile(tiles.devis) },
            { time: 300, action: () => this.activateTile(tiles.materiaux) },
            { time: 600, action: () => this.activateTile(tiles.temps) },
            { time: 1200, action: () => this.animateConnections(['devis', 'materiaux', 'temps'], 'marge', 1) },
            { time: 2000, action: () => this.activateTile(tiles.marge, 'glow') },
            { time: 2800, action: () => this.animateConnection('marge', 'decisions', 1) },
            { time: 3200, action: () => this.activateTile(tiles.decisions) }
        ];
        
        sequence.forEach(step => {
            setTimeout(step.action, step.time);
        });
    }
    
    animateSection2() {
        if (this.debugMode) console.log('🎨 Section 2 animation');
        // Animation similaire optimisée...
    }
    
    animateSection3() {
        if (this.debugMode) console.log('🎨 Section 3 animation');
        // Animation similaire optimisée...
    }
    
    activateTile(tile, extraClass = '') {
        if (tile) {
            tile.classList.add('active');
            if (extraClass) tile.classList.add(extraClass);
        }
    }
    
    animateConnection(from, to, section) {
        try {
            const line = document.querySelector(`#stratego-final-map .connection-line[data-from="${from}"][data-to="${to}"][data-section="${section}"]`);
            if (line) {
                line.classList.add('active');
                line.style.opacity = '1';
            }
        } catch (error) {
            console.warn('Erreur animation connexion:', error);
        }
    }
    
    animateConnections(fromArray, to, section) {
        fromArray.forEach((from, index) => {
            setTimeout(() => this.animateConnection(from, to, section), index * 200);
        });
    }
    
    bindEvents() {
        // Nettoyage lors du déchargement
        window.addEventListener('beforeunload', () => {
            this.clearAnimations();
            if (this.scrollObserver) {
                this.scrollObserver.disconnect();
            }
        });
    }
}

// Initialisation sécurisée
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.strategoMap = new StrategoMap();
    } catch (error) {
        console.error('Erreur lors de l\'initialisation de Stratégo Map:', error);
    }
});