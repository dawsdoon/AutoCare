import React from 'react'
import './CostCalculator.css'

const CostCalculator = ({ services }) => {
    
    const total = services.reduce((accumulator, service) => {

        const price = service.price || 0

        return accumulator + price

    }, 0)

    return (
        <div className="cost-calculator">
            <div className="cost-calculator-content">
                <span className="cost-label">Total Cost:</span>
                <span className="cost-total">${total.toFixed(2)}</span>
            </div>
        </div>
        )
}

export default CostCalculator
