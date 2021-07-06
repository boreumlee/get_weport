const request = require("request-promise");
const Excels = require("exceljs");

const getSingleUserCoupon = async (qs, authorization) => {
  try {
    const output = await request.get({
      url: "https://www.weport.co.kr/v2/coupon/user_coupon/",
      headers: {
        authorization,
        "content-type": "application/json",
      },
      qs,
      json: true,
    });
    return output;
  } catch (error) {
    console.log(error);
  }
};

async function processArray(array, qs, authorization) {
  let result = [];
  for (const i of array) {
    const output = await getSingleUserCoupon(
      { ...qs, offset: 100 * (i + 1) },
      authorization
    );
    result = result.concat(output.results);
  }
  return result;
}

const getTotalUserList = async () => {
  try {
    const authorization = "auth 코드 추가";
    const qs = {
      coupon_id: 14671,
      offset: 0,
      limit: 100,
    };

    let totalList = [];

    const offset0 = await getSingleUserCoupon(qs, authorization);
    const totalCount = offset0.count;
    if (offset0.next === null) {
      totalList = totalList.concat(offset0.results);

      const filtered_used_list = totalList.reduce(
        (pre, cur) => (cur.is_used ? [...pre, cur] : pre),
        []
      );
      const result = filtered_used_list.map(({ user_info }) => [
        user_info.name,
        user_info.phone,
        user_info.email,
      ]);
      return result;
    }

    totalList = totalList.concat(offset0.results);

    const callLimit = Math.floor(totalCount / 100);

    const indexArray = Array.from({ length: callLimit }, (_, i) => i);

    const lastUserList = await processArray(indexArray, qs, authorization);

    totalList = totalList.concat(lastUserList);

    const filtered_used_list = totalList.reduce(
      (pre, cur) => (cur.is_used ? [...pre, cur] : pre),
      []
    );
    const result = filtered_used_list.map(({ user_info }) => [
      user_info.name,
      user_info.phone,
      user_info.email,
    ]);
    return result;
  } catch (error) {
    console.log(error);
  }
};

(async () => {
  try {
    const getTotalUser = await getTotalUserList();

    // 관리 객체 생성
    const workbook = new Excels.Workbook();

    // 엑셀 시트 생성
    const sheet = workbook.addWorksheet("first sheet");

    sheet.addRows(getTotalUser);

    workbook.xlsx
      .writeFile("./first_excel.xlsx")
      .then((_) => console.log("완료"))
      .catch((_) => console.log("실패"));
  } catch (err) {
    console.log(err);
  }
})();
