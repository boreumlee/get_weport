const axios = require("axios").default;
require("dotenv").config();

(async () => {
  try {
    const url = process.env.URL;
    const body = {
      operationName: "BoardScreen",
      variables: {
        boardSlug: "testreview",
        page: 1,
        field: "title",
        word: "",
        boardHeaderID: "",
      },
      query:
        "query BoardScreen($boardSlug: String!, $page: Int!, $field: String, $word: String, $boardHeaderID: ID) {\n  boardBySlug(boardSlug: $boardSlug) {\n    id\n    ...BoardList_board\n    __typename\n  }\n}\n\nfragment BoardList_board on Board {\n  id\n  title\n  subtitle\n  notices {\n    ...BoardListItem_post\n    __typename\n  }\n  subNotices {\n    ...BoardListItem_post\n    __typename\n  }\n  extension {\n    isFAQ\n    service\n    __typename\n  }\n  posts(filterBy: {field: $field, word: $word, boardHeaderID: $boardHeaderID}, pagination: {page: $page, pageSize: 20}, orderBy: {field: CREATED_AT, direction: DESC}) {\n    nodes {\n      id\n      ...BoardListItem_post\n      __typename\n    }\n    totalCount\n    __typename\n  }\n  __typename\n}\n\nfragment BoardListItem_post on Post {\n  id\n  title\n  commentCount\n  createdAt\n  views\n  likes\n  nickname\n  imageSrc\n  youtubeSrc\n  board {\n    id\n    slug\n    title\n    __typename\n  }\n  author {\n    id\n    username\n    nickname\n    __typename\n  }\n  attachments {\n    id\n    __typename\n  }\n  boardHeader {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n",
    };

    // console.log(process.env.LIST_QUERY)
    const response = await axios.post(url, body, {
      headers: {
        "content-type": "application/json",
        "content-length": JSON.stringify(body).toString().length,
      },
    });

    console.log(response.data);
  } catch (error) {
    console.log("error ::::: ", error);
  }
})();
