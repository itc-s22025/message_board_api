import {useState, useEffect} from "react";
import {useRouter} from "next/router";
import s from '../styles/login.module.css'
import Link from "next/link";

const Signup = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const handleSubmit = async () => {
        // ここで入力された値を利用して処理を行う（例：APIへの送信等）
        try {
            const res = await fetch("http://localhost:3030/users/signup", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name, password
                })
            })
            if (res.status === 201){
                console.log("SUCCESSSSS!!!!!!!!")
                window.location.href = "/login"
            }else {
                console.log("FAilED........")
            }
        } catch (e) {
            console.error("ERRORRRRRRR:::: ".e)
        }
    };


    return(
        <>
            <h1 className={s.title}>SIGN UP</h1>
            <div className={s.frame}>
                <div className={s.flex}>
                    <label className={s.label}>User ID</label>
                    <input type="text" placeholder="user ID" value={name} onChange={(e) => setName(e.target.value)} className={s.input}/>
                </div>
                <div className={s.flex}>
                    <label className={s.label}>Password</label>
                    <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} className={s.input}/>
                </div>
                <input type="submit" value="SIGN UP" onClick={handleSubmit} className={s.submit}/>
                <div>
                    <Link href="/login">
                        <button className={s.toNext}>＜＜ログイン画面に戻る</button>
                    </Link>
                </div>
            </div>
        </>
    )
}


export default Signup