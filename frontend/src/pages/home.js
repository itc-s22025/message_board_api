import {useEffect, useState} from "react";
import s from '../styles/Home.module.css'


const Home = () => {
    const [name, setName] = useState("")

    useEffect(() => {
        fetch("http://localhost:3030/users/check", {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(
            res => res.json()
        ).then(
            data => {
                console.log(data)
                setName(data.result)
            }
        )
    }, []);

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:3030/users/logout", {
                method: 'POST',
                credentials: 'include',
            }).then(
                res => {
                    if (!res.ok){
                        window.location.href = "/login"
                    }else {
                        throw new Error('ログアウト失敗した...')
                    }
                })
        }catch (e){
            console.log('error--->',e)
        }
    };


    return (
        <>
            <div className={s.all}>
                <h1 className={s.head}>Hello, {name}!</h1>

                <div>
                    <input type="text" placeholder="what's new..." size="30" className={s.text}/>
                    <input type="submit" value="SUBMIT" className={s.send}/>
                </div>

                <table>
                    <tbody>
                    <tr>
                        <td className={s.message}>aaa</td>
                        <td className={s.user}>bbb</td>
                    </tr>
                    </tbody>
                </table>

                <button className={s.logout} onClick={handleLogout}>logout</button>
            </div>
        </>
    )
}

export default Home