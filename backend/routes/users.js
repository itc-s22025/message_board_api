import express from "express";
import passport from "passport";
import {check, validationResult} from "express-validator";
import {calcHash, generateSalt} from "../util/auth.js";
import {PrismaClient} from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// router.use('/', (req, res, next) => {
//   if (!req.user){
//     console.log("ろぐいんしてない")
//     //未ログインだったときに返すメッセージ
//     res.status(401).json({message: "ログインしてないですよ"});
//     return
//   }
//   //ログインされていたら次の処理へ
//   next();
// })

// ログイン認証
router.post('/login', passport.authenticate('local', {
  // 認証通った場合
  successReturnToOrRedirect: '/',
  // 失敗した場合
  failureRedirect: '/login/error',
  // 失敗したときのメッセージ 上で指定したmessageがでる
  failureMessage: true,
  // これないとreturn toが効かない？
  keepSessionInfo: true,
  //deserializeのやつ?
  session: true
}));

router.get('/error', (req, res, next) => {
  res.status(401).json({message: "name and/or password is invalid..."})
})

// ログイン表示
router.get('/login', async (req, res, next) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ msg: error.msg });
  }
});

// ユーザ新規登録処理
router.post('/signup', [
  check('name', '名前の入力は必須です').notEmpty(),
  check('password', 'パスワードの入力は必須です').notEmpty()
], async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const errors = result.array();
      console.log(errors);
      return res.status(400).json({ errors: errors });
    }
    // OKだったらDB登録へ
    const { name, password } = req.body;
    const salt = generateSalt();
    const hashedPassword = calcHash(password, salt);

    await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        salt
      }
    });
    return res.status(201).json({ message: 'ユーザ登録成功' });
  } catch (e) {
    switch (e.code){
      case "P2002":
        res.status(400).json({message: "すでに使われているユーザー名かも"});
        break;
      default:
        console.error(e);
        res.status(500).json({ message: 'サーバーエラー' });
    }
    return console.error(e)
  }
});

// ログインチェックミドルウェア
router.use((req, res, next) => {
  if (!req.user){
    console.log("ろぐいんしてない")
    //未ログインだったときに返すメッセージ
    res.status(401).json({message: "ログインしてないですよ"});
    return
  }
  //ログインされていたら次の処理へ
  next();
})

//単純にクライアント側でログイン状態をチェックする用 ログインしてなかったら上の400が表示される
router.get("/", (req, res, next) => {
  res.json({message: "ok", name: req.user.name, id: +req.user.id});
});

//ログアウト処理
router.post("/logout",(req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

export default router;
