import { Button } from '@chakra-ui/react'
import React from 'react'
import FormInput from '../components/input/FormInput'
import SkyBidder from '../components/common/SkyBidder'
import { AppContext } from '../context/Context'
import axios from 'axios'
import { API_URL } from '../constants/data'

export default function ForgetPass() {

    const [email, setEmail] = React.useState<string>("")
    const { setLoading, raiseToast } = React.useContext(AppContext);

    function handlePassChange(e: React.ChangeEvent<HTMLInputElement>) {
        setEmail(e.target.value)
    }

    async function sendEmail() {
        const params = new URLSearchParams({ email: email || "" })

        try {
            setLoading(true)
            const data = await axios.get(API_URL + "/users/validate/email?" + params)
                .then((res) => res.data)
                .catch((err) => {
                    raiseToast(err.response.data.message, "error")
                    return;
                });

            if (data.status === 200) {
                raiseToast(data.message, "success")
            } else {
                raiseToast(data.message, "error")
            }
        } catch (error) {
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
                            Forgot Password
                        </h1>

                        <div className="w-full md:w-10/12 mx-auto text-start my-6">
                            <FormInput
                                label="Email"
                                name="email"
                                isRequired={true}
                                type="email"
                                placeholder='Enter your email'
                                handleChange={handlePassChange}
                            />

                            <Button
                                onClick={sendEmail}
                                className="w-full mt-4 !bg-[#004d3d] !text-white"
                            >
                                Send Verification Email
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
