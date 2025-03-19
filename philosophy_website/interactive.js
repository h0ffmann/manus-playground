// Interactive Concept Map for Pirsig-Nietzsche Philosophical Connections

class ConceptMap {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.width = this.container.clientWidth;
    this.height = 400;
    this.concepts = [];
    this.connections = [];
    this.initialize();
  }

  initialize() {
    // Create SVG container
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.svg.setAttribute("width", this.width);
    this.svg.setAttribute("height", this.height);
    this.svg.setAttribute("class", "concept-map");
    this.container.appendChild(this.svg);

    // Add concepts
    this.addConcept("Quality", "Pirsig", 150, 100);
    this.addConcept("Will to Power", "Nietzsche", 450, 100);
    this.addConcept("Classical", "Pirsig", 100, 250);
    this.addConcept("Romantic", "Pirsig", 200, 250);
    this.addConcept("Apollonian", "Nietzsche", 400, 250);
    this.addConcept("Dionysian", "Nietzsche", 500, 250);
    this.addConcept("Aretē", "Greek", 300, 50);
    this.addConcept("Subject-Object", "Shared", 300, 350);

    // Add connections
    this.addConnection("Quality", "Will to Power", "Parallel concepts");
    this.addConnection("Classical", "Apollonian", "Similar concepts");
    this.addConnection("Romantic", "Dionysian", "Similar concepts");
    this.addConnection("Quality", "Aretē", "Pirsig's interpretation");
    this.addConnection("Will to Power", "Aretē", "Nietzsche's interpretation");
    this.addConnection("Quality", "Subject-Object", "Rejects dualism");
    this.addConnection("Will to Power", "Subject-Object", "Rejects dualism");
    this.addConnection("Classical", "Romantic", "Pirsig's dichotomy");
    this.addConnection("Apollonian", "Dionysian", "Nietzsche's dichotomy");

    // Add interactivity
    this.addInteractivity();
  }

  addConcept(name, philosopher, x, y) {
    const concept = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      philosopher: philosopher,
      x: x,
      y: y
    };
    
    this.concepts.push(concept);
    
    // Create group for the concept
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", concept.id);
    g.setAttribute("class", `concept ${philosopher.toLowerCase()}`);
    g.setAttribute("transform", `translate(${x}, ${y})`);
    
    // Create circle
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", "30");
    g.appendChild(circle);
    
    // Create text for concept name
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dy", "0.3em");
    text.textContent = name;
    g.appendChild(text);
    
    // Create text for philosopher
    const philosopherText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    philosopherText.setAttribute("text-anchor", "middle");
    philosopherText.setAttribute("dy", "2em");
    philosopherText.setAttribute("class", "philosopher-label");
    philosopherText.textContent = philosopher;
    g.appendChild(philosopherText);
    
    this.svg.appendChild(g);
  }

  addConnection(source, target, label) {
    const sourceNode = this.concepts.find(c => c.name === source);
    const targetNode = this.concepts.find(c => c.name === target);
    
    if (!sourceNode || !targetNode) return;
    
    const connection = {
      source: sourceNode,
      target: targetNode,
      label: label
    };
    
    this.connections.push(connection);
    
    // Create line
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", sourceNode.x);
    line.setAttribute("y1", sourceNode.y);
    line.setAttribute("x2", targetNode.x);
    line.setAttribute("y2", targetNode.y);
    line.setAttribute("class", "connection");
    line.setAttribute("data-source", sourceNode.id);
    line.setAttribute("data-target", targetNode.id);
    
    // Create connection label
    const textX = (sourceNode.x + targetNode.x) / 2;
    const textY = (sourceNode.y + targetNode.y) / 2;
    
    const textBg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    textBg.setAttribute("x", textX - 50);
    textBg.setAttribute("y", textY - 10);
    textBg.setAttribute("width", "100");
    textBg.setAttribute("height", "20");
    textBg.setAttribute("class", "connection-label-bg");
    textBg.setAttribute("rx", "5");
    
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", textX);
    text.setAttribute("y", textY);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("dy", "0.3em");
    text.setAttribute("class", "connection-label");
    text.textContent = label;
    
    // Add elements to SVG
    this.svg.insertBefore(line, this.svg.firstChild); // Add lines to back
    this.svg.appendChild(textBg);
    this.svg.appendChild(text);
  }

  addInteractivity() {
    // Add hover effects for concepts
    const conceptNodes = this.svg.querySelectorAll(".concept");
    const connectionLines = this.svg.querySelectorAll(".connection");
    
    conceptNodes.forEach(node => {
      node.addEventListener("mouseenter", () => {
        const nodeId = node.id;
        
        // Highlight connected lines
        connectionLines.forEach(line => {
          if (line.getAttribute("data-source") === nodeId || 
              line.getAttribute("data-target") === nodeId) {
            line.classList.add("highlighted");
          }
        });
        
        // Highlight connected nodes
        conceptNodes.forEach(otherNode => {
          const otherId = otherNode.id;
          
          connectionLines.forEach(line => {
            if ((line.getAttribute("data-source") === nodeId && 
                 line.getAttribute("data-target") === otherId) ||
                (line.getAttribute("data-target") === nodeId && 
                 line.getAttribute("data-source") === otherId)) {
              otherNode.classList.add("connected");
            }
          });
        });
        
        node.classList.add("active");
      });
      
      node.addEventListener("mouseleave", () => {
        // Remove all highlights
        connectionLines.forEach(line => {
          line.classList.remove("highlighted");
        });
        
        conceptNodes.forEach(otherNode => {
          otherNode.classList.remove("connected");
          otherNode.classList.remove("active");
        });
      });
    });
  }
}

