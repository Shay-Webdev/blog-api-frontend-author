const urlPaths = {
  userUrl: {
    users: "http://localhost:3000/users", //GET | POST
    users_UserId: "http://localhost:3000/users/:userId", //GET | PUT
    users_Author_UserId: "http://localhost:3000/users/author/:userId", // PUT
  },
  postUrl: {
    posts: "http://localhost:3000/posts", //GET | POST
    posts_postId: "http://localhost:3000/posts/:postId", // GET | PUT | DELETE
    posts_userId_posts: "http://localhost:3000/posts/:userId/posts", //GET
  },
  commentUrl: {
    comments: "http://localhost:3000/posts/:postId/comments", // GET | POST
    comments_commentId:
      "http://localhost:3000/posts/:postId/comments/:commentId", // GET | PUT | DELETE
  },
  sessionUrl: {
    signup: "http://localhost:3000/signup", // POST
    login: "http://localhost:3000/login", // POST
    logout: "http://localhost:3000/logout", // DELETE
  },
  tokenUrl: {
    token_Refresh: "http://localhost:3000/token/refresh", //POST
  },
};

export { urlPaths };
