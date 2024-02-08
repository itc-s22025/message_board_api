const express = require('express');
const {PrismaClient} = require('@prisma/client');
const {check, validationResult} = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();


router.use((req, res, next) => {
    if (!req.user) {
        //ログインしてないとき
        res.status(400).json({message: "ログインしてください"});
    }
    //
    next()
});

//全データ取得
// router.get("/all", async (req, res, next) => {
//     const documents = await prisma.message.findMany({
//         where: {
//             userId: +req.user.id
//         },
//         orderBy: [
//             {createddAt: "desc"}
//         ]
//     });
//     res.json({
//         message: "ok",
//         documents,
//     });
// });

router.post("/create", [
    check("text").notEmpty({ignore_whitespace: true})
], async (req, res, next) => {
    try {
        const result = validationResult(req)
        if (!result.isEmpty()) {
            const errors = result.array();
            console.log(errors)
            return res.status(400).json({message: errors});
        }
        await prisma.message.create({
            data: {
                text: req.body.text,
                userId: +req.user.id
            }
        });
        res.status(201).json({message: "作成できたよ〜"});
    } catch (e) {
        console.log("クリエイトエラー：", e)
    }

});

router.get('/read', async (req, res, next) => {
    try {
        const messages = await prisma.message.findMany({
            orderBy: {
                updatedAt: 'desc'
            },
            include: {
                user: true
            },
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({msg: error.msg});
    }
});
//
// router.get("/read", async (req, res, next) => {
//     const page = req.query.page ? +req.query.page : 1;
//     // const skip = maxItemCount * (oage -1);
//     // const [message, count] =
// })

module.exports = router;