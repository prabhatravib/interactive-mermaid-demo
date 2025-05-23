/**
 * Interactive Mermaid Flowchart Handler
 * 
 * This script enables clicking on Mermaid flowchart nodes to navigate
 * to corresponding content sections with smooth scrolling and highlighting.
 * 
 * Author: Interactive Mermaid Demo
 * License: MIT
 */

class FlowchartInteractionHandler {
    constructor() {
        this.nodeToSectionMap = {
            'Check power connection': '#power-connection',
            'Reconnect power cable': '#reconnect-power',
            'Test different outlet': '#test-outlet',
            'Replace power supply': '#replace-psu',
            'Count beep pattern': '#beep-codes',
            'Look up beep code': '#lookup-beep',
            'Replace indicated component': '#replace-component',
            'Check internal connections': '#internal-connections',
            'Reseat RAM and cables': '#reseat-components',
            'Test different monitor': '#test-monitor',
            'Graphics card issue': '#graphics-issue',
            'Check boot device order': '#boot-order',
            'Run hardware diagnostics': '#hardware-diagnostics',
            'Boot from recovery media': '#recovery-media',
            'Repair or reinstall OS': '#repair-os'
        };
        
        this.init();
    }
    
    /**
     * Initialize the interactive flowchart system
     */
    init() {
        // Configure Mermaid
        this.initializeMermaid();
        
        // Set up click handlers after Mermaid renders
        this.setupClickHandlers();
    }
    
    /**
     * Configure and initialize Mermaid
     */
    initializeMermaid() {
        mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            securityLevel: 'loose',
            flowchart: {
                useMaxWidth: true,
                htmlLabels: true
            }
        });
        
        console.log('✅ Mermaid initialized');
    }
    
    /**
     * Set up click handlers for flowchart nodes
     */
    setupClickHandlers() {
        // Wait for Mermaid to render, then add click handlers
        setTimeout(() => {
            this.addClickHandlers();
        }, 2000);
        
        // Retry if needed (sometimes Mermaid takes longer)
        setTimeout(() => {
            if (this.getFlowchartNodes().length === 0) {
                console.log('🔄 Retrying click handler setup...');
                setTimeout(() => this.addClickHandlers(), 2000);
            }
        }, 4000);
    }
    
    /**
     * Find and return all flowchart nodes
     */
    getFlowchartNodes() {
        const flowchartContainer = document.querySelector('#troubleshoot-flowchart');
        if (!flowchartContainer) {
            console.warn('❌ Flowchart container not found');
            return [];
        }
        
        return flowchartContainer.querySelectorAll('.node');
    }
    
    /**
     * Add click handlers to interactive nodes
     */
    addClickHandlers() {
        const nodes = this.getFlowchartNodes();
        console.log(`🔍 Found ${nodes.length} flowchart nodes`);
        
        if (nodes.length === 0) {
            console.warn('❌ No flowchart nodes found for click handling');
            return;
        }
        
        // Process each node
        nodes.forEach((node, index) => {
            this.processNode(node, index);
        });
        
        // Also try SVG text elements as fallback
        this.addSVGTextHandlers();
        
        console.log('✅ Click handlers setup complete');
    }
    
    /**
     * Process individual flowchart node for interactivity
     */
    processNode(node, index) {
        const nodeText = this.getNodeText(node);
        console.log(`📝 Processing node ${index}: "${nodeText}"`);
        
        // Check if this node should be clickable
        const sectionId = this.findMatchingSection(nodeText);
        if (sectionId) {
            this.makeNodeClickable(node, nodeText, sectionId);
        }
    }
    
    /**
     * Extract text content from a node
     */
    getNodeText(node) {
        const textElement = node.querySelector('span') || 
                          node.querySelector('text') || 
                          node.querySelector('foreignObject') || 
                          node;
        
        return textElement.textContent ? textElement.textContent.trim() : '';
    }
    
    /**
     * Find matching section ID for node text
     */
    findMatchingSection(nodeText) {
        for (const [key, sectionId] of Object.entries(this.nodeToSectionMap)) {
            if (nodeText.includes(key)) {
                return sectionId;
            }
        }
        return null;
    }
    
    /**
     * Make a node clickable and interactive
     */
    makeNodeClickable(node, nodeText, sectionId) {
        console.log(`🎯 Making node clickable: "${nodeText}" → ${sectionId}`);
        
        // Add CSS class for styling
        node.classList.add('clickable-node');
        
        // Set cursor and tooltip
        node.style.cursor = 'pointer';
        node.title = `Click for detailed instructions: ${nodeText}`;
        
        // Add click event listener
        node.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log(`🔗 Node clicked: "${nodeText}" → ${sectionId}`);
            this.scrollToSection(sectionId);
        });
        
        // Log success
        console.log(`✅ Node "${nodeText}" is now clickable`);
    }
    
    /**
     * Handle SVG text elements as fallback method
     */
    addSVGTextHandlers() {
        const flowchartContainer = document.querySelector('#troubleshoot-flowchart');
        if (!flowchartContainer) return;
        
        const svgTexts = flowchartContainer.querySelectorAll('text');
        console.log(`🔍 Processing ${svgTexts.length} SVG text elements as fallback`);
        
        svgTexts.forEach((textEl) => {
            const text = textEl.textContent.trim();
            const sectionId = this.findMatchingSection(text);
            
            if (sectionId) {
                const parentNode = textEl.closest('.node') || textEl.parentElement;
                if (parentNode && !parentNode.hasAttribute('data-clickable')) {
                    parentNode.setAttribute('data-clickable', 'true');
                    parentNode.classList.add('clickable-node');
                    parentNode.style.cursor = 'pointer';
                    parentNode.addEventListener('click', (e) => {
                        e.preventDefault();
                        console.log(`🔗 SVG text clicked: "${text}" → ${sectionId}`);
                        this.scrollToSection(sectionId);
                    });
                    console.log(`✅ SVG fallback applied to: "${text}"`);
                }
            }
        });
    }
    
    /**
     * Smooth scroll to section and highlight it
     */
    scrollToSection(sectionId) {
        console.log(`📍 Scrolling to section: ${sectionId}`);
        
        const element = document.querySelector(sectionId);
        if (!element) {
            console.warn(`❌ Section not found: ${sectionId}`);
            return
