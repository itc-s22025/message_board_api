const express = require('express');
const passport = require('passport');
const { check, validationResult } = require('express-validator');
const { calcHash, generateSalt } = require('../util/auth');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', (req, res, next) => {
  res.redirect("/users/login")
})

// ログイン認証
router.post('/login', passport.authenticate('local', {
  // 認証通った場合
  successReturnToOrRedirect: '/',
  // 失敗した場合
  failureRedirect: '/login',
  // 失敗したときのメッセージ 上で指定したmessageがでる
  failureMessage: true,
  // これないとreturntoが効かない？
  keepSessionInfo: true
}));


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
    return res.status(200).json({ message: 'ユーザ登録成功' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: 'サーバーエラー発生' });
  }
});

//ログインチェックミドルウェア
router.use((req, res, next) => {
  if (!req.user){
    //未ログインだったときに返すメッセージ
    res.status(401).json({message: "ログインしてないです"});
    return
  }
  //ログインされていたら次の処理へ
  next();
})

//単純にクライアント側でログイン状態をチェックする用
//ログインしてなかったら上の400が表示される
router.get("/check", (req, res, next) => {
  res.json({message: "ok", result: req.user.name});
});

module.exports = router;
