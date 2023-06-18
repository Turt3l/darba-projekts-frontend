import jwtDecode from 'jwt-decode';
export default function IsAuthicitated() {
    
    const token = localStorage.getItem("token")
    if (token) {
        try {
            const decodeToken = jwtDecode(token)
            const currentTime = Date.now() / 1000
            
            console.log(token)
            if (decodeToken.exp < currentTime) {
                return false;
            }

            return true
        } catch (error) {
            return false
        }
    }
    return false
}