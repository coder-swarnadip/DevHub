# DevHub OS

## Project Idea

## User Roles

## Main Features

## Tech Stack

## System Architecture

## Database Collections

# DevHub OS Database Design V1

## 1. User Collection

This is the core collection. Almost everything connects to `User`.

```js
User {
  _id,

  name,
  username,
  email,
  passwordHash,

  role, // developer, recruiter, company_admin, admin

  avatar,
  banner,
  bio,
  location,

  skills: [],
  education: [],
  experience: [],

  resume: {
    url,
    publicId
  },

  socialLinks: {
    github,
    linkedin,
    portfolio,
    twitter
  },

  isEmailVerified,
  isBlocked,

  followersCount,
  followingCount,

  lastActiveAt,
  createdAt,
  updatedAt
}
```

### Why these fields?

`username` should be unique because public profiles need URLs like:

```txt
/dev/swarnadip
```

`passwordHash` stores the encrypted password, never the raw password.

`role` controls permissions.

A developer should not access the recruiter dashboard.
A recruiter should not access admin moderation.

`followersCount` and `followingCount` are stored for fast display.

You don’t want to count followers from scratch every time someone opens a profile.

### Possible indexes

```js
email: unique
username: unique
role
skills
```

---

## 2. Post Collection

A post belongs to one user.

```js
Post {
  _id,

  author, // User _id

  content,

  media: [
    {
      url,
      publicId,
      type // image, video
    }
  ],

  likesCount,
  commentsCount,
  sharesCount,

  visibility, // public, followers, private

  isEdited,
  isDeleted,

  createdAt,
  updatedAt
}
```

### Why not store comments inside Post?

Because comments can grow a lot.

If one post gets 10,000 comments, the post document becomes heavy.

That is bad design.

Keep comments separate.

---

## 3. Comment Collection

A comment belongs to a post and a user.

```js
Comment {
  _id,

  post, // Post _id
  author, // User _id

  parentComment, // Comment _id, optional

  content,

  likesCount,
  repliesCount,

  isEdited,
  isDeleted,

  createdAt,
  updatedAt
}
```

### Why `parentComment`?

This allows replies.

Normal comment:

```js
parentComment: null
```

Reply:

```js
parentComment: "someCommentId"
```

This is cleaner than making a separate `Reply` collection.

---

## 4. Company Collection

A company profile is separate from a user.

```js
Company {
  _id,

  name,
  slug,
  logo,
  banner,

  description,
  website,
  industry,
  companySize,

  location,

  createdBy, // User _id

  admins: [User _id],
  recruiters: [User _id],

  isVerified,

  createdAt,
  updatedAt
}
```

### Why separate Company from User?

Because a company can have many recruiters/admins.

Don’t force:

```txt
one company = one user
```

That is a beginner mistake.

Example:

```txt
TCS company profile
├── HR 1
├── HR 2
├── Recruiter 1
└── Company admin
```

---

## 5. Job Collection

A job belongs to a company and is posted by a recruiter/admin.

```js
Job {
  _id,

  company, // Company _id
  postedBy, // User _id

  title,
  description,

  jobType, // full-time, internship, contract, remote
  workMode, // remote, onsite, hybrid

  location,

  skillsRequired: [],
  experienceLevel, // fresher, junior, mid, senior

  salary: {
    min,
    max,
    currency
  },

  openings,

  applicationDeadline,

  status, // open, closed, draft

  applicationsCount,

  createdAt,
  updatedAt
}
```

### Important

You also need an `Application` collection later.

Without it, the job portal is incomplete.

```js
Application {
  _id,

  job, // Job _id
  applicant, // User _id

  resumeUrl,
  coverLetter,

  status, // applied, shortlisted, rejected, selected

  appliedAt,
  updatedAt
}
```

Don’t skip this.

A job app without applications is just a job listing website.

---

## 6. Chat Collection

`Chat` stores conversation metadata, not actual messages.

```js
Chat {
  _id,

  type, // one_to_one, group

  participants: [User _id],

  groupName,
  groupAvatar,

  lastMessage, // Message _id

  createdBy, // User _id

  createdAt,
  updatedAt
}
```

### Why not store messages inside Chat?

Because messages grow very fast.

If you store all messages inside one chat document, your app will become slow and messy.

---

## 7. Message Collection

Each message is separate.

