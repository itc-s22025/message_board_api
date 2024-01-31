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
            <h1 className={s.title}>LOGIN</h1>
            <div className={s.frame}>
                <div className={s.flex}>
                    <label className={s.label}>User ID</label>
                    <input type="text" placeholder="user ID" value={name} onChange={(e) => setName(e.target.value)} className={s.input}/>
                </div>
                <div className={s.flex}>
                    <label className={s.label}>Password</label>
                    <input type="password" placeholder="password" value={password}
                           onChange={(e) => setPassword(e.target.value)} className={s.input}/>
                </div>
                <input type="submit" value="LOGIN" onClick={handleSubmit} className={s.submit}/>
                <div>
                    <Link href="/signup">
                        <button className={s.toNext}>新規登録はここから＞＞</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Login