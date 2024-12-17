import http from "./http"

const api = {
    login:(data?:any)=>http.post("/login",data),
    test:(data?:any)=>http.post("/test",data),
    selectVideo:(data:object)=>http.post("/selectVideo",data),
    getDmByVid:(data:object)=>http.post("/getDmByVid",data),
    addDm:(data:object)=>http.post("/addDm",data)
}
export default api