import React, { useState } from 'react'
import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import { VStack } from "@chakra-ui/layout";
import { useToast } from "@chakra-ui/toast";
import {useNavigate} from 'react-router-dom'
import axios from 'axios'
function SignUp() {
    const [name,setName] = useState();
    const [email,setEmail] = useState();
    const [password,setPassword] = useState();
    const [confirmPassword,setConfirmPassword] = useState();
    const [pic,setPic] = useState();
    const [show,setShow] = useState(false)
    const [loading,setLoading] = useState(false)
    const handleClick = ()=>{setShow(!show)}
    const toast = useToast();
    const navigate = useNavigate()
    const postDetails = (pic)=>{
        setLoading(true)
        if(pic === undefined){
            toast({
                title:'Please select an image',
                status:'warning',
                duration:3000,
                isClosable:true,
                position:'top',
            });
            return ;
        }
        if(pic.type === 'image/jpg' || pic.type === 'image/png' || pic.type === 'image/jpeg'){
            const data = new FormData();
            data.append("file",pic);
            data.append('upload_preset','chat-app')
            data.append('cloud_name','dkovoxeqd')
            fetch('https://api.cloudinary.com/v1_1/dkovoxeqd/image/upload',{
                method: 'POST',
                body: data,
            }).then((res)=>res.json())
            .then((data) => {
                setPic(data.url.toString())
                console.log(data.url.toString())
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
                setLoading(false)
            })
        }else{
            toast({
                title:'Please select extension jpg/png/jpeg',
                status:'warning',
                duration:3000,
                isClosable:true,
                position:'top',
            });
            return ;
        }
    }
    const submitHander = async ()=>{
        setLoading(true)
        if(!name || !email || !password || !confirmPassword){
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
        if( password !== confirmPassword){
            toast({
                title:'Your password did not match',
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
            axios.post('/api/users', { name, email, password, pic }, config)
            .then(response => {
                const data = response.data;
                localStorage.setItem("userInfo", JSON.stringify(data));
                toast({
                    title: `Congrats! ${name} Your account has been created`,
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
                navigate('/chats')
            })
            .catch(error => {
                console.error('Error creating account:', error);
                toast({
                    title: 'Error creating account',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top',
                });
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
        <VStack spacing="5px">
            <FormControl id="first-name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input
                    placeholder="Enter Your Name"
                    onChange={(e)=>setName(e.target.value)}
                />
            </FormControl>
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
            <FormControl id="password" isRequired>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup size="md">
                    <Input
                    type={show?'text':'password'}
                        placeholder="Confirm password"
                    onChange={(e)=>setConfirmPassword(e.target.value)}
                    />
                    <InputRightElement width="4.5rem">
                        <Button h="1.75rem" size="sm"onClick={handleClick} >
                        {show?'Hide':'Show'}
                        </Button>
                    </InputRightElement>
                </InputGroup>
            </FormControl>
            <FormControl id="pic">
                <FormLabel>Upload your Picture</FormLabel>
                <Input
                    type="file"
                    p={1.5}
                    accept="image/*"
                    onChange={(e)=>{postDetails(e.target.files[0])}}
                />
            </FormControl>
            <Button
                colorScheme="blue"
                width="100%"
                style={{ marginTop: 15 }}
                onClick={submitHander}
                isLoading={loading}
            >
                Sign Up
            </Button>
        </VStack>
    )
}

export default SignUp
