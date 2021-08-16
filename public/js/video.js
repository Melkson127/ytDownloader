const searchbar = document.getElementById("search").shadowRoot
const button = searchbar.getElementById("searchButton")
button.addEventListener("click", onSearch)
function onSearch(){
    const link = searchbar.getElementById("searchInput").value
    let params = `link=${link}`
    let ajax = new XMLHttpRequest()
    ajax.open("POST", "http://localhost:8080/getinfo")
    ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
    ajax.onreadystatechange = ()=>{
        if(ajax.status === 200 && ajax.readyState === 4){
            
            const response = JSON.parse(ajax.responseText)
            console.log(response.thumb.url)
            const img = document.createElement("img")
            img.src = response.thumb.url
            //searchDiv.insertBefore(img)
        }
    }
    ajax.send(params)
}