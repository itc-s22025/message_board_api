import {useEffect, useState} from "react";
import s from '../styles/Home.module.css'


const Home = () => {
    const [name, setName] = useState("")
    const [userId, setUserId] = useState()
    const [text, setText] = useState("")
    const [msgs, setMsgs] = useState([])

    useEffect(() => {
        home()
        getMsg()
    }, []);

    const home = async () => {
        fetch("http://localhost:3030/users", {
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
                setName(data.name)
                setUserId(data.id)
            }
        )
    }

    const getMsg = async () => {
        try {
            fetch("http://localhost:3030/messages/read", {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
            }).then(
                res => res.json()
            ).then(
                data => {
                    console.log("DATA->",data)
                    setMsgs(data)
                }
            )
        } catch (e) {
            console.log(e)
        }
    }

    const handleLogout = async () => {
        try {
            const res = await fetch("http://localhost:3030/users/logout", {
                method: 'POST',
                credentials: 'include',
            }).then(
                res => {
                    if (!res.ok) {
                        window.location.href = "/login"
                    } else {
                        throw new Error('ログアウト失敗した...')
                    }
                })
        } catch (e) {
            console.log('error--->', e)
        }
    };

    const handleSubmit = async () => {
        try {
            const res = await fetch("http://localhost:3030/messages/create", {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text, userId
                })
            }).then(
                res => {
                    if (res.ok) {
                        console.log("OK")
                    } else {
                        throw new Error('クリエイトできてませんけど')
                    }
                    window.location.href = "/home"
                }
            )
        } catch (e) {
            console.log("error--->", e)
        }
    }

    const msgItems = msgs.map(msg =>
    <li key={msg.id} className={s.flex}>
        <b className={s.user}>{msg.user.name}</b>
        <b className={s.message}>{msg.text}</b>
    </li>
    )

    return (
        <>
            <div className={s.all}>
                <h1 className={s.head}>Hello, {name}!</h1>

                <div>
                    <input type="text" placeholder="what's new..." size="30" className={s.text} value={text}
                           onChange={(e) => setText(e.target.value)}/>
                    <input type="submit" value="SUBMIT" onClick={handleSubmit} className={s.send}/>
                </div>

                <article>
                    {msgItems}
                    <button> ⇨ </button>
                </article>

                <button className={s.logout} onClick={handleLogout}>logout</button>
            </div>
        </>
    )
}

export default Home