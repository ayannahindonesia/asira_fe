import React from 'react'
import { Redirect } from 'react-router-dom'
// import CheckBox from '../subComponent/CheckBox';
import { Grid } from '@material-ui/core';

import Loading from '../subComponent/Loading';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { withStyles } from '@material-ui/styles';
import { compose } from 'redux';
import { getPermintaanPinjamanDetailFunction } from '../permintaanPinjaman/saga';
import { formatNumber, handleFormatDate, findAmount } from '../global/globalFunction';
import { getTokenClient } from '../index/token';
import GridDetail from '../subComponent/GridDetail';
import TitleBar from '../subComponent/TitleBar';
import ActionComponent from '../subComponent/ActionComponent';

const styles = (theme) => ({
  container: {
    flexGrow: 1,
  },
});

class PencairanDetail extends React.Component{
    _isMounted = false;
    
    state = {
      diKlik:false,
      errorMessage:'',
      dataDetail: {},
      loanId: 0,
      disabled: true,
      loading: true,
    };

    componentDidMount(){
      this._isMounted = true;

      this.setState({
        loanId: this.props.match.params.idLoan,
      },() => {
        this.refresh();
      })
      
    }

    componentWillUnmount() {
      this._isMounted = false;
    }

    refresh = async function(){
      const param = {
        idLoan: this.state.loanId,
      };

      const data = await getPermintaanPinjamanDetailFunction(param, null);

      if(data) {    
          if(!data.error) {
            if(data.dataLender && data.dataLender.status && data.dataLender.disburse_status && data.dataLender.status.toString().toLowerCase() === 'approved' && data.dataLender.disburse_status.toString().toLowerCase() === 'confirmed') {
              this.setState({
                dataDetail: data.dataLender,
                dataBorrower: data.dataLender && data.dataLender.borrower_info,
                loading: false,
              })
            } else {
              this.setState({diKlik: true})
            }          
          } else {
            this.setState({
              errorMessage: data.error,
              loading: false,
            })
          }      
      }
    }

    btnCancel = ()=>{
      this.setState({diKlik:true})
    }
    UNSAFE_componentWillReceiveProps(newProps){
      this.setState({errorMessage:newProps.error})
    }

