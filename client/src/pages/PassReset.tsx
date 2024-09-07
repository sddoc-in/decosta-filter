import React from 'react'
import {  useNavigate, useParams } from 'react-router-dom'
import SkyBidder from '../components/common/SkyBidder'
import FormInput from '../components/input/FormInput'
import { Button } from '@chakra-ui/react'
import { AppContext } from '../context/Context'
import axios from 'axios'
import { API_URL } from '../constants/data'
import InputPassword from '../components/input/InputPassword'

export default function PassReset() {

    const { email, uid } = useParams<{ email: string, uid: string }>()
    const navigate = useNavigate()
    const { raiseToast,setLoading } = React.useContext(AppContext);

    const [otp, setOtp] = React.useState<number>(0)
    const [newPass, setNewPass] = React.useState<string>("")
    const [confirmPass, setConfirmPass] = React.useState<string>("")
    const [otpValid, setOtpValid] = React.useState<boolean>(false)

    function handleOtp(e: React.ChangeEvent<HTMLInputElement>) {
        setOtp(parseInt(e.target.value))
    }

    function handleNewPass(e: React.ChangeEvent<HTMLInputElement>) {
        setNewPass(e.target.value)
    }

    function handleConfirmPass(e: React.ChangeEvent<HTMLInputElement>) {
        setConfirmPass(e.target.value)
    }

    async function validateOTP() {

        const params = new URLSearchParams({ email: email || "", otp: otp.toString() })

        try {
            setLoading(true)
            const data = await axios.get(API_URL + "/users/validate/otp?" + params)
                .then((res) => res.data)
                .catch((err) => {
                    raiseToast("OTP validation failed", "error")
                    return;
                });

            if (data.status === 200) {
                setOtpValid(true)
            } else {
                raiseToast(data.message, "error")
            }
        } catch (error) {
        }
        finally {
            setLoading(false)
        }
    }

    async function resetPassword() {

        if (newPass !== confirmPass) {
            raiseToast("Passwords do not match", "error")
            return;
        }

        try {
            setLoading(true)
            const data = await axios.put(API_URL + "/users/password/update", {
                email: email,
                password: newPass,
                uid: uid
            })
                .then((res) => res.data)
                .catch((err) => {
                    raiseToast("Password reset failed", "error")
                    return;
                });

            if (data.status === 200) {
                raiseToast(data.message, "success")
                navigate("/sign-in")
            }
        }
        catch (error) {
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <>
            <div className="relative w-full h-auto md:h-[100vh] overflow-hidden">
                <SkyBidder />
                <div className="w-full md:w-[65%] lg:w-[75%] pb-6 md:absolute top-[30%] md:top-0 right-0 bg-white h-full z-20 rounded-t-3xl lg:rounded-t-[unset] lg:rounded-l-[1.5rem!important] block pt-20 md:pt-0 md:flex items-center justify-center">
                    <div className="w-[80%] mx-auto">
                        <h1 className="text-black font-bold text-[32px]">
                            Reset Your Password
                        </h1>

                        <div className="w-full md:w-10/12 mx-auto text-start my-6">
                            <FormInput
                                label="Email"
                                name="email"
                                isRequired={true}
                                defaultValue={email}
                                isDisabled={true}
                            />

                            {
                                otpValid ?
                                    <>
                                        <InputPassword
                                            label="New Password"
                                            handleChange={handleNewPass}
                                            name="newPass"
                                            isRequired={true}
                                            placeholder="Enter new password"
                                            type='password'
                                        />

                                        <InputPassword
                                            label="Confirm Password"
                                            handleChange={handleConfirmPass}
                                            name="confirmPass"
                                            isRequired={true}
                                            placeholder="Confirm password"
                                            type='password'
                                        />
                                        <Button
                                            onClick={resetPassword}
                                            className="w-full mt-4 !bg-[#004d3d] !text-white"
                                        >
                                            Reset Password
                                        </Button>
                                    </>
                                    :
                                    <>
                                        <FormInput
                                            label="OTP"
                                            handleChange={handleOtp}
                                            name="otp"
                                            isRequired={true}
                                            placeholder="Enter OTP"
                                            type='number'
                                        />
                                        <Button
                                            onClick={validateOTP}
                                            className="w-full mt-4 !bg-[#004d3d] !text-white"
                                        >
                                            Validate OTP
                                        </Button>
                                    </>
                            }



                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
