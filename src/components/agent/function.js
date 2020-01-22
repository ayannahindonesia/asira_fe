export function isRoleAccountExecutive (kategori) {
  let flag = false;

  if(kategori === 'account_executive') {
    flag = true;
  }

  return flag;
}

export function constructAgent (dataState, post) {
  let dataAgent = {
    name: dataState.agentName,
    email: dataState.email,
    phone: `62${dataState.phone}`,
    banks: isRoleAccountExecutive(dataState.kategori) ? [parseInt((dataState.bank[0] && dataState.bank[0].id) || dataState.instansi)] : redefineBank(dataState.bank, dataState.listBank),
    status: dataState.status ? 'active' : 'inactive',
  }

  if(post) {
    dataAgent.username = dataState.username;
    dataAgent.category = dataState.kategori;
    if(!isRoleAccountExecutive(dataState.kategori)) {
      dataAgent.agent_provider = parseInt(dataState.instansi)
    }
  }

  return dataAgent
}

export function redefineBank(dataBank) {
  let arrBank = [];

  for(const key in dataBank) {
    arrBank.push(parseInt((dataBank[key].id && dataBank[key].id) || dataBank[key]))
  }

  return arrBank;
}

export function destructAgent (dataAgent, list, dataBank) {
  const dataListAgent = list ? dataAgent : [dataAgent];

  for(const key in dataListAgent) {
    dataListAgent[key].status = dataListAgent[key].status && dataListAgent[key].status.toString().toLowerCase() === 'active' ? (list ? 'Aktif' : true) : (list ? 'Tidak Aktif' : false)
    dataListAgent[key].category_name = isRoleAccountExecutive(dataListAgent[key].category) ? 'Account Executive' : 'Agen'
    dataListAgent[key].agent_provider = isRoleAccountExecutive(dataListAgent[key].category) ? ((dataListAgent[key].banks && dataListAgent[key].banks[0]) || 0) : (dataListAgent[key].agent_provider && dataListAgent[key].agent_provider.Int64)
    dataListAgent[key].instansi = isRoleAccountExecutive(dataListAgent[key].category) ? findBanksName(dataListAgent[key].bank_names) : dataListAgent[key].agent_provider_name ;
    dataListAgent[key].banks_name = findBanksName(dataListAgent[key].bank_names);
    dataListAgent[key].banks = dataBank ? findBanks(dataListAgent[key].banks, dataBank) : dataListAgent[key].banks;
  }
  
  return list ? dataListAgent : dataListAgent[0];
}

export function findBanksName(listBank) {
  let bankName = '';

  for(const key in listBank) {
    if(bankName.trim().length !== 0) {
      bankName += ', ';
    }
    bankName += listBank[key]
  }

  return bankName;
}

export function findBanks(banks, dataListBank) {
  let bankNew = [];

  for(const keyBank in banks) {
    for(const key in dataListBank) {
      if(dataListBank[key].id && dataListBank[key].id.toString().toLowerCase() === banks[keyBank].toString().toLowerCase()){
        bankNew.push(dataListBank[key]);
        break;
      }
    }
  }

  return bankNew;
}