```js
Message {
  _id,

  chat, // Chat _id
  sender, // User _id

  content,

  attachments: [
    {
      url,
      publicId,
      type
    }
  ],

  readBy: [User _id],

  isEdited,
  isDeleted,

  createdAt,
  updatedAt
}
```

### Why `readBy`?

For read receipts.

Example:

```txt
Seen by Swarna
Seen by Rahul
```

For one-to-one chat, this is simple.

For big groups, later we may optimize it.

---

## 8. Notification Collection

Notifications tell users that something happened.

```js
Notification {
  _id,

  recipient, // User _id
  sender, // User _id, optional

  type, // like, comment, follow, message, job_application, system

  entityType, // post, comment, job, chat, user
  entityId,

  message,

  isRead,

  createdAt
}
```

### Why `entityType` and `entityId`?

Because one notification can point to different things.

Example:

```txt
Rahul liked your post                 → entityType: post
A recruiter viewed your application   → entityType: application
Sudeshna sent you a message           → entityType: chat
```

This makes notifications flexible.

---

# Collections You Should Add Later

You asked for the main ones, but a real app also needs these.

---

## 9. Follow Collection

Don’t store huge follower lists inside the user document.

```js
Follow {
  _id,

  follower, // User _id
  following, // User _id

  createdAt
}
```

---

## 10. Like Collection

Don’t store thousands of likes inside a post.

```js
Like {
  _id,

  user, // User _id

  entityType, // post, comment
  entityId,

  createdAt
}
```

---

## 11. SavedPost Collection

```js
SavedPost {
  _id,

  user,
  post,

  createdAt
}
```

---

## 12. SavedJob Collection

```js
SavedJob {
  _id,

  user,
  job,

  createdAt
}
```


## API Plan

## Folder Structure

## Development Phases






backend/
│
├── src/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   │
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── post.controller.js
│   │   ├── comment.controller.js
│   │   ├── company.controller.js
│   │   ├── job.controller.js
│   │   ├── chat.controller.js
│   │   ├── message.controller.js
│   │   └── notification.controller.js
│   │
│   ├── models/
│   │   ├── user.model.js
│   │   ├── post.model.js
│   │   ├── comment.model.js
│   │   ├── company.model.js
│   │   ├── job.model.js
│   │   ├── chat.model.js
│   │   ├── message.model.js
│   │   └── notification.model.js
│   │
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── user.routes.js
│   │   ├── post.routes.js
│   │   ├── comment.routes.js
│   │   ├── company.routes.js
│   │   ├── job.routes.js
│   │   ├── chat.routes.js
│   │   ├── message.routes.js
│   │   └── notification.routes.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   ├── error.middleware.js
│   │   ├── upload.middleware.js
│   │   └── role.middleware.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   ├── sendEmail.js
│   │   └── apiError.js
│   │
│   ├── validators/
│   │   ├── auth.validator.js
│   │   ├── user.validator.js
│   │   └── post.validator.js
│   │
│   ├── services/
│   │   ├── auth.service.js
│   │   ├── user.service.js
│   │   └── notification.service.js
│   │
│   ├── app.js
│   └── server.js
│
├── .env
├── .env.example
├── package.json
└── README.md


frontend/
│
├── src/
│   ├── api/
│   │   ├── axiosInstance.js
│   │   ├── authApi.js
│   │   ├── userApi.js
│   │   ├── postApi.js
│   │   └── jobApi.js
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── Loader.jsx
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   └── RegisterForm.jsx
│   │   │
│   │   ├── layout/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── posts/
│   │   │   ├── PostCard.jsx
│   │   │   └── CreatePost.jsx
│   │   │
│   │   └── jobs/
│   │       ├── JobCard.jsx
│   │       └── JobFilter.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Profile.jsx
│   │   ├── Feed.jsx
│   │   ├── Jobs.jsx
│   │   ├── Company.jsx
│   │   ├── Chat.jsx
│   │   └── NotFound.jsx
│   │
│   ├── layouts/
│   │   ├── MainLayout.jsx
│   │   └── AuthLayout.jsx
│   │
│   ├── context/
│   │   └── AuthContext.jsx
│   │
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useDebounce.js
│   │
│   ├── utils/
│   │   ├── formatDate.js
│   │   └── constants.js
│   │
│   ├── routes/
│   │   ├── AppRoutes.jsx
│   │   └── ProtectedRoute.jsx
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── .env
├── .env.example
├── package.json
└── README.md