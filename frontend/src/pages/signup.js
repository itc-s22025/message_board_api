import {useState, useEffect} from "react";
import {useRouter} from "next/router";

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
            if (res.status === 200){
                console.log("SUCCESSSSS!!!!!!!!")
                router.push("/login")
            }else {
                console.log("FAilED........")
                router.push("/signup")
            }
        } catch (e) {
            console.error("ERRORRRRRRR:::: ".e)
        }
    };


    return(
        <>
            <h1>新規ユーザー登録</h1>
            <div>
                <label>User ID</label>
                <input type="text" placeholder="user ID" value={name} onChange={(e) => setName(e.target.value)} />
                <p>{name}</p>
            </div>
            <div>
                <label>Password</label>
                <input type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
            </div>
            <input type="submit" value="SIGN UP" onClick={handleSubmit}/>
        </>
    )
}


export default Signup