    render(){
        if(this.state.diKlik){
            return <Redirect to='/pencairanList'/>            
        } else if (this.state.loading){
          return(
            <Loading
                title={'Pencairan - Detail'}
            />
          )
        } else if(getTokenClient()){
            return(
              <Grid container className="containerDetail">

                <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                      
                  <TitleBar
                    title={'Pencairan - Detail'}
                  />

                </Grid>

                <Grid
                  item
                  sm={12} xs={12}
                  style={{padding:10, marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                >

                  <Grid container>
                    <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                      <ActionComponent
                        onCancel={this.btnCancel}
                      />
                    </Grid> 

                    <Grid item sm={12} xs={12} style={{color:'red'}}>
                      {this.state.errorMessage}
                    </Grid> 

                    {/* Title Section */}
                    <GridDetail
                      gridLabel={[4,5]}
                      background
                      noTitleLine
                      label={[
                        ['ID Pinjaman','Nama Nasabah'],
                        ['Rekening Pinjaman','Status Pinjaman'],
                        ['Kategori', 'Agen/ AE'],
                      ]}
                      data={this.state.dataDetail &&this.state.dataBorrower && [
                        [
                          this.state.dataDetail.id,
                          this.state.dataDetail.borrower_name
                        ],
                        [
                          this.state.dataBorrower.bank_accountnumber,
                          this.state.dataDetail.status && this.state.dataDetail.status.toString().toLowerCase() === 'approved' && this.state.dataDetail.disburse_status && this.state.dataDetail.disburse_status.toString().toLowerCase() === 'confirmed' ? {value:"Telah Dicairkan", color:'blue'}  : ''
                        ],
                        [
                          this.state.dataDetail.category && this.state.dataDetail.category === 'account_executive' ? 'Account Executive' : this.state.dataDetail.category === 'agent' ? 'Agen' : 'Personal',
                          `${this.state.dataDetail.agent_name?this.state.dataDetail.agent_name:"-"} (${this.state.dataDetail.agent_provider_name?this.state.dataDetail.agent_provider_name:"-"})`
                            
                        ]
                      ]}                 
                    />

                  {/* Detail Section */}
                  
                  <GridDetail
                    gridLabel={[4,5]}
                    label={[
                      ['Pinjaman Pokok','Tenor (Bulan)','Total Pinjaman','Angsuran Perbulan'],
                      ['Tujuan Pinjaman','Detail Tujuan','Tanggal Pengajuan','Tanggal Persetujuan' ],
                    ]}
                    data={this.state.dataDetail && [
                      [
                        "Rp. "+ formatNumber(parseInt(this.state.dataDetail.loan_amount)),
                        this.state.dataDetail.installment,
                        "Rp. "+formatNumber(parseInt(this.state.dataDetail.total_loan)),
                        "Rp. "+formatNumber(parseInt(this.state.dataDetail.layaway_plan)),
                      ],
                      [
                        this.state.dataDetail.loan_intention,
                        this.state.dataDetail.intention_details,
                        handleFormatDate(this.state.dataDetail.created_at),
                        handleFormatDate(this.state.dataDetail.updated_at),
                      ],
                      []
                    ]}                 
                  />

                 

                  {/* Fee Section */}

                  <GridDetail
                    gridLabel={[8]}
                    noEquals
                    label={[
                      ['','Imbal Hasil/ Bunga','Admin Fee','Convenience Fee'],
                      [
                        '(Jumlah)',
                        "Rp. "+formatNumber(this.state.dataDetail && this.state.dataDetail.loan_amount && this.state.dataDetail.interest && parseInt(this.state.dataDetail.interest * this.state.dataDetail.loan_amount / 100), true),
                        "Rp. "+formatNumber(findAmount(this.state.dataDetail && this.state.dataDetail.fees, 'Admin Fee',this.state.dataDetail && this.state.dataDetail.loan_amount,false), true),
                        "Rp. "+formatNumber(findAmount(this.state.dataDetail && this.state.dataDetail.fees, 'Convenience Fee',this.state.dataDetail && this.state.dataDetail.loan_amount,false), true)
                      ],
                      ['','','','']
                   
                    ]}
                    data={this.state.dataDetail && [
                      [
                        '<b>(%)',
                        `<b>${parseFloat(this.state.dataDetail.interest).toFixed(2)}%`,
                        `<b>${findAmount(this.state.dataDetail && this.state.dataDetail.fees, 'Admin Fee',this.state.dataDetail && this.state.dataDetail.loan_amount,true)}%`,
                        `<b>${findAmount(this.state.dataDetail && this.state.dataDetail.fees, 'Convenience Fee',this.state.dataDetail && this.state.dataDetail.loan_amount,true)}%`
                      ],
                      [' ',' ',' ',' '],
                      [' ',' ',' ',' '],
                      [' ',' ',' ',' '],
                    ]}   
                  />
                
                 
                  {/* Info Penghasilan Section */}


                  <GridDetail
                    title={'Info Penghasilan Saat Pengajuan'}
                    gridLabel={[3]}
                    label={[
                      ['Pendapatan perbulan','Penghasilan lain-lain (jika ada)','Sumber Penghasilan lain-lain','Tanggal Pencairan']
                    ]}
                    data={this.state.dataBorrower &&  this.state.dataDetail &&[
                      [
                        "Rp. "+formatNumber(this.state.dataBorrower && this.state.dataBorrower.monthly_income, true),
                        "Rp. "+ formatNumber(this.state.dataBorrower && this.state.dataBorrower.other_income, true),
                        this.state.dataBorrower && this.state.dataBorrower.other_incomesource,
                        this.state.dataDetail && this.state.dataDetail.disburse_date_changed ? 
                        handleFormatDate(this.state.dataDetail && this.state.dataDetail.disburse_date) : 
                        `${handleFormatDate(this.state.dataDetail && this.state.dataDetail.disburse_date)} ${this.state.dataDetail && this.state.dataDetail.disburse_date_changed ? <b>(Telah Diubah)</b> : ''}`
                      ],                      
                    ]}                 
                  />


                </Grid>
                </Grid>
              </Grid>
            )
        } else if(!getTokenClient()){
          return (
              <Redirect to='/login' />
          )    
        }
       
    }
}

export function mapDispatchToProps(dispatch) {
    return {
    //   getSourceTransaction: () => {
    //     dispatch(sourceTransactionRequest());
    //   },
    //   handleRedirect: (route) => {
    //     dispatch(push(route));
    //   },
    };
}
  
export const mapStateToProps = (state)=>{
  return{  
    // role: state.user.role,
    // id: state.user.id  
  }
  
}

const withConnect = connect(
    mapStateToProps,
    mapDispatchToProps
);

const withStyle = withStyles(styles);

export default compose(
    withConnect,
    withStyle,
    withRouter
  )(PencairanDetail);