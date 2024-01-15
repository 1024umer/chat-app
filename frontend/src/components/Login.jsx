import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
function Login() {
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const toast = useToast();
    const navigate = useNavigate()
    const handleClick = ()=>{setShow(!show)}
    const submitHander = async ()=>{
        setLoading(true)
        if(!email || !password ){
            toast({
                title:'Please fill all the fields',
                status:'warning',
                duration:3000,
                isClosable:true,
                position:'top',
            });
            setLoading(false)
            return ;
        }
        try {
            const config = {
                headers:{"Content-Type": "application/json",}
            }
            axios.post('/api/users/login', {  email, password }, config)
            .then(response => {
                const data = response.data;
                localStorage.setItem("userInfo", JSON.stringify(data));
                navigate('/chats')
            })
            .catch(error => {
                toast({
                    title: 'Invalid Credentials',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
            setLoading(false)
            });
        } catch (error) {
            toast({
                title:error.response.data.message,
                status:'warning',
                duration:5000,
                isClosable:true,
                position:'top',
            });
            setLoading(false)
        }
    }

    return (
        <VStack spacing="10px">
            <FormControl id="email" isRequired>
                <FormLabel>Email Address</FormLabel>
                <Input
                    type="email"
                    placeholder="Enter Your Email Address"
                    onChange={(e)=>setEmail(e.target.value)}
                />
            </FormControl>
            <FormControl id="password" isRequired>
                <FormLabel>Password</FormLabel>
                <InputGroup size="md">
                    <Input
                    type={show?'text':'password'}
                        placeholder="Enter Password"
                    onChange={(e)=>setPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm" onClick={handleClick} >
                            {show?'Hide':'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHander}
                isLoading={loading}
            >
                Login
            </Button>
            <Button
                variant="solid"
                colorScheme="red"
                width="100%"
                onClick={() => {
                setEmail("guest@example.com");
                setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </Button>
        </VStack>
    )
}

export default Login
