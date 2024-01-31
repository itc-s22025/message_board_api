const express = require('express');
const {PrismaClient} = require('@prisma/client');
const {check, validationResult} = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();

//ログイン状態のチェックミドルウェア ログインされているかどうか確認できる
router.use((req, res, next) => {
    if (!req.user){
        //未ログインだったときに返すメッセージ
        res.status(401).json({message: "ログインしてないです"});
        return
    }
    //ログインされていたら次の処理へ
    next();
});

//単純にクライアント側でログイン状態をチェックする用
//ログインしてなかったら上のunauthenticatedが表示される
router.get("/check", (req, res, next) => {
    res.json({message: "ok", result: req.user.name});
});


module.exports = router;