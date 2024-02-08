import s from '../styles/Home.module.css'
import Link from "next/link";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";

const App = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const check = async () => {
        try {
            const res = await fetch("http://localhost:3030/users", {
                method: 'GET',
                credentials: 'include',
            }).then(
                res => {
                    if (!res.ok) {
                        window.location.href = "/login"
                    } else {
                        window.location.href = "/home"
                    }
                })
        } catch (e) {
            console.log('error--->', e)
        }
    };

    useEffect(() => {
        check()
    }, []);

    return (
        <>
        </>
    )
}

export default App