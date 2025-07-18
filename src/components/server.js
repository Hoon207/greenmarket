/**
 * ================================================
 *  공통 설정: Express + 미들웨어
 * ================================================
 */
const express    = require('express');      // Express 기본 라우팅
const app        = express();               // Express 인스턴스 생성
const port       = 9070;                    // 사용할 포트 (kdt/지니펫/greenmarket 공통)
const cors       = require('cors');         // CORS 허용 미들웨어
const mysql      = require('mysql');        // MySQL 연결 라이브러리
const bcrypt     = require('bcrypt');       // bcrypt 해시 암호화
const jwt        = require('jsonwebtoken'); // JWT 생성/검증
const SECRET_KEY = 'test';                  // JWT 서명용 비밀 키 (예시)

// 모든 도메인에서의 요청 허용 및 JSON 파싱
app.use(cors());
app.use(express.json());

/**
 * ======================================
 * uploads 폴더 자동 생성 & 정적 제공
 * ======================================
 */
const fs   = require('fs');
const path = require('path');
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
app.use('/uploads', express.static(uploadDir));

/**
 * ======================================
 * Multer 설정 (상품 이미지 업로드)
 * ======================================
 */
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename:    (req, file, cb) => {
    const ext  = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    cb(null, `${name}-${Date.now()}${ext}`);
  }
});
const upload = multer({ storage }).fields([
  { name: 'image_main', maxCount: 1 },
  { name: 'image_1',      maxCount: 1 },
  { name: 'image_2',      maxCount: 1 },
  { name: 'image_3',      maxCount: 1 },
  { name: 'image_4',      maxCount: 1 },
  { name: 'image_5',      maxCount: 1 },
  { name: 'image_6',      maxCount: 1 },
]);

/**
 * ======================================
 * 1. MySQL 연결 정보 (kdt 데이터베이스)
 * ======================================
 */
const connectionKdt = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: '1234',
  database: 'kdt'
});
connectionKdt.connect(err => {
  if (err) console.log('MYSQL(kdt) 연결 실패:', err);
  else     console.log('MYSQL(kdt) 연결 성공');
});

/**
 * ======================================
 * 2. MySQL 연결 정보 분리
 *    - Ginipet 전용
 *    - GreenMarket 전용
 * ======================================
 */
// Ginipet 전용 (ginipet_users 테이블)
const connectionGinipet = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: '1234',
  database: 'ginipet'
});
connectionGinipet.connect(err => {
  if (err) console.log('MYSQL(ginipet) 연결 실패:', err);
  else     console.log('MYSQL(ginipet) 연결 성공');
});

// GreenMarket 전용 (green_users, green_products, green_cart)
const connectionGM = mysql.createConnection({
  host: 'database',
  user: 'root',
  password: '1234',
  database: 'greenmarket'
});
connectionGM.connect(err => {
  if (err) console.log('MYSQL(greenmarket) 연결 실패:', err);
  else     console.log('MYSQL(greenmarket) 연결 성공');
});

/**
 * ======================================
 * JWT 인증 미들웨어
 * ======================================
 */
function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token      = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: '토큰 없음' });
  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(401).json({ message: '유효하지 않은 토큰입니다.' });
    req.user = user;
    next();
  });
}

/**
 * ======================================
 * 3. 기존 KDT 프로젝트용 라우트
 * ======================================
 */
// 3-1. 로그인 (users 테이블)
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  connectionKdt.query(
    'SELECT * FROM users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다.' });
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다.' });
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    }
  );
});

// 3-2. 회원가입 (users 테이블)
app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const hash = await bcrypt.hash(password, 10);
  connectionKdt.query(
    'INSERT INTO users (username, password) VALUES (?, ?)',
    [username, hash],
    err => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY')
          return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
        return res.status(500).json({ error: '회원가입 실패' });
      }
      res.json({ success: true });
    }
  );
});

// 3-3. 로그인2 (users2 테이블)
app.post('/login2', (req, res) => {
  const { username, password } = req.body;
  connectionKdt.query(
    'SELECT * FROM users2 WHERE username = ?',
    [username],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다.' });
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다.' });
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    }
  );
});

// 3-4. 회원가입2 (users2 테이블)
app.post('/register2', async (req, res) => {
  const { username, password, email, tel } = req.body;
  const hash = await bcrypt.hash(password, 10);
  connectionKdt.query(
    'INSERT INTO users2 (username, password, email, tel) VALUES (?, ?, ?, ?)',
    [username, hash, email, tel],
    err => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY')
          return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
        return res.status(500).json({ error: '회원가입 실패' });
      }
      res.json({ success: true });
    }
  );
});

// 3-5. 상품목록 조회 (goods 테이블)
app.get('/goods', (req, res) => {
  connectionKdt.query(
    'SELECT * FROM goods ORDER BY g_code DESC',
    (err, results) => {
      if (err) return res.status(500).json({ error: 'DB쿼리 오류' });
      res.json(results);
    }
  );
});

// 3-6. 상품삭제 (DELETE /goods/:g_code)
app.delete('/goods/:g_code', (req, res) => {
  connectionKdt.query(
    'DELETE FROM goods WHERE g_code = ?',
    [req.params.g_code],
    err => {
      if (err) return res.status(500).json({ error: '상품 삭제 실패' });
      res.json({ success: true });
    }
  );
});

// 3-7. 상품수정 (UPDATE /goods/update/:g_code)
app.put('/goods/update/:g_code', (req, res) => {
  const { g_name, g_cost } = req.body;
  connectionKdt.query(
    'UPDATE goods SET g_name = ?, g_cost = ? WHERE g_code = ?',
    [g_name, g_cost, req.params.g_code],
    err => {
      if (err) return res.status(500).json({ error: '상품 수정 실패' });
      res.json({ success: true });
    }
  );
});

// 3-8. 특정상품 조회 (GET /goods/:g_code)
app.get('/goods/:g_code', (req, res) => {
  connectionKdt.query(
    'SELECT * FROM goods WHERE g_code = ?',
    [req.params.g_code],
    (err, results) => {
      if (err) return res.status(500).json({ error: '상품 조회 실패' });
      if (!results.length) return res.status(404).json({ error: '해당 상품이 없습니다.' });
      res.json(results[0]);
    }
  );
});

// 3-9. 상품 등록 (POST /goods)
app.post('/goods', (req, res) => {
  const { g_name, g_cost } = req.body;
  if (!g_name || !g_cost) return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  connectionKdt.query(
    'INSERT INTO goods (g_name, g_cost) VALUES (?, ?)',
    [g_name, g_cost],
    (err, result) => {
      if (err) return res.status(500).json({ error: '상품 등록 실패' });
      res.json({ success: true, insertId: result.insertId });
    }
  );
});

// 3-10. 도서목록 조회 (book_store)
app.get('/books', (req, res) => {
  connectionKdt.query('SELECT * FROM book_store', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB쿼리 오류' });
    res.json(results);
  });
});

// 3-11. 도서등록 (POST /books)
app.post('/books', (req, res) => {
  const { name, area1, area2, area3, BOOK_CNT, owner_nm, tel_num } = req.body;
  if (!name || !BOOK_CNT) return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  connectionKdt.query(
    'INSERT INTO book_store (name, area1, area2, area3, BOOK_CNT, owner_nm, tel_num) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [name, area1, area2, area3, BOOK_CNT, owner_nm, tel_num],
    (err, result) => {
      if (err) return res.status(500).json({ error: '도서 등록 실패' });
      res.json({ success: true, insertId: result.insertId });
    }
  );
});

// 3-12. 특정 도서 조회 (GET /books/:num)
app.get('/books/:num', (req, res) => {
  connectionKdt.query(
    'SELECT * FROM book_store WHERE num = ?',
    [req.params.num],
    (err, results) => {
      if (err) return res.status(500).json({ error: '도서 조회 실패' });
      if (!results.length) return res.status(404).json({ error: '해당 도서가 없습니다.' });
      res.json(results[0]);
    }
  );
});

// 3-13. 도서삭제 (DELETE /books/:num)
app.delete('/books/:num', (req, res) => {
  connectionKdt.query(
    'DELETE FROM book_store WHERE num = ?',
    [req.params.num],
    err => {
      if (err) return res.status(500).json({ error: '도서 삭제 실패' });
      res.json({ success: true });
    }
  );
});

// 3-14. 도서수정 (PUT /books/update/:num)
app.put('/books/update/:num', (req, res) => {
  const { name, area1, area2, area3, BOOK_CNT, owner_nm, tel_num } = req.body;
  connectionKdt.query(
    'UPDATE book_store SET name = ?, area1 = ?, area2 = ?, area3 = ?, BOOK_CNT = ?, owner_nm = ?, tel_num = ? WHERE num = ?',
    [name, area1, area2, area3, BOOK_CNT, owner_nm, tel_num, req.params.num],
    err => {
      if (err) return res.status(500).json({ error: '도서 수정 실패' });
      res.json({ success: true });
    }
  );
});

// 3-15. 과일목록 조회 (fruit)
app.get('/fruits', (req, res) => {
  connectionKdt.query('SELECT * FROM fruit ORDER BY num DESC', (err, results) => {
    if (err) return res.status(500).json({ error: 'DB쿼리 오류' });
    res.json(results);
  });
});

// 3-16. 과일등록 (POST /fruits)
app.post('/fruits', (req, res) => {
  const { name, price, color, country } = req.body;
  if (!name || !price || !color || !country) return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  connectionKdt.query(
    'INSERT INTO fruit (name, price, color, country) VALUES (?, ?, ?, ?)',
    [name, price, color, country],
    (err, result) => {
      if (err) return res.status(500).json({ error: '상품 등록 실패' });
      res.json({ success: true, insertId: result.insertId });
    }
  );
});

// 3-17. 과일상세 조회 (GET /fruits/:num)
app.get('/fruits/:num', (req, res) => {
  connectionKdt.query(
    'SELECT * FROM fruit WHERE num = ?',
    [req.params.num],
    (err, results) => {
      if (err) return res.status(500).json({ error: '과일 조회 실패' });
      if (!results.length) return res.status(404).json({ error: '해당 과일이 없습니다.' });
      res.json(results[0]);
    }
  );
});

// 3-18. 과일삭제 (DELETE /fruits/:num)
app.delete('/fruits/:num', (req, res) => {
  connectionKdt.query(
    'DELETE FROM fruit WHERE num = ?',
    [req.params.num],
    err => {
      if (err) return res.status(500).json({ error: '과일 삭제 실패' });
      res.json({ success: true });
    }
  );
});

// 3-19. 과일수정 (PUT /fruits/update/:num)
app.put('/fruits/update/:num', (req, res) => {
  const { name, price, color, country } = req.body;
  connectionKdt.query(
    'UPDATE fruit SET name = ?, price = ?, color = ?, country = ? WHERE num = ?',
    [name, price, color, country, req.params.num],
    err => {
      if (err) return res.status(500).json({ error: '과일 수정 실패' });
      res.json({ success: true });
    }
  );
});

// 3-20. 질문등록 (POST /question)
app.post('/question', (req, res) => {
  const { name, tel, email, txtbox } = req.body;
  if (!name || !tel || !email || !txtbox) return res.status(400).json({ error: '필수 항목이 누락되었습니다.' });
  connectionKdt.query(
    'INSERT INTO question (name, tel, email, txtbox) VALUES (?, ?, ?, ?)',
    [name, tel, email, txtbox],
    err => {
      if (err) return res.status(500).json({ error: '데이터 입력 오류' });
      res.send('질문 등록 완료');
    }
  );
});

/**
 * ================================================
 * 4. Ginipet 전용 라우트
 * ================================================
 */
app.post('/ginipet/register', async (req, res) => {
  const { username, password, tel, email } = req.body;
  const hash = await bcrypt.hash(password, 10);
  connectionGinipet.query(
    'INSERT INTO ginipet_users (username, password, tel, email) VALUES (?, ?, ?, ?)',
    [username, hash, tel, email],
    err => {
      if (err && err.code === 'ER_DUP_ENTRY')
        return res.status(400).json({ error: '이미 존재하는 아이디입니다.' });
      if (err) return res.status(500).json({ error: '회원가입 실패' });
      res.json({ success: true });
    }
  );
});

app.post('/ginipet/login', (req, res) => {
  const { username, password } = req.body;
  connectionGinipet.query(
    'SELECT * FROM ginipet_users WHERE username = ?',
    [username],
    async (err, results) => {
      if (err || results.length === 0)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 틀렸습니다.' });
      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 틀립니다.' });
      const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    }
  );
});

app.get('/ginipet/join', (req, res) => {
  res.json('Excused from ginipet backend');
});

/** 
 * ================================================
 * 5. GreenMarket 전용 라우트 + 관리자 권한 판별
 * ================================================
 */

// 5-1. 회원가입 (green_users 테이블)
app.post('/greenmarket/register', async (req, res) => {
  const { userid, username, password, phone, email, region } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    connectionGM.query(
      'INSERT INTO green_users (userid, username, password, phone, email, region) VALUES (?, ?, ?, ?, ?, ?)',
      [userid, username, hash, phone, email, region],
      err => {
        if (err && err.code === 'ER_DUP_ENTRY')
          return res.status(400).json({ error: '이미 존재하는 아이디 또는 이메일입니다.' });
        if (err) return res.status(500).json({ error: '회원가입 실패' });
        res.json({ success: true });
      }
    );
  } catch {
    res.status(500).json({ error: '서버 오류' });
  }
});

// 5-1-2. 회원정보 수정 (PUT /greenmarket/member/update/:id)
app.put('/greenmarket/member/update/:id', async (req, res) => {
  const { username, password, phone, email, region } = req.body;
  const { id } = req.params;

  try {
    let hash = null;
    if (password) {
      hash = await bcrypt.hash(password, 10);
    }

    const query =
      'UPDATE green_users ' +
      'SET username = ?, password = COALESCE(?, password), phone = ?, email = ?, region = ? ' +
      'WHERE id = ?';
    const values = [username, hash, phone, email, region, id];

    connectionGM.query(query, values, err => {
      if (err) {
        console.error('수정 오류:', err);
        return res.status(500).json({ error: '수정 실패' });
      }
      res.json({ success: true });
    });
  } catch (error) {
    console.error('서버 오류:', error);
    res.status(500).json({ success: false, message: '서버 오류' });
  }
});

// 5-1-3. 회원정보 조회 (GET /greenmarket/member/:id)
app.get('/greenmarket/member/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const sql =
    'SELECT id, userid, username, phone, email, region, last_login ' +
    'FROM green_users WHERE id = ?';

  connectionGM.query(sql, [id], (err, results) => {
    if (err) {
      console.error('조회 오류:', err);
      return res.status(500).json({ error: '조회 실패' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: '해당 정보가 없습니다.' });
    }
    res.json(results[0]);
  });
});

// 5-2. 로그인 (관리자 판별 포함)
app.post('/greenmarket/login', (req, res) => {
  const { userid, password } = req.body;
  connectionGM.query(
    'SELECT * FROM green_users WHERE userid = ?',
    [userid],
    async (err, results) => {
      if (err) return res.status(500).json({ error: 'DB 오류' });
      if (!results.length)
        return res.status(400).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });

      const user = results[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(401).json({ error: '아이디 또는 비밀번호가 잘못되었습니다.' });

      // last_login 업데이트
      const now = new Date();
      connectionGM.query('UPDATE green_users SET last_login = ? WHERE id = ?', [now, user.id]);

      // 관리자 여부 판별
      const role = user.userid === 'admin' ? 'admin' : 'user';

      // 토큰 생성
      const token = jwt.sign(
        { id: user.id, username: user.username, role },
        SECRET_KEY,
        { expiresIn: '1h' }
      );

      res.json({
        success: true,
        token,
        user: { id: user.id, username: user.username, role, last_login: now }
      });
    }
  );
});

// 5-3. 상품 등록 (green_products + 이미지)
app.post('/greenmarket/products', authenticateToken, upload, (req, res) => {
  const b = req.body;
  const img = key => req.files?.[key]?.[0]?.filename ?? null;
  const params = [
    req.user.id,
    b.title, b.brand, b.kind, b.condition,
    b.price, b.trade_type, b.region, b.description,
    b.shipping_fee || 0,
    img('image_main'), img('image_1'), img('image_2'),
    img('image_3'), img('image_4'), img('image_5'), img('image_6')
  ];
  const sql =
    'INSERT INTO green_products ' +
    '(owner_id, title, brand, kind, `condition`, price, ' +
    'trade_type, region, description, shipping_fee, ' +
    'image_main, image_1, image_2, image_3, image_4, image_5, image_6) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  connectionGM.query(sql, params, (err, result) => {
    if (err) {
      console.error('상품 등록 오류:', err);
      return res.status(500).json({ error: '상품 등록 실패' });
    }
    res.json({ success: true, id: result.insertId });
  });
});

// 5-4. 상품 목록 조회
app.get('/greenmarket/products', (req, res) => {
  connectionGM.query(
    'SELECT * FROM green_products ORDER BY id DESC',
    (err, rows) => {
      if (err) return res.status(500).json({ error: '조회 실패' });
      const products = rows.map(r => ({
        id:         r.id,
        title:      r.title,
        brand:      r.brand,
        kind:       r.kind,
        condition:  r.condition,
        price:      r.price,
        trade_type: r.trade_type,
        region:     r.region,
        description:r.description,
        datetime:   r.datetime,
        images:     [r.image_main, r.image_1, r.image_2, r.image_3, r.image_4, r.image_5, r.image_6].filter(v => v)
      }));
      res.json(products);
    }
  );
});

// 5-5. 상품 상세 조회
app.get('/greenmarket/products/:id', (req, res) => {
  const sql =
    'SELECT p.*, u.username AS seller_name, ' +
    '(SELECT COUNT(*) FROM green_products WHERE owner_id = p.owner_id) AS seller_product_count ' +
    'FROM green_products p ' +
    'JOIN green_users u ON p.owner_id = u.id ' +
    'WHERE p.id = ?';
  connectionGM.query(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    if (!rows.length) return res.status(404).json({ error: '상품 없음' });
    res.json(rows[0]);
  });
});

// 5-6. 장바구니 조회
app.get('/greenmarket/cart', authenticateToken, (req, res) => {
  const sql =
    'SELECT cart_id AS id, product_id, title, brand, `condition`, price, shipping_fee, trade_type, region, image_main, added_at ' +
    'FROM green_cart WHERE user_id = ?';
  connectionGM.query(sql, [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB 오류' });
    res.json(rows);
  });
});

// 5-7. 장바구니 삭제
app.delete('/greenmarket/cart', authenticateToken, (req, res) => {
  const ids = req.body.ids;
  if (!Array.isArray(ids) || !ids.length)
    return res.status(400).json({ error: '삭제할 ID 필요' });
  const placeholders = ids.map(() => '?').join(',');
  const sql = `DELETE FROM green_cart WHERE user_id = ? AND cart_id IN (${placeholders})`;
  connectionGM.query(sql, [req.user.id, ...ids], (err, result) => {
    if (err) return res.status(500).json({ error: '삭제 실패' });
    res.json({ success: true, affectedRows: result.affectedRows });
  });
});

// 5-8. 장바구니 추가
app.post('/greenmarket/cart', authenticateToken, (req, res) => {
  const { product_id } = req.body;
  // kind와 condition까지 백틱으로 감싸서 조회
  const productSql =
    'SELECT title, brand, kind, `condition`, price, trade_type, region, image_main, shipping_fee ' +
    'FROM green_products WHERE id = ?';
  connectionGM.query(productSql, [product_id], (err, pRows) => {
    if (err) return res.status(500).json({ error: '상품 조회 오류' });
    if (!pRows.length) return res.status(404).json({ error: '상품 없음' });

    const product = pRows[0];
    const checkSql = 'SELECT * FROM green_cart WHERE user_id = ? AND product_id = ?';
    connectionGM.query(checkSql, [req.user.id, product_id], (cErr, cRows) => {
      if (cErr) return res.status(500).json({ error: 'DB 오류' });
      if (cRows.length) return res.status(400).json({ error: '이미 장바구니에 있음' });

      // INSERT 시에도 condition을 백틱으로 감싸야 합니다
      const insertSql =
        'INSERT INTO green_cart ' +
        '(user_id, product_id, title, brand, kind, `condition`, price, shipping_fee, trade_type, region, image_main, added_at) ' +
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())';
      const params = [
        req.user.id,
        product_id,
        product.title,
        product.brand,
        product.kind,
        product.condition,
        product.price,
        product.shipping_fee,
        product.trade_type,
        product.region,
        product.image_main
      ];

      connectionGM.query(insertSql, params, iErr => {
        if (iErr) {
          console.error('장바구니 추가 오류:', iErr);
          return res.status(500).json({ error: '장바구니 추가 실패' });
        }
        res.json({ success: true, message: '장바구니에 상품이 추가되었습니다.' });
      });
    });
  });
});



// — 공지사항 API (green_notice) 전체 CRUD
//  • 목록 조회
app.get('/greenmarket/notice', (req, res) => {
  connectionGM.query(
    'SELECT * FROM green_notice ORDER BY id DESC',
    (err, rows) => {
      if (err) return res.status(500).json({ error: '조회 실패' });
      res.json(rows);
    }
  );
});
//  • 상세 조회
app.get('/greenmarket/notice/:id', (req, res) => {
  const { id } = req.params;
  connectionGM.query(
    'SELECT * FROM green_notice WHERE id = ?',
    [id],
    (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB 오류' });
      if (!rows.length) return res.status(404).json({ error: '공지 없음' });
      res.json(rows[0]);
    }
  );
});
//  • 등록
app.post('/greenmarket/notice', (req, res) => {
  const { category, title, writer, content } = req.body;
  connectionGM.query(
    'INSERT INTO green_notice (category, title, writer, content) VALUES (?, ?, ?, ?)',
    [category, title, writer, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: '등록 실패' });
      res.json({ success: true, insertId: result.insertId });
    }
  );
});
//  • 수정
app.put('/greenmarket/notice/update/:id', (req, res) => {
  const { id } = req.params;
  const { category, title, content } = req.body;
  connectionGM.query(
    'UPDATE green_notice SET category = ?, title = ?, content = ? WHERE id = ?',
    [category, title, content, id],
    err => {
      if (err) return res.status(500).json({ error: '수정 실패' });
      res.json({ success: true });
    }
  );
});
//  • 삭제
app.delete('/greenmarket/notice/:id', (req, res) => {
  const { id } = req.params;
  connectionGM.query(
    'DELETE FROM green_notice WHERE id = ?',
    [id],
    err => {
      if (err) return res.status(500).json({ error: '삭제 실패' });
      res.json({ success: true });
    }
  );
});

/**
 * ======================================
 * 6. 서버 실행
 * ======================================
 */
app.listen(port, () => {
  console.log(`서버 실행 중… 포트: ${port}`);
});
