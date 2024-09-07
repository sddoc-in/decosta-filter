


function validateEmail(email: string): string {

    if(!email) return "Email is required";

    if(!email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) return "Invalid email";

    return "";

}


export default validateEmail;