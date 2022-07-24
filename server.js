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

const packageDef = protoLoader.loadSync(PROTO_PATH, loaderOptions)
const grpcObj = grpc.loadPackageDefinition(packageDef)
const grpcServer = new grpc.Server()

let database = new Map([
  [
    1,
    {
      id: 1,
      username: 'Kasra_K2K',
      email: 'Kasra_K2K@yahoo.com',
      first_name: 'Kasra',
      last_name: 'Karami',
      password: '1234567890',
      address: 'Iran, Tehran',
      is_admin: true,
    },
  ],
  [
    2,
    {
      id: 2,
      username: 'Kaveh_K2K',
      email: 'Kaveh_K2K@yahoo.com',
      first_name: 'Kaveh',
      last_name: 'Karami',
      password: '0987654321',
      address: 'Iran, Arak',
      is_admin: false,
    },
  ],
])

/** @returns {Record<string, any> | undefined} */
const findUser = (id) => (database.has(id) ? database.get(id) : undefined)

grpcServer.addService(grpcObj.UserService.service, {
  getUserService: (args, callback) => {
    const user = findUser(args.request.id)
    return user
      ? callback(null, user)
      : callback({ status: grpc.status.NOT_FOUND, message: 'User not found' })
  },

  getUserListService: (args, callback) =>
    callback(null, { user: Array.from(database.values()) }),

  createUserService: (args, callback) => {
    const id = Date.now()
    const newUser = { ...args.request, id, is_admin: false }
    database.set(id, newUser)
    return callback(null, newUser)
  },

  updateUserService: (args, callback) => {
    const user = findUser(args.request.find.id)
    if (user) {
      const userKeys = Object.keys(user)
      userKeys.forEach((key) => {
        user[key] = args.request.update[key] ?? user[key]
      })
      database.set(args.request.find.id, user)
      return callback(null, user)
    } else
      callback({ status: grpc.status.NOT_FOUND, message: 'User not found' })
  },

  deleteUserService: (args, callback) => {
    const user = findUser(args.request.id)
    if (user) {
      database.delete(args.request.id)
      return callback(null, user)
    } else
      callback({ status: grpc.status.NOT_FOUND, message: 'User not found' })
  },
})

grpcServer.bindAsync(
  '127.0.0.1:50051',
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log('Server running at http://127.0.0.1:50051')
    grpcServer.start()
  }
)
