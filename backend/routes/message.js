const express = require('express');
const {PrismaClient} = require('@prisma/client');
const {check, validationResult} = require('express-validator');

const router = express.Router();
const prisma = new PrismaClient();


router.use((req, res, next) => {
    if (!req.user){
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

// router.post("/create", [
//     check("text").notEmpty({ignore_whitespace: true})
// ],(req, res, next) => {
//
// })
//
// router.get("/read", async (req, res, next) => {
//     const page = req.query.page ? +req.query.page : 1;
//     // const skip = maxItemCount * (oage -1);
//     // const [message, count] =
// })

module.exports = router;