

(() => {
  let keyVlauesData = {};


  const fetchKeyValue = () => {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (items) => {
        resolve(items);
      });
    });
  }

  const observerCallback = function(mutationsList, observer) {
    for (let mutation of mutationsList) {
        if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    if (node.matches('input, textarea')) {
                        autocomplete(node)
                    } else {
                        const nestedInputs = node.querySelectorAll('input, textarea');
                        console.log(nestedInputs)
                        nestedInputs.forEach(input => {
                            autocomplete(input)
                        });
                    }
                }
            });
        }
    }
};

  chrome.runtime.onMessage.addListener(async (obj, sender, response) => {
    const { type } = obj;
    if (type == "NEW") {
      console.log('msg rcevd')
      keyVlauesData = await fetchKeyValue();
      const observer = new MutationObserver(observerCallback);
      observer.observe(document.body, { childList: true, subtree: true });
      /*initiate the autocomplete function on the "myInput" element, and pass along the countries array as possible autocomplete values:*/
      const inputlist = document.getElementsByTagName('input');
      Array.from(inputlist).forEach(i => {
        autocomplete(i);
      })
    } else if (type == "STORAGE_CHANGED") {
      console.log(obj)
      keyVlauesData[obj.key] = obj.newValue;
      const inputlist = document.getElementsByTagName('input');
      Array.from(inputlist).map(i => {
        autocomplete(i);
      })
    }
  });
  function autocomplete(inp) {
    let arr = Object.keys(keyVlauesData);
   
    var currentFocus;
    
    
    inp.addEventListener("input", function (e) {
      var a, b, i, val = this.value;
     
      closeAllLists();
      if (!val) { return false; }
      currentFocus = -1;
      
      a = document.createElement("DIV");
      
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      
      this.parentNode.appendChild(a);
     
      for (i = 0; i < arr.length; i++) {
       
        if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
        
          b = document.createElement("DIV");
          
          b.innerHTML = `<p>${keyVlauesData[arr[i]].length > 20
            ? keyVlauesData[arr[i]].substring(0, 20)
            : keyVlauesData[arr[i]]}
                  </p>`;

          b.innerHTML += `<p class='input-key'><strong> ${arr[i].substr(0, val.length)}</strong>${arr[i].substr(val.length)}</p> `;


          b.innerHTML += "<input type='hidden' value='" + keyVlauesData[arr[i]] + "'>";
          
          b.addEventListener("click", function (e) {
            inp.value = this.getElementsByTagName("input")[0].value;

            closeAllLists();
          });
          a.appendChild(b);
        }
      }
    });
    
    inp.addEventListener("keydown", function (e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
       
        currentFocus++;
        
        addActive(x);
      } else if (e.keyCode == 38) { 
        currentFocus--;
        
        addActive(x);
      } else if (e.keyCode == 13) {
        
        e.preventDefault();
        if (currentFocus > -1) {
         
          if (x) x[currentFocus].click();
        }
      }
    });
    function addActive(x) {
      
      if (!x) return false;
      
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
     
      x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
     
      for (var i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }
    function closeAllLists(elmnt) {
      
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
        if (elmnt != x[i] && elmnt != inp) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }
   
    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }


 

})();


