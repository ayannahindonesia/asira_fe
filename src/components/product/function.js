export function constructFees (dataFees, feeMethod) {
    let fees = [];

    for(const key in dataFees) {
        if(
            dataFees[key].label && dataFees[key].label.toString().trim().length > 0 &&
            dataFees[key].value && dataFees[key].value.toString().trim().length > 0 &&
            dataFees[key].type && dataFees[key].type.toString().trim().length > 0
        ) {
            fees.push(
                {
                    description: dataFees[key].label,
                    amount:`${dataFees[key].value}${dataFees[key].type === 'percent' ? '%':''}`,
                    fee_method: feeMethod,
                }
            )
        }
    }

    return fees.length > 0 ? fees : false;
}

export function constructCollaterals (dataCollaterals) {
    let collaterals = [];

    for(const key in dataCollaterals) {
        if(
            dataCollaterals[key].label && dataCollaterals[key].label.toString().trim().length > 0
        ) {
            collaterals.push(dataCollaterals[key].label)
        }
    }

    return collaterals.length > 0 ? collaterals : false;
}

export function constructSector (dataSector) {
    let sector = [];

    for(const key in dataSector) {
        if(
            dataSector[key].label && dataSector[key].label.toString().trim().length > 0
        ) {
            sector.push(dataSector[key].label)
        }
    }

    return sector.length > 0 ? sector : false;
}

export function constructMandatory (dataMandatory) {
    let mandatory = [];

    for(const key in dataMandatory) {
        if(
            dataMandatory[key].label && dataMandatory[key].label.toString().trim().length > 0 &&
            dataMandatory[key].type && dataMandatory[key].type.toString().trim().length > 0 
        ) {  
            const dataNew = dataMandatory[key];

            if(
                ((dataNew.type === 'dropdown' || dataNew.type === 'checkbox' ) && dataMandatory[key].value && dataMandatory[key].value.toString().trim().length > 0) ||
                (dataNew.type !== 'dropdown' && dataNew.type !== 'checkbox')
            ) {
                mandatory.push(dataNew)   
            } 

            
        }
    }

    return mandatory.length > 0 ? mandatory : false;
}

export function destructFees (dataFees) {
    let fees = [];

    if(dataFees && dataFees.length && dataFees.length > 0) {
        for(const key in dataFees) {
            fees.push({
                label:dataFees[key].description && dataFees[key].description.toString(),
                value:dataFees[key].amount && dataFees[key].amount.toString().includes('%') ? dataFees[key].amount.toString().replace('%',''):dataFees[key].amount,
                type:dataFees[key].amount && dataFees[key].amount.toString().includes('%') ? 'percent' : 'rupiah',
            })
        }
    } else {
        fees = [
            {
                label: '',
                type:'percent',
                value: '',
            }
        ]
    }
    

    return fees;
}

export function destructSector (dataSector) {
    let sector = [];

    if(dataSector && dataSector.length && dataSector.length > 0) {
        for(const key in dataSector) {
            sector.push({
                label:dataSector[key] && dataSector[key].toString(),
                value:'',
                type:'',
            })
        }
    } else {
        sector = [
            {
                label: '',
                type:'',
                value: '',
            }
        ]
    } 

    return sector;
}

export function destructCollaterals (dataCollaterals) {
    let collaterals = [];

    if(dataCollaterals && dataCollaterals.length && dataCollaterals.length > 0) {
        for(const key in dataCollaterals) {
            collaterals.push({
                label:dataCollaterals[key] && dataCollaterals[key].toString(),
                value:'',
                type:'',
            })
        }
    } else {
        collaterals = [
            {
                label: '',
                type:'',
                value: '',
            }
        ]
    } 

    return collaterals;
}

export function destructMandatory(dataMandatory) {
    let collaterals = [];

    if(dataMandatory && dataMandatory.length && dataMandatory.length > 0) {
        for(const key in dataMandatory) {
            collaterals.push(dataMandatory[key])
        }
    } else {
        collaterals = [
            {
                label: '',
                type: 'textfield',
                value: '',
                status: 'required',
            }
        ]
    } 

    return collaterals;
}