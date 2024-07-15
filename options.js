 const fetchKeyValue = () => {
        return new Promise((resolve) => {
          chrome.storage.sync.get(null, (items) => {
            resolve(items);
          });
        });
      }
    

(async()=>{

    const list_container = document.getElementsByClassName("key-value-list")[0]
   
    const arr = await fetchKeyValue();
    
    const hendleDelete = (btn,key) => {
      btn.addEventListener('click',(button) => {
        btn.parentNode.remove()
        console.log(key)
        chrome.storage.sync.remove(key, function() {
          console.log('Value removed from local storage');
        });
    })
    }
    for(key in arr){
        const element_li = document.createElement('li')
        const element_span = document.createElement('span')
        element_span.classList.add('key');
        element_span.innerText = `${key}:`;
        const element_span2 = document.createElement('span')
        element_span2.classList.add('value');
        element_span2.innerText = `${arr[key]}`
        const btn = document.createElement('button');
        btn.innerText = 'Delete';
        element_li.appendChild(element_span);
        element_li.appendChild(element_span2);
        element_li.appendChild(btn);
        hendleDelete(btn,key)
        list_container.appendChild(element_li);// += `<li><span class="key">${key}:</span> <span class="value">${arr[key]}</span><button>Delete</button></li>`
    }

    

})()