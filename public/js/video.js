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
            const sec = document.getElementById("sec")
            const thumb = document.createElement("div")
            thumb.setAttribute("id", "thumb")
            thumb.innerHTML += `
                <img src="${response.thumb.url}">
                <h3>${response.title}</h3>
            `
            const quality = document.createElement("div")
            quality.setAttribute("class", "qualiDiv")
            response.quality.forEach(element => {
                quality.innerHTML+=`
                    <label class="quality" for="${element}"><p>${element}</p></label>
                    <input type="radio" class="quali" value="${element}" id="${element}" name="quality">
                `
            })
            const temp = document.createElement("div")
            temp.innerHTML += `
                Inicio:<input type="text" value="00:00:00" class="inputTemp" id="timeIni">
                Duração:<input type="text" value="00:00:00" class="inputTemp" id="duration"><br><br>
                <button id="download">Download</button>
            `
            temp.setAttribute("class", "temp")
            sec.appendChild(thumb)
            sec.appendChild(quality)
            sec.appendChild(temp)
            const download = document.getElementById("download")
            const inputTemp = document.getElementsByClassName("inputTemp")
            const inp = document.getElementsByClassName("quality")
            download.addEventListener("click",Download)
            Object.keys(inputTemp).forEach(n=>{
                inputTemp.item(n).addEventListener("input",(ev)=>{
                    let i = inputTemp.item(n).value
                    if(ev.data){
                        i = i.replace(/[\D]/g,"")
                        i = i.replace(/(\d+)(\d{2})(\d{2})/,"$1:$2:$3")
                        inputTemp.item(n).value = i.replace(/\d/,"")
                    }else{
                        i = i.replace(/[\D]/g,"")
                        i = "0"+i
                        inputTemp.item(n).value = i.replace(/(\d{2})(\d{2})(\d+)/,"$1:$2:$3")
                    }
                   
                })
            })
            let elements = []
            Object.keys(inp).forEach(el=>{
                elements.push(el)
                inp.item(el).addEventListener("click", (ev)=>{
                    elements.forEach(elem=>{
                        if(elem!=el){
                            inp.item(elem).style.color = "white"
                            inp.item(elem).style.border = "1px solid white"
                        }
                    })
                    inp.item(el).style.color = "rgb(21, 95, 255)"
                    inp.item(el).style.border = "1px solid rgb(21, 95, 255)"
                })
            })
        }
    }
    ajax.send(params)
}
function Download(){
    const duration = document.getElementById("duration").value
    const ini = document.getElementById("timeIni").value
    const quality = document.getElementsByName("quality")
    quality.forEach(el=>{
        if(el.checked){
            let params = `duration=${duration}&timeIni=${ini}&quality=${el.value}`
            let ajax = new XMLHttpRequest()
            ajax.open("POST", "http://localhost:8080/prepare")
            ajax.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
            ajax.onreadystatechange = ()=>{
                if(ajax.status === 200 && ajax.readyState === 4){
                    if(ajax.responseText == "success"){
                        window.location = "/download"
                    }
                }
            }
            ajax.send(params)
        }
    })
    
}