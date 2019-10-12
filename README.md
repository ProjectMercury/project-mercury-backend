# Project Mercury - Backend

## API Endpoints

Endpoints Content:

- [Login](#Login)
- [Signup](#Signup)

### Login

Expects an object with this format as the request body:

```
{
  "email": "email",   //string
  "password": "password" //string
}
```

If the email doesn't exist or the password doesn't match, it will reject the request with a `403` HTTP status and will return:

```
{
    "general": "Wrong credentials, please try again"
}
```

If successful, it will return a `200` HTTP status and will return a token:

```
{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ2YzM5Mzc4YWVmYzA2YzQyYTJlODI1OTA0ZWNlZDMwODg2YTk5MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZm9ybS1idWlsZGVyLTk3YzNhIiwiYXVkIjoiZm9ybS1idWlsZGVyLTk3YzNhIiwiYXV0aF90aW1lIjoxNTcwODYxNDI0LCJ1c2VyX2lkIjoieFV6REMxR3F5bFAxWGVETFliNlpJU2VJME4wMyIsInN1YiI6InhVekRDMUdxeWxQMVhlRExZYjZaSVNlSTBOMDMiLCJpYXQiOjE1NzA4NjE0MjQsImV4cCI6MTU3MDg2NTAyNCwiZW1haWwiOiJmcmVzaEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZnJlc2hAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OBUYq9ZXW8BXAcxqLLLRcfZRvzMVi6T19iQjzZVezlU7O30qT8wcLUbjMk3oYZMPCkHY97JK_te6uSDf1Dn7oXv7vx_alTaia1JTthK9QDceLFzVNoo2jQbOSfhssPw6eQIP5G3OkGhCYKfw0sx7WUMWBIxj69jlVQPIZQ1fCnBynhLlqs4Ua3p33ZmDeuHRdm59LJMerRH-7muAAQoDYBbvArHVGGyuV5-X02FJUKOopxLDm8qY4DQRbgTTTwVv_JnjUfQyJYdYZNzMoZxKx5Y4kbb09Z6esP5396O6oft0wOjDuz1cXXHBsCxvXvQHJF7rzcp1buszhdQq6v_b-g"
}
```

### Signup

Expects an object with this format as the request body:

```
  --header "Content-Type: application/json"
  --data:
{
	"email": "email@email.com",
	"password": "password",
	"confirmPassword": "password",
	"username": "username"
}
```

If any of the required fields are missing, it will reject the request with a `400` HTTP status, and it returns an object showing which fields are missing:

```
{
    "password": "Must not be empty",
    "username": "Must not be empty"
}
```

If the username already exists in the database, it will reject the request with a `400` HTTP status, and it returns:

```
{
    "username": "username is taken already"
}
```

If successful, it will return with a `201` HTTP status, and a token:

```
{
    "token": "eyJhbGciOiJSUzI1NiIsImtpZCI6ImQ2YzM5Mzc4YWVmYzA2YzQyYTJlODI1OTA0ZWNlZDMwODg2YTk5MjIiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZm9ybS1idWlsZGVyLTk3YzNhIiwiYXVkIjoiZm9ybS1idWlsZGVyLTk3YzNhIiwiYXV0aF90aW1lIjoxNTcwODYxNDI0LCJ1c2VyX2lkIjoieFV6REMxR3F5bFAxWGVETFliNlpJU2VJME4wMyIsInN1YiI6InhVekRDMUdxeWxQMVhlRExZYjZaSVNlSTBOMDMiLCJpYXQiOjE1NzA4NjE0MjQsImV4cCI6MTU3MDg2NTAyNCwiZW1haWwiOiJmcmVzaEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsiZnJlc2hAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OBUYq9ZXW8BXAcxqLLLRcfZRvzMVi6T19iQjzZVezlU7O30qT8wcLUbjMk3oYZMPCkHY97JK_te6uSDf1Dn7oXv7vx_alTaia1JTthK9QDceLFzVNoo2jQbOSfhssPw6eQIP5G3OkGhCYKfw0sx7WUMWBIxj69jlVQPIZQ1fCnBynhLlqs4Ua3p33ZmDeuHRdm59LJMerRH-7muAAQoDYBbvArHVGGyuV5-X02FJUKOopxLDm8qY4DQRbgTTTwVv_JnjUfQyJYdYZNzMoZxKx5Y4kbb09Z6esP5396O6oft0wOjDuz1cXXHBsCxvXvQHJF7rzcp1buszhdQq6v_b-g"
}
```