// Timeline Explorer for Pirsig-Nietzsche Philosophical Connections
class TimelineExplorer {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.events = [];
    this.initialize();
  }

  initialize() {
    // Create timeline container
    this.timelineEl = document.createElement("div");
    this.timelineEl.className = "timeline-explorer";
    this.container.appendChild(this.timelineEl);
    
    // Add timeline events
    this.addEvents();
    
    // Render timeline
    this.render();
    
    // Add controls
    this.addControls();
  }

  addEvents() {
    // Nietzsche events
    this.addEvent(1844, "Friedrich Nietzsche born in Röcken, Germany", "Nietzsche", "birth");
    this.addEvent(1869, "Appointed professor at University of Basel at age 24", "Nietzsche", "career");
    this.addEvent(1872, "Publishes 'The Birth of Tragedy'", "Nietzsche", "work", 
                  "Introduces the Apollonian/Dionysian dichotomy and critiques Socratic rationalism");
    this.addEvent(1878, "Publishes 'Human, All-Too-Human'", "Nietzsche", "work",
                  "Marks his break with Wagner and Schopenhauer");
    this.addEvent(1882, "Publishes 'The Gay Science'", "Nietzsche", "work",
                  "Contains the first mention of the 'death of God'");
    this.addEvent(1883, "Begins publishing 'Thus Spoke Zarathustra'", "Nietzsche", "work",
                  "Introduces the concepts of the Übermensch and the will to power");
    this.addEvent(1886, "Publishes 'Beyond Good and Evil'", "Nietzsche", "work",
                  "Critiques traditional philosophical assumptions");
    this.addEvent(1887, "Publishes 'On the Genealogy of Morality'", "Nietzsche", "work",
                  "Introduces the distinction between master and slave morality");
    this.addEvent(1889, "Mental collapse in Turin", "Nietzsche", "personal");
    this.addEvent(1900, "Friedrich Nietzsche dies", "Nietzsche", "death");
    
    // Pirsig events
    this.addEvent(1928, "Robert M. Pirsig born in Minneapolis, Minnesota", "Pirsig", "birth");
    this.addEvent(1950, "Studies Eastern philosophy at Benares Hindu University", "Pirsig", "education");
    this.addEvent(1961, "Begins teaching rhetoric at Montana State University", "Pirsig", "career");
    this.addEvent(1968, "Motorcycle journey with his son Chris", "Pirsig", "personal",
                  "The journey that would form the narrative framework for his first book");
    this.addEvent(1974, "Publishes 'Zen and the Art of Motorcycle Maintenance'", "Pirsig", "work",
                  "Introduces his concept of Quality and the classical/romantic dichotomy");
    this.addEvent(1991, "Publishes 'Lila: An Inquiry Into Morals'", "Pirsig", "work",
                  "Develops the Metaphysics of Quality (MOQ) framework");
    this.addEvent(2017, "Robert M. Pirsig dies", "Pirsig", "death");
    
    // Historical context events
    this.addEvent(1859, "Darwin publishes 'On the Origin of Species'", "Context", "historical");
    this.addEvent(1867, "Marx publishes 'Das Kapital'", "Context", "historical");
    this.addEvent(1914, "World War I begins", "Context", "historical");
    this.addEvent(1939, "World War II begins", "Context", "historical");
    this.addEvent(1945, "World War II ends", "Context", "historical");
    this.addEvent(1960, "Beginning of counterculture movement in the US", "Context", "historical");
  }

  addEvent(year, title, category, type, description = "") {
    this.events.push({
      year,
      title,
      category,
      type,
      description
    });
  }

  render() {
    // Clear timeline
    this.timelineEl.innerHTML = "";
    
    // Sort events chronologically
    this.events.sort((a, b) => a.year - b.year);
    
    // Create timeline line
    const line = document.createElement("div");
    line.className = "timeline-line";
    this.timelineEl.appendChild(line);
    
    // Add events to timeline
    this.events.forEach(event => {
      const eventEl = document.createElement("div");
      eventEl.className = `timeline-event ${event.category.toLowerCase()} ${event.type}`;
      
      // Calculate position based on year
      const startYear = this.events[0].year;
      const endYear = this.events[this.events.length - 1].year;
      const range = endYear - startYear;
      const position = ((event.year - startYear) / range) * 100;
      
      eventEl.style.left = `${position}%`;
      
      // Create event marker
      const marker = document.createElement("div");
      marker.className = "event-marker";
      eventEl.appendChild(marker);
      
      // Create event label
      const label = document.createElement("div");
      label.className = "event-label";
      label.textContent = `${event.year}: ${event.title}`;
      eventEl.appendChild(label);
      
      // Add description if available
      if (event.description) {
        const description = document.createElement("div");
        description.className = "event-description";
        description.textContent = event.description;
        eventEl.appendChild(description);
        
        // Show description on hover
        eventEl.addEventListener("mouseenter", () => {
          description.style.display = "block";
        });
        
        eventEl.addEventListener("mouseleave", () => {
          description.style.display = "none";
        });
      }
      
      this.timelineEl.appendChild(eventEl);
    });
  }

  addControls() {
    // Create filter controls
    const controls = document.createElement("div");
    controls.className = "timeline-controls";
    
    // Create category filters
    const categories = ["All", "Nietzsche", "Pirsig", "Context"];
    
    const categoryFilters = document.createElement("div");
    categoryFilters.className = "category-filters";
    
    categories.forEach(category => {
      const filter = document.createElement("button");
      filter.className = `filter-btn ${category.toLowerCase()}`;
      filter.textContent = category;
      
      filter.addEventListener("click", () => {
        // Remove active class from all buttons
        categoryFilters.querySelectorAll(".filter-btn").forEach(btn => {
          btn.classList.remove("active");
        });
        
        // Add active class to clicked button
        filter.classList.add("active");
        
        // Filter events
        if (category === "All") {
          this.timelineEl.querySelectorAll(".timeline-event").forEach(event => {
            event.style.display = "block";
          });
        } else {
          this.timelineEl.querySelectorAll(".timeline-event").forEach(event => {
            if (event.classList.contains(category.toLowerCase())) {
              event.style.display = "block";
            } else {
              event.style.display = "none";
            }
          });
        }
      });
      
      categoryFilters.appendChild(filter);
    });
    
    // Set "All" as default active filter
    categoryFilters.querySelector(".filter-btn.all").classList.add("active");
    
    controls.appendChild(categoryFilters);
    this.container.insertBefore(controls, this.timelineEl);
  }
}

// Initialize interactive features when DOM is loaded
document.addEventListener("DOMContentLoaded", function() {
  // Add CSS for interactive features
  const style = document.createElement("style");
  style.textContent = `
    /* Concept Map Styles */
    .concept-map-container {
      position: relative;
      height: 400px;
      background-color: #f9f9f9;
      border-radius: 8px;
      overflow: hidden;
    }
    
    .concept-map {
      width: 100%;
      height: 100%;
    }
    
    .concept circle {
      stroke-width: 2px;
      transition: all 0.3s ease;
    }
    
    .concept.pirsig circle {
      fill: #d1e1f9;
      stroke: #3a6ea5;
    }
    
    .concept.nietzsche circle {
      fill: #f9d1d1;
      stroke: #c25b56;
    }
    
    .concept.greek circle {
      fill: #e1f9d1;
      stroke: #6ea53a;
    }
    
    .concept.shared circle {
      fill: #f9f9d1;
      stroke: #a59e3a;
    }
    
    .concept text {
      font-size: 12px;
      font-weight: bold;
      pointer-events: none;
    }
    
    .concept .philosopher-label {
      font-size: 10px;
      fill: #666;
      font-style: italic;
    }
    
    .connection {
      stroke: #ccc;
      stroke-width: 2px;
      stroke-dasharray: 5, 5;
      transition: all 0.3s ease;
    }
    
    .connection.highlighted {
      stroke: #333;
      stroke-width: 3px;
      stroke-dasharray: none;
    }
    
    .connection-label-bg {
      fill: white;
      opacity: 0.8;
      display: none;
    }
    
    .connection-label {
      font-size: 10px;
      fill: #666;
      display: none;
    }
    
    .concept.active circle {
      r: 35;
      stroke-width: 3px;
    }
    
    .concept.connected circle {
      stroke-width: 3px;
    }
    
    /* Timeline Explorer Styles */
    .timeline-container {
      position: relative;
      height: 400px;
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 20px;
      overflow: hidden;
    }
    
    .timeline-explorer {
      position: relative;
      height: 300px;
      margin-top: 50px;
    }
    
    .timeline-line {
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 2px;
      background-color: #ccc;
    }
    
    .timelin<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>