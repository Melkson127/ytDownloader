class Searchbar extends HTMLElement{
    search
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
        //create div element
        const searchDiv = document.createElement("div")
        searchDiv.setAttribute("class", "searchDiv")
        //create span element
        const searchSpan = document.createElement("span")
        searchSpan.setAttribute("class", "searchSpan")
        //text content in span element
        const info = searchSpan.appendChild(document.createElement("span"))
        info.textContent = this.getAttribute("data-text")
        //create input text element
        const searchInput = document.createElement("input")
        searchInput.setAttribute("id","searchInput")
        searchInput.setAttribute("class", "searchInput")
        searchInput.placeholder = this.getAttribute("placeholder")
        //create button element
        const searchButton = document.createElement("button")
        searchButton.setAttribute("class", "searchButton")
        searchButton.setAttribute("id", "searchButton")
        const image = searchButton.appendChild(document.createElement("img"))
        image.src = this.getAttribute("icon")
        image.alt = "pesquisar"
        searchDiv.appendChild(searchInput)
        searchDiv.appendChild(searchButton)
        //style
        const style = document.createElement("link")
        style.rel = "stylesheet"
        style.href = "/css/components.css"
        console.log(this.getAttribute("sla"))
        this.shadowRoot.append(style,searchDiv,searchSpan)
        
    }

    
}
customElements.define('search-bar', Searchbar)