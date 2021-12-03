import { reactive, readonly } from "vue";
import { stringifyQuery } from "vue-router";

const loginstate = reactive({
    username: '',
    errormessage: '',
    isLoggedIn: false
})

export async function doLogin(user: string, password: string): Promise<boolean> {
    try {
        const userObj = {
            username: user,
            password: password
        }
    
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(userObj)
        })
    
        // API Call verarbeiten
        const responseData = response.text
        console.log(responseData)


    } catch(reason) {
        loginstate.errormessage = String(reason)
    }

    
    return false;
}

export function useLoginStore() {
    return {
        loginstate: readonly(loginstate),
        doLogin
    }
}