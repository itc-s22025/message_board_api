import express from "express";
import {PrismaClient} from "@prisma/client";
import {check, validationResult} from "express-validator";

const router = express.Router();
const prisma = new PrismaClient();

const maxItemCount = 10;

//ログイン状態のチェック
router.use((req, res, next) => {
    if (!req.user) {
        const err = new Error("ログインしてくださいね");
        err.status = 401;
        throw err;
        // //ログインしてないとき
        // res.status(400).json({message: "ログインしてください"});
    }
    //
    next()
});

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
        res.status(400).json({message: "なんかエラーでてるよ〜"})
    }

});

router.get('/read', async (req, res, next) => {
    const page = req.query.page ? +req.query.page : 1;
    const skip = maxItemCount * (page - 1);
    // const [messages, count] = await Promise.all([
    // prisma.message.findMany({
    //     orderBy: {
    //         updatedAt: 'desc'
    //     },
    //     skip,
    //     take: maxItemCount,
    //     include: {
    //         user: true
    //     },
    // }),
    // prisma.message.count()
    // ]);
    // const maxPageCount = Math.ceil(count/maxItemCount);
    // res.json({
    //     message: "OK",
    //     messages,
    //     maxPageCount
    // })

    const messages = await prisma.message.findMany({
        orderBy: {
            updatedAt: 'desc'
        },
        skip,
        take: maxItemCount,
        include: {
            user: true
        },
    });
    res.status(200).json(messages);
    try {
    } catch (error) {
        res.status(500).json({msg: error.msg});
    }
});

router.get('/:uid/read', async (req,res,next) => {
    const uid = +req.params.uid;
    const message =await prisma.message.findMany({
        where: {
            userId: uid
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    res.status(200).json(message)
})

export default router;