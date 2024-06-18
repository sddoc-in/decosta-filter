import Users from "../interface/Users";
import setError from "./setError";

export default function validateUser(
  user: Users,
  cPassword?: string,
  checkPassword?: boolean
) {
  if (user.name === undefined || user.name === "") {
    return setError("First Name is required", "name");
  }
  if (user.name.length < 3) {
    return setError("First Name must be at least 3 characters", "name");
  }
  if (user.name.length > 20) {
    return setError("First Name must be less than 20 characters", "name");
  }
  if (user.username === undefined || user.username === "") {
    return setError("Username is required", "username");
  }
  if (user.username.length < 3) {
    return setError("Username must be at least 3 characters", "username");
  }
  if (user.username.length > 20) {
    return setError("Username must be less than 20 characters", "username");
  }
  if (user.role === undefined || user.role === "") {
    return setError("Role is required", "role");
  }
  if (user.email === undefined || user.email === "") {
    return setError("Email is required", "email");
  }
  if (!/\S+@\S+\.\S+/.test(user.email)) {
    return setError("Email address is invalid", "email");
  }
  if (checkPassword === true) {
    if (user.password === undefined || user.password === "") {
      return setError("Password is required", "password");
    }
    if (user.password.length < 8) {
      return setError("Password must be at least 8 characters", "password");
    }
    if (user.password.length > 20) {
      return setError("Password must be less than 20 characters", "password");
    }
    if (!/(?=.*[0-9])/.test(user.password)) {
      return setError("Password must contain a number", "password");
    }
    if (!/(?=.*[!@#$%^&*])/.test(user.password)) {
      return setError("Password must contain a special character", "password");
    }
    if (!/(?=.*[a-z])/.test(user.password)) {
      return setError("Password must contain a lowercase letter", "password");
    }
    if (!/(?=.*[A-Z])/.test(user.password)) {
      return setError("Password must contain an uppercase letter", "password");
    }
    if (!/(?=.*[a-zA-Z])/.test(user.password)) {
      return setError("Password must contain a letter", "password");
    }
    if (cPassword !== undefined && cPassword !== "") {
      if (cPassword === "") {
        return setError("Confirm Password is required", "confirmPassword");
      }
      if (cPassword !== user.password) {
        return setError("Password does not match", "confirmPassword");
      }
    }
  }

  return setError("", "", false);
}