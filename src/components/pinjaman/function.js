import {  handleFormatDate } from "../global/globalFunction";

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
        { label:'ID Agen', key:'borroweagent_idr_id'},
        { label:'Nama Agen', key:'agent_name'},
        { label:'Nama Kantor Agen', key:'agent_provider'},
        { label:'ID Nasabah', key:'borrower_id'},
        { label:'Nama Nasabah', key:'borrower_name'},
        { label:'Rekening Bank', key:'bank_account'},
        { label:'Tujuan Pinjaman', key:'loan_intention'},
        { label:'Tujuan Pinjaman Detail', key:'intention_details'},
        { label:'Penghasilan Bulanan', key:'monthly_income'},
        { label:'Penghasilan Lain-lain', key:'other_income'},
        { label:'Sumber Penghasilan Lain-lain', key:'other_incomesource'},
        { label:'Lama Cicilan', key:'installment'},
        { label:'ID Produk', key: 'product_id'},
        { label:'Produk', key: 'product_name'},
        { label:'Tipe Bunga', key: 'interest_type'},
        { label:'Bunga (%)', key:'interest'},
        { label:'Pinjaman Pokok', key:'loan_amount'},
        { label:'Cicilan', key:'layaway_plan'},
        { label:'Status Pinjaman', key:'status'},
        { label:'Catatan Pembayaran', key:'payment_note'},
        { label:'Alasan Penolakan', key:'reject_reason'},
        { label:'Tanggal Pengajuan', key:'created_at'},
        { label:'Tanggal Penerimaan', key:'approval_date'},
        { label:'Tanggal Pencairan', key:'disburse_date'},
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

            dataCsv[key].status = 
            dataCsv[key].payment_status === "failed"  ? 'Gagal Bayar' :
            dataCsv[key].payment_status === "paid"  ? 'Telah Bayar' :
            dataCsv[key].status ==="approved" && dataCsv[key].disburse_status === 'confirmed' ? 'Telah Cair' :
            dataCsv[key].status ==="approved" ? "Diterima" : 
            dataCsv[key].status==="rejected" ? "Ditolak" : 
            "Proses Pengajuan"

            dataCsv[key].created_at = `-${handleFormatDate(dataCsv[key].created_at)}-`;
            dataCsv[key].approval_date = `-${handleFormatDate(dataCsv[key].approval_date)}-`;
            dataCsv[key].disburse_date = `-${handleFormatDate(dataCsv[key].disburse_date)}-`;

            dataCsv[key].bank_account = `'${dataCsv[key].bank_account.toString()}`;
            dataCsv[key].loan_amount = parseInt(dataCsv[key].loan_amount) !== 0 ? parseFloat(dataCsv[key].loan_amount) : 0;          
            dataCsv[key].total_loan = parseInt(dataCsv[key].total_loan) !== 0 ? parseFloat(dataCsv[key].total_loan) : 0;
            dataCsv[key].monthly_income = parseInt(dataCsv[key].monthly_income) !== 0 ? parseFloat(dataCsv[key].monthly_income) : 0; 
            dataCsv[key].other_income = parseInt(dataCsv[key].other_income) !== 0 ? parseFloat(dataCsv[key].other_income) : 0;   
            dataCsv[key].layaway_plan = parseInt(dataCsv[key].layaway_plan) !== 0 ? parseFloat(dataCsv[key].layaway_plan).toFixed(2) : 0;

            const fees = dataCsv[key].fees;

            for(const keyFee in fees) {
                let desc = fees[keyFee] && fees[keyFee].description && fees[keyFee].description.toString().toLowerCase();

                while(desc && desc.includes(' ')) {
                desc = desc.replace(' ','_')
                }
                
                if(!feesData[desc] && fees[keyFee] && fees[keyFee].amount) {
                feesData[desc] = '';
                feesData[desc] = desc && fees[keyFee] && fees[keyFee].amount && parseFloat(fees[keyFee].amount).toFixed(2)
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