// export const serverUrl="https://cors-anywhere.herokuapp.com/http://asira.ayannah.com/api-lender/"
// export const serverUrlBorrower="https://cors-anywhere.herokuapp.com/http://asira.ayannah.com/api-borrower/"

//export const serverUrl="https://virtserver.swaggerhub.com/ayannahindonesia/Asira_Lender/1.0.0/"
//export const serverUrl="http://asira-lender.ayannah.com/"

//  export const serverUrl="https://virtserver.swaggerhub.com/ayannahindonesia/Asira_Lender/1.0.0/"
//  export const serverUrlBorrower="https://cors-anywhere.herokuapp.com/http://asira.ayannah.com/api-borrower/"

export const serverUrl=window.location.origin.includes('asira') ? 
"http://asira.ayannah.com/api-lender/" :
"https://cors-anywhere.herokuapp.com/http://asira.ayannah.com/api-lender/";

export const serverUrlBorrower=window.location.origin.includes('asira') ? 
"http://asira.ayannah.com/api-borrower/" :
"https://cors-anywhere.herokuapp.com/http://asira.ayannah.com/api-borrower/";



