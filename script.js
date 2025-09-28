// Algo Strategy Builder - Interactive JavaScript
class StrategyBuilder {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 4;
        this.strategy = {
            conditions: [],
            action: {
                type: 'buy',
                quantity: 10,
                quantityType: 'shares'
            },
            risk: {
                stopLoss: 5,
                takeProfit: 15
            },
            name: '',
            description: ''
        };
        
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.updateUI();
        this.addDefaultCondition();
        this.updateVisualization();
        this.updateStrategyStats();
    }
    
    bindEvents() {
        // Navigation buttons
        document.getElementById('next-btn').addEventListener('click', () => this.nextStep());
        document.getElementById('prev-btn').addEventListener('click', () => this.prevStep());
        document.getElementById('save-draft-btn').addEventListener('click', () => this.saveDraft());
        
        // Add condition button
        document.getElementById('add-condition-btn').addEventListener('click', () => this.addCondition());
        
        // Order type buttons
        document.getElementById('buy-btn').addEventListener('click', () => this.setOrderType('buy'));
        document.getElementById('sell-btn').addEventListener('click', () => this.setOrderType('sell'));
        
        // Input change listeners
        document.getElementById('quantity-input').addEventListener('input', (e) => {
            this.strategy.action.quantity = parseInt(e.target.value) || 1;
            this.updateVisualization();
        });
        
        document.getElementById('quantity-type').addEventListener('change', (e) => {
            this.strategy.action.quantityType = e.target.value;
            this.updateVisualization();
        });
        
        // Risk management sliders and inputs
        this.bindRiskControls();
        
        // Strategy name and description
        document.getElementById('strategy-name').addEventListener('input', (e) => {
            this.strategy.name = e.target.value;
        });
        
        document.getElementById('strategy-description').addEventListener('input', (e) => {
            this.strategy.description = e.target.value;
        });
    }
    
    bindRiskControls() {
        const stopLossRange = document.getElementById('stop-loss-range');
        const stopLossInput = document.getElementById('stop-loss');
        const takeProfitRange = document.getElementById('take-profit-range');
        const takeProfitInput = document.getElementById('take-profit');
        
        // Stop Loss controls
        stopLossRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            stopLossInput.value = value;
            this.strategy.risk.stopLoss = value;
            this.updateVisualization();
            this.updateStrategyStats();
        });
        
        stopLossInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 1;
            stopLossRange.value = Math.min(value, 20);
            this.strategy.risk.stopLoss = value;
            this.updateVisualization();
            this.updateStrategyStats();
        });
        
        // Take Profit controls
        takeProfitRange.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            takeProfitInput.value = value;
            this.strategy.risk.takeProfit = value;
            this.updateVisualization();
            this.updateStrategyStats();
        });
        
        takeProfitInput.addEventListener('input', (e) => {
            const value = parseInt(e.target.value) || 1;
            takeProfitRange.value = Math.min(value, 50);
            this.strategy.risk.takeProfit = value;
            this.updateVisualization();
            this.updateStrategyStats();
        });
    }
    
    addDefaultCondition() {
        const condition = {
            indicator: 'SMA_50',
            operator: 'crosses_above',
            comparison: 'SMA_200'
        };
        this.strategy.conditions.push(condition);
        this.bindConditionEvents();
    }
    
    addCondition() {
        const conditionsContainer = document.getElementById('conditions-container');
        const conditionIndex = this.strategy.conditions.length;
        
        const conditionHTML = `
            <div class="condition-group p-4 border-2 border-dashed border-slate-200 rounded-lg hover:border-blue-300 transition-all" data-condition="${conditionIndex}">
                <label class="block text-sm font-semibold text-slate-700 mb-3">Condition ${conditionIndex + 1}</label>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <select class="indicator-select w-full p-3 border-2 rounded-lg bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                        <option value="SMA_50">SMA (50)</option>
                        <option value="SMA_20">SMA (20)</option>
                        <option value="EMA_20">EMA (20)</option>
                        <option value="EMA_50">EMA (50)</option>
                        <option value="RSI_14">RSI (14)</option>
                        <option value="MACD">MACD</option>
                        <option value="PRICE">Current Price</option>
                    </select>
                    <select class="operator-select w-full p-3 border-2 rounded-lg bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                        <option value="crosses_above">Crosses Above</option>
                        <option value="crosses_below">Crosses Below</option>
                        <option value="greater_than">Is Greater Than</option>
                        <option value="less_than">Is Less Than</option>
                        <option value="equals">Equals</option>
                    </select>
                    <select class="comparison-select w-full p-3 border-2 rounded-lg bg-white shadow-sm hover:border-blue-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all">
                        <option value="SMA_200">SMA (200)</option>
                        <option value="SMA_100">SMA (100)</option>
                        <option value="EMA_50">EMA (50)</option>
                        <option value="fixed_value">Fixed Value...</option>
                        <option value="PRICE">Current Price</option>
                    </select>
                </div>
                <button type="button" class="remove-condition-btn mt-3 text-red-500 hover:text-red-700 text-sm font-semibold">
                    ✕ Remove Condition
                </button>
            </div>
        `;
        
        conditionsContainer.insertAdjacentHTML('beforeend', conditionHTML);
        
        const condition = {
            indicator: 'SMA_50',
            operator: 'crosses_above',
            comparison: 'SMA_200'
        };
        this.strategy.conditions.push(condition);
        
        this.bindConditionEvents();
        this.updateVisualization();
        
        // Add animation to new condition
        const newCondition = conditionsContainer.lastElementChild;
        newCondition.style.animation = 'slideIn 0.5s ease-out';
    }
    
    bindConditionEvents() {
        const conditionGroups = document.querySelectorAll('.condition-group');
        
        conditionGroups.forEach((group, index) => {
            const indicatorSelect = group.querySelector('.indicator-select');
            const operatorSelect = group.querySelector('.operator-select');
            const comparisonSelect = group.querySelector('.comparison-select');
            const removeBtn = group.querySelector('.remove-condition-btn');
            
            // Remove existing event listeners to prevent duplicates
            const newIndicatorSelect = indicatorSelect.cloneNode(true);
            const newOperatorSelect = operatorSelect.cloneNode(true);
            const newComparisonSelect = comparisonSelect.cloneNode(true);
            
            indicatorSelect.parentNode.replaceChild(newIndicatorSelect, indicatorSelect);
            operatorSelect.parentNode.replaceChild(newOperatorSelect, operatorSelect);
            comparisonSelect.parentNode.replaceChild(newComparisonSelect, comparisonSelect);
            
            // Add new event listeners
            newIndicatorSelect.addEventListener('change', (e) => {
                if (this.strategy.conditions[index]) {
                    this.strategy.conditions[index].indicator = e.target.value;
                    this.updateVisualization();
                }
            });
            
            newOperatorSelect.addEventListener('change', (e) => {
                if (this.strategy.conditions[index]) {
                    this.strategy.conditions[index].operator = e.target.value;
                    this.updateVisualization();
                }
            });
            
            newComparisonSelect.addEventListener('change', (e) => {
                if (this.strategy.conditions[index]) {
                    this.strategy.conditions[index].comparison = e.target.value;
                    this.updateVisualization();
                }
            });
            
            if (removeBtn && index > 0) { // Don't allow removing the first condition
                removeBtn.addEventListener('click', () => this.removeCondition(index));
            } else if (removeBtn) {
                removeBtn.style.display = 'none';
            }
        });
    }
    
    removeCondition(index) {
        if (this.strategy.conditions.length <= 1) return;
        
        this.strategy.conditions.splice(index, 1);
        const conditionGroups = document.querySelectorAll('.condition-group');
        conditionGroups[index].remove();
        
        // Update condition labels
        document.querySelectorAll('.condition-group').forEach((group, i) => {
            const label = group.querySelector('label');
            label.textContent = `Condition ${i + 1}`;
            group.setAttribute('data-condition', i);
        });
        
        this.bindConditionEvents();
        this.updateVisualization();
    }
    
    setOrderType(type) {
        const buyBtn = document.getElementById('buy-btn');
        const sellBtn = document.getElementById('sell-btn');
        
        if (type === 'buy') {
            buyBtn.classList.add('active');
            sellBtn.classList.remove('active', 'sell-active');
            this.strategy.action.type = 'buy';
        } else {
            sellBtn.classList.add('active', 'sell-active');
            buyBtn.classList.remove('active');
            this.strategy.action.type = 'sell';
        }
        
        this.updateVisualization();
    }
    
    nextStep() {
        if (this.currentStep < this.totalSteps) {
            if (this.validateCurrentStep()) {
                this.currentStep++;
                this.updateUI();
                this.updateVisualization();
                
                if (this.currentStep === 4) {
                    this.updateStrategySummary();
                }
            }
        } else {
            this.saveStrategy();
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
            this.updateVisualization();
        }
    }
    
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.strategy.conditions.length > 0;
            case 2:
                return this.strategy.action.quantity > 0;
            case 3:
                return this.strategy.risk.stopLoss > 0 && this.strategy.risk.takeProfit > 0;
            case 4:
                return this.strategy.name.trim().length > 0;
            default:
                return true;
        }
    }
    
    updateUI() {
        // Update progress bar
        const progressBar = document.getElementById('progress-bar');
        const progress = (this.currentStep / this.totalSteps) * 100;
        progressBar.style.width = `${progress}%`;
        
        // Update navigation buttons
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        
        prevBtn.disabled = (this.currentStep === 1);
        
        if (this.currentStep === this.totalSteps) {
            nextBtn.textContent = '🚀 Save & Backtest';
            nextBtn.className = nextBtn.className.replace('primary', 'success');
        } else {
            nextBtn.textContent = 'Next →';
            nextBtn.className = nextBtn.className.replace('success', 'primary');
        }
        
        // Hide all form sections
        document.querySelectorAll('.form-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show current form section
        document.getElementById(`form-step-${this.currentStep}`).classList.add('active');
        
        // Update step indicators
        for (let i = 1; i <= this.totalSteps; i++) {
            const stepIndicator = document.getElementById(`step-${i}`);
            stepIndicator.classList.remove('active', 'completed');
            
            if (i < this.currentStep) {
                stepIndicator.classList.add('completed');
            } else if (i === this.currentStep) {
                stepIndicator.classList.add('active');
            }
        }
    }
    
    updateVisualization() {
        const visualizationText = document.getElementById('visualization-text');
        
        let text = '';
        
        switch (this.currentStep) {
            case 1:
                text = this.getConditionsText();
                break;
            case 2:
                text = this.getActionText();
                break;
            case 3:
                text = this.getRiskText();
                break;
            case 4:
                text = this.getFullStrategyText();
                break;
        }
        
        visualizationText.innerHTML = text;
        this.updateChart();
    }
    
    getConditionsText() {
        if (this.strategy.conditions.length === 0) {
            return 'Add conditions to see your entry signals';
        }
        
        const conditionTexts = this.strategy.conditions.map((condition, index) => {
            const indicator = this.formatIndicator(condition.indicator);
            const operator = this.formatOperator(condition.operator);
            const comparison = this.formatIndicator(condition.comparison);
            
            return `<strong>Condition ${index + 1}:</strong> ${indicator} ${operator} ${comparison}`;
        });
        
        return `<div class="space-y-2">${conditionTexts.join('<br>')}</div>`;
    }
    
    getActionText() {
        const actionType = this.strategy.action.type.toUpperCase();
        const quantity = this.strategy.action.quantity;
        const quantityType = this.formatQuantityType(this.strategy.action.quantityType);
        
        return `<strong>Action:</strong> ${actionType} ${quantity} ${quantityType}`;
    }
    
    getRiskText() {
        return `<strong>Risk Management:</strong><br>
                Stop Loss: ${this.strategy.risk.stopLoss}%<br>
                Take Profit: ${this.strategy.risk.takeProfit}%<br>
                Risk/Reward Ratio: 1:${(this.strategy.risk.takeProfit / this.strategy.risk.stopLoss).toFixed(1)}`;
    }
    
    getFullStrategyText() {
        return `<strong>Complete Strategy Preview:</strong><br>
                ${this.getConditionsText()}<br>
                ${this.getActionText()}<br>
                ${this.getRiskText()}`;
    }
    
    updateChart() {
        const chartContainer = document.getElementById('chart-container');
        
        // Simulate different chart states based on current step
        let chartHTML = '';
        
        switch (this.currentStep) {
            case 1:
                chartHTML = `
                    <div class="chart-placeholder w-full h-full flex items-center justify-center">
                        <div class="text-center">
                            <div class="text-6xl mb-4">📊</div>
                            <p class="text-slate-600 font-semibold">Indicators: ${this.strategy.conditions.length} conditions</p>
                            <p class="text-sm text-slate-500">Configure entry signals to see visualization</p>
                        </div>
                    </div>
                `;
                break;
            case 2:
                chartHTML = `
                    <div class="chart-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
                        <div class="text-center">
                            <div class="text-6xl mb-4">${this.strategy.action.type === 'buy' ? '📈' : '📉'}</div>
                            <p class="text-slate-600 font-semibold">${this.strategy.action.type.toUpperCase()} Signal Active</p>
                            <p class="text-sm text-slate-500">Quantity: ${this.strategy.action.quantity} ${this.formatQuantityType(this.strategy.action.quantityType)}</p>
                        </div>
                    </div>
                `;
                break;
            case 3:
                chartHTML = `
                    <div class="chart-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-green-50">
                        <div class="text-center">
                            <div class="text-6xl mb-4">🎯</div>
                            <p class="text-slate-600 font-semibold">Risk Management Active</p>
                            <p class="text-sm text-slate-500">Stop Loss: ${this.strategy.risk.stopLoss}% | Take Profit: ${this.strategy.risk.takeProfit}%</p>
                        </div>
                    </div>
                `;
                break;
            case 4:
                chartHTML = `
                    <div class="chart-placeholder w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50">
                        <div class="text-center">
                            <div class="text-6xl mb-4">✅</div>
                            <p class="text-slate-600 font-semibold">Strategy Complete</p>
                            <p class="text-sm text-slate-500">Ready for backtesting and deployment</p>
                        </div>
                    </div>
                `;
                break;
        }
        
        chartContainer.innerHTML = chartHTML;
    }
    
    updateStrategyStats() {
        const potentialSignals = document.getElementById('potential-signals');
        const riskReward = document.getElementById('risk-reward');
        
        // Calculate potential signals based on conditions
        const signals = Math.max(1, this.strategy.conditions.length * 3);
        potentialSignals.textContent = signals;
        
        // Calculate risk/reward ratio
        const ratio = (this.strategy.risk.takeProfit / this.strategy.risk.stopLoss).toFixed(1);
        riskReward.textContent = `1:${ratio}`;
    }
    
    updateStrategySummary() {
        const strategySummary = document.getElementById('strategy-summary');
        
        const conditionsText = this.strategy.conditions.map((condition, index) => {
            const indicator = this.formatIndicator(condition.indicator);
            const operator = this.formatOperator(condition.operator);
            const comparison = this.formatIndicator(condition.comparison);
            
            return `<div class="flex items-center space-x-2 mb-2">
                        <span class="font-mono text-blue-600 font-bold">IF</span>
                        <span class="font-semibold">${indicator}</span>
                        <span class="text-slate-600">${operator}</span>
                        <span class="font-semibold">${comparison}</span>
                    </div>`;
        }).join('');
        
        const actionColor = this.strategy.action.type === 'buy' ? 'text-green-600' : 'text-red-600';
        const actionText = `
            <div class="flex items-center space-x-2 mb-2">
                <span class="font-mono text-purple-600 font-bold">THEN</span>
                <span class="font-semibold ${actionColor}">${this.strategy.action.type.toUpperCase()}</span>
                <span class="font-semibold">${this.strategy.action.quantity}</span>
                <span class="text-slate-600">${this.formatQuantityType(this.strategy.action.quantityType)}</span>
            </div>
        `;
        
        const riskText = `
            <div class="flex items-center space-x-4 text-sm">
                <span class="flex items-center space-x-1">
                    <span class="font-mono text-red-600 font-bold">STOP</span>
                    <span class="font-semibold text-red-600">${this.strategy.risk.stopLoss}%</span>
                </span>
                <span class="flex items-center space-x-1">
                    <span class="font-mono text-green-600 font-bold">PROFIT</span>
                    <span class="font-semibold text-green-600">${this.strategy.risk.takeProfit}%</span>
                </span>
                <span class="text-slate-500">
                    (Risk/Reward: 1:${(this.strategy.risk.takeProfit / this.strategy.risk.stopLoss).toFixed(1)})
                </span>
            </div>
        `;
        
        strategySummary.innerHTML = conditionsText + actionText + riskText;
    }
    
    formatIndicator(indicator) {
        const indicators = {
            'SMA_50': 'SMA (50)',
            'SMA_20': 'SMA (20)',
            'SMA_200': 'SMA (200)',
            'SMA_100': 'SMA (100)',
            'EMA_20': 'EMA (20)',
            'EMA_50': 'EMA (50)',
            'RSI_14': 'RSI (14)',
            'MACD': 'MACD',
            'PRICE': 'Current Price',
            'fixed_value': 'Fixed Value'
        };
        return indicators[indicator] || indicator;
    }
    
    formatOperator(operator) {
        const operators = {
            'crosses_above': 'crosses above',
            'crosses_below': 'crosses below',
            'greater_than': 'is greater than',
            'less_than': 'is less than',
            'equals': 'equals'
        };
        return operators[operator] || operator;
    }
    
    formatQuantityType(type) {
        const types = {
            'shares': 'shares',
            'percent': '% of capital',
            'dollars': 'USD'
        };
        return types[type] || type;
    }
    
    saveDraft() {
        const draftData = {
            ...this.strategy,
            timestamp: new Date().toISOString(),
            step: this.currentStep
        };
        
        // In a real application, this would save to a backend
        // For now, we'll use localStorage simulation (but not actually use it as per instructions)
        console.log('Saving draft:', draftData);
        
        // Show user feedback
        const saveBtn = document.getElementById('save-draft-btn');
        const originalText = saveBtn.textContent;
        saveBtn.textContent = '✅ Saved!';
        saveBtn.classList.add('loading');
        
        setTimeout(() => {
            saveBtn.textContent = originalText;
            saveBtn.classList.remove('loading');
        }, 2000);
        
        this.showNotification('Draft saved successfully!', 'success');
    }
    
    saveStrategy() {
        if (!this.validateCurrentStep()) {
            this.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        const finalStrategy = {
            ...this.strategy,
            timestamp: new Date().toISOString(),
            id: this.generateId()
        };
        
        console.log('Saving final strategy:', finalStrategy);
        
        // Simulate saving process
        const saveBtn = document.getElementById('next-btn');
        saveBtn.classList.add('loading');
        saveBtn.textContent = 'Saving...';
        
        setTimeout(() => {
            this.showSuccessModal(finalStrategy);
            saveBtn.classList.remove('loading');
        }, 2000);
    }
    
    showSuccessModal(strategy) {
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
            <div class="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl animate-fade-in">
                <div class="text-center">
                    <div class="text-6xl mb-4">🎉</div>
                    <h2 class="text-2xl font-bold text-slate-800 mb-4">Strategy Created Successfully!</h2>
                    <p class="text-slate-600 mb-6">
                        "${strategy.name}" has been saved and is ready for backtesting.
                    </p>
                    <div class="space-y-3">
                        <button class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-xl font-bold hover:from-blue-600 hover:to-purple-600 transition-all">
                            Run Backtest
                        </button>
                        <button class="w-full bg-gray-100 text-slate-700 py-3 px-6 rounded-xl font-bold hover:bg-gray-200 transition-all" onclick="this.parentElement.parentElement.parentElement.parentElement.remove()">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Auto-remove modal after 10 seconds
        setTimeout(() => {
            if (document.body.contains(modal)) {
                modal.remove();
            }
        }, 10000);
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 animate-fade-in ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    generateId() {
        return 'strategy_' + Math.random().toString(36).substr(2, 9);
    }
}

// Initialize the Strategy Builder when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.strategyBuilder = new StrategyBuilder();
    
    // Add some extra interactive features
    addInteractiveFeatures();
});

function addInteractiveFeatures() {
    // Add hover effects to form elements
    const formInputs = document.querySelectorAll('input, select, button');
    formInputs.forEach(input => {
        if (!input.classList.contains('nav-btn')) {
            input.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-1px)';
                this.style.transition = 'transform 0.2s ease';
            });
            
            input.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        }
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            window.strategyBuilder.saveDraft();
        }
        
        if (e.key === 'ArrowRight' && e.altKey) {
            e.preventDefault();
            window.strategyBuilder.nextStep();
        }
        
        if (e.key === 'ArrowLeft' && e.altKey) {
            e.preventDefault();
            window.strategyBuilder.prevStep();
        }
    });
    
    // Add tooltips for better UX
    addTooltips();
}

function addTooltips() {
    const tooltips = {
        'stop-loss': 'The maximum percentage you\'re willing to lose on this trade',
        'take-profit': 'The target percentage profit at which to close the trade',
        'quantity-input': 'The amount to invest when the strategy triggers'
    };
    
    Object.keys(tooltips).forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.title = tooltips[id];
        }
    });
}