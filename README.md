# task_management_be

## Instructions

1. Clone the branch `template`.
2. Rename `.env.example` to `.env` and supply your own MongoDB URI or leave as is to use your local MongoDB URI.
3. Based on the provided schema, parse and import the data frorm [this dataset](https://www.kaggle.com/datasets/CooperUnion/cardataset) into your database.
4. Fill in the missing logic in the controller. Remember to consider and handle all possible errors.
5. Test and make sure it works with the provided frontend.

## Requirements

### API endpoints

#### Auth APIs
```
* @route POST /auth/login
* @description Log in with username and password
* @body {email, passsword}
* @access Public
```

#### Team APIs
```
    @route Post /teams
    @descripton create New Team
    @body {"name",
    "manager"}
    @access login request
```
```
    @route Get/teams/page=1&limit=10
    @descripton get teams with paginaton
    @body
    @access login request
```
```
    @route Get /teams/:id
    @descripton get Single Team
    @body 
    @access login request
```
```
    @route Put /teams/:id
    @descripton update Single Team
    @body {"name",
    "manager",
    "workers"}
    @access login request
```

#### User APIs
```
    @route Post /users
    @descripton Reginster new user
    @body {"name","email" , "password"}
    @access public
```
```
    @route Get /users/page=1&limit=10
    @descripton get users with paginaton
    @body 
    @access login request
```
```
    @route Get /users/me
    @descripton get current user info
    @body 
    @access login request
```
```
    @route Get /users/admin
    @descripton admin get information
    @body 
    @access login request
```
```
    @route Get /users/:id
    @descripton get users profile
    @body
    @access login request
```
```
    @route Put /users/:id
    @descripton Update user profile
    @body {"name",
    "avatarUrl",
    "position",
    "team",
    "imageUrl",
    "phone1",
    "phone2",
    "manager",}
    @access login request
```
```
    @route delete /users/:id
    @descripton delete user
    @body
    @access login request
```

#### File APIs
```
    @route Post /files
    @descripton create new file
    @body {
    "FileUrl",
    "projectId",
    "taskId"}
    @access login request
```
```
    @route Get /files
    @descripton get list files
    @body 
    @access login request
```
#### Project APIs
```
    @route Post /projects
    @descripton create new project
    @body
    {"name",
    "description",
    "team",
    "assignee",
    }
    @access login request
```
```
    @route Get /projects/page=1&limit=10
    @descripton get projects with paginaton
    @body 
    @access login request
```
```
    @route Get /projects/:id
    @descripton get project profile
    @body
    @access login request
```
```
    @route Delete /projects/:id
    @descripton delete a project
    @body 
    @access login request
```
```
    @route Put /projects/:id
    @descripton update a project
    @body {"name",
    "description",
    "assignee",
    "status",}
    @access login request
```


#### Task APIs
```
    @route Post /tasks
    @descripton create new task
    @body
    {"name",
    "dueAt",
    "assignee",
    "project",
    "important",
    "urgent"}
    @access login request
```
```
    @route Put /tasks/:id
    @descripton update a task
    @body {"name",
        "dueAt",
        "urgent",
        "important",
        "assignee",
        "status",
        "progress"}
    @access login request
```
```
    @route Put /review/:id
    @descripton write a comment
    @body 
    @access login request
```
```
    @route Delete /tasks/:id
    @descripton delete a task
    @body 
    @access login request
```
```
    @route Get /tasks/page=1&limit=10
    @descripton get tasks with paginaton
    @body 
    @access login request
```
```
    @route Get /tasks/:id
    @descripton get task profile
    @body
    @access login request
```

### Diagram Relation
![](https://i.imgur.com/sGBgGxb.png)
