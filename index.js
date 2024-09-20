const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-passwordDisplay]");
const copybtn=document.querySelector("[data-copy]");

const copyMsg=document.querySelector("[data-copiedMsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numbersCheck=document.querySelector("#numbers");
const symbolsCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generatebtn=document.querySelector(".generatebutton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbol='~`!@#$%^&*()_-+={[}]|\:;"<,>.?/';

let password="";
let passwordLength=10;
let checkCount=0;
handleSlider();
//set strength circle color to gray


//set password length
function handleSlider(){
    inputSlider.value=passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min=inputSlider.min;
    const max=inputSlider.max;

    inputSlider.style.backgroundSize =((passwordLength - min)*100/(max - min)) + " %"
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    //shadow
    indicator.style.boxShadow = `0 0 12px 1px ${color}`;
}

setIndicator("#ccc");

function getRandomInteger(min , max){
    return Math.floor( Math.random() * (max-min)) + min ;
}

function generateRandomNumber(){
    return getRandomInteger(0 , 9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97 , 123));
}

function generateUpperCase(){
    return String.fromCharCode(getRandomInteger(65 , 91));
}

function generateSymbols(){
    const randomNo=getRandomInteger(0 , symbol.length);
    return symbol.charAt(randomNo);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNumber = false;
    let hasSymbol = false;

    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNumber = true;
    if (symbolsCheck.checked) hasSymbol = true;

    if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordLength >= 8) {
        setIndicator("#0f0");
    } else if (
        (hasLower || hasUpper) &&
        (hasNumber || hasSymbol) &&
        passwordLength >= 6
    ) {
        setIndicator("#ff0");
    } else {
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText='Failed';
    }
    
    //to make copy wala span visible
    copyMsg.classList.add("active");
    
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
    
}

function sufflePassword(array){
    // fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        //random j find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special condition

    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider(); 
    }
}


allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change' ,handleCheckBoxChange );
})


inputSlider.addEventListener('input',(e) => {
    passwordLength=e.target.value;
    handleSlider();
})

copybtn.addEventListener('click' , () =>{
    if(passwordDisplay.value){
        copyContent();
    }
})

generatebtn.addEventListener('click' , ()=> {
    // none of the checkbox are selected

    if(checkCount <= 0){
        return;
    }
    if(passwordLength < checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    //let's start the journey to find new password
    console.log("Starting the journey");
    //remove old password
    password="";

    //let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked){
    //     password +=generateUpperCase();
    // }

    // if(lowercaseCheck.checked){
    //     password +=generateLowerCase();
    // }

    // if(numbersCheck.checked){
    //     password +=generateRandomNumbere();
    // }

    // if(symbolsCheck.checked){
    //     password +=generateSymbols();
    // }

    let funArr=[];
    if(uppercaseCheck.checked){
        funArr.push(generateUpperCase);
    }

    if(lowercaseCheck.checked){
        funArr.push(generateLowerCase);
    }

    if(numbersCheck.checked){
        funArr.push(generateRandomNumber);
    }

    if(symbolsCheck.checked){
        funArr.push(generateSymbols);
    }

    //compulsary addition
    for(let i=0;i<funArr.length;i++){
        password +=funArr[i]();
    }
    console.log("Coumpulsary addition done");

    //remaining
    for(let i=0;i<passwordLength-funArr.length;i++){
        let randIdx=getRandomInteger(0 , funArr.length);
        password +=funArr[randIdx]();
    }
    console.log("Remaining addition done");

    //suffle the password

    password=sufflePassword(Array.from(password));
    console.log("Suffling done");

    //show in UI
    passwordDisplay.value=password;
    console.log("UI addition done");

    //calculate password

    calcStrength();

})