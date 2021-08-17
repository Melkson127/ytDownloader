    const express = require("express")
    const app = express()
    const fs = require("fs")
    const ytdl = require("ytdl-core")
    const ffmpeg = require("fluent-ffmpeg")
    const flash = require("connect-flash")
    const session = require("express-session")
    const secret = require("./secret.json")
const { env } = require("process")
    app.use(express.urlencoded({ extended:  false }))
    app.use(express.static("./public"))
    app.use(express.json())
    app.use(session({
        secret: secret["secret"]||process.env.secret,
        resave: true,
        saveUninitialized: true
    }))
    app.use(flash())
    app.use((req,res,next)=>{
        res.locals.infoVideo = req.flash("infoVideo")
        res.locals.name = req.flash("name")
        next() 
    })
    app.get("/",(req,res)=>{
        res.sendFile("index.html")
    })
    app.post("/getInfo", (req,res)=>{
        const info = getInfo(req,res)
        if(info){
            info.then(info=>{
                let quality = info["formats"].filter(audio=>(audio.hasAudio == true && audio.hasVideo == true)).map(q=>q.quality)
                let title =  info["videoDetails"].title
                let thumbnail =  info["videoDetails"].thumbnails
                req.flash("infoVideo",info["formats"].filter(audio=>(audio.hasAudio == true)))
                req.flash("name",title)
                res.json({
                    quality: quality,
                    thumb: thumbnail[thumbnail.length -1],
                    title: title
                })
            })
        }
       
    })

    app.post("/prepare",async (req,res)=>{
        const quality = req.body.quality
        const info = res.locals.infoVideo
        const timeIni = req.body.timeIni
        const duration = req.body.duration
        const fileName = res.locals.name
        if(info){
            const getLink = info
            .filter(vid=>(vid.quality == quality))

            ffmpeg(getLink[0].url)
            .setStartTime(timeIni)
            .setDuration(duration)
            .output(`${__dirname}/tmp/${fileName}.mp4`,{end:true})
            .on("error", (err)=>console.log(err)).on("end", ()=>{
                console.log("sla")
                req.flash("name", fileName)
                res.send("success")
            }).run()
                
        }
    })


    app.get("/download", (req,res)=>{
        const fileName = res.locals.name
        res.download(`${__dirname}/tmp/${fileName}.mp4`,(err)=>{
            if(err){
                console.log("error:"+err)
            }else{
                fs.unlink(`${__dirname}/tmp/${fileName}.mp4`, (err) => {
                    if (err){
                        console.log(err)
                    }
                    console.log('path was deleted')
                })
            }
            
        })
    })
    function getInfo(req,res){
        const link = req.body.link
        if(!link || link == null || typeof link == undefined){
            res.send("dados invalidos")
        }else{
            if(ytdl.validateURL(link)){
                return ytdl.getInfo(link)
                
            }else{
                res.send("URL invalida")
            }
        }
    }
    
    app.listen(8080,()=>console.log("servidor funcionando"))