const INITIAL_STATE = {
    token:'',
    cookie:false,
    id: 0,
    name: "",
    type: "",
    address: "",
    province:"",
    city: "",
    services: [ ],
    pic_name: "",
    phone: "",
    join_date: ""
}

export default (state = INITIAL_STATE, action)=>{
    switch(action.type){
     
        case "LOGIN_SUCCESS":
            return{...INITIAL_STATE,
                id:action.payload.id,
                name:action.payload.name,
                type:action.payload.type,
                address:action.payload.address,
                province:action.payload.province,
                city:action.payload.city,
                services:action.payload.services,
                pic_name:action.payload.pic_name,
                phone:action.payload.phone,
                join_date:action.payload.join_date
            }
        case "RESET_USER":
                return{...INITIAL_STATE}
        default:
            return state 
    }
}