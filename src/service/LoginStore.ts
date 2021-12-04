import { reactive, readonly } from "vue";
import { stringifyQuery } from "vue-router";

const loginstate = reactive({
    username: '',
    errormessage: '',
    isLoggedIn: false
})

export function doLogout() {
    loginstate.username = ''
    loginstate.errormessage = ''
    loginstate.isLoggedIn = false
}

export async function doLogin(user: string, password: string): Promise<boolean> {
    console.log('doLogin() called')
    try {
        const userObj = {
            username: user,
            password: password
        }

        console.log(`UserObj: ${userObj}`)
    
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify(userObj)
        })
    
        // API Call verarbeiten
        const responseData = await response.json

        // Testing
        loginstate.username = user
        loginstate.errormessage = ''
        loginstate.isLoggedIn = true

        return true

    } catch(reason) {
        loginstate.errormessage = String(reason)

        return false
    }
}

export function useLoginStore() {
    return {
        loginstate: readonly(loginstate),
        doLogin,
        doLogout
    }
}