steps that i have done
1. initialized init -y node env 
2. npm install typescript ts-node-dev express @types/express
3. set up a ts config file tsc --init
4. create index.ts file 
5. go to package.json and set up the start script 
7. set up the k8s env
8. set up docker file
9. setup docker ignore 
10. build image
11. set up the auth-depl file and serv inside that
12. set up skaffold 
13. writing a route inside index.ts 
14. installed and setup ingress, now going to write ingress-srv.yaml
// day 2 
15. setting up a cloud environment using free google cloud service 
16. in gc, set up a new project, and go to the left panel and add kubernetes engine and set up a cluster
17. set up the project zone and everything in google cloud sdk 
18. connected to the cluster and craeted a new cloud context in docker using a command, its available online 
19. initialized the context, and tweaked the skaffold and depl file
20. installed cloud build api in google cloud
21. set up the googleCloudBuild in skaffold, changed the image name in skaffold and depl 
22. installed ingress into the google cloud cluster 
23. creating a load balancer 
day 3 
24. created a seperate routes folder, and set up current-user.ts 
25. using express-validator from npm js for validation 
26. switched back to local machine docker context 
27. writing error handling middleware 
28. create a seperate folder errors, for metioning different subclasses of errors, so that u can show the errors in a standard format since different errors are made with different formats 
29. created a method called serializeError inside the class to overthrow all the complex predicted logics inside error-handler 
30. Create an abstract class, called CustomError, to verify the structure of error's correctness. An abstract class cannot be instantiated, it is used
to set up requirements for the subclasses, it is set as class when compiled to js, so we can use instance of checks 
31. Passed a message string to super inorder to leverage it to throw new Error('') so that we can log the errors too
32. set up the not found error handler and go to index file and import notfounderror, and before error handling middleware set up app.all(*) code
33. There is some problems that may cause worse things to the error handling we have done so far, and that is async keyword. so handling that now!
34. change the app.all, change it to async, include next in the callback args, call the new NotFoundError with next,
35. We can further solve this problem of async keyword with a package.
Section 8 - Database stuffs 
36. we are going to run mongodb inside of a pod. we have to create a depl for that, inorder to communicate with that pod, we have to make use of
cluster ip services , go to infra/k8s, create auth-mongo-depl
37. now we have to connect to the mongoose, for that we have to access the cluster ip service ,so do tis, mongodb://auth-mongo-srv - the name of the clusterip service 
38. model setup finished, now we have to do typechecking for the properties inside the model, to reassure it is entered correctly in code 
39. set up a custom function for building a user, with userSchema.statics.build(attr:UserAttrs) - this userAttrs is the interface with predefined attributes 
a user should have inorder to make the type security
40. The direct usage of the static prop will cause error, since mongoose Model doesnt recognize it as a property, so we have to define it using an interface
This interface should extend mongoose.Model class and should accept an angle brackets with type any, inside that we have to specify the build(attrs:UserAttres):any 
After doing the above, we can easily deal with the User.build() function to create a new user :) 
41. Now we have to replace this any with the correct config, for that we have to find what the userDocument should look like. so create a new interface userDoc extends mongoose.Model, and inside that set up the
email,password:string, and whatever new props u are gonna bring in. Then pass this to the places where you passed any, that is to const User = mongoose.model<UserDoc,UserModel>('User',userSchema)
& to interface userModel 
42. What is the angle brackets used for huh? lets see : The angle brackers is a generic syntax inside type script 
These can be considered as types being provided to functions as arguments, in our case we are providing the model function with types UserDoc, and UserAttrs interfaces as arguments
43. Set up the logic for user Creation, created a new error handler for displaying the email exist error too 
44. Added password hashing with a new concept scrypt,
45. implementing password hashing using preSave hooks 
Day 4
46. Authentication in microservices is a tedious problem, user auth has no single best solution, but we have to choose the best solution from the list of solutions 
47. set up cookie based jwt. use a library called cookie-session
48. install cookie-session, import on top, app.use after json, inside that set secure to true, and signed to false, then after the app = express(), set up app.set('trust proxy', true)
we added trust proxy as express is gonna see the things proxied and will say it dont trust the connection, so inorder to bypas this problem
we used app.set('trust proxy',true) 
49. After that, we have to create the token in signup, and in that there will be a secret key, we need to share the secret key across services, for that we have to be familiar with storing secrets in kubernetes 
50. C:\Users\JG\Desktop\MS-Project1>kubectl create secret generic jwt-secret --from-literal=JWT_KEY=sayeedsafvan
secret/jwt-secret created
51. tweak the depl file to tell that whenever we create a pod, we have to find the secret and put it in the env variables of the pod
52. in the auth-depl file, under the containers, we specified a new field called env, under that set an array of entries, with name : random name, valueFrom, under that , secretKeyRef, under that name:jwt-secret (name we provided while creating secret)
and key : JWT_KEY (the name of key which we provided while giving the key value pair as secret)
53. Now we need to access the env variables, specify the secret with proces.env.JWT_KEY, and it will cause a ts error 
54. To solve the error, we have to specify a check inside the const start in index file if process.env.JWT_KEY exists, if not throw an error 
55. Still in signup.ts process.env.JWT_KEY will show an error, we can solve it by defining process.env.JWT_KEY!
56. We have introduced a new option into the schema called toJSON, where we can specify how our json doc should look like
we can change how id is set up, we can remove password, version etc.. do check it out 
moving on to sign in now! :) 
57. we set up the sign in stuff, checked using body and validationResult of express-validator, using body we check for errors in email and password, then using validationResult
we check the req object and if the variable errors assigned to validationResult is not empty, then we have to throw the RequestValidationError(errors.array()), this will map the correct error to be shown 
m
58. create a middleware validate request, then apply middleware after validation check using express validator, and middleware will handle throwing of error, so u can reduce the code 
59. After this in sign in , i checked for the existing user, if not threw a badrequesterror, then i checkd the password using password.compare method, if false, threw bad request error 
if u bypassed all these, then re invoke jwt, store in session, send existing user as response ! 
60. After this, i created a current user handler and signout handler sign out handler only has req.session set to null to sign out 
61. Now we are gonna set up a middleware for the currentUser checking throughout 
62. started creating a current-user middleware where it will check for the req.session.jwt exists if not, it will proceed to call next(), else it will check for the payload using verify
then we have to set it to req.currentUser, but ts doesnt identify req.currentUser in its typedef file, so we have to add that proprty by ourselves 
63. to solve that, first declare an interface which defines the type of payload, set it as the payload, so jwt.verify..... as UserPayload
now set up a declare global{namespace Express{interface Request{currentUser?:UserPayload}}}, with this we have added a prop called currentUser to the typedef file of Request interface and have
set its type to be Userpayload, now req.currentUser can accept any type of UserPayload data 
64. After that call this middleware in currentUser route, and send the req.currentUser as response 
65. create a new middleware called require-auth, which checks and verifies the presence of req.currentUser 
for throwing the error create a new error obj 
