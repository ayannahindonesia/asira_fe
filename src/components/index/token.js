import SecureLS from 'secure-ls';
import md5 from 'md5';

const newLs = new SecureLS({encodingType: 'aes', isCompression: true, encryptionSecret:'react-secret'}); 

export function setTokenAuth(token) {
    newLs.set(md5('tokenAuth'), token);
}

export function setTokenClient(token, expires) {
    newLs.set(md5('tokenClient'), token);
    newLs.set(md5('tokenTime'), expires);
}

export function setTokenBorrower(tokenBorrower) {
    newLs.set(md5('tokenBorrower'), tokenBorrower);
}

export function setProfileUser(profileUser) {
    newLs.set(md5('profileUser'), profileUser);
}

export function getTokenAuth() {
    return newLs.get(md5('tokenAuth'));
}

export function getTokenClient() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();
    
    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }
    
    return newLs.get(md5('tokenClient'));
}

export function getTokenBorower() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();
    
    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }

    return newLs.get(md5('tokenBorrower'));
}

export function getProfileUser() {
    const newDateToken = new Date().getTime();
    const timeExpires = newLs.get(md5('tokenTime')) ? parseInt(newLs.get(md5('tokenTime'))) : new Date().getTime();
    
    if(newDateToken > timeExpires) {
        localStorage.clear();
        return null
    }

    return newLs.get(md5('profileUser'));
}