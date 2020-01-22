exports.GlobalFunction ={

    formatMoney:(number)=>
    { return number.toLocaleString('in-RP', {style : 'currency', currency: 'IDR'})}

} 
