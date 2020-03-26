import React from 'react'
import { Redirect } from 'react-router-dom'
import './../../support/css/productEdit.css'
import DropDown from '../subComponent/DropDown';
import TitleBar from '../subComponent/TitleBar';
import { Grid, InputAdornment, FormControlLabel, Checkbox, TextField } from '@material-ui/core';
import {  detailProductFunction,detailServiceProductFunction} from './saga';
import { getAllLayananListFunction } from '../layanan/saga';
import { getTokenAuth, getTokenClient } from '../index/token';
import Loading from '../subComponent/Loading';
import { destructFees, destructSector, destructCollaterals, destructMandatory } from './function';
import ActionComponent from '../subComponent/ActionComponent';
import { formatNumber } from '../global/globalFunction';



class ProductDetail extends React.Component{
    _isMounted = false;

    state = {
        id: 0,
        namaProduct: '', 
        errorMessage:null,
        bankService:[],
        diKlik:false,
        check:true,
        asuransi: '',
        rentangFrom:'',
        rentangTo:'',
        timeFrom: '',
        timeTo: '',
        layanan:0,
        interest:'',
        tipeBunga:'fixed',
        loading:true,
        checkAuto:true,
        feeType:'deduct_loan',
        description:'',
        listTypeFee:[
            {
                id: 'deduct_loan',
                name: 'Potong dari Plafon'
            },
            {
                id: 'charge_loan',
                name: 'Tambah ke Cicilan'
            },
        ],
        agunan:[
            {
                label: '',
                type: '',
                value: '',
            }
        ],
        sektor:[
            {
                label: '',
                type: '',
                value: '',
            }
        ],
        fee:[
            {
                label: '',
                type: 'percent',
                value: '',
            }
        ],
        mandatory:[
            {
                label: '',
                type: 'textfield',
                value: '',
            }
        ],
        listRequired:[
            {
                id:'required',
                label:'Required'
            },
            {
                id:'optional',
                label:'Optional'
            },
            
        ],
        listType:[
            {
                id:'textfield',
                label:'Text Field'
            },
            {
                id:'dropdown',
                label:'Drop Down'
            },
            {
                id:'checkbox',
                label:'Checkbox'
            },    
            {
                id:'image',
                label:'Image'
            },      
        ],
        listInterestType:[
            {
                id:'percent',
                label:'Percent (%)'
            },
            {
                id:'rupiah',
                label:'Rupiah (IDR)'
            },
            
        ],
        listBunga:[
            {
                id: 'fixed',
                name: 'Fixed Anually'
            },
            {
                id: 'flat',
                name: 'Flat'
            },
            {
                id: 'onetimepay',
                name: 'One Time Loan'
            },
            {
                id: 'efektif_menurun',
                name: 'Efektif Menurun'
            },
        ]
    };

    componentDidMount(){
        this._isMounted = true
        this.getBankService()
        this.getProductDetailId()
    }

    componentWillUnmount (){
        this._isMounted = false
    }

    UNSAFE_componentWillReceiveProps(newProps){
        this.setState({errorMessage:newProps.error})
    }
       
    getProductDetailId = async function () {
        const id = this.props.match.params.id
        const data = await detailProductFunction({id},detailServiceProductFunction);

        if(data){
            if(!data.error){
                const dataProduct = data.dataProduct || [];

                const fees = destructFees(dataProduct.fees);
                const feeType = dataProduct.fees && dataProduct.fees[0] && dataProduct.fees[0].fee_method;
                const sektor = destructSector(dataProduct.financing_sector);
                const collaterals = destructCollaterals(dataProduct.collaterals)
                const mandatory = destructMandatory(dataProduct.form)

                this.setState({
                    tipeBunga:dataProduct.interest_type,
                    id: dataProduct.id,
                    namaProduct: dataProduct.name,
                    layanan: dataProduct.service_id,
                    check: dataProduct.status === 'active' ? true : false,
                    checkAuto: dataProduct.record_installment_details ? true : false,
                    interest: dataProduct.interest,
                    rentangFrom: dataProduct.min_loan,
                    rentangTo: dataProduct.max_loan,
                    timeFrom: dataProduct.min_timespan,
                    timeTo: dataProduct.max_timespan,
                    asuransi: dataProduct.assurance,
                    description: dataProduct.description,
                    feeType,
                    mandatory,
                    sektor,
                    fee: fees,
                    agunan: collaterals,
                    loading: false,
                })

            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }
    
    getBankService = async function () {
        const data = await getAllLayananListFunction({})
        if(data){
            if(!data.error){
                this.setState({bankService:data.layananList.data})
            }else{
                this.setState({errorMessage:data.error})
            }
        }
    }

    btnCancel = ()=>{
        this.setState({diKlik:true})
    }

    render(){
        
        if(this.state.diKlik){
            return <Redirect to='/produk'/>            

        } else if(this.state.loading) {
            return(
                <Loading
                    title={'Produk - Detail'}
                />
            )
            
             
        }else if(getTokenClient() && getTokenAuth()){
            return (
                <Grid container>

                    <Grid item sm={12} xs={12} style={{maxHeight:50}}>
                        
                        <TitleBar
                            title={'Produk - Detail'}
                        />

                    </Grid>
                    <Grid
                        item
                        sm={12} xs={12}
                        style={{padding:'20px', marginBottom:20, boxShadow:'0px -3px 25px rgba(99,167,181,0.24)', WebkitBoxShadow:'0px -3px 25px rgba(99,167,181,0.24)', borderRadius:'15px'}}                  
                    >
                        <Grid container>
                             {/* Action Button */}
                            <Grid item xs={12} sm={12} style={{display:'flex', justifyContent:'flex-end'}}>
                                <ActionComponent
                                    onCancel={this.btnCancel}
                                />
                            </Grid> 

                            {/* Error */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', color:'red'}}>
                                {this.state.errorMessage}
                            </Grid>
                           
                            {/* Nama Produk */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Nama Produk
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="namaProduct"
                                            value={this.state.namaProduct}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Layanan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                                        Layanan
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <DropDown
                                            value={this.state.layanan}
                                            label="name"
                                            data={this.state.bankService}
                                            id="id"
                                            labelName={"name"}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Bunga */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                                        Bunga
                                    </Grid>
                                    <Grid item xs={1} sm={1} style={{paddingTop:'12px', marginRight:'20px'}}>
                                        <TextField
                                            id="interest"
                                            value={formatNumber(parseFloat(this.state.interest).toFixed(2))}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">%</InputAdornment>,
                                            }}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item xs={3} sm={3} >
                                        <DropDown
                                            value={this.state.tipeBunga}
                                            label="name"
                                            data={this.state.listBunga}
                                            id="id"
                                            labelName={"name"}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>                       
                            {/* Jangka Waktu */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Jangka Waktu (Bulan)
                                    </Grid>
                                    <Grid item xs={1} sm={1} >
                                        <TextField
                                            id="timeFrom"
                                            value={formatNumber(this.state.timeFrom)}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item sm={1} xs={1} style={{paddingTop:'10px'}}>
                                        <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                                    </Grid>
                                    <Grid item xs={1} sm={1} >
                                        <TextField
                                            id="timeTo"
                                            value={formatNumber(this.state.timeTo)}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Rentang Nilai Pengajuan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Rentang Nilai Pengajuan
                                    </Grid>
                                    <Grid item xs={2} sm={2} >
                                        <TextField
                                            id="rentangFrom"
                                            value={formatNumber(this.state.rentangFrom)}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"> Rp </InputAdornment>,
                                            }}
                                            disabled
                                        />
                                    </Grid>
                                    <Grid item sm={1} xs={1} style={{paddingTop:'10px'}}>
                                        <hr style={{maxWidth:'10px',borderTop:'1px solid black'}}></hr>
                                    </Grid>
                                    <Grid item xs={2} sm={2} >
                                        <TextField
                                            id="rentangTo"
                                            value={formatNumber(this.state.rentangTo)}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            InputProps={{
                                                startAdornment: <InputAdornment position="start"> Rp </InputAdornment>,
                                            }}
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Asuransi */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Asuransi
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="asuransi"
                                            value={this.state.asuransi}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>   
                            {/* Tipe Fee */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'30px'}}>
                                        Tipe Biaya
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <DropDown
                                            value={this.state.feeType}
                                            label="name"
                                            data={this.state.listTypeFee}
                                            id="id"
                                            labelName={"name"}
                                            fullWidth
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Deskripsi */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'25px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'20px'}}>
                                        Deskripsi
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <TextField
                                            id="description"
                                            value={this.state.description}
                                            margin="dense"
                                            variant="outlined"
                                            fullWidth
                                            multiline
                                            disabled
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                            {/* Pantau Cicilan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                                        Pantau Cicilan
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.checkAuto}
                                                    color={this.state.checkAuto ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                />
                                            }
                                            label={'Pantau Cicilan'}
                                            disabled
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </Grid>       
                            
                            {/* Status */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px', marginBottom:'20px'}}>
                                <Grid container>
                                    <Grid item xs={4} sm={4} style={{paddingTop:'10px'}}>
                                        Status
                                    </Grid>
                                    <Grid item xs={4} sm={4} >
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={this.state.check}
                                                    color={this.state.check ? "primary":"default"}
                                                    value="default"
                                                    inputProps={{ 'aria-label': 'checkbox with default color' }}
                                                />
                                            }
                                            label={'Aktif'}
                                            disabled
                                        />
                                        
                                    </Grid>
                                </Grid>
                            </Grid> 
                            {/* Sektor Pembiayaan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={12} sm={12} >
                                        Sektor Pembiayaan
                                    </Grid>

                                    <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
                                        
                                        <Grid container>
                                        {
                                            this.state.sektor.map((sektorPerData, index) => {
                                                return (
                                                    <Grid item xs={3} sm={3} key={index} style={{marginRight:'20px'}}>
                                                        <Grid container> 
                                                            <Grid item xs={10} sm={10} style={{marginRight:'2px',paddingTop:'10px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    placeholder={'Sektor Pembiayaan'}
                                                                    value={sektorPerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    disabled
                                                                />
                                                            </Grid> 
                                                        </Grid>
                                                         
                                                    </Grid> 
                                                )
                                            },this)
                                        }
                                        </Grid>
                                        
                                    </Grid>                                         
                                    
                                </Grid>
                            </Grid>

                            {/* Agunan */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={12} sm={12} >
                                        Agunan
                                    </Grid>

                                    <Grid item xs={12} sm={12} style={{marginBottom:'10px'}}>
                                        
                                        <Grid container>
                                        {
                                            this.state.agunan.map((agunanPerData, index) => {
                                                return (
                                                    <Grid item xs={3} sm={3} key={index} style={{marginRight:'20px'}}>
                                                        <Grid container> 
                                                            <Grid item xs={10} sm={10} style={{marginRight:'2px',paddingTop:'10px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    placeholder={'Nama Agunan'}
                                                                    value={agunanPerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    disabled
                                                                />
                                                            </Grid> 
                                                        </Grid>
                                                         
                                                    </Grid> 
                                                )
                                            },this)
                                        }
                                        </Grid>
                                        
                                    </Grid>                                         
                                    
                                </Grid>
                            </Grid>
                            
                            {/* Biaya */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px'}}>
                                <Grid container>
                                    <Grid item xs={12} sm={12} >
                                        Biaya
                                    </Grid>

                                    {
                                        this.state.fee.map((feePerData, index) => {
                                            return (
                                                <Grid item xs={12} sm={12} key={index} style={{marginBottom:'10px'}}>
                                                    {
                                                        <Grid container>
                                                            <Grid item xs={3} sm={3} style={{marginRight:'20px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    placeholder={'Nama Fee'}
                                                                    value={feePerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    disabled
                                                                />
                                                            </Grid> 
                                                            
                                                            <Grid item xs={2} sm={2} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={feePerData.type}
                                                                    label="label"
                                                                    data={this.state.listInterestType}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </Grid>                                      
                                                        
                                                            
                                                            <Grid item xs={2} sm={2} style={{marginRight:'10px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    placeholder={'Amount'}
                                                                    value={feePerData.type === 'percent' ? formatNumber(parseFloat(feePerData.value).toFixed(2)) : formatNumber(feePerData.value)}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    disabled
                                                                />
                                                            </Grid>          
                                                            
                                                        </Grid>
                                                    }
                                                </Grid>
                                            )

                                        },this)
                                    }
                                </Grid>
                            </Grid>
                            {/* Form */}
                            <Grid item xs={12} sm={12} style={{fontSize:'20px', padding:'0px 10px 10px',marginBottom:'15px'}}>
                                <Grid container>
                                    <Grid item xs={12} sm={12}>
                                        Form
                                    </Grid>
                        

                                    {
                                        this.state.mandatory.map((mandatoryPerData, index) => {
                                            return (
                                                <Grid item xs={12} sm={12} key={index} style={{marginBottom:'10px'}}>
                                                    {
                                                        <Grid container>
                                                            <Grid item xs={3} sm={3} style={{marginRight:'20px',paddingTop:'12px'}}>
                                                                <TextField 
                                                                    fullWidth
                                                                    placeholder={'Judul Pertanyaan'}
                                                                    value={mandatoryPerData.label}
                                                                    margin="dense"
                                                                    variant="outlined"
                                                                    disabled
                                                                />
                                                            </Grid> 
                                                            
                                                            <Grid item xs={2} sm={2} style={{marginRight:'20px'}}>
                                                                <DropDown
                                                                    value={mandatoryPerData.type}
                                                                    label="label"
                                                                    data={this.state.listType}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </Grid> 

                                                            <Grid item xs={2} sm={2} style={{marginRight:'10px'}}>
                                                                <DropDown
                                                                    value={mandatoryPerData.status}
                                                                    label="label"
                                                                    data={this.state.listRequired}
                                                                    id="id"
                                                                    labelName={"label"}
                                                                    fullWidth
                                                                    disabled
                                                                />
                                                            </Grid>                                      
                                                        
                                                            {
                                                                (mandatoryPerData.type === 'dropdown' || mandatoryPerData.type === 'checkbox')  &&
                                                                <Grid item xs={3} sm={3} style={{marginRight:'10px',paddingTop:'12px'}}>
                                                                    <TextField 
                                                                        fullWidth
                                                                        placeholder={'Pilihan Pertanyaan ex:albert,ganteng'}
                                                                        value={mandatoryPerData.value}
                                                                        margin="dense"
                                                                        variant="outlined"
                                                                        disabled
                                                                    />
                                                                </Grid> 
                                                            }       
                                                            
                                                        </Grid>
                                                    }
                                                </Grid>
                                            )

                                        },this)
                                    }
                                </Grid>
                            </Grid>

                        </Grid>

                    </Grid>

                </Grid>
            )
            
            
        } else if(getTokenAuth()){
            return (
                <Redirect to='/login' />
            )    
        } else {
            return null;
        }
    }
}

export default ProductDetail;