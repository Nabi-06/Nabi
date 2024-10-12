const express = require("express");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(express.static("public"));
app.use(express.json());
app.use(cors());

// TODO: 개발자센터에 로그인해서 내 결제위젯 연동 키 > 시크릿 키를 입력하세요. 시크릿 키는 외부에 공개되면 안돼요.
// @docs https://docs.tosspayments.com/reference/using-api/api-keys
const apiSecretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";

// 토스페이먼츠 API는 시크릿 키를 사용자 ID로 사용하고, 비밀번호는 사용하지 않습니다.
// 비밀번호가 없다는 것을 알리기 위해 시크릿 키 뒤에 콜론을 추가합니다.
// @docs https://docs.tosspayments.com/reference/using-api/authorization#%EC%9D%B8%EC%A6%9D
const encryptedApiSecretKey =
  "Basic " + Buffer.from(apiSecretKey + ":").toString("base64");

const billingKeyMap = new Map();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// 빌링키 발급
app.post("/issue-billing-key", (req, res) => {
  const { customerKey, authKey } = req.body;

  // AuthKey 로 카드 빌링키 발급 API 를 호출하세요
  // @docs https://docs.tosspayments.com/reference#authkey로-카드-빌링키-발급
  fetch(`https://api.tosspayments.com/v1/billing/authorizations/issue`, {
    method: "POST",
    headers: {
      Authorization: encryptedApiSecretKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      customerKey,
      authKey,
    }),
  }).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 빌링키 발급 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 빌링키 발급 성공 비즈니스 로직을 구현하세요.
    // TODO: 발급된 빌링키를 구매자 정보로 찾을 수 있도록 저장해두고, 결제가 필요한 시점에 조회하여 카드 자동결제 승인 API 를 호출합니다.
    billingKeyMap.set(customerKey, result.billingKey);
    res.status(response.status).json(result);
  });
});

// 카드 자동결제 승인
app.post("/confirm-billing", function (req, res) {
  const {
    customerKey,
    amount,
    orderId,
    orderName,
    customerEmail,
    customerName,
  } = req.body;

  // 저장해두었던 빌링키로 카드 자동결제 승인 API 를 호출하세요.
  fetch(
    `https://api.tosspayments.com/v1/billing/${billingKeyMap.get(customerKey)}`,
    {
      method: "POST",
      headers: {
        Authorization: encryptedApiSecretKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerKey,
        amount,
        orderId,
        orderName,
        customerEmail,
        customerName,
      }),
    }
  ).then(async function (response) {
    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // TODO: 자동결제 승인 실패 비즈니스 로직을 구현하세요.
      res.status(response.status).json(result);

      return;
    }

    // TODO: 자동결제 승인 성공 비즈니스 로직을 구현하세요.
    res.status(response.status).json(result);
  });
});

app.listen(port, () => console.log(`listen on http://localhost:${port}`));
