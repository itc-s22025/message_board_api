import Link from "next/link";
import s from "../styles/login.module.css"
import {useState} from "react";
import {useRouter} from "next/router";

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:3030/users/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, password
                })
            })
            if (res.status === 200) {
                console.log("ろぐいんできた!!!!!!!!")
                router.push("/")
            } else {
                console.log("できなかった........")
                router.push("/login")
            }
        } catch (e) {
            console.error("ERRORRRRRRR:::: ".e)
        }
    };

    return (
        <>
            <h1>ログイン</h1>
            <div className={s.frame}>
                <div>
                    <label>User ID</label>
                    <input type="text" placeholder="user ID" value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" placeholder="password" value={password}
                           onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <input type="submit" value="LOGIN" onClick={handleSubmit}/>
                <div>
                    <Link href="/signup">
                        <button>新規登録はここから＞＞</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Login