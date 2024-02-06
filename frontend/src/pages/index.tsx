import s from '../styles/Home.module.css'
import Link from "next/link";
import {useState} from "react";
import {useRouter} from "next/router";

const App = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();
    const buttonClick = async () => {
        try {
            const res = await fetch("http://localhost:3030/users/check", {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            console.log(res)
        } catch (e) {
            console.error("エラ: ",e)
        }
    }

    return (
        <>
            <div className={s.all}>
                <h1>HOME</h1>
                    <button>クリック</button>
            </div>
        </>
    )
}

export default App