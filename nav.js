fetch('nav.html')
.then(res => res.text())
.then(text => {
    let oldelem = document.querySelector("script#replace_with_navbar");
    let newelem = document.createElement("div");
    newelem.innerHTML = text;
    oldelem.parentNode.replaceChild(newelem,oldelem);
})

var menuList = document.getElementById("menuList");

menuList.style.maxHeight = "0px";

function togglemenu(){

    if(menuList.style.maxHeight == "0px")
    {   
        menuList.style.maxHeight = "130px";
    }
    else   
    {
        menuList.style.maxHeight = "0px";
    }
}