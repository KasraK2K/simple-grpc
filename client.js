const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const PROTO_PATH = './user.proto'

const loaderOptions = {
  keepCase: true, // instructs the protoLoader to maintain protobuf field names
  longs: String, // store the data types that represent long and enum values
  enums: String, // store the data types that represent long and enum values
  defaults: true, // when set to true, sets default values for output objects
  oneofs: true, // sets virtual oneof properties to field names
}

const newUser = {
  username: 'Kamal_K2K',
  email: 'Kamal_K2K@yahoo.com',
  first_name: 'Kamal',
  last_name: 'Kamal',
  password: '123653221',
  address: 'Iran, Arak',
}

const updateUser = {
  email: 'Kasra_K2K@gmail.com',
  password: '777',
  is_admin: true,
}

const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions)
const grpcObj = grpc.loadPackageDefinition(packageDef)
const UserService = grpcObj.UserService

const userClient = new UserService(
  'localhost:50051',
  grpc.credentials.createInsecure()
)

userClient.getUserService({ id: 1 }, (error, user) => {
  error
    ? console.log(`Error on getUserService: ${error.details}`)
    : console.log('getUserService:', user)
})

userClient.getUserListService({}, (error, userList) => {
  error
    ? console.log(`Error on getUserListService: ${error.details}`)
    : console.log('getUserListService:', userList)
})

userClient.createUserService(newUser, (error, user) => {
  error
    ? console.log(`Error on createUserService: ${error.details}`)
    : console.log('createUserService:', user)
})

userClient.updateUserService(
  { find: { id: 1 }, update: updateUser },
  (error, user) => {
    error
      ? console.log(`Error on updateUserService: ${error.details}`)
      : console.log('updateUserService:', user)
  }
)

userClient.deleteUserService(
  { id: 1, username: 'Kasra_K2K' },
  (error, user) => {
    error
      ? console.log(`Error on deleteUserService: ${error.details}`)
      : console.log('deleteUserService:', user)
  }
)
