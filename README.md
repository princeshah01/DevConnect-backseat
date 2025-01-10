# SoulMate apiList

## SignupLogin (authRouter)

-POST /Signup
-POST /Login
-POST /Logout
-PATCH /Forgetpassword
-POST /resetpassword/:id/:token
-GET /resetpassword/:id/:token

## UserProfile (ProfileRouter)

-GET /Profile/view
-PATCH /Profile/edit
-PATCH /Profile/password


## connectionRequest (connectionRequestRouter)

-POST /request/send/Ignore/:UserId
-POST /request/send/interested/:UserId

## Accept/reject request (userRequests)

-POST /user/request/review/accepted/:userId
-POST /user/request/review/rejected/:userId

# connections and user data api 
-GET /user/matches
-GET /user/BlockedUser
-GET /user/Requests/received
-GET /user/Feed -- to get profile of other users
