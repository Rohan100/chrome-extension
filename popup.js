(async () => {
    const btn = document.getElementById("btn-save");
    const btn_get = document.getElementById("btn-get");
    const keyInp = document.getElementById("key");
    const valueInp = document.getElementById("value");

    const data = {
        ukey : '',
        uvalue : ''
    }

    const handleGet =async () => {
        const value = await chrome.storage.sync.get(data.ukey);
        console.log(value)
        valueInp.value = value[data.ukey];
    } 
    const handleKeyInput = (e) => {
        data.ukey = e.target.value;
    }

    const handleValueInput = (e) => {
        data.uvalue = e.target.value;
    }

    const handleSave = () => {
        if(!setErrorMsg(data)){
            chrome.storage.sync.set({
                [data.ukey]: data.uvalue
            })
            data.ukey = '';
            data.uvalue = '';
            keyInp.value = '';
            valueInp.value = '';
        }
    }
    
    const  setErrorMsg = () => {
        const errorMsg = document.getElementById('error-msg');
        if(data.ukey.trim() == '' || data.uvalue.trim() == ''){
            errorMsg.classList.add('error');
            return true;
        }else{
            errorMsg.classList.remove('error');
            return false;
        }
    }

    keyInp.addEventListener('change',(e) => handleKeyInput(e,data));
    valueInp.addEventListener('change',(e) => handleValueInput(e,data));
    btn.addEventListener('click',() => handleSave());
    btn_get.addEventListener('click',() => handleGet())
})()






