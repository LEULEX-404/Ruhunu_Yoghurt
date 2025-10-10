/*import { createClient } from "@supabase/supabase-js"

const url = "https://tnygeegyssiymgunhsmv.supabase.co"
const key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRueWdlZWd5c3NpeW1ndW5oc212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2NTQ2NTMsImV4cCI6MjA3NDIzMDY1M30.tkVlccbxETMkgrVRE8ZXu2gKtg4Tz-nYaBD9Koj2W_Y"

const supabase = createClient(url, key)

export default function MediaUpload(file){

    const mediaUploadPromise = new Promise((resolve, reject) => {
        if(file == null){
            reject("No file rejected")
            return
        }

        const timeStamp = new Date().getTime()
        const newName = `${timeStamp}_${file.name}`;

        supabase.storage.from("images").upload(newName, file, {
            upsert : false,
            cacheControl : "3600"
        }).then(() => {
            const publicUrl = supabase.storage.from("images").getPublicUrl(newName).data.publicUrl
            resolve(publicUrl)
        }).catch((e) => {
            reject(`Supabase upload error: ${e.message || e}`)
        })
    })

    return mediaUploadPromise
}*/