




export default function validatePass(password: string) {


    if (!password) {
        return "Password is required";
    } else if (password.length < 8) {
        return "Password must be 8 characters or more";
    } else if (password.length > 20) {
        return "Password must be 20 characters or less";
    } else if (!/[0-9]/.test(password)) {
        return "Password must contain a number";
    } else if (!/[!@#$%^&*(),.?":{}|<>]/g.test(password)) {
        return "Password must contain a special character";
    } else if (!/[a-z]/.test(password)) {
        return "Password must contain a lowercase letter";
    } else if (!/[A-Z]/.test(password)) {
        return "Password must contain an uppercase letter";
    } else if (!/(?=.*[a-zA-Z])/.test(password)) {
        return "Password must contain a letter";
    }
    return ""
}

