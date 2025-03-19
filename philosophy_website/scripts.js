// Main JavaScript for Pirsig & Nietzsche Website

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Navigation Toggle
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');
    
    burger.addEventListener('click', () => {
        // Toggle Nav
        nav.classList.toggle('nav-active');
        
        // Animate Links
        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
        
        // Burger Animation
        burger.classList.toggle('toggle');
    });
    
    // Expandable Content for Philosopher Cards
    const expandButtons = document.querySelectorAll('.expand-btn');
    
    expandButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetId = button.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            
            if (targetContent.style.display === 'block') {
                targetContent.style.display = 'none';
                button.textContent = 'Learn More';
            } else {
                targetContent.style.display = 'block';
                button.textContent = 'Show Less';
            }
        });
    });
    
    // Quote Comparison Tool
    const themeSelect = document.getElementById('theme-select');
    const pirsigQuote = document.querySelector('.pirsig-quote p');
    const nietzscheQuote = document.querySelector('.nietzsche-quote p');
    const pirsigSource = document.querySelector('.pirsig-quote .quote-source');
    const nietzscheSource = document.querySelector('.nietzsche-quote .quote-source');
    
    // Quote database
    const quotes = {
        rationality: {
            pirsig: {
                text: "The truth knocks on the door and you say, 'Go away, I'm looking for the truth,' and so it goes away. Puzzling.",
                source: "- Robert M. Pirsig, Zen and the Art of Motorcycle Maintenance"
            },
            nietzsche: {
                text: "There are no facts, only interpretations.",
                source: "- Friedrich Nietzsche, Notebooks"
            }
        },
        experience: {
            pirsig: {
                text: "The real cycle you're working on is a cycle called yourself. The machine that appears to be 'out there' and the person that appears to be 'in here' are not two separate things.",
                source: "- Robert M. Pirsig, Zen and the Art of Motorcycle Maintenance"
            },
            nietzsche: {
                text: "We have art in order not to die of the truth.",
                source: "- Friedrich Nietzsche, The Will to Power"
            }
        },
        values: {
            pirsig: {
                text: "Quality is not a thing. It is an event... It is the event at which the subject becomes aware of the object.",
                source: "- Robert M. Pirsig, Zen and the Art of Motorcycle Maintenance"
            },
            nietzsche: {
                text: "The noble type of man experiences itself as determining values; it does not need approval; it judges, 'what is harmful to me is harmful in itself'; it knows itself to be that which first accords honor to things.",
                source: "- Friedrich Nietzsche, Beyond Good and Evil"
            }
        },
        greek: {
            pirsig: {
                text: "The Greeks didn't have a word for Quality as a separate entity, a separate thing in itself. What they had was the word aretê, which meant excellence in all things... When they tried to define aretê they found themselves talking about Quality.",
                source: "- Robert M. Pirsig, Zen and the Art of Motorcycle Maintenance"
            },
            nietzsche: {
                text: "With Socrates, Greek taste changes in favor of dialectics. What really happened there? Above all, a noble taste is thus vanquished; with dialectics the plebs come to the top.",
                source: "- Friedrich Nietzsche, Twilight of the Idols"
            }
        }
    };
    
    // Update quotes when theme is selected
    themeSelect.addEventListener('change', function() {
        const selectedTheme = this.value;
        const selectedQuotes = quotes[selectedTheme];
        
        pirsigQuote.textContent = selectedQuotes.pirsig.text;
        pirsigSource.textContent = selectedQuotes.pirsig.source;
        
        nietzscheQuote.textContent = selectedQuotes.nietzsche.text;
        nietzscheSource.textContent = selectedQuotes.nietzsche.source;
    });
    
    // Placeholder for Concept Explorer
    const conceptExplorerBtn = document.querySelector('#concept-explorer .tool-button');
    const conceptMapPlaceholder = document.querySelector('.concept-map-placeholder');
    
    conceptExplorerBtn.addEventListener('click', function() {
        // In a real implementation, this would initialize the concept map visualization
        conceptMapPlaceholder.innerHTML = '<p>Concept Explorer would be initialized here with a visualization library like D3.js</p>';
        
        // For demonstration purposes, show a simple placeholder
        const concepts = [
            { name: "Quality", philosopher: "Pirsig", related: ["Will to Power", "Aretē"] },
            { name: "Will to Power", philosopher: "Nietzsche", related: ["Quality", "Self-Overcoming"] },
            { name: "Classical Understanding", philosopher: "Pirsig", related: ["Apollonian"] },
            { name: "Romantic Understanding", philosopher: "Pirsig", related: ["Dionysian"] },
            { name: "Apollonian", philosopher: "Nietzsche", related: ["Classical Understanding"] },
            { name: "Dionysian", philosopher: "Nietzsche", related: ["Romantic Understanding"] }
        ];
        
        let conceptHTML = '<div class="concept-demo">';
        concepts.forEach(concept => {
            const philosopherClass = concept.philosopher.toLowerCase();
            conceptHTML += `<div class="concept-node ${philosopherClass}">
                <span class="concept-name">${concept.name}</span>
                <span class="concept-philosopher">${concept.philosopher}</span>
            </div>`;
        });
        conceptHTML += '</div>';
        
        conceptMapPlaceholder.innerHTML = conceptHTML;
    });
    
    // Placeholder for Timeline Explorer
    const timelineExplorerBtn = document.querySelector('#timeline-explorer .tool-button');
    const timelinePlaceholder = document.querySelector('.timeline-placeholder');
    
    timelineExplorerBtn.addEventListener('click', function() {
        // In a real implementation, this would initialize the timeline visualization
        timelinePlaceholder.innerHTML = '<p>Timeline Explorer would be initialized here with a timeline library</p>';
        
        // For demonstration purposes, show a simple placeholder
        const events = [
            { year: 1844, text: "Friedrich Nietzsche born", philosopher: "Nietzsche" },
            { year: 1872, text: "The Birth of Tragedy published", philosopher: "Nietzsche" },
            { year: 1883, text: "Thus Spoke Zarathustra (Part I) published", philosopher: "Nietzsche" },
            { year: 1887, text: "On the Genealogy of Morality published", philosopher: "Nietzsche" },
            { year: 1900, text: "Friedrich Nietzsche dies", philosopher: "Nietzsche" },
            { year: 1928, text: "Robert M. Pirsig born", philosopher: "Pirsig" },
            { year: 1974, text: "Zen and the Art of Motorcycle Maintenance published", philosopher: "Pirsig" },
            { year: 1991, text: "Lila: An Inquiry Into Morals published", philosopher: "Pirsig" },
            { year: 2017, text: "Robert M. Pirsig dies", philosopher: "Pirsig" }
        ];
        
        // Sort events chronologically
        events.sort((a, b) => a.year - b.year);
        
        let timelineHTML = '<div class="timeline-demo">';
        events.forEach(event => {
            const philosopherClass = event.philosopher.toLowerCase();
            timelineHTML += `<div class="timeline-event ${philosopherClass}">
                <span class="event-year">${event.year}</span>
                <span class="event-text">${event.text}</span>
            </div>`;
        });
        timelineHTML += '</div>';
        
        timelinePlaceholder.innerHTML = timelineHTML;
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            if (nav.classList.contains('nav-active')) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                navLinks.forEach(link => {
                    link.style.animation = '';
                });
            }
        });
    });
    
    // Add styles for the concept and timeline demos
    const style = document.createElement('style');
    style.textContent = `
        .concept-demo, .timeline-demo {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            justify-content: center;
            padding: 20px;
            background-color: #f5f5f5;
            border-radius: 4px;
            height: 100%;
            align-content: center;
        }
        
        .concept-node {
            padding: 10px 15px;
            border-radius: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
        
        .concept-node.pirsig {
            background-color: #d1e1f9;
            border: 2px solid #3a6ea5;
        }
        
        .concept-node.nietzsche {
            background-color: #f9d1d1;
            border: 2px solid #c25b56;
        }
        
        .concept-name {
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .concept-philosopher {
            font-size: 0.8rem;
            color: #666;
        }
        
        .timeline-demo {
            flex-direction: column;
            align-items: flex-start;
            overflow-y: auto;
            max-height: 280px;
        }
        
        .timeline-event {
            padding: 10px 15px;
            margin-bottom: 10px;
            border-radius: 4px;
            width: 100%;
            position: relative;
            padding-left: 80px;
        }
        
        .timeline-event.pirsig {
            background-color: #d1e1f9;
            border-left: 4px solid #3a6ea5;
        }
        
        .timeline-event.nietzsche {
            background-color: #f9d1d1;
            border-left: 4px solid #c25b56;
        }
        
        .event-year {
            font-weight: bold;
            position: absolute;
            left: 15px;
        }
        
        .event-text {
            display: block;
        }
    `;
    document.head.appendChild(style);
});
