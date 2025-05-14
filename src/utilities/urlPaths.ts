const urlOrigin = "https://blog-api-backend-vath.onrender.com";
const urlPaths = {
  userUrl: {
    users: `${urlOrigin}/users`, //GET | POST
    users_UserId: `${urlOrigin}/users/:userId`, //GET | PUT
    users_Author_UserId: `${urlOrigin}/users/author/:userId`, // PUT
  },
  postUrl: {
    posts: `${urlOrigin}/posts`, //GET | POST
    posts_postId: `${urlOrigin}/posts/:postId`, // GET | PUT | DELETE
    posts_userId_posts: `${urlOrigin}/posts/:userId/posts`, //GET
  },
  commentUrl: {
    comments: `${urlOrigin}/posts/:postId/comments`, // GET | POST
    comments_commentId: `${urlOrigin}/posts/:postId/comments/:commentId`, // GET | PUT | DELETE
  },
  sessionUrl: {
    signup: `${urlOrigin}/signup`, // POST
    login: `${urlOrigin}/login`, // POST
    logout: `${urlOrigin}/logout`, // DELETE
  },
  tokenUrl: {
    token_Refresh: `${urlOrigin}/token/refresh`, //POST
  },
};

export { urlPaths };
