import { formatNumber } from "../global/globalFunction";

export function constructReportNameLoan (dataLoanNew, status, filter) {

    let newReportName = 'Report Loan '

    if(status) {
        newReportName += `-${status} `
    }

    if(dataLoanNew && dataLoanNew[0] && dataLoanNew[0].bank_name) {
        newReportName += `(${dataLoanNew[0].bank_name})`
    }

    if(filter) {
        newReportName += ` ${filter}`
    }

    return `${newReportName}.csv`;
}

export function constructHeaderDataLoan (dataLoanNew) {
    
    const headerCsv = [
        { label:'ID Pinjaman', key:'id'},
        { label:'Nama Nasabah', key:'borrower_name'},
        { label:'Rekening Bank', key:'bank_account'},
        { label:'Tujuan Pinjaman', key:'loan_intention'},
        { label:'Tujuan Pinjaman Detail', key:'intention_details'},
        { label:'Penghasilan Bulanan', key:'monthly_income'},
        { label:'Penghasilan Lain-lain', key:'other_income'},
        { label:'Sumber Penghasilan Lain-lain', key:'other_incomesource'},
        { label:'Lama Cicilan', key:'installment'},
        { label:'Bunga (%)', key:'interest'},
        { label:'Pinjaman Pokok', key:'loan_amount'},
        { label:'Cicilan', key:'layaway_plan'},
    ]

    if(dataLoanNew) {
        const newFees = {};

        for(const key in dataLoanNew) {
            const fees = dataLoanNew[key].fees;

            if(fees) {
                for(const keyFee in fees) {
                    if(!newFees[keyFee]) {
                        newFees[keyFee] = keyFee;
                        const labelFee = keyFee.split('_');
                        let newLabel = '';
                        
                        for(const keyLabel in labelFee) {
                            newLabel += `${labelFee[keyLabel].substring(0,1).toUpperCase()}${labelFee[keyLabel].substring(1,labelFee[keyLabel].length)} ` 
                        }

                        headerCsv.push({
                            label: newLabel,
                            key: `fees.${keyFee}`,
                        })
                    }
                }
            }
            
        
        }
    }
    
    return headerCsv;
}

export function constructDataLoan (dataLoan, status) {

    const dataCsv = dataLoan;
    const csvNew = {};

    if(dataCsv) {
        
        for(const key in dataCsv) {

          let feesData = {};

          dataCsv[key].bank_account = `'${dataCsv[key].bank_account.toString()}`;
          const loan_amount_float = parseInt(dataCsv[key].layaway_plan) !== 0 ? dataCsv[key].loan_amount.toString().split('.')[1] && dataCsv[key].loan_amount.toString().split('.')[1].substring(0,2) : '-';
          dataCsv[key].loan_amount = parseInt(dataCsv[key].layaway_plan) !== 0 ? `${formatNumber(parseInt(dataCsv[key].loan_amount))},${loan_amount_float || '00'}` : '-';
          const total_loan_float = dataCsv[key].total_loan.toString().split('.')[1] && dataCsv[key].total_loan.toString().split('.')[1].substring(0,2);
          dataCsv[key].total_loan = parseInt(dataCsv[key].layaway_plan) !== 0 ? `${formatNumber(parseInt(dataCsv[key].total_loan))},${total_loan_float || '00'}` : '-';
          const monthly_income_float = dataCsv[key].monthly_income.toString().split('.')[1] && dataCsv[key].monthly_income.toString().split('.')[1].substring(0,2);
          dataCsv[key].monthly_income = parseInt(dataCsv[key].layaway_plan) !== 0 ? `${formatNumber(parseInt(dataCsv[key].monthly_income))},${monthly_income_float || '00'}` : '-';
          const other_income_float = dataCsv[key].other_income.toString().split('.')[1] && dataCsv[key].other_income.toString().split('.')[1].substring(0,2);
          dataCsv[key].other_income = parseInt(dataCsv[key].layaway_plan) !== 0 ? `${formatNumber(parseInt(dataCsv[key].other_income))},${other_income_float || '00'}` : '-';
          const layaway_plan_float = dataCsv[key].layaway_plan.toString().split('.')[1] && dataCsv[key].layaway_plan.toString().split('.')[1].substring(0,2);
          dataCsv[key].layaway_plan = parseInt(dataCsv[key].layaway_plan) !== 0 ? `${formatNumber(parseInt(dataCsv[key].layaway_plan))},${layaway_plan_float || '00'}` : '-';

          const fees = dataCsv[key].fees;

          for(const keyFee in fees) {
            let desc = fees[keyFee] && fees[keyFee].description && fees[keyFee].description.toString().toLowerCase();

            while(desc && desc.includes(' ')) {
              desc = desc.replace(' ','_')
            }
            
            if(!feesData[desc] && fees[keyFee] && fees[keyFee].amount) {
              feesData[desc] = '';
              const fees_float = fees[keyFee] && fees[keyFee].amount && fees[keyFee].amount.toString().split('.')[1] && fees[keyFee].amount.toString().split('.')[1].substring(0,2);        
              feesData[desc] = desc && fees[keyFee] && fees[keyFee].amount && `${formatNumber(parseInt(fees[keyFee].amount))},${fees_float || '00'}`
              
            }
          }
          
          dataCsv[key].fees = feesData;
        }

        
    }

    csvNew.data = dataCsv;
    csvNew.header = constructHeaderDataLoan(dataCsv);
    csvNew.name = constructReportNameLoan(dataCsv, status)

    return csvNew;
}