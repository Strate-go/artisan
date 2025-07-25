class InteractiveMap {
    constructor() {
        this.sections = document.querySelectorAll('.section');
        this.currentSection = null;
        this.animationTimers = [];
        
        this.init();
    }
    
    init() {
        this.setupIntersectionObserver();
        this.setupSVGPaths();
        this.bindEvents();
    }
    
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '-20% 0px -20% 0px',
            threshold: 0.3
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const section = entry.target;
                    const sectionNumber = section.dataset.section;
                    
                    // Ajouter la classe visible pour le fade-in de la section
                    section.classList.add('visible');
                    
                    // Déclencher l'animation spécifique à la section
                    setTimeout(() => {
                        this.triggerSectionAnimation(sectionNumber);
                    }, 500);
                }
            });
        }, options);
        
        this.sections.forEach(section => {
            observer.observe(section);
        });
    }
    
    setupSVGPaths() {
        this.sections.forEach(section => {
            const svg = section.querySelector('.connections');
            if (svg) {
                this.calculatePaths(svg);
            }
        });
    }
    
    calculatePaths(svg) {
        const paths = svg.querySelectorAll('.connection-line');
        const container = svg.parentElement;
        
        paths.forEach(path => {
            const fromTile = path.dataset.from;
            const toTile = path.dataset.to;
            
            const fromElement = container.querySelector(`[data-tile="${fromTile}"]`);
            const toElement = container.querySelector(`[data-tile="${toTile}"]`);
            
            if (fromElement && toElement) {
                const fromRect = fromElement.getBoundingClientRect();
                const toRect = toElement.getBoundingClientRect();
                const containerRect = container.getBoundingClientRect();
                
                const fromX = fromRect.left + fromRect.width / 2 - containerRect.left;
                const fromY = fromRect.top + fromRect.height / 2 - containerRect.top;
                const toX = toRect.left + toRect.width / 2 - containerRect.left;
                const toY = toRect.top + toRect.height / 2 - containerRect.top;
                
                // Créer une courbe de Bézier pour une ligne plus naturelle
                const midX = (fromX + toX) / 2;
                const midY = (fromY + toY) / 2;
                const controlX1 = fromX + (midX - fromX) * 0.5;
                const controlY1 = fromY;
                const controlX2 = toX - (toX - midX) * 0.5;
                const controlY2 = toY;
                
                const pathData = `M ${fromX} ${fromY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${toX} ${toY}`;
                path.setAttribute('d', pathData);
                
                // Calculer la longueur du chemin pour l'animation
                const length = path.getTotalLength();
                path.style.strokeDasharray = length;
                path.style.strokeDashoffset = length;
            }
        });
    }
    
    triggerSectionAnimation(sectionNumber) {
        this.clearAnimationTimers();
        
        switch(sectionNumber) {
            case '1':
                this.animateSection1();
                break;
            case '2':
                this.animateSection2();
                break;
            case '3':
                this.animateSection3();
                break;
        }
    }
    
    animateSection1() {
        const section = document.querySelector('[data-section="1"]');
        const tiles = {
            devis: section.querySelector('[data-tile="devis"]'),
            materiaux: section.querySelector('[data-tile="materiaux"]'),
            temps: section.querySelector('[data-tile="temps"]'),
            marge: section.querySelector('[data-tile="marge"]'),
            decisions: section.querySelector('[data-tile="decisions"]')
        };
        
        // Phase 1: Apparition des coûts (problèmes)
        this.animationTimers.push(setTimeout(() => {
            tiles.devis.classList.add('active', 'fade-in');
        }, 0));
        
        this.animationTimers.push(setTimeout(() => {
            tiles.materiaux.classList.add('active', 'fade-in');
        }, 200));
        
        this.animationTimers.push(setTimeout(() => {
            tiles.temps.classList.add('active', 'fade-in');
        }, 400));
        
        // Phase 2: Connexions vers la solution
        this.animationTimers.push(setTimeout(() => {
            this.animateConnections(section, ['devis', 'materiaux', 'temps'], 'marge');
        }, 1200));
        
        // Phase 3: Révélation de la solution
        this.animationTimers.push(setTimeout(() => {
            tiles.marge.classList.add('active', 'fade-in', 'glow');
        }, 2000));
        
        // Phase 4: Bénéfice final
        this.animationTimers.push(setTimeout(() => {
            this.animateConnection(section, 'marge', 'decisions');
        }, 2800));
        
        this.animationTimers.push(setTimeout(() => {
            tiles.decisions.classList.add('active', 'fade-in');
        }, 3200));
    }
    
    animateSection2() {
        const section = document.querySelector('[data-section="2"]');
        const tiles = {
            fournisseurs: section.querySelector('[data-tile="fournisseurs"]'),
            charges: section.querySelector('[data-tile="charges"]'),
            factures: section.querySelector('[data-tile="factures"]'),
            previsionnel: section.querySelector('[data-tile="previsionnel"]'),
            serenite: section.querySelector('[data-tile="serenite"]')
        };
        
        // Phase 1: Les sorties d'argent
        this.animationTimers.push(setTimeout(() => {
            tiles.fournisseurs.classList.add('active', 'fade-in');
            tiles.charges.classList.add('active', 'fade-in');
        }, 0));
        
        // Phase 2: L'entrée incertaine (clignotement)
        this.animationTimers.push(setTimeout(() => {
            tiles.factures.classList.add('active', 'fade-in');
            this.addBlinkingEffect(tiles.factures);
        }, 600));
        
        // Phase 3: Convergence vers la solution
        this.animationTimers.push(setTimeout(() => {
            this.animateConnections(section, ['fournisseurs', 'charges', 'factures'], 'previsionnel');
        }, 1400));
        
        // Phase 4: La solution Stratégo
        this.animationTimers.push(setTimeout(() => {
            tiles.previsionnel.classList.add('active', 'fade-in', 'glow');
            this.removeBlinkingEffect(tiles.factures);
            this.solidifyConnections(section, ['fournisseurs', 'charges', 'factures']);
        }, 2200));
        
        // Phase 5: Le bénéfice final
        this.animationTimers.push(setTimeout(() => {
            this.animateConnection(section, 'previsionnel', 'serenite');
        }, 3000));
        
        this.animationTimers.push(setTimeout(() => {
            tiles.serenite.classList.add('active', 'fade-in');
        }, 3400));
    }
    
    animateSection3() {
        const section = document.querySelector('[data-section="3"]');
        const tiles = {
            doute: section.querySelector('[data-tile="doute"]'),
            investissement: section.querySelector('[data-tile="investissement"]'),
            recrutement: section.querySelector('[data-tile="recrutement"]'),
            conseil: section.querySelector('[data-tile="conseil"]'),
            croissance: section.querySelector('[data-tile="croissance"]')
        };
        
        // Phase 1: Le dilemme central
        this.animationTimers.push(setTimeout(() => {
            tiles.doute.classList.add('active', 'fade-in', 'pulse');
        }, 0));
        
        // Phase 2: Les choix difficiles
        this.animationTimers.push(setTimeout(() => {
            this.animateConnections(section, ['doute'], 'investissement');
            this.animateConnections(section, ['doute'], 'recrutement');
        }, 800));
        
        this.animationTimers.push(setTimeout(() => {
            tiles.investissement.classList.add('active', 'fade-in');
            tiles.recrutement.classList.add('active', 'fade-in');
        }, 1200));
        
        // Phase 3: L'intervention de Stratégo
        this.animationTimers.push(setTimeout(() => {
            // Animation spéciale : ligne bleue qui "frappe" le doute
            this.animateInterventionLine(section, 'conseil', 'doute');
        }, 2000));
        
        // Phase 4: Élimination du doute et révélation de la solution
        this.animationTimers.push(setTimeout(() => {
            tiles.doute.classList.remove('active', 'pulse');
            tiles.doute.style.opacity = '0.3';
            tiles.conseil.classList.add('active', 'fade-in', 'glow');
            this.hideConnections(section, ['doute']);
        }, 2600));
        
        // Phase 5: Le bénéfice final
        this.animationTimers.push(setTimeout(() => {
            this.animateConnection(section, 'conseil', 'croissance');
        }, 3400));
        
        this.animationTimers.push(setTimeout(() => {
            tiles.croissance.classList.add('active', 'fade-in');
        }, 3800));
    }
    
    animateConnection(section, fromTile, toTile) {
        const path = section.querySelector(`[data-from="${fromTile}"][data-to="${toTile}"]`);
        if (path) {
            path.classList.add('active');
        }
    }
    
    animateConnections(section, fromTiles, toTile) {
        fromTiles.forEach((fromTile, index) => {
            setTimeout(() => {
                this.animateConnection(section, fromTile, toTile);
            }, index * 200);
        });
    }
    
    animateInterventionLine(section, fromTile, toTile) {
        const path = section.querySelector(`[data-from="${fromTile}"][data-to="${toTile}"]`);
        if (path) {
            path.classList.add('intervention', 'active');
        }
    }
    
    hideConnections(section, tiles) {
        tiles.forEach(tile => {
            const connections = section.querySelectorAll(`[data-from="${tile}"], [data-to="${tile}"]`);
            connections.forEach(connection => {
                if (!connection.classList.contains('intervention')) {
                    connection.style.opacity = '0';
                }
            });
        });
    }
    
    solidifyConnections(section, tiles) {
        tiles.forEach(tile => {
            const connections = section.querySelectorAll(`[data-from="${tile}"]`);
            connections.forEach(connection => {
                connection.classList.remove('dashed');
                connection.classList.add('solution-line');
            });
        });
    }
    
    addBlinkingEffect(tile) {
        tile.style.animation = 'pulse 1.5s infinite';
    }
    
    removeBlinkingEffect(tile) {
        tile.style.animation = '';
    }
    
    bindEvents() {
        // Événements de redimensionnement
        window.addEventListener('resize', () => {
            this.debounce(() => {
                this.setupSVGPaths();
            }, 250)();
        });
        
        // Événements de clic sur les tuiles pour des interactions supplémentaires
        document.addEventListener('click', (e) => {
            if (e.target.closest('.tile')) {
                const tile = e.target.closest('.tile');
                this.handleTileClick(tile);
            }
        });
    }
    
    handleTileClick(tile) {
        // Ajouter un effet de clic
        tile.style.transform = 'scale(0.95)';
        setTimeout(() => {
            tile.style.transform = '';
        }, 150);
    }
    
    clearAnimationTimers() {
        this.animationTimers.forEach(timer => clearTimeout(timer));
        this.animationTimers = [];
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Utilitaires pour les animations CSS personnalisées
class AnimationUtils {
    static addGlowEffect(element, color = 'rgba(58, 143, 255, 0.6)') {
        element.style.boxShadow = `0 0 20px ${color}`;
    }
    
    static removeGlowEffect(element) {
        element.style.boxShadow = '';
    }
    
    static addPulseEffect(element) {
        element.classList.add('pulse');
    }
    
    static removePulseEffect(element) {
        element.classList.remove('pulse');
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const map = new InteractiveMap();
    
    // Ajouter quelques interactions supplémentaires
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('mouseenter', () => {
            if (tile.classList.contains('active')) {
                AnimationUtils.addGlowEffect(tile);
            }
        });
        
        tile.addEventListener('mouseleave', () => {
            tile.style.boxShadow = '';
        });
    });
});

// Export pour utilisation dans d'autres scripts si nécessaire
window.InteractiveMap = InteractiveMap;
window.AnimationUtils = AnimationUtils